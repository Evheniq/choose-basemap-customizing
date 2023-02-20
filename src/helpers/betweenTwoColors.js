function getNumsFromGradient(rgb){
    const colors = rgb.replace("linear-gradient", "")
        .replace("rgba(", "").replace("rgba(", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace("(", "")
        .replace(")", "").replace(")", "").split(" ")

    // debugger
    // console.log(Number(colors[1]))

    const from = [
        Number(colors[1]),
        Number(colors[2]),
        Number(colors[3]),
        Number(colors[4])
    ];

    const to = [
        Number(colors[6]),
        Number(colors[7]),
        Number(colors[8]),
        Number(colors[9]),
    ];

    return {
        from,
        to
    }


}

export const betweenColors = (rgb, sag, min, max) => {
    const colorNums = getNumsFromGradient(rgb)
    // console.log(colorNums)

    const basis = max - min;
    const percent = sag/basis;

    let result = ""
    for(let i = 0; i < 4; i++){
        result += ((colorNums.from[i] + colorNums.to[i])/(2*percent)).toString() + (i === 3 ? "" : ",")
    }

    return "rgba(" + result + ")";
}