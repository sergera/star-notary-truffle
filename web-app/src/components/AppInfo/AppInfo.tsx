export function AppInfo() {
  return (
    <div className="app-info">
			<h1>Welcome to the Star Notary dApp</h1>
			<p>Here you can register, name, and trade stars!</p>
			<ul className="app-info__list">
				<li>{"Firstly, you need a "}
					<a
						target="_self" 
						rel="noopener noreferrer"
						href="https://metamask.io/"
						className="app-info__inline-anchor"
					>
						{"Metamask Wallet"}
					</a>
				</li>
				<li>{"Secondly, you need some fake internet money, you can get some through this "}
					<a
						target="_blank" 
						rel="noopener noreferrer"
						href="https://goerlifaucet.com/"
						className="app-info__inline-anchor"
					>
						{"Faucet"}
					</a>
					{" (may require registration)"}
				</li>
				<li>{"You can also use this "}
					<a
						target="_blank" 
						rel="noopener noreferrer"
						href="https://goerli-faucet.pk910.de/"
						className="app-info__inline-anchor"
					>
						{"PoW Faucet"}
					</a>
				</li>
				<li>{"Every star's coordinates and name must be unique"}</li>
				<li>{"Coordinates use the "}
					<a 						
						target="_blank" 
						rel="noopener noreferrer"
						href="https://en.wikipedia.org/wiki/Equatorial_coordinate_system"
						className="app-info__inline-anchor"
					>
						{"Equatorial Coordinate System"}
					</a>
				</li>
				<li>{"The only parameters are Right Ascension (RA) and Declination (DEC)"}</li>
				<li>{"RA is measured in hours, minutes, and seconds"}</li>
				<li>{"DEC is measured in degrees, arcminutes, and arcseconds"}</li>
				<li>{"Epoch is always "}
					<a
						target="_blank" 
						rel="noopener noreferrer"
						href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#Julian_dates_and_J2000"
						className="app-info__inline-anchor"
					>
						{"J2000.0"}
					</a>
				</li>
			</ul>
    </div>
  );
};
