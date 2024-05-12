export const calculateCardRotations = (
  cardCount: number,
  maxRotationAngle: number = 10,
): number[] => {
  const rotations: number[] = [];
  const midpoint = (cardCount - 1) / 2; // adjusted to work with 0-based index

  for (let i = 0; i < cardCount; i++) {
    const distanceFromMidpoint = i - midpoint;
    const rotation = (distanceFromMidpoint / midpoint) * maxRotationAngle;
    rotations.push(rotation);
  }

  return rotations;
};

export const calculateCardTopValues = (
  cardCount: number,
  maxTopValue: number = 24,
): number[] => {
  const topValues: number[] = [];
  const midpoint = (cardCount - 1) / 2;

  for (let i = 0; i < cardCount; i++) {
    const distanceFromMidpoint = Math.abs(i - midpoint);
    const normalizedDistance = distanceFromMidpoint / midpoint;
    const topValue = maxTopValue * Math.pow(normalizedDistance, 2);
    topValues.push(topValue);
  }

  return topValues;
};
