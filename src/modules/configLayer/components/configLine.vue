<template>
  <drop-down :showSetting="true" opened-by-default :title="titleTile + 'Layer'" class="border p-3 border-gray-400">

    <drop-down title="Code of template" :opened-by-default="false">
      <pre class="text-left">{{ JSON.stringify(mapSettings, null, "\t") }}</pre>
    </drop-down>

    <drop-down title="Border settings">
      <label for="default-range" class="block text-gray-900">
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
    }" :dataJson="dataJson" :property-selected="propertySelected" :update="update" />
  </drop-down>
</template>

<script>
import WaterDepth from "../../../components/waterDepth.vue";
import templatesItems from "../../../helpers/templates.js";
import {sliceColorsTemplates} from "../../../helpers/sliceColorsTemplates.js";
import DropDown from "../../../components/dropDown.vue";
import {nextTick, reactive} from "vue";

export default {
  components: {DropDown, WaterDepth},
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
          color: "#4f4f4f",
          weight: 1,
          dashArray: [3,3],
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
    colorLegend: {
      async handler(){
        this.update = true
        await nextTick()
        this.update = false
      },
      deep: true
    },
  },
}
</script>

<style scoped>

</style>