import { Link } from "react-router-dom";

export function Landing() {

  return (
    <div className="landing">
			<div className="landing__content">
				<h1>Welcome to the Star Notary dApp</h1>

				<p>Here you can register, name, and negotiate stars!</p>

				<h3>Specifics:</h3>
				<ul>
					<li>Every star coordinate and star name must be unique</li>
					<li>Coordinates use the 
						<a 						
							target="_blank" 
							rel="noopener noreferrer"
							href="https://en.wikipedia.org/wiki/Equatorial_coordinate_system"
							className="landing-page__inline-anchor"
						>
								Equatorial Coordinate System
						</a>
					</li>
					<li>The only parameters are Right Ascention (RA) and Declination (DEC)</li>
					<li>RA is measured in hours, minutes, and seconds</li>
					<li>DEC is measured in degrees, arcminutes, and arcseconds</li>
					<li>Epoch is always 
						<a
							target="_blank" 
							rel="noopener noreferrer"
							href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#Julian_dates_and_J2000"
							className="landing-page__inline-anchor"
						>
							J2000.0
						</a>
					</li>
				</ul>
				
				<h3>Features:</h3>
				<ul>
					<li>Redux store with blockchain-related state management</li>
					<li>Integration with MetaMask provider from the start</li>
					<li>Killswitch state for building blockchain-safe components</li>
					<li>Tested store and components with jest</li>
					<li>Keyboard accessiblity</li>
					<li>Modals</li>
					<li>Notifications</li>
					<li>Toasts</li>
					<li>Completely responsive interface</li>
					<li>Logging with severity levels</li>
					<li>Validation and formatting helpers</li>
					<li>Error page triggered by react boundary</li>
					<li>Not found page</li>
				</ul>

				<Link 
					to="/components" 
					className="landing__link"
				>
					Components Page:
				</Link>
				<p>A collection of the components built for this template</p>
			</div>
    </div>
  );
};
