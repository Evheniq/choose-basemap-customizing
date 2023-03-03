<template>
  <div id="maptiler"></div>

  <div class="container mx-auto">

    <div class="mx-auto text-center">
      <drop-down title="Code of template" :opened-by-default="false">
        <pre class="text-left">{{ JSON.stringify(mapSettings, null, "\t") }}</pre>
      </drop-down>

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

      <drop-down title="Legend settings" :opened-by-default="true">
        <div class="mb-5">
          You have 2 types of settings:
          <b :class="{'underline text-blue-700 cursor-pointer': mapSettings.colorSegmentRegime !== 'Templates'}"
             @click="() => mapSettings.colorSegmentRegime = 'Templates'">
            Templates for legend
          </b>
          or
          <b :class="{'underline text-blue-700 cursor-pointer': mapSettings.colorSegmentRegime !== 'Gradient'}"
             @click="() => mapSettings.colorSegmentRegime = 'Gradient'">
            Gradient
          </b>
        </div>

        <div v-if="mapSettings.colorSegmentRegime === 'Gradient'">
          <div>
            <b>Gradient for segments:</b>
            <br>
            {{ mapSettings.gradientColor }}
            <br>
            <color-picker
                :disable-history="true"
                :is-widget="false"
                picker-type="chrome"
                useType="gradient"
                v-model:gradientColor="mapSettings.gradientColor"
            />

          </div>
        </div>
        <div v-if="mapSettings.colorSegmentRegime === 'Templates'">
          <div>
            <div v-if="false">
              Step for template (max - min):
              <input type="text" v-model="templateStep" class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded">
            </div>

            <div class="text-center mt-8 font-bold mb-5">
              Select property
            </div>

            <select v-model="propertySelected" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-0.5 mx-auto">
              <!--Supplement an id here instead of using 'name'-->
              <option v-for="property in properties">{{ property }}</option>
            </select>

            <div class="text-center mt-8 font-bold mb-5">
              Templates
            </div>
            <div>
              <div class="mb-5">
                <span class="mb-2 ">Number of data classes:</span>
                <select v-model="countOfColorsWeNeed" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-0.5 mx-auto">
                  <!--Supplement an id here instead of using 'name'-->
                  <option v-for="number in 9">{{ number }}</option>
                </select>
              </div>

            </div>
            <div class="flex justify-center mb-8">

              <div class="block p-2 box-border cursor-pointer mx-1" @click="this.selectTemplate(template.items, template.id)" style="width: 40px;" v-for="template in legendTemplates" :key="template.id" :class="{'border-2 border-rose-400': selectedTemplate === template.id}">
                <div v-for="rectangle in sliceColorsTemplates(template.items, countOfColorsWeNeed)" :key="rectangle.id" :style="{background: rectangle.color}" style="height: 20px; width: 20px; margin-bottom: 1px; border: 1px solid #8d97a3;"></div>
              </div>
            </div>
          </div>

          <b>Legend: </b>
          <div class="mt-5">
            <div v-for="legendItem of mapSettings.colorLegend" class="my-2">

              <color-picker
                  :disable-history="true"
                  :is-widget="false"
                  v-model:pure-color="legendItem.color"
              />
              Min:
              <input class="w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded" type="text" v-model="legendItem.min">
              Max:
              <input class="w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded" type="text" v-model="legendItem.max">

              <button class="text-red-600" @click="removeLegend(legendItem.id)">x</button>

            </div>
          </div>
          <button
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-1"
              @click="addLegend"
          >
            Add
          </button>
        </div>

        <div class="text-center mt-8 mb-5 font-bold">
          Exceptions
        </div>
        <div class="flex justify-center mb-8">
          <div class="mx-3">
            Null values:
            <color-picker
                :disable-history="true"
                :is-widget="false"
                v-model:pure-color="mapSettings.nullColor"
            />
          </div>

          <div class="mx-3">
            Out of range:
            <color-picker
                :disable-history="true"
                :is-widget="false"
                v-model:pure-color="mapSettings.noMatchingLegend"
            />
          </div>
        </div>

        <div class="my-5">
          <label for="default-range" class="block text-gray-900">
            <b>Opacity</b> ({{ mapSettings.opacity*100 }}%)
          </label>
          <input id="default-range"
                 type="range"
                 min="0" max="1"
                 step="0.1"
                 v-model="mapSettings.opacity"
                 class="w-44 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
        </div>
        <div class="my-5">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="mapSettings.fill">
            <span class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></span>
            <span class="ml-3"><b>Зробити заливку сегментів?</b></span>
          </label>
        </div>
      </drop-down>

      <drop-down title="Border settings">
        <label for="default-range" class="block text-gray-900">
          <b>Border color</b>
          <br>
          {{mapSettings.borderColor}}
        </label>

        <color-picker
            :disable-history="true"
            :is-widget="false"
            picker-type="chrome"
            v-model:pure-color="mapSettings.borderColor"
        />

        <label for="default-range" class="block text-gray-900 mt-5">
          <b>Border size </b> ({{ mapSettings.borderSize }})
        </label>
        <input id="default-range"
               type="range"
               min="0" max="5"
               step="1"
               v-model="mapSettings.borderSize"
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
               v-model="mapSettings.dashArray"
               class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
        >


      </drop-down>

    </div>
  </div>

  <water-depth :map="map" :color-legend="mapSettings.colorLegend" :styles="{
    color: '#4f4f4f',
    weight: 1,
    fillOpacity: 0.5,
    fill: true,
    dashArray: [3,3]
  }" :dataJson="dataLayers[0]" :property-selected="propertySelected" />

  <water-depth :map="map" :color-legend="mapSettings.colorLegend" :styles="{
    'color': '#c02390',
    'weight': 1,
    'opacity': 1
  }" :dataJson="dataLayers[1]" />

  <saving-templates :map-link="mapLink" v-model:map-settings="mapSettings"/>
