export const randomBetween = (
  min: number,
  max: number,
  step?: number
): number => {
  const random = Math.random() * (max - min) + min;
  return step ? Math.floor(random / step) * step : random;
};
