<script>
import { getValuesUnits } from '../helpers/getValuesUnits.js'

export default {
  name: 'waterDepth',
  props: {
    map: {
      type: Object,
      required: true,
    },
    colorLegend: {
      type: Object,
    },
    countOfColorsWeNeed: {
      type: Number,
      required: true,
    },
    dataJson: {
      type: Object,
      required: true,
    },
    styles: {
      type: Object,
      required: true,
    },
    propertySelected: {
      type: String,
    },
    options: {
      type: Object,
    },
    bringToBack: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Object
    }
  },
  methods: {
    updateTile() {
      if (this.tile) this.tile.remove()

      this.setTile()
      this.tile.addTo(this.map)
    },
    setTile() {
      if (this.icon) {
        this.tile = L.geoJSON(this.dataJson, {
          pointToLayer: (feature, latlng) => {
            return L.marker(latlng, { icon: this.icon });
          }
        }).bindTooltip((ctx) => {
          return `${this.propertySelected ? this.propertySelected + ' :' : ''} ${
            ctx.feature.properties[this.propertySelected]?.toString()
              ? ctx.feature.properties[this.propertySelected]?.toString()
              : ''
          } ${this.propertySelected ? getValuesUnits(this.propertySelected) : ''}`
        })
      } else {
        this.tile = L.geoJSON(this.dataJson, this.options).bindTooltip((ctx) => {
          return `${this.propertySelected ? this.propertySelected + ' :' : ''} ${
            ctx.feature.properties[this.propertySelected]?.toString()
              ? ctx.feature.properties[this.propertySelected]?.toString()
              : ''
          } ${this.propertySelected ? getValuesUnits(this.propertySelected) : ''}`
        })
      }
    },
  },
  data() {
    return {
      tile: undefined,
      tasks: [],
    }
  },
  mounted() {
    console.log('mounted')
    this.setTile()
  },
  unmounted() {
    console.log('unmounted')
    if (this.tile) this.tile.remove()
  },
  updated() {
    console.log('update start')

    console.log('beforeUpdate')
    this.tasks.push('1')
    console.log('push 1')

    // Just fixing throttle
    setTimeout(() => {
      console.log('this.tasks:', this.tasks)
      console.log('this.tasks.pop', this.tasks.pop())
      if (this.tasks.length) {
        console.log('Skip, tasks', ...this.tasks)
        return
      }

      console.log('Update tile')
      this.updateTile()

      if (this.bringToBack) this.tile.bringToBack()
    }, 300)
  },
}
</script>
