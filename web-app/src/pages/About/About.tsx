import { AppInfo } from "../../components/AppInfo";
import { TeamPortrait } from "../../components/TeamPortrait";

import { getPublicUrl } from "../../env";

const publicURL = getPublicUrl();

export function About() {

  return (
    <div className="about">
			<div className="about__content">
				<AppInfo />
				<div className="about__team">
					<TeamPortrait 
						name={"Sergio Joselli"}
						portraitURL={`${publicURL}/portrait/sergio_joselli.jpg`}
						description={[
							`Sergio is a Software Engineering acolyte, 
							an admirer of Best Practices, a lover of Go, and a disciple
							of the Blockchain.`,
							`He has graduated as a Computer Engineer 
							in 2022 with a GPA of 8.8, has 4 years of professional experience 
							as a developer (partially at IBM), and a wide reaching background 
							that ranges from music to teaching.`,
							`With an interest for emerging 
							technologies, battle-tested self motivation skills, and being an 
							eager autodidact, he is currently looking for the next big challenge 
							of his lifetime.`
						]}
					/>
				</div>
			</div>
    </div>
  );
};
