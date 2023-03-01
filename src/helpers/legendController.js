export const legendController = (segment_val, legend) => {
    let color;

    for(let i = 0; i < legend.length; i++){
        // console.log(segment_val, legend[i].min, legend[i].max)
        if(segment_val < legend[i].max && segment_val > legend[i].min - 1){
            color = legend[i].color;
            break;
        }
    }

    return color;
}