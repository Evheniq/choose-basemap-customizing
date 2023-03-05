export function legendWidthController(val, minVal, maxVal, newMin, newMax) {
    // console.log('>>>>>>')
    // console.log(val, minVal, maxVal, Number(newMin), Number(newMax))
    const phase1 = val - minVal
    // console.log('phase1: ', val, minVal, phase1)
    const phase2 = Number(newMax) - Number(newMin)
    // console.log('phase2: ', Number(newMax), Number(newMin), phase2)
    const phase3 = maxVal - minVal
    // console.log('phase3: ', maxVal, minVal, phase3)
    const phase4 = phase1 * phase2 / phase3
    // console.log('phase4: ', phase1, phase2, phase4)

    const result = phase4 + Number(newMin);
    // console.log('<<<<<<')
    // console.log(val, minVal, maxVal, Number(newMin), Number(newMax), '=', result)
    return result
}