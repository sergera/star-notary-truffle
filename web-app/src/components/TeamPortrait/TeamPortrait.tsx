import { TeamPortraitProps } from "./TeamPortrait.types";

export function TeamPortrait({
	name,
	description,
	portraitURL,
}: TeamPortraitProps) {
    return (
			<div className="team-portrait">
					<div className="team-portrait__name">
						<p>{name}</p>
					</div>
					<img className="team-portrait__portrait" src={portraitURL}/>
					<div className="team-portrait__description">
						{description.map((paragraph) => {
							return (
								<p>{paragraph}</p>
							);
						})}
					</div>
			</div>
    );
};
