import { Button } from '../../../UI/Button';

import { ModalTokenDifferentPriceProps } from './ModalTokenDifferentPrice.types';

export function ModalTokenDifferentPrice({
	close
}:ModalTokenDifferentPriceProps) {

	const title = "Token Price Changed";
	const content = "Token price is no longer this value, please await confirmation";

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
