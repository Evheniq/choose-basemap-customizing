<template>
  <drop-down :showSetting="true" opened-by-default :title="titleTile + 'Layer'" class="border p-3 border-gray-400">

    <drop-down title="Code of template" :opened-by-default="false">
      <pre class="text-left">mapSettings: {{ JSON.stringify(mapSettings, null, "\t") }}</pre>
      <pre class="text-left">propertySelected: {{ JSON.stringify(propertySelected, null, "\t") }}</pre>
    </drop-down>

    <drop-down title="Border settings">
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

      <label for="default-range" class="block text-gray-900 mt-5">
        <b>Border size </b> ({{ mapSettings.styles.weight }})
      </label>
      <input id="default-range"
             type="range"
             min="0" max="5"
             step="1"
             v-model="mapSettings.styles.weight"
             class="w-44 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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

    <water-depth :map="map" :styles="{
      ...mapSettings.styles
    }" :dataJson="dataJson" :property-selected="propertySelected" :update="update" :options="options" />
  </drop-down>
</template>

<script>
import WaterDepth from "../../../components/waterDepth.vue";
import DropDown from "../../../components/dropDown.vue";
import {legendController} from "../../../helpers/legendController.js";
import {ColorPicker} from "vue3-colorpicker";

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

      options: {
        style: (feature) => {
          let colorSegm = "";
          if(this.colorLegend){
            if (feature.properties[this.propertySelected] == null){
              colorSegm = this.mapSettings.nullColor
            }
            else {
              colorSegm = legendController(feature.properties[this.propertySelected], this.colorLegend)
            }

            if (!colorSegm) {
              colorSegm = this.mapSettings.noMatchingLegend;
            }
          }

          console.log(feature)

          return {
            ...this.mapSettings.styles,
            // weight: feature.properties[this.propertySelected],
          };
        }
      },

      mapSettings: {
        styles: {
          color: "#b50d40",
          weight: 1,
          dashArray: "",
        },
      },

      tile: undefined,
    }
  },
  mounted() {
    this.properties = Object.keys(this.dataJson.features[0].properties)
    this.propertySelected = this.properties.includes("water_depth_annual") ? "water_depth_annual" : this.properties[0]
  },
  watch: {
    // colorLegend: {
    //   async handler(){
    //     this.update = true
    //     await nextTick()
    //     this.update = false
    //   },
    //   deep: true
    // },
  },
}
</script>

<style scoped>

</style>