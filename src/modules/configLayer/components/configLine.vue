<template>
  <drop-down :showSetting="true" :opened-by-default="false" :title="titleTile + 'Layer'" class="border p-3 border-gray-400">

    <drop-down title="Code of template" :opened-by-default="false">
      <pre class="text-left">mapSettings: {{ JSON.stringify(mapSettings, null, "\t") }}</pre>
      <pre class="text-left">propertySelected: {{ JSON.stringify(propertySelected, null, "\t") }}</pre>
    </drop-down>

    <drop-down title="Border settings" opened-by-default>
      <div class="text-center font-bold">
        Select property
      </div>

      <select v-model="propertySelected" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-0.5 mx-auto">
        <option v-for="property in properties">{{ property }}</option>
      </select>

      <label for="default-range" class="block text-gray-900 mt-5">
        <b>Border color</b>
        <br>
        {{mapSettings.styles.color}}
      </label>

      <color-picker
          :disable-history="true"
          :is-widget="false"
          picker-type="chrome"
          v-model:pure-color="mapSettings.styles.color"
      />

      <label class="block text-gray-900 mt-5">
        <b>Border size </b>
      </label>

      Min:
      <input
             v-model="minWidth"
             class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
      >

      Max:
      <input
          v-model="maxWidth"
          class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
      >

      <label for="default-range" class="block text-gray-900 mt-5">
        <b>Stroke pattern</b>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash#some_common_patterns"
           title="[] = ________________________
1, 1 = .........................................
10, 10 = _ _ _ _ _ _ _ _ _ _ _ _
20, 5 = __ __ __ __ __ __ __ __
15, 3, 3, 3 = _._._._._._._._._._._
20, 3, 3, 3, 3, 3, 3, 3 = _..._..._
12, 3, 3 = _. ._. ._. ._. ._. ._. ._.
"
        >
          [?]
        </a>
      </label>
      <input id="default-range"
             type="text"
             v-model="mapSettings.styles.dashArray"
             class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
      >
    </drop-down>

    <water-depth :map="map" :dataJson="dataJson"
                 :property-selected="propertySelected" :update="update" :options="options"
                 :styles="{
                    ...mapSettings.styles
                  }"
    />
  </drop-down>
</template>

<script>
import WaterDepth from "../../../components/waterDepth.vue";
import DropDown from "../../../components/dropDown.vue";
import {ColorPicker} from "vue3-colorpicker";
import {legendWidthController} from "../../../helpers/legendWidthController.js";

export default {
  components: {ColorPicker, DropDown, WaterDepth},
  props: {
    dataJson: {
      type: Object,
      required: true,
    },
    map: {
      type: Object,
      required: true
    },
    titleTile: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      update: false,

      properties: [],
      propertySelected: "",

      mapSettings: {
        styles: {
          color: "#2e57cb",
          dashArray: "",
        },
      },

      minWidth: 0,
      maxWidth: 3,

      tile: undefined,
    }
  },
  methods: {
    optionObject(min, max, styles){
      return {
        style: (feature) => {
          let lineWeight;
          const featureValue = feature.properties[this.propertySelected];

          if (featureValue == null){
            lineWeight = 1
          } else {
            lineWeight = legendWidthController(featureValue, this.minFeatureVal, this.maxFeatureVal, min, max)
          }

          return {
            ...styles,
            weight: lineWeight,
          };
        }
      }
    }
  },
  mounted() {
    this.properties = Object.keys(this.dataJson.features[0].properties)
    this.propertySelected = this.properties.includes("water_depth_annual") ? "water_depth_annual" : this.properties[0]
  },
  computed: {
    maxFeatureVal(){
      return this.dataJson.features.reduce((max, val) => val.properties[this.propertySelected] > max ? val.properties[this.propertySelected] : max, 0)
    },
    minFeatureVal(){
      return this.dataJson.features.reduce((min, val) => {
        // console.log(min, "<", val.properties[this.propertySelected])
        const res = min < val.properties[this.propertySelected] ? min : val.properties[this.propertySelected]
        // console.log('res', res)
        return res
      }, 999999999)
    },
    options(){
      return this.optionObject(this.minWidth, this.maxWidth, this.mapSettings.styles)
    }
  },
  // watch: {
  //   mapSettings: {
  //     async handler(){
  //       this.$forceUpdate()
  //     },
  //     deep: true
  //   },
  // },
}
</script>

<style scoped>

</style>