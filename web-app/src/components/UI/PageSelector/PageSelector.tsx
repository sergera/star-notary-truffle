import { Button } from '../Button';

import { PageSelectorProps } from './PageSelector.types';

export function PageSelector({
	handleClickNext,
	handleClickPrevious,
	shouldDisplayNext,
	shouldDisplayPrevious,
	pageNumber,
	id="",	
	styleClass="",
}: PageSelectorProps) {

  return (
		<div className={"page-selector " + styleClass} id={id}>
			{shouldDisplayPrevious &&
				<Button 
					styleClass="btn-background-outline" 
					handleClick={handleClickPrevious} 
					name={"< previous"} 
				/>
			}
			<div className="page-selector__number">
				{pageNumber}
			</div>
			{shouldDisplayNext &&
				<Button 
					styleClass="btn-background-outline" 
					handleClick={handleClickNext} 
					name={"next >"} 
				/>
			}
		</div>
  );
};
