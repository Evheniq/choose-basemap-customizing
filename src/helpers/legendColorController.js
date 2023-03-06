export const legendColorController = (segment_val, legend) => {
  let color;

  for (let i = 0; i < legend.length; i++) {
    if (segment_val < legend[i].max && segment_val > legend[i].min - 1) {
      color = legend[i].color;
      break;
    }
  }

  return color;
};
