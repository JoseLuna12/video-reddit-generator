import { Composition } from 'remotion';
import { Reddit } from './Reddit/Reddit';

import redditData from "../redditData.json";
import BgVideos from "./videos/files";
import { RedditComments, RedditData } from './types/types';

function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const calculateDurationOfComposition = (comments: RedditComments[]): number => {
	let totalWordCount = 0

	const onlyLevel1Coments = comments.filter(comment => comment.level === "1")

	onlyLevel1Coments.forEach(comment => {
		totalWordCount += comment.comment.split(" ").length
	})

	const speed = Math.floor((totalWordCount / 4) * 60) + 120

	return speed
}

export const RemotionVideo: React.FC = () => {
	const redditDataWithType = redditData as unknown as RedditData[];

	const questionsToRender = redditDataWithType.slice(0, 5)

	return (	
		<>
			{
				questionsToRender.map((reddit,index) => {
					const durationInFrames = calculateDurationOfComposition(reddit.comments);
					return (
						<Composition
							id={`questionN${index+1}`}
							component={Reddit}
							durationInFrames={durationInFrames}
							fps={30}
							height={1080}
							width={600}
							defaultProps={{ ...reddit, bg: BgVideos[0] }}
						/>
					)
				})

			}
		</>
	);
};
