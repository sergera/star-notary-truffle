const expectThrow = require('./utils/expectThrow');

const StarNotary = artifacts.require('StarNotary');

function hexToAscii(hex) {
	return web3.utils.hexToAscii(hex);
};

function asciiToHex(str) {
	return web3.utils.asciiToHex(str);
};

const RAHours = "60";
const RAMinutes = "60";
const RASeconds = "60.99";
const decDegrees = "+90";
const decArcMinutes = "60";
const decArcSeconds = "60.99";
const coordinatesString = RAHours + RAMinutes + RASeconds + decDegrees + decArcMinutes + decArcSeconds;
const coordinatesHex = asciiToHex(coordinatesString);
const starName = "my star"
const starNameHex = asciiToHex(starName);

const starFirstId = 1;
const starSecondId = 2;

let owner;
let accounts;

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];


	it("user can create a star", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(hexToAscii(createdStar.name), starName);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];


	it("emits Created event on star creation", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(createdStar.name, starNameHex);

		let pastEvents = await instance.getPastEvents("allEvents", { fromBlock: 1 });
		const lastEvent = pastEvents[pastEvents.length-1];
		assert.equal(lastEvent.event, "Created")
		let lastEventReturnValues = lastEvent.returnValues;
		assert.equal(lastEventReturnValues.owner, user1);
		assert.equal(lastEventReturnValues.tokenId, starFirstId);
		assert.equal(lastEventReturnValues.coordinates, coordinatesHex);
		assert.equal(lastEventReturnValues.name, starNameHex);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("user owns created star", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let currentOwner = await instance.ownerOf.call(starFirstId);
		assert.equal(currentOwner, user1);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];


	it("user can't create a star with existing coordinates", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(createdStar.name, starNameHex);

		let user2 = accounts[2];
		let differentStarNameHex = asciiToHex("different star name");
		tx = instance.createStar(differentStarNameHex, coordinatesHex, {from: user2});
		expectThrow(tx);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];


	it("user can't create a star with existing name", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(createdStar.name, starNameHex);

		let user2 = accounts[2];
		let differentStarCoordinatesHex = asciiToHex(RAHours+RAMinutes+RASeconds+decDegrees+"45"+decArcSeconds);
		tx = instance.createStar(starNameHex, differentStarCoordinatesHex, {from: user2});
		expectThrow(tx);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("lets user put star for sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let starPrice = web3.utils.toWei(".01", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, starPrice);
		let approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("changes sale price if user puts for sale again", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let starPrice = web3.utils.toWei(".01", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, starPrice);
		let approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);

		let newStarPrice = web3.utils.toWei(".04", "ether");
		await instance.putStarUpForSale(starFirstId, newStarPrice, {from: user1});
		priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, newStarPrice);
		approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];


	it("emits PutForSale event on putting star for sale", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		let starPrice = web3.utils.toWei(".01", "ether");

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(hexToAscii(createdStar.name), starName);
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, starPrice);

		let pastEvents = await instance.getPastEvents("allEvents", { fromBlock: 1 });
		const lastEvent = pastEvents[pastEvents.length-1];
		assert.equal(lastEvent.event, "PutForSale")
		let lastEventReturnValues = lastEvent.returnValues;
		assert.equal(lastEventReturnValues.owner, user1);
		assert.equal(lastEventReturnValues.tokenId, starFirstId);
		assert.equal(lastEventReturnValues.priceInWei, starPrice);
	});
});


contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("stops user from putting for sale if user is not owner", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let tx = instance.putStarUpForSale(starFirstId, starPrice, {from: user2});
		expectThrow(tx);

		let salePrice = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(salePrice, 0);
		let approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, 0);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("lets user remove star from sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let starPrice = web3.utils.toWei(".01", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, starPrice);
		let approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);

		await instance.removeStarFromSale(starFirstId, {from: user1});
		priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, 0);
		approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, 0);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("emits RemovedFromSale event when removed star from sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let starPrice = web3.utils.toWei(".01", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, starPrice);
		let approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);

		await instance.removeStarFromSale(starFirstId, {from: user1});
		priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, 0);
		approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, 0);

		let pastEvents = await instance.getPastEvents("allEvents", { fromBlock: 1 });
		const lastEvent = pastEvents[pastEvents.length-1];
		assert.equal(lastEvent.event, "RemovedFromSale")
		let lastEventReturnValues = lastEvent.returnValues;
		assert.equal(lastEventReturnValues.owner, user1);
		assert.equal(lastEventReturnValues.tokenId, starFirstId);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("stops user from removing from sale if user is not owner", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, starPrice);
		let approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);

		let tx = instance.removeStarFromSale(starFirstId, {from: user2});
		expectThrow(tx);
		priceOfStarPutForSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(priceOfStarPutForSale, starPrice);
		approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("user seller gets the funds after the sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
		let moreThanPrice = web3.utils.toWei(".05", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let user1BalanceBeforeSale = await web3.eth.getBalance(user1);
		await instance.buyStar(starFirstId, {from: user2, value: moreThanPrice});
		let user1BalanceAfterSale = await web3.eth.getBalance(user1);
		let balanceBeforePlusPrice = Number(user1BalanceBeforeSale) + Number(starPrice);
		let balanceAfter = Number(user1BalanceAfterSale);
		assert.equal(balanceBeforePlusPrice, balanceAfter);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("emits Sold event after the sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
		let moreThanPrice = web3.utils.toWei(".05", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let user1BalanceBeforeSale = await web3.eth.getBalance(user1);
		await instance.buyStar(starFirstId, {from: user2, value: moreThanPrice});
		let user1BalanceAfterSale = await web3.eth.getBalance(user1);
		let balanceBeforePlusPrice = Number(user1BalanceBeforeSale) + Number(starPrice);
		let balanceAfter = Number(user1BalanceAfterSale);
		assert.equal(balanceBeforePlusPrice, balanceAfter);

		let pastEvents = await instance.getPastEvents("allEvents", { fromBlock: 1 });
		const lastEvent = pastEvents[pastEvents.length-1];
		assert.equal(lastEvent.event, "Sold")
		let lastEventReturnValues = lastEvent.returnValues;
		assert.equal(lastEventReturnValues.newOwner, user2);
		assert.equal(lastEventReturnValues.tokenId, starFirstId);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("removes approval after the sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
		let moreThanPrice = web3.utils.toWei(".05", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);
		await instance.buyStar(starFirstId, {from: user2, value: moreThanPrice});
		approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, 0);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("removes star from sale after the sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
		let moreThanPrice = web3.utils.toWei(".05", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let approvedAddress = await instance.getApproved.call(starFirstId);
		assert.equal(approvedAddress, instance.address);
		await instance.buyStar(starFirstId, {from: user2, value: moreThanPrice});
		salePriceAfterSale = await instance.tokenIdToSalePrice.call(starFirstId);
		assert.equal(salePriceAfterSale, 0);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("lets user buy star, if it is put up for sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
		let moreThanPrice = web3.utils.toWei(".05", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		await instance.buyStar(starFirstId, {from: user2,value: moreThanPrice});
		let currentOwner = await instance.ownerOf.call(starFirstId);
		assert.equal(currentOwner, user2);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("doesn't let user buy star, if it is not put up for sale", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let imaginaryPrice = web3.utils.toWei(".05", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let tx = instance.buyStar(starFirstId, {from: user2, value: imaginaryPrice});
		expectThrow(tx);
		let currentOwner = await instance.ownerOf.call(starFirstId);
		assert.equal(currentOwner, user1);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("doesn't let user buy star, if user doesn't has less ether than price", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
		let lessThanPrice = web3.utils.toWei(".05", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let tx = instance.buyStar(starFirstId, {from: user2, value: lessThanPrice});
		expectThrow(tx);
		let currentOwner = await instance.ownerOf.call(starFirstId);
		assert.equal(currentOwner, user1);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("lets user buy star with tx value exactly equal to sale price", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
		let user1BalanceBeforeSale = await web3.eth.getBalance(user1);
		await instance.buyStar(starFirstId, {from: user2, value: starPrice});
		let user1BalanceAfterSale = await web3.eth.getBalance(user1);
		let balanceBeforePlusPrice = Number(user1BalanceBeforeSale) + Number(starPrice);
		let balanceAfter = Number(user1BalanceAfterSale);
		assert.equal(balanceBeforePlusPrice, balanceAfter);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("user buys star and receives correct change", async() => {
		let instance = await StarNotary.deployed();
	
		let user1 = accounts[1];
		let user2 = accounts[2];
		let starPrice = web3.utils.toWei(".01", "ether");
		let moreThanPrice = web3.utils.toWei(".05", "ether");
	
		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		await instance.putStarUpForSale(starFirstId, starPrice, {from: user1});
	
		let user2BalanceBeforePurchase = web3.utils.toBN(await web3.eth.getBalance(user2));
		let txInfo = await instance.buyStar(starFirstId, {from: user2, value: moreThanPrice});
		let user2BalanceAfterPurchase = web3.utils.toBN(await web3.eth.getBalance(user2));
	
		// Important! Note that because these are big numbers (more than Number.MAX_SAFE_INTEGER), we
		// need to use the BN operations, instead of regular operations, which cause mathematical errors.
		// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
		// console.log("Ok  = " + (balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar)).toString());
		// console.log("Bad = " + (balanceOfUser2BeforeTransaction - balanceAfterUser2BuysStar).toString());
	
		// calculate the gas fee
		const tx = await web3.eth.getTransaction(txInfo.tx);
		const gasPrice = web3.utils.toBN(tx.gasPrice);
		const gasUsed = web3.utils.toBN(txInfo.receipt.gasUsed);
		const txGasCost = gasPrice.mul(gasUsed);
	
		// make sure that [final_balance == initial_balance - star_price - gas_fee]
		const starPriceBN = web3.utils.toBN(starPrice); // from string
		const expectedFinalBalance = user2BalanceBeforePurchase.sub(starPriceBN).sub(txGasCost);
		assert.equal(expectedFinalBalance.toString(), user2BalanceAfterPurchase.toString());
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("allows user to change star name if owner", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(createdStar.name, starNameHex);

		const newStarNameHex = asciiToHex("new star name");
		await instance.changeStarName(starFirstId, newStarNameHex, {from: user1});
		createdStar = await instance.tokenIdToStar.call(starFirstId, {from: user1});
		assert.equal(createdStar.name, newStarNameHex);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("emits ChangedName event on name changed", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(createdStar.name, starNameHex);

		const newStarNameHex = asciiToHex("new star name");
		await instance.changeStarName(starFirstId, newStarNameHex, {from: user1});
		createdStar = await instance.tokenIdToStar.call(starFirstId, {from: user1});
		assert.equal(createdStar.name, newStarNameHex);

		let pastEvents = await instance.getPastEvents("allEvents", { fromBlock: 1 });
		const lastEvent = pastEvents[pastEvents.length-1];
		assert.equal(lastEvent.event, "ChangedName")
		let lastEventReturnValues = lastEvent.returnValues;
		assert.equal(lastEventReturnValues.owner, user1);
		assert.equal(lastEventReturnValues.tokenId, starFirstId);
		assert.equal(lastEventReturnValues.newName, newStarNameHex);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("doesn't allow user to change star name if not owner", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		let user2 = accounts[2];

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(createdStar.name, starNameHex);

		const newStarNameHex = asciiToHex("new star name");

		let tx = instance.changeStarName(starFirstId, newStarNameHex, {from: user2});
		expectThrow(tx);
		createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(createdStar.name, starNameHex);
	});
});

contract("StarNotary", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("doesn't allow user to change star name if star name in use", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		let user2 = accounts[2];

		await instance.createStar(starNameHex, coordinatesHex, {from: user1});
		let createdStar = await instance.tokenIdToStar.call(starFirstId);
		assert.equal(createdStar.name, starNameHex);

		const newStarNameHex = asciiToHex("new star name");
		let differentStarCoordinatesHex = asciiToHex(RAHours+RAMinutes+RASeconds+decDegrees+"45"+decArcSeconds);
		await instance.createStar(newStarNameHex, differentStarCoordinatesHex, {from: user2});
		createdStar = await instance.tokenIdToStar.call(starSecondId);
		assert.equal(createdStar.name, newStarNameHex);

		let tx = instance.changeStarName(starSecondId, starNameHex, {from: user2});
		expectThrow(tx);
		createdStar = await instance.tokenIdToStar.call(starSecondId);
		assert.equal(createdStar.name, newStarNameHex);
	});
});

contract("StarNotary - Star Name Input Validation", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("capitalized name", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarName = asciiToHex("Star Name");
		let tx = instance.createStar(wrongStarName, coordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("name with leading space", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarName = asciiToHex(" star name");
		let tx = instance.createStar(wrongStarName, coordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("name with trailing space", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarName = asciiToHex("star name ");
		let tx = instance.createStar(wrongStarName, coordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("name with double spaces", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarName = asciiToHex("star  name");
		let tx = instance.createStar(wrongStarName, coordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("name with number", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarName = asciiToHex("star2 name");
		let tx = instance.createStar(wrongStarName, coordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});
});

contract("StarNotary - Star Coordinates Input Validation", (accs) => {
	accounts = accs;
	owner = accounts[0];

	it("RAHours greater than 60", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			"61"+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAHours smaller than 0", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			"-1"+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAHours with letter", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			"1a"+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAHours with dot", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			"1."+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAHours with more than 2 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			"123"+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAHours with less than 2 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			"1"+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAMinutes greater than 60", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			"61"+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAMinutes smaller than 0", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			"-1"+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAMinutes with letter", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			"1a"+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAMinutes with dot", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			"1."+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAMinutes with more than 2 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			"123"+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RAMinutes with less than 2 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			"1"+
			RASeconds+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RASeconds greater than 60.99", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			"61.00"+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RASeconds smaller than 0", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			"-1.00"+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RASeconds with letter", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			"1a.00"+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RASeconds with comma", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			"10,00"+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RASeconds without dot", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			"10000"+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RASeconds with more than 5 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			"10.123"+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("RASeconds with less than 5 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			"10.1"+
			decDegrees+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decDegrees greater than 90", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			"+91"+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decDegrees smaller than -90", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			"-91"+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decDegrees with letter", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			"+1a"+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decDegrees with dot", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			"+1."+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decDegrees with more than 3 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			"+123"+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decDegrees with less than 3 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			"+1"+
			decArcMinutes+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcMinutes greater than 60", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			"61"+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcMinutes smaller than 0", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			"-1"+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcMinutes with letter", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			"1a"+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcMinutes with dot", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			"1."+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcMinutes with more than 2 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			"123"+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcMinutes with less than 2 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			"1"+
			decArcSeconds
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcSeconds greater than 60.99", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			"61.00"
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcSeconds smaller than 0", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			"-1.00"
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcSeconds with letter", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			"1a.00"
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcSeconds with comma", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			"10,00"
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcSeconds without dot", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			"10000"
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcSeconds with more than 5 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			"10.123"
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});

	it("decArcSeconds with less than 5 chars", async() => {
		let instance = await StarNotary.deployed();

		let user1 = accounts[1];
		
		let wrongStarCoordinatesHex = asciiToHex(
			RAHours+
			RAMinutes+
			RASeconds+
			decDegrees+
			decArcMinutes+
			"10.1"
		);
		let tx = instance.createStar(starNameHex, wrongStarCoordinatesHex, {from: user1});
		expectThrow(tx);
		tx = instance.ownerOf.call(starFirstId);
		expectThrow(tx);
	});
});
