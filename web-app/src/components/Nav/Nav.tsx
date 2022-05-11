import { Link } from "react-router-dom";

export function Nav() {

  return (
		<nav className="nav">
			<div className="nav__link">
				<Link 
					to="/" 
					style={{ color: 'inherit', textDecoration: 'inherit', padding: '0.5rem' }}
				>
					Landing
				</Link>
			</div>
			<div className="nav__link">
				<Link 
					to="/create" 
					style={{ color: 'inherit', textDecoration: 'inherit', padding: '0.5rem' }}
				>
					Create Star
				</Link>
			</div>
			<div className="nav__link">
				<Link 
					to="/components" 
					style={{ color: 'inherit', textDecoration: 'inherit', padding: '0.5rem' }}
				>
					Components
				</Link>
			</div>
		</nav>
  );
};
