import { Button } from '../../../UI/Button';

import { ModalTokenNotOwnedProps } from './ModalTokenNotOwned.types';

export function ModalTokenNotOwned({
	close
}:ModalTokenNotOwnedProps) {

	const title = "Token Not Owned";
	const content = "Token is no longer in your possession, please await confirmation";

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
