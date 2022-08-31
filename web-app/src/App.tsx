import { Routes, Route, Navigate } from "react-router-dom";

import { ConnectedStars as Stars } from './pages/Stars';
import { CreateStar } from './pages/CreateStar';
import { About } from './pages/About';
import { ErrorNotFound } from './pages/ErrorNotFound';

import { Header } from './components/Header';
import { Nav } from './components/Nav';
import { Footer } from "./components/Footer";

import { ConnectedModalContainer as ModalContainer } from './components/ModalContainer';
import { ConnectedNotificationContainer as NotificationContainer } from './components/NotificationContainer';
import { ConnectedToastContainer as ToastContainer } from './components/ToastContainer';

import { ErrorBoundary } from "./components/ErrorBoundary";

import { ROUTER_PATHS } from "./constants";

import './App.css';

export function App() {

  return (
		<div className="app">
			<ModalContainer />
			<NotificationContainer />
			<ToastContainer />
			<Header />
			<Nav />
			<ErrorBoundary> 
				<Routes>
						<Route path={ROUTER_PATHS.stars} element={<Stars />} />
						<Route path={ROUTER_PATHS.create} element={<CreateStar />} />
						<Route path={ROUTER_PATHS.about} element={<About />} />
						<Route path={ROUTER_PATHS.notFound} element={<ErrorNotFound />} />
						<Route path={"*"} element={<Navigate to={ROUTER_PATHS.notFound} />} />
				</Routes>
			</ErrorBoundary>
			<Footer />
		</div>
  );
};