</template>

<script>
import water_depthJson from "../gjson/water_depth.json";
import riverJson from "../gjson/river.json";
import templatesItems from "../helpers/templates";
import {ColorPicker} from "vue3-colorpicker";
import {betweenColors} from "../helpers/betweenTwoColors";

import "vue3-colorpicker/style.css";
import DropDown from "./dropDown.vue";
import {legendController} from "../helpers/legendController.js";
import {sliceColorsTemplates} from "../helpers/sliceColorsTemplates.js";
import {getValuesUnits} from "../helpers/getValuesUnits.js";
import SavingTemplates from "../modules/savingTemplates/components/savingTemplates.vue";
import mapsForChoice from "../helpers/mapsForChoice.js";
import WaterDepth from "./waterDepth.vue";

export default {
  name: "maptiler",
  components: {WaterDepth, SavingTemplates, DropDown, ColorPicker },
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
    buildDataLayer(){
      // this.tileObj.addTo(this.map);
      // this.riverTileObj.addTo(this.map);
    },
    changeMap(map){
      this.mapLink = map.link
    },

    sliceColorsTemplates,
    selectTemplate(template, id){
      if (typeof(id) != "undefined"){
        this.selectedTemplate = id;
      }
      // this.rebuildLegendItems(template)
      this.recolorLegendItems(template)
    },
    recolorLegendItems(template){
      let legend = [];

      sliceColorsTemplates(template, this.countOfColorsWeNeed).forEach((item, index) => {
        legend.push({
          min: this.mapSettings.colorLegend[index].min,
          max: this.mapSettings.colorLegend[index].max,
          color: item.color,
          id: item.id
        })
      })

      legend[legend.length-1].max = 999999999;
      this.mapSettings.colorLegend = legend;
    },
    rebuildLegendItems(template){
      let min = water_depthJson.features.reduce((min, item) => item.properties[this.propertySelected] > min ? min : item.properties[this.propertySelected], 999999);
      let max = water_depthJson.features.reduce((max, item) => item.properties[this.propertySelected] < max ? max : item.properties[this.propertySelected], 0);
      let step = Math.round((max - min) / this.countOfColorsWeNeed)

      let legend = [];

      let localMin = min;
      let localMax = min + step;

      sliceColorsTemplates(template, this.countOfColorsWeNeed).forEach((item) => {
        // console.log(localMin)
        // console.log(localMax)
        legend.push({
          min: localMin,
          max: localMax,
          color: item.color,
          id: item.id
        })
        localMin += step;
        localMax += step;
      })

      legend[legend.length-1].max = 999999999;
      this.mapSettings.colorLegend = legend;
    },
    addLegend(){
      this.countOfColorsWeNeed += 1;
      this.rebuildLegendItems(this.legendTemplates[this.selectedTemplate].items)
    },
    removeLegend(id){
      this.countOfColorsWeNeed -= 1;
      this.mapSettings.colorLegend = this.mapSettings.colorLegend.filter(item => item.id !== id)
    }
  },
  computed: {
    riverTileObj(){
      return this.riverTile = L.geoJSON(riverJson, {
        style: {
          "color": "#c02390",
          "weight": 1,
          "opacity": 1
        }
      })
    }
  },
  mounted() {
    this.properties = Object.keys(water_depthJson.features[0].properties)
    this.propertySelected = this.properties.includes("water_depth_annual") ? "water_depth_annual" : this.properties[0]

    this.map = L.map('maptiler').setView([48.505, 32.09], 6);

    this.maplibreGL = L.maplibreGL({
      attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      style: `https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9`
    }).addTo(this.map);

    this.buildDataLayer();

    this.rebuildLegendItems(this.legendTemplates[this.selectedTemplate].items)
    this.selectTemplate(this.legendTemplates[this.selectedTemplate].items)
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
    templateStep(){
      if (this.tile) this.tile.remove()
      this.buildDataLayer()
      this.selectTemplate(this.mapSettings.colorLegend)
    },
    countOfColorsWeNeed(){
      if (this.tile) this.tile.remove()
      this.buildDataLayer()
      this.selectTemplate(this.mapSettings.colorLegend)
    },
    mapSettings: {
      handler(){
        if (this.tile) this.tile.remove()
        this.buildDataLayer()
      },
      deep: true
    },
    propertySelected(){
      if (this.tile) this.tile.remove()
      this.buildDataLayer()
      this.rebuildLegendItems(this.legendTemplates[this.selectedTemplate].items)
      this.selectTemplate(this.mapSettings.colorLegend)
    }
  }
}
</script>

<style scoped>
#maptiler{
  height: 600px;
}
</style>