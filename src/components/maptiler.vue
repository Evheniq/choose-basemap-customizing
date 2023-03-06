<template>
  <Map v-model:map="map" v-model:maplibreGL="maplibreGL" />
  <div class="container mx-auto px-3">
    <div class="mx-auto text-center">
      <drop-down title="Choose base map" :opened-by-default="false">
        <div class="container mt-3 mx-auto text-xl text-left">Maptiler:</div>
        <div class="container my-5 mx-auto inline-flex flex-wrap">
          <button
            ref="#"
            v-for="map in mapForChoice"
            :class="{
              'bg-gray-100 text-blue-600': map.link === mapLink,
              'bg-white text-gray-600': map.link !== mapLink,
            }"
            class="mr-3 my-1 px-3 py-2 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-1 focus:ring-blue-700 focus:text-blue-700"
            @click="changeMap(map)">
            {{ map.name }}
          </button>
        </div>
      </drop-down>
      <config-line :dataJson="dataLayers[1]" :map="map" title-tile="Rivers" />
      <configPolygon
        :dataJson="dataLayers[0]"
        :map="map"
        title-tile="WaterDepth"
      />
    </div>
  </div>

  <!--  <saving-templates :map-link="mapLink" v-model:map-settings="mapSettings"/>-->
</template>

<script>
import water_depthJson from '../gjson/water_depth.json'
import riverJson from '../gjson/river.json'
import { ColorPicker } from 'vue3-colorpicker'

import 'vue3-colorpicker/style.css'
import DropDown from './dropDown.vue'
import mapsForChoice from '../helpers/mapsForChoice.js'
import { configPolygon, configLine } from '../modules/configLayer'
import Map from '../components/map.vue'

export default {
  name: 'maptiler',
  components: { configLine, configPolygon, DropDown, ColorPicker, Map },
  data() {
    return {
      mapForChoice: mapsForChoice,

      map: undefined,
      mapLink:
        'https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9',

      dataLayers: [water_depthJson, riverJson],

      maplibreGL: undefined,
      savingTitle: '',
    }
  },
  methods: {
    changeMap(map) {
      this.mapLink = map.link
    },
  },
  watch: {
    mapLink(val) {
      this.maplibreGL.remove()

      if (!val) {
        this.mapLink =
          'https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9'
      }
      this.maplibreGL = L.maplibreGL({
        attribution:
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
        style: this.mapLink,
      }).addTo(this.map)
    },
  },
}
</script>
