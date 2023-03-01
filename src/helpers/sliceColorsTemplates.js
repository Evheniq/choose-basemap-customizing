export const sliceColorsTemplates = (colors, count) => {
    const result = new Set();
    for (let i = 0; i < count; i++){
        const id = Math.floor( i * (colors.length / count))
        const item = colors[id]
        result.add(item)
    }
    return Array.from(result);
}