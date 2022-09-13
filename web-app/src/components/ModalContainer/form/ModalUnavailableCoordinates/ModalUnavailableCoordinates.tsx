import { Button } from '../../../UI/Button';

import { ModalUnavailableCoordinatesProps } from './ModalUnavailableCoordinates.types';

export function ModalUnavailableCoordinates({
	close
}:ModalUnavailableCoordinatesProps) {

	const title = "Coordinates Unavailable";
	const content = "These coordinates are already registered";

  return (
		<div className="modal">
			<div className="modal__content">
				<h1 className="modal__text">{title}</h1>
				<p className="modal__text">{content}</p>
			</div>
			<Button 
				styleClass="btn-foreground-outline" 
				name={"ok"} 
				handleClick={() => close()}
				shouldFocusOnRender={true}
			/>
		</div>
  );
};
