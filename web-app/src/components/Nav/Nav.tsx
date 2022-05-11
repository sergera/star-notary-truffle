import { Link } from "react-router-dom";

export function Nav() {

  return (
		<nav className="nav">
			<div className="nav__link">
				<Link 
					to="/" 
					style={{ color: 'inherit', textDecoration: 'inherit'}}
				>
					Landing
				</Link>
			</div>
			<div className="nav__link">
				<Link 
					to="/create" 
					style={{ color: 'inherit', textDecoration: 'inherit'}}
				>
					Create Star
				</Link>
			</div>
			<div className="nav__link">
				<Link 
					to="/components" 
					style={{ color: 'inherit', textDecoration: 'inherit'}}
				>
					Components
				</Link>
			</div>
		</nav>
  );
};
