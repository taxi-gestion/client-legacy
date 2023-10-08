// TODO Do I really need to explain how ugly this is ?
export const sortByDatetime = <T extends { datetime: string }>(elements: T[]): T[] =>
  elements.sort((elem1: T, elem2: T): number => Date.parse(elem1.datetime) - Date.parse(elem2.datetime));

/*
export const sortByTime = <T extends { time: string }>(elements: T[]): T[] =>
  elements.sort((elem1: T, elem2: T) => Date.parse(elem1.time) - Date.parse(elem2.time));
*/
