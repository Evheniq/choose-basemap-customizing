<script>
import { legendController } from "../helpers/legendController.js";
import { getValuesUnits } from "../helpers/getValuesUnits.js";

export default {
  name: "waterDepth",
  props: {
    map: {
      type: Object,
      required: true
    },
    colorLegend: {
      type: Object,
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
    },
    update: {
      type: Boolean
    }
  },
  methods: {
    setTile(){
      this.tile = L.geoJSON(this.dataJson, {
        style: (feature) => {
          let colorSegm = "";
          if(this.colorLegend){
            if (feature.properties[this.propertySelected] == null){
              colorSegm = this.mapSettings?.nullColor
            }
            else {
              colorSegm = legendController(feature.properties[this.propertySelected], this.colorLegend)
            }

            if (!colorSegm) {
              colorSegm = this.mapSettings?.noMatchingLegend;
            }
          }


          return {
            ...this.styles,
            fillColor: colorSegm,
          };
        }
      }).bindTooltip((ctx) => `${this.propertySelected ? this.propertySelected + " :" : ""} ${ctx.feature.properties[this.propertySelected]?.toString() ? ctx.feature.properties[this.propertySelected]?.toString() : ""} ${this.propertySelected ? getValuesUnits(this.propertySelected) : ""}`)
    }
  },
  data(){
    return {
      tile: undefined,
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
  watch: {
    update(){
      this.$forceUpdate()
    }
  }
}
</script>
