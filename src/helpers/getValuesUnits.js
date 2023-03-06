export const getValuesUnits = (property) => {
  if (property.includes('water_depth')) return 'mm'
  if (property.includes('precipitation')) return 'mm'
  if (property.includes('evapotranspiration')) return 'mm'
  return ''
}
