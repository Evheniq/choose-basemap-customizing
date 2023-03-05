<template>
  <water-depth bringToBack
               :map="map"
               :color-legend="[...colorLegend]"
               :styles="{...styles}"
               :dataJson="dataJson"
               :property-selected="propertySelected" :options="options"/>

  <drop-down :showSetting="true" opened-by-default :title="titleTile + 'Layer'" class="border p-3 border-gray-400">

    <drop-down title="Code of template" :opened-by-default="false">
      <pre class="text-left">mapSettings: {{ JSON.stringify(mapSettings, null, "\t") }}</pre>
      <pre class="text-left">propertySelected: {{ JSON.stringify(propertySelected, null, "\t") }}</pre>
      <pre class="text-left">legendTemplate: {{ JSON.stringify(legendTemplates[selectedTemplate], null, "\t") }}</pre>
      <pre class="text-left">legendTemplate: {{ JSON.stringify(styles, null, "\t") }}</pre>
      <pre class="text-left">legendTemplate: {{ JSON.stringify(styles, null, "\t") }}</pre>
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

          <select v-model="propertySelected"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                  focus:border-blue-500 block p-0.5 mx-auto">
            <option v-for="property in properties">{{ property }}</option>
          </select>

          <div class="text-center mt-8 font-bold mb-5">
            Templates
          </div>
          <div>
<!--            <div class="mb-5">-->
<!--              <span class="mb-2 ">Number of data classes:</span>-->
<!--              <select v-model="countOfColorsWeNeed"-->
<!--                      class="bg-gray-50 border border-gray-300-->
<!--                             text-gray-900 text-sm rounded-lg-->
<!--                             focus:ring-blue-500 focus:border-blue-500 block p-0.5 mx-auto">-->
<!--                &lt;!&ndash;Supplement an id here instead of using 'name'&ndash;&gt;-->
<!--                <option v-for="number in 9">{{ number }}</option>-->
<!--              </select>-->
<!--            </div>-->

          </div>
          <div class="flex justify-center mb-8">

            <div class="block p-2 box-border cursor-pointer mx-1"
                 @click="this.selectTemplate(template.items, template.id)"
                 style="width: 40px;"
                 v-for="template in legendTemplates"
                 :key="template.id" :class="{'border-2 border-rose-400': selectedTemplate === template.id}">
              <div v-for="rectangle in sliceColorsTemplates(template.items, countOfColorsWeNeed)"
                   :key="rectangle.id"
                   :style="{background: rectangle.color}"
                   style="height: 20px; width: 20px; margin-bottom: 1px; border: 1px solid #8d97a3;"></div>
            </div>
          </div>
        </div>

        <b>Legend: </b>
        <div class="legend-block">
          <div v-for="legendItem of colorLegend" class="legend-item">
            <color-picker
                :disable-history="true"
                :is-widget="false"
                v-model:pure-color="legendItem.color"
                @pureColorChange="this.recolorLegendItems(this.colorLegend)"
            />
            Min:
            <input class="w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded" type="text" v-model="legendItem.min">
            Max:
            <input class="w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded" type="text" v-model="legendItem.max">

            <span class="button-group-cst">
              <button @click="insertNewLegendItem(legendItem.id)">+</button>
              <button class="text-red-600" @click="removeLegend(legendItem.id)">x</button>
            </span>

          </div>
        </div>

        <button
            class="addLegendBtn"
            @click="legendRebuildMode(this.legendTemplates[this.selectedTemplate].items)"
        >
          Recalculate legend
        </button>
        <button
            class="addLegendBtn"
            @click="recolorLegendItems(this.legendTemplates[this.selectedTemplate].items)"
        >
          Recolor legend
        </button>
        <br>
        <button
            class="addLegendBtn"
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
          <b>Opacity</b> ({{ styles.fillOpacity*100 }}%)
        </label>
        <input id="default-range"
               type="range"
               min="0" max="1"
               step="0.1"
               v-model="styles.fillOpacity"
               class="w-44 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
      </div>
      <div class="my-5">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer" v-model="styles.fill">
          <span class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></span>
          <span class="ml-3"><b>Зробити заливку сегментів?</b></span>
        </label>
      </div>
    </drop-down>

    <drop-down title="Border settings">
      <label for="default-range" class="block text-gray-900">
        <b>Border color</b>
        <br>
        {{styles.color}}
      </label>

      <color-picker
          :disable-history="true"
          :is-widget="false"
          picker-type="chrome"
          v-model:pure-color="styles.color"
      />

      <label for="default-range" class="block text-gray-900 mt-5">
        <b>Border size </b> ({{ styles.weight }})
      </label>
      <input id="default-range"
             type="range"
             min="0" max="5"
             step="1"
             v-model="styles.weight"
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
             v-model="styles.dashArray"
             class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
      >
    </drop-down>

  </drop-down>
