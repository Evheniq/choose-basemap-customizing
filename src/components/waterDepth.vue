<script>
import { legendController } from "../helpers/legendController.js";
import { getValuesUnits } from "../helpers/getValuesUnits.js";
import water_depthJson from "../gjson/water_depth.json";
import {nextTick} from "vue";

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
    },
    styles: {
      type: Object,
      required: true
    },
    propertySelected: {
      type: String,
    }
  },
  methods: {
    setTile(){
      this.tile = L.geoJSON(this.dataJson, {
        style: (feature) => {
          let colorSegm = "";

          if (feature.properties[this.propertySelected] == null){
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
          else {
            colorSegm = legendController(feature.properties[this.propertySelected], this.colorLegend)
          }

          if (!colorSegm) {
            colorSegm = this.mapSettings.noMatchingLegend;
          }

          return {
            ...this.styles,
            fillColor: colorSegm,

            // color: this.mapSettings.borderColor,
            // fill: this.mapSettings.fill,
            // fillOpacity: this.mapSettings.opacity,
            // weight: this.mapSettings.borderSize,
            // dashArray: this.mapSettings.dashArray
          };
        }
      }).bindTooltip((ctx) => `${this.propertySelected ? this.propertySelected + " :" : ""} ${ctx.feature.properties[this.propertySelected]?.toString() ? ctx.feature.properties[this.propertySelected]?.toString() : ""} ${this.propertySelected ? getValuesUnits(this.propertySelected) : ""}`)
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
  beforeMount() {
    console.log('beforeMount')
    this.setTile()
  },
  async mounted() {
    console.log('mounted')
    console.log(this.propertySelected)
    // this.tile.addTo(this.map);
  },
  unmounted() {
    console.log('unmounted')
    if (this.tile) this.tile.remove()
  },
  beforeUpdate() {
    console.log('beforeUpdate')
    if (this.tile) this.tile.remove()
  },
  updated() {
    console.log('updated')
    this.setTile()
    this.tile.addTo(this.map);
  },
}
</script>
