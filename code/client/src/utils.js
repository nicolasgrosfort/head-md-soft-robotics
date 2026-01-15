export const lerp = (current, target, alpha) => {
  return current + (target - current) * alpha;
};

export const mapValue = (value, inputRange, outputRange) => {
  const [inputStart, inputEnd] = inputRange;
  const [outputStart, outputEnd] = outputRange;

  return (
    ((value - inputStart) * (outputEnd - outputStart)) /
      (inputEnd - inputStart) +
    outputStart
  );
};
