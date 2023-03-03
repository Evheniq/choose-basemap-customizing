<template>

</template>

<script>
import {betweenColors} from "../helpers/betweenTwoColors.js";
import {legendController} from "../helpers/legendController.js";
import {getValuesUnits} from "../helpers/getValuesUnits.js";

export default {
  name: "waterDepth",
  props: {
    map: {
      type: Object,
      required: true
    },
    colorLegend: {
      type: Object,
      required: true
    },
    dataJson: {
      type: Object,
      required: true
    }
  },
  methods: {
    setTile(){
      this.tile = L.geoJSON(this.dataJson, {
        style: (feature) => {
          let colorSegm = "";

          if (feature.properties.water_depth_annual == null){
            colorSegm = this.mapSettings.nullColor
          }
          // else if(this.mapSettings.colorSegmentRegime === 'Gradient') {
          //   colorSegm = betweenColors(
          //       this.mapSettings.gradientColor,
          //       feature.properties.water_depth_annual,
          //       23, 300
          //   );
          // } else if(this.mapSettings.colorSegmentRegime === 'Templates') {
          //   colorSegm = legendController(feature.properties.water_depth_annual, this.colorLegend)
          // }

          colorSegm = legendController(feature.properties.water_depth_annual, this.colorLegend)

          if (!colorSegm) {
            colorSegm = this.mapSettings.noMatchingLegend;
          }

          return {
            color: this.mapSettings.borderColor,
            fill: this.mapSettings.fill,
            fillColor: colorSegm,
            fillOpacity: this.mapSettings.opacity,
            weight: this.mapSettings.borderSize,
            dashArray: this.mapSettings.dashArray
          };
        }
      }).bindTooltip((ctx) => `${this.propertySelected}: ${ctx.feature.properties[this.propertySelected].toString()} ${getValuesUnits(this.propertySelected)}`)
    }
  },
  data(){
    return {
      tile: undefined,

      mapSettings: {
        colorSegmentRegime: "Templates",
        borderColor: "#4f4f4f",
        borderSize: 1,
        opacity: 0.3,
        fill: true,
        gradientColor: "linear-gradient(90deg, rgba(31, 135, 232, 1) 0%, rgba(3, 30, 58, 1) 100%)",
        colorLegend: [],
        nullColor: "#eb6f27",
        noMatchingLegend: "#ca0505",
        dashArray: [3,3],
      },
    }
  },
  async mounted() {
    console.log('mounted')
    this.setTile()
    console.log(this.colorLegend)
    this.tile.addTo(this.map);
  },
  updated() {
    console.log('updated')
    if (this.tile) this.tile.remove()
    this.setTile()
    this.tile.addTo(this.map);
  }
}
</script>

<style scoped>

</style>