export function lineWidthController(val, minVal, maxVal, newMin, newMax) {
  const phase1 = val - minVal;
  const phase2 = Number(newMax) - Number(newMin);
  const phase3 = maxVal - minVal;
  const phase4 = (phase1 * phase2) / phase3;

  return phase4 + Number(newMin);
}

export function legendWidthController(val, legend) {
  let width;

  for (let i = 0; i < legend.length; i++) {
    if (val < legend[i].max && val > legend[i].min - 1) {
      width = legend[i].width;
      break;
    }
  }

  console.log('width', width)

  return width;
}
