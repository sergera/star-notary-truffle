// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

	constructor() ERC721("Star", "STAR") {}

	struct Star {
		bytes name;
		bytes2 RAHours;
		bytes2 RAMinutes;
		bytes5 RASeconds;
		bytes3 decDegrees;
		bytes2 decArcMinutes;
		bytes5 decArcSeconds;
	}

	mapping(uint256 => Star) public tokenIdToStar;
	mapping(uint256 => uint256) public tokenIdToSalePrice;

	/* both the star coordinates and the name must be unique */
	mapping(bytes19 => uint256) public coordinatesToTokenId;
	mapping(bytes => uint256) public starNameToTokenId;

	/* borrowing ideas from enumerable extension for automatic tokenId attribution */
	uint256[] private _allTokens;

	event Created(address owner, uint256 tokenId, bytes19 coordinates, bytes name);
	event ChangedName(uint256 tokenId, bytes newName);
	event PutForSale(uint256 tokenId, uint256 priceInWei);
	event RemovedFromSale(uint256 tokenId);
	event Bought(uint256 tokenId, address newOwner);

	function totalSupply() public view returns (uint256) {
		return _allTokens.length;
	}

	function tokenIds() public view returns (uint256[] memory) {
		return _allTokens;
	}

	function createStar(bytes calldata _name, bytes calldata _coordinates) external {
		require(isStarName(_name), "Star name invalid");
		require(starNameToTokenId[_name] == 0, "Star name currently in use");
		require(isHour(bytes2(_coordinates[0:2])), "Right ascension hours invalid");
		require(isMinute(bytes2(_coordinates[2:4])), "Right ascension minutes invalid");
		require(isSecond(bytes5(_coordinates[4:9])), "Right ascension seconds invalid");
		require(isDegree(bytes3(_coordinates[9:12])), "Declination degrees invalid");
		require(isMinute(bytes2(_coordinates[12:14])), "Declination arc minutes invalid");
		require(isSecond(bytes5(_coordinates[14:19])), "Declination arc seconds invalid");
		require(coordinatesToTokenId[bytes19(_coordinates)] == 0, "Star coordinate already exists");

		Star memory newStar = Star(
			_name,
			bytes2(_coordinates[0:2]),
			bytes2(_coordinates[2:4]),
			bytes5(_coordinates[4:9]),
			bytes3(_coordinates[9:12]),
			bytes2(_coordinates[12:14]),
			bytes5(_coordinates[14:19])
		);

		/* tokenId starts at value 1 so that non existant entries have value 0 */
		uint256 tokenId = totalSupply() + 1;
		coordinatesToTokenId[bytes19(_coordinates)] = tokenId;
		starNameToTokenId[_name] = tokenId;
		_allTokens.push(tokenId);
		tokenIdToStar[tokenId] = newStar;
		_mint(msg.sender, tokenId);
		
		emit Created(msg.sender, tokenId, bytes19(_coordinates), _name);
	}

	/***
		The NFT contract and the "market" contract are 1 in this case

		This means that there is a problem with the transfer approval on sale

		Since the buyer is not the owner at the time of buying, the seller would then
		have to approve the buyer sepparately, before the buyer calls the "buyStar" function

		This not only would be an unfeasible interface, since the seller would have no way
		of knowing when the another person is going to buy the star, but would also make the
		seller pay for fees (approve is a transaction function call) in the act of selling

		So I've decided to approve the contract itself when putting the star for sale

		This way, when the seller puts the star for sale, he/she approves the contract to 
		make the transfer, and when a buyer buys the star the contract itself transfers the NFT
	
	 */

	function putStarUpForSale(uint256 _tokenId, uint256 _price) external {
		require(ownerOf(_tokenId) == msg.sender, "You can't sell a Star you don't own");

		/* approve this contract to transfer the token */
		approve(address(this), _tokenId);

		tokenIdToSalePrice[_tokenId] = _price;

		emit PutForSale(_tokenId, _price);
	}

	function removeFromSale(uint256 _tokenId) external {
		require(ownerOf(_tokenId) == msg.sender, "You can't remove from sale a Star you don't own");

		approve(address(0), _tokenId);
		delete tokenIdToSalePrice[_tokenId];

		emit RemovedFromSale(_tokenId);
	}

	function buyStar(uint256 _tokenId) external payable {
		require(tokenIdToSalePrice[_tokenId] > 0, "The Star is not up for sale");
		uint256 starCost = tokenIdToSalePrice[_tokenId];
		address ownerAddress = ownerOf(_tokenId);
		require(msg.value >= starCost, "Not enough Ether to buy this Star");

		/* call transfer function with this contract as msg.sender */
		this.transferFrom(ownerAddress, msg.sender, _tokenId);
		
		payable(ownerAddress).transfer(starCost);
		if(msg.value > starCost) {
			payable(msg.sender).transfer(msg.value - starCost);
		}

		emit Bought(_tokenId, msg.sender);
	}

	function changeStarName(uint256 _tokenId, bytes calldata _name) external {
		require(ownerOf(_tokenId) == msg.sender, "You can't edit a Star you don't own");
		require(isStarName(_name), "Star name invalid");
		require(starNameToTokenId[_name] == 0, "Star name currently in use");

		delete starNameToTokenId[tokenIdToStar[_tokenId].name];
		tokenIdToStar[_tokenId].name = _name;
		starNameToTokenId[_name] = _tokenId;

		emit ChangedName(_tokenId, _name);
	}

	function isSpace(bytes1 space) private pure returns (bool) {
		if(space != 0x20) return false;
		return true;
	}

	function isLowercaseLetter(bytes1 letter) private pure returns (bool) {
		if(letter < 0x61 || letter > 0x7A) return false;
		return true;
	}

	function isUppercaseLetter(bytes1 letter) private pure returns (bool) {
		if(letter < 0x41 || letter > 0x5A) return false;
		return true;
	}

	function isLetter(bytes1 letter) private pure returns (bool) {
		if(!isLowercaseLetter(letter) && !isUppercaseLetter(letter)) return false;
		return true;
	}

	function isStarName(bytes calldata name) private pure returns (bool){
		/* max 32 characters */
		if(name.length > 32) return false;
		/* min 4 characters */
		if(name.length < 4) return false;

		/* no leading spaces */
		if(isSpace(name[0])) return false;

		bytes1 char;
		bool charIsLower;
		bool charIsSpace;
		uint8 lastLetterIndex;
    for(uint8 i; i<name.length; i++){
			char = name[i];
			charIsLower = isLowercaseLetter(char);
			charIsSpace = isSpace(char);
			/* name must be lowercase letters and spaces only */
			if(!charIsLower && !charIsSpace) return false;
			if(i > 0) {
				/* no consecutive spaces */
				if(charIsSpace && isSpace(name[i-1])) return false;
			}
			if(charIsLower) lastLetterIndex = i;
    }

    /* no trailing spaces */
    if(lastLetterIndex < name.length - 1) return false;

    return true;
	}

	function isInteger(bytes1 integer) private pure returns (bool) {
		if(integer < 0x30 || integer > 0x39) return false;
		return true;
	}

	function isDot(bytes1 dot) private pure returns (bool) {
		if(dot != 0x2E) return false;
		return true;
	}
	
	function isSign(bytes1 sign) private pure returns (bool) {
		if(sign != 0x2B && sign != 0x2D) return false;
		return true;
	}

	function isHour(bytes2 hour) private pure returns (bool) {
		if(!isInteger(hour[0])) return false;
		if(!isInteger(hour[1])) return false;
		/* if number greater than 60 return false */
		if(hour[0] == 0x36 && hour[1] != 0x30) return false;
		return true;
	}

	function isMinute(bytes2 minute) private pure returns (bool) {
		if(!isInteger(minute[0])) return false;
		if(!isInteger(minute[1])) return false;
		/* if number greater than 60 return false */
		if(minute[0] == 0x36 && minute[1] != 0x30) return false;
		return true;
	}

	function isSecond(bytes5 second) private pure returns (bool) {
		if(!isInteger(second[0])) return false;
		if(!isInteger(second[1])) return false;
		if(!isDot(second[2])) return false;
		if(!isInteger(second[3])) return false;
		if(!isInteger(second[4])) return false;
		/* if number greater than 60.99 return false */
		if(second[0] == 0x36 && second[1] != 0x30) return false;
		return true;
	}

	function isDegree(bytes3 deg) private pure returns (bool) {
		if(!isSign(deg[0])) return false;
		if(!isInteger(deg[1])) return false;
		if(!isInteger(deg[2])) return false;
		/* if number greater than 90 or less than -90 return false */
		if(deg[1] == 0x39 && deg[2] != 0) return false;
		return true;
	}
}
