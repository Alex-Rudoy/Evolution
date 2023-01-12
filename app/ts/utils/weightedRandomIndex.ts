export const weightedRandomIndex = (weights: number[]) => {
  const sum = weights.reduce((a, b) => a + b, 0);
  const r = Math.random() * sum;
  let i = 0;
  let s = weights[0];
  while (s < r) {
    i++;
    s += weights[i];
  }
  return i;
};