</template>

<script>
import WaterDepth from "../../../components/waterDepth.vue";
import templatesItems from "../../../helpers/templates.js";
import {sliceColorsTemplates} from "../../../helpers/sliceColorsTemplates.js";
import DropDown from "../../../components/dropDown.vue";
import {legendColorController } from "../../../helpers/legendColorController.js";
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
      legendTemplates: templatesItems,
      selectedTemplate: 0,
      templateStep: 20,
      countOfColorsWeNeed: 5,

      properties: [],
      propertySelected: "",

      colorLegend: [],

      styles: {
        color: "#4f4f4f",
        weight: 1,
        fillOpacity: 0.5,
        fill: true,
        dashArray: [3,3],
      },

      mapSettings: {
        colorSegmentRegime: "Templates",
        nullColor: "#eb6f27",
        noMatchingLegend: "#ca0505",
      },

      options: {
        style: (feature) => {
          let colorSegm = "";
          if(this.colorLegend){
            if (feature.properties[this.propertySelected] == null){
              colorSegm = this.mapSettings.nullColor
            }
            else {
              colorSegm = legendColorController(feature.properties[this.propertySelected], this.colorLegend)
            }

            if (!colorSegm) {
              colorSegm = this.mapSettings.noMatchingLegend;
            }
          }

          return {
            ...this.styles,
            fillColor: colorSegm,
          };
        }
      },

      tile: undefined,
    }
  },
  methods: {
    sliceColorsTemplates,
    insertNewLegendItem(id){
      const index = this.colorLegend.findIndex(element => element.id === id);
      const emptyItem = {
        id: Date.now(),
        color: '#f05f00',
        min: 0,
        max: 0
      }

      if (index === -1) {
        return [...this.colorLegend, emptyItem]; // ID not found, append the item to the end of the array
      }

      this.colorLegend = [...this.colorLegend.slice(0, index+1), emptyItem, ...this.colorLegend.slice(index)];
      this.countOfColorsWeNeed += 1;
      this.recolorLegendItems(this.colorLegend)
    },
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
    frequencyObject(array) {
      console.log(array)
      return array.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
    },
    mode(array) {
      const frequency = this.frequencyObject(array)
      const res = Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
      return res;
    },
    legendRebuildMode(template){
      const min = this.dataJson.features
          .reduce((min, item) => item.properties[this.propertySelected] > min ? min : item.properties[this.propertySelected], 999999);
      const max = this.dataJson.features
          .reduce((max, item) => item.properties[this.propertySelected] < max ? max : item.properties[this.propertySelected], 0);

      const arr = [];

      this.dataJson.features
          .forEach((item) => arr.push(item.properties[this.propertySelected]));

      const step = Math.round((max / this.countOfColorsWeNeed-2 - this.mode(arr)) / this.countOfColorsWeNeed)

      let legend = [];

      let localMin = min;
      let localMax = min + step;

      sliceColorsTemplates(template, this.countOfColorsWeNeed).forEach((item) => {
        console.log(item.color)
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
    legendRebuildAvg(template){
      const min = this.dataJson.features
          .reduce((min, item) => item.properties[this.propertySelected] > min ? min : item.properties[this.propertySelected], 999999);
      const max = this.dataJson.features
          .reduce((max, item) => item.properties[this.propertySelected] < max ? max : item.properties[this.propertySelected], 0);
      const step = Math.round((max - min) / this.countOfColorsWeNeed)

      let legend = [];

      let localMin = min;
      let localMax = min + step;

      sliceColorsTemplates(template, this.countOfColorsWeNeed).forEach((item) => {
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
    rebuildLegendItems(template){
      // this.legendRebuildAvg(template)
      this.legendRebuildMode(template)
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
}
</script>

<style lang="scss" scoped>
.addLegendBtn{
  @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-1;
}

.legend-block{
  @apply mt-5;

  .legend-item{
    @apply my-2;

    .button-group-cst{

      button:first-child {
        @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm
        px-2 py-0.5 mr-2 mb-2 mt-1;
      }
      button:last-child {
        @apply text-sm focus:ring-4 focus:ring-blue-300 font-medium ring-1 ring-red-200 rounded-lg text-sm px-2 py-0.5;
      }
    }
  }
}


</style>