import { Button } from '../../../UI/Button';

import { ModalTokenNotForSaleProps } from './ModalTokenNotForSale.types';

export function ModalTokenNotForSale({
	close
}:ModalTokenNotForSaleProps) {

	const title = "Token Not For Sale";
	const content = "Token is no longer for sale, please await confirmation";

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
