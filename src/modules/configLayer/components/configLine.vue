<template>
  <data-layer
    :map="map"
    :dataJson="dataJson"

    :property-selected="propertySelected"
    :options="optionsStrict"

    :styles="{ ...styles }"
  />

  <drop-down
    :showSetting="true"
    :opened-by-default="false"
    :title="titleTile + 'Layer'"
    class="border p-3 border-gray-400"
  >
    <drop-down title="Code of template" :opened-by-default="false">
      <pre class="text-left">
styles: {{ JSON.stringify(styles, null, '\t') }}
      </pre>

      <pre class="text-left">
propertySelected: {{ JSON.stringify(propertySelected, null, '\t') }}
      </pre>
    </drop-down>

    <drop-down title="Border settings" opened-by-default>
      <div class="text-center font-bold">Select property</div>

      <select
        v-model="propertySelected"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-0.5 mx-auto"
      >
        <option v-for="property in properties">{{ property }}</option>
      </select>

      <label for="default-range" class="block text-gray-900 mt-5">
        <b>Border color</b>
        <br />
        {{ styles.color }}
      </label>

      <color-picker
        :disable-history="true"
        :is-widget="false"
        picker-type="chrome"
        v-model:pure-color="styles.color"
      />

      <label class="block text-gray-900 mt-5">
        <b>Border size </b>
      </label>

      Min:
      <input
        v-model="styles.weight"
        class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
      />

      Max:
      <input
        v-model="maxWidth"
        class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
      />

      <stroke-pattern v-model:value="styles.dashArray" />
    </drop-down>

    <drop-down title="Save">
      <saving-templates
        type="Line"
        :id="titleTile"
        v-model:properties="properties"
        v-model:propertySelected="propertySelected"
        v-model:styles="styles"
        v-model:minWidth="minWidth"
        v-model:maxWidth="maxWidth"
      />
    </drop-down>
  </drop-down>
</template>

<script>
import dataLayer from '../../../components/dataLayer.vue'
import DropDown from '../../../components/dropDown.vue'
import { ColorPicker } from 'vue3-colorpicker'
import { legendWidthController } from '../../../helpers/legendWidthController.js'
import StrokePattern from './basic/StrokePattern.vue'
import SavingTemplates from '../../savingTemplates/components/savingTemplates.vue'

export default {
  components: {
    SavingTemplates,
    StrokePattern,
    ColorPicker,
    DropDown,
    dataLayer,
  },
  props: {
    dataJson: {
      type: Object,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
    titleTile: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      properties: [],
      propertySelected: '',

      styles: {
        color: '#2e57cb',
        dashArray: '',
        weight: 2
      },

      minWidth: 0,
      maxWidth: 3,

      tile: undefined,
    }
  },
  mounted() {
    this.properties = Object.keys(this.dataJson.features[0].properties)
    this.propertySelected = this.properties.includes('water_depth_annual')
      ? 'water_depth_annual'
      : this.properties[0]
  },
  computed: {
    maxFeatureVal() {
      return this.dataJson.features.reduce(
        (max, val) =>
          val.properties[this.propertySelected] > max
            ? val.properties[this.propertySelected]
            : max,
        0
      )
    },
    minFeatureVal() {
      return this.dataJson.features.reduce((min, val) => {
        return min < val.properties[this.propertySelected]
          ? min
          : val.properties[this.propertySelected]
      }, 999999999)
    },
    options() {
      return {
        style: (feature) => {
          let lineWeight
          const featureValue = feature.properties[this.propertySelected]

          if (featureValue == null) {
            lineWeight = 1
          } else {
            lineWeight = legendWidthController(
              featureValue,
              this.minFeatureVal,
              this.maxFeatureVal,
              this.minWidth,
              this.maxWidth
            )
          }

          return {
            ...this.styles,
            weight: lineWeight,
          }
        },
      }
    },
    optionsStrict() {
      return {
        style: (feature) => {
          let lineWeight

          return {
            ...this.styles,
          }
        },
      }
    },
  },
}
</script>

<style scoped></style>
