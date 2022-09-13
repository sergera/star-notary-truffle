import { Button } from '../../../UI/Button';

import { ModalUnavailableNameProps } from './ModalUnavailableName.types';

export function ModalUnavailableName({
	close
}:ModalUnavailableNameProps) {

	const title = "Name Unavailable";
	const content = "This name is currently in use";

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
