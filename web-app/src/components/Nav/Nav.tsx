import { Link, useLocation } from "react-router-dom";

import { ROUTER_PATHS } from "../../constants";

export function Nav() {
	const location = useLocation();

	const routeActive = (path: string) => {
		if(location.pathname === path) {
			return true;
		}
		return false;
	}

  return (
		<nav className="nav">
			<div className="nav__link">
				<Link 
					to={ROUTER_PATHS.stars}
					style={{
						color: 'inherit',
						textDecoration: routeActive(ROUTER_PATHS.stars) ? 'underline' : 'inherit',
						padding: '0.5rem'
					}}
				>
					Stars
				</Link>
			</div>
			<div className="nav__link">
				<Link 
					to={ROUTER_PATHS.create}
					style={{
						color: 'inherit',
						textDecoration: routeActive(ROUTER_PATHS.create) ? 'underline' : 'inherit',
						padding: '0.5rem'
					}}
				>
					Create Star
				</Link>
			</div>
			<div className="nav__link">
				<Link 
					to={ROUTER_PATHS.about}
					style={{
						color: 'inherit',
						textDecoration: routeActive(ROUTER_PATHS.about) ? 'underline' : 'inherit',
						padding: '0.5rem'
					}}
				>
					About
				</Link>
			</div>
			<div className="nav__link">
				<Link 
					to={ROUTER_PATHS.components}
					style={{
						color: 'inherit',
						textDecoration: routeActive(ROUTER_PATHS.components) ? 'underline' : 'inherit',
						padding: '0.5rem'
					}}
				>
					Components
				</Link>
			</div>
		</nav>
  );
};
