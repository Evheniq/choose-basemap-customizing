<template>
  <drop-down :showSetting="true" opened-by-default :title="titleTile + 'Layer'" class="border p-3 border-gray-400">

    <drop-down title="Code of template" :opened-by-default="false">
      <pre class="text-left">{{ JSON.stringify(mapSettings, null, "\t") }}</pre>
    </drop-down>

    <drop-down title="Legend settings" :opened-by-default="true">

      <div>
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
          <div v-for="legendItem of colorLegend" class="my-2">

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
          <b>Opacity</b> ({{ mapSettings.styles.fillOpacity*100 }}%)
        </label>
        <input id="default-range"
               type="range"
               min="0" max="1"
               step="0.1"
               v-model="mapSettings.styles.fillOpacity"
               class="w-44 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
      </div>
      <div class="my-5">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer" v-model="mapSettings.styles.fill">
          <span class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></span>
          <span class="ml-3"><b>Зробити заливку сегментів?</b></span>
        </label>
      </div>
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

    <water-depth :map="map" :color-legend="colorLegend" :styles="{
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
      legendTemplates: templatesItems,
      selectedTemplate: 1,
      templateStep: 20,
      countOfColorsWeNeed: 5,
      update: false,

      properties: [],
      propertySelected: "",

      colorLegend: [],

      mapSettings: {
        colorSegmentRegime: "Templates",
        nullColor: "#eb6f27",
        noMatchingLegend: "#ca0505",
        styles: {
          color: "#4f4f4f",
          weight: 1,
          fillOpacity: 0.5,
          fill: true,
          dashArray: [3,3],
        },
      },

      tile: undefined,
    }
  },
  methods: {
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
          min: this.colorLegend[index].min,
          max: this.colorLegend[index].max,
          color: item.color,
          id: item.id
        })
      })

      legend[legend.length-1].max = 999999999;
      this.colorLegend = legend;
    },
    rebuildLegendItems(template){
      let min = this.dataJson.features.reduce((min, item) => item.properties[this.propertySelected] > min ? min : item.properties[this.propertySelected], 999999);
      let max = this.dataJson.features.reduce((max, item) => item.properties[this.propertySelected] < max ? max : item.properties[this.propertySelected], 0);
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
      this.colorLegend = legend;
    },
    addLegend(){
      this.countOfColorsWeNeed += 1;
      this.rebuildLegendItems(this.legendTemplates[this.selectedTemplate].items)
    },
    removeLegend(id){
      this.countOfColorsWeNeed -= 1;
      this.colorLegend = this.colorLegend.filter(item => item.id !== id)
    }
  },
  mounted() {
    this.properties = Object.keys(this.dataJson.features[0].properties)
    this.propertySelected = this.properties.includes("water_depth_annual") ? "water_depth_annual" : this.properties[0]

    this.rebuildLegendItems(this.legendTemplates[this.selectedTemplate].items)
    this.selectTemplate(this.legendTemplates[this.selectedTemplate].items)
  },
  watch: {
    templateStep(){
      if (this.tile) this.tile.remove()
      this.selectTemplate(this.colorLegend)
    },
    countOfColorsWeNeed(){
      if (this.tile) this.tile.remove()
      this.selectTemplate(this.colorLegend)
    },
    colorLegend: {
      async handler(){
        this.update = true
        await nextTick()
        this.update = false
      },
      deep: true
    },
    propertySelected(){
      if (this.tile) this.tile.remove()
      this.rebuildLegendItems(this.legendTemplates[this.selectedTemplate].items)
      this.selectTemplate(this.colorLegend)
    }
  },
}
</script>

<style scoped>

</style>