import { Button } from '../../../UI/Button';

import { ModalTokenIdenticalPriceProps } from './ModalTokenIdenticalPrice.types';

export function ModalTokenIdenticalPrice({
	close
}:ModalTokenIdenticalPriceProps) {

	const title = "Identical Price";
	const content = "Token is already for sale at this price, save your tokens!";

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
