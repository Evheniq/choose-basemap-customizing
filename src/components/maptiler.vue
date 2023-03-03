<template>
  <Map v-model:map="map" v-model:maplibreGL="maplibreGL" />
  <div class="container mx-auto">

    <div class="mx-auto text-center">
      <drop-down title="Choose base map" :opened-by-default="false">
        <div class="container mt-3 mx-auto text-xl text-left">
          Maptiler:
        </div>
        <div class="container my-5 mx-auto inline-flex">
          <button ref="#" v-for="map in mapForChoice"
                  :class="{
                      'bg-gray-100 text-blue-600': map.link === mapLink,
                      'bg-white text-gray-600': map.link !== mapLink,
                    }"
                  class="mr-3 px-4 py-2 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-1 focus:ring-blue-700 focus:text-blue-700"
                  @click="changeMap(map)"
          >{{ map.name }}</button>
        </div>
      </drop-down>
      <config-line :dataJson="dataLayers[1]" :map="map" title-tile="Rivers" />
      <configPolygon :dataJson="dataLayers[0]" :map="map" title-tile="WaterDepth" />
    </div>
  </div>

  <saving-templates :map-link="mapLink" v-model:map-settings="mapSettings"/>
</template>

<script>
import water_depthJson from "../gjson/water_depth.json";
import riverJson from "../gjson/river.json";
import templatesItems from "../helpers/templates";
import {ColorPicker} from "vue3-colorpicker";

import "vue3-colorpicker/style.css";
import DropDown from "./dropDown.vue";
import SavingTemplates from "../modules/savingTemplates/components/savingTemplates.vue";
import mapsForChoice from "../helpers/mapsForChoice.js";
import WaterDepth from "./waterDepth.vue";
import configPolygon from "../modules/configLayer";
import ConfigLine from "../modules/configLayer/components/configLine.vue";
import Map from "../components/map.vue";
import {nextTick} from "vue";

export default {
  name: "maptiler",
  components: {ConfigLine, configPolygon, WaterDepth, SavingTemplates, DropDown, ColorPicker, Map},
  data() {
    return {
      mapForChoice: mapsForChoice,
      legendTemplates: templatesItems,
      selectedTemplate: 1,
      map: undefined,
      mapLink: "https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9",
      templateStep: 20,
      countOfColorsWeNeed: 5,

      dataLayers: [water_depthJson, riverJson],

      properties: [],
      propertySelected: "",

      mapSettings: {
        colorSegmentRegime: "Templates",
        borderColor: "#4f4f4f",
        borderSize: 1,
        opacity: 0.5,
        fill: true,
        gradientColor: "linear-gradient(90deg, rgba(31, 135, 232, 1) 0%, rgba(3, 30, 58, 1) 100%)",
        colorLegend: [],
        nullColor: "#eb6f27",
        noMatchingLegend: "#ca0505",
        dashArray: [3,3],
      },

      tile: undefined,
      riverTile: undefined,
      maplibreGL: undefined,
      savingTitle: "",
    }
  },
  methods: {
    changeMap(map){
      this.mapLink = map.link
    },
  },
  watch: {
    mapLink(val){
      this.maplibreGL.remove()

      if (!val){
        this.mapLink = "https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9";
      }
      this.maplibreGL = L.maplibreGL({
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        style: this.mapLink
      }).addTo(this.map);
    },
  }
}
</script>
