const areArraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((val, index) => val === sortedB[index]);
};


export {
    areArraysEqual
}