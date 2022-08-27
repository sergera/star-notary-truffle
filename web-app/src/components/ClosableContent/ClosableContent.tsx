import { useState } from "react";

import { Button } from "../UI/Button";

import { ClosableContentProps } from "./ClosableContent.types";

export const ClosableContent: React.FC<ClosableContentProps> = ({
	children,
	handleClose=()=>{},
}) => {

	let [shouldClose, setShouldClose] = useState<boolean>(false);

	if(shouldClose) {
		return (<></>);	
	}

	const closeHandler = () => {
		setShouldClose(true);
		handleClose();
	}
	
	return (
		<div className="closable-content">
			<div className="closable-content__close-button">
				<Button 
					name={"Close"}
					handleClick={closeHandler}
					styleClass={"btn-background-outline"}
				/>
			</div>
			{children}
		</div>
	);
};
