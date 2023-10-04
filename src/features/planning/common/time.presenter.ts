// TODO Do I really need to explain how ugly this is ?
export const sortByDatetime = <T extends { datetime: string }>(elements: T[]): T[] =>
  elements.sort(
    (element1: T, element2: T): number =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(element1.datetime.split(':')[0]!, 10) * 60 +
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(element1.datetime.split(':')[1]!, 10) -
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(element2.datetime.split(':')[0]!, 10) * 60 +
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(element2.datetime.split(':')[1]!, 10)
  );

export const sortByTime = <T extends { time: string }>(elements: T[]): T[] =>
  elements.sort(
    (element1: T, element2: T): number =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(element1.time.split(':')[0]!, 10) * 60 +
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(element1.time.split(':')[1]!, 10) -
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(element2.time.split(':')[0]!, 10) * 60 +
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(element2.time.split(':')[1]!, 10)
  );
