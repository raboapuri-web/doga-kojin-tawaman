import data from './story-data.json';

export type Tone='tokyo'|'memory'|'neutral';
export type StoryBeat={id:string;tone:Tone;visuals:string[];narration:string;emphasis?:string};
export const storyTitle=data.title;
export const shots=data.shots as StoryBeat[];
