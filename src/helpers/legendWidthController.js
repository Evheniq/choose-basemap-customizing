export function legendWidthController(val, minVal, maxVal, newMin, newMax) {
  const phase1 = val - minVal;
  const phase2 = Number(newMax) - Number(newMin);
  const phase3 = maxVal - minVal;
  const phase4 = (phase1 * phase2) / phase3;

  return phase4 + Number(newMin);
}
