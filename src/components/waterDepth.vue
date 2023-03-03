<script>
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
    options: {
      type: Object
    }
  },
  methods: {
    updateTile(){
      if (this.tile) this.tile.remove()

      this.setTile()
      this.tile.addTo(this.map);
    },
    setTile(){
      this.tile = L.geoJSON(this.dataJson, this.options).bindTooltip((ctx) => `${this.propertySelected ? this.propertySelected + " :" : ""} ${ctx.feature.properties[this.propertySelected]?.toString() ? ctx.feature.properties[this.propertySelected]?.toString() : ""} ${this.propertySelected ? getValuesUnits(this.propertySelected) : ""}`)
    }
  },
  data(){
    return {
      tile: undefined,
      tasks: []
    }
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    console.log('mounted')
    this.setTile()
  },
  unmounted() {
    console.log('unmounted')
    if (this.tile) this.tile.remove()
  },
  beforeUpdate() {
    console.log('beforeUpdate')
    this.tasks.push({})
  },
  updated() {
    console.log('updated')
    setTimeout(() => {
      this.tasks.pop()
      if(this.tasks.length){
        console.log("Skip, tasks", ...this.tasks)
        return
      }
      console.log("Update tile")
      this.updateTile()
    }, 300)
  },
}
</script>
