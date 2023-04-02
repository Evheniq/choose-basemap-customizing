<template>
  <data-layer
    :map="map"
    :dataJson="dataJson"

    :property-selected="propertySelected"
    :icon="icon"

    :styles="{}"
  />

  <drop-down
    :showSetting="true"
    opened-by-default
    :title="titleTile + 'Layer'"
    class="border p-3 border-gray-400"
  >
    <drop-down title="Code of template" :opened-by-default="false">
      <pre class="text-left">
propertySelected: {{ JSON.stringify(propertySelected, null, '\t') }}</pre>
      <pre class="text-left">
selectedIcon: {{ JSON.stringify(selectedIcon, null, '\t') }}</pre>
    </drop-down>

    Size:
    <input
      class="w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
      type="text"
      v-model="size"
    />


    <div class='select-marker'>
      <span v-for='icon in iconsForSelect'>
        <button @click='selectMarker(icon)' :class="{ 'active': selectedIcon === icon }">
          <img :src='icon' :alt='icon'>
        </button>
      </span>
    </div>

    <drop-down title="Save">
      <saving-templates
        type="Point"
        :id="titleTile"
        v-model:properties="properties"
        v-model:propertySelected="propertySelected"
        v-model:selectedIcon="selectedIcon"
        v-model:size="size"
      />
    </drop-down>
  </drop-down>
</template>

<script>
import DataLayer from '../../../components/dataLayer.vue'
import DropDown from '../../../components/dropDown.vue'
import { ColorPicker } from 'vue3-colorpicker'
import StrokePattern from './basic/StrokePattern.vue'
import SavingTemplates from '../../savingTemplates/components/savingTemplates.vue'

export default {
  components: {
    SavingTemplates,
    StrokePattern,
    ColorPicker,
    DropDown,
    DataLayer,
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
      selectedIcon: '',
      size: '18',

      iconsForSelect: [
        'marker_1.png',
        'marker_2.png',
      ],

      icon: {},
      properties: [],
      propertySelected: '',
    }
  },
  methods: {
    selectMarker(markerName) {
      console.log(markerName)
      this.selectedIcon = markerName
    }
  },
  computed: {

  },
  watch: {
    selectedIcon(){
      this.icon = L.icon({
        iconUrl: this.selectedIcon,
        iconSize: [this.size, this.size]
      })
    },
    size(){
      this.icon = L.icon({
        iconUrl: this.selectedIcon,
        iconSize: [this.size, this.size]
      })
    }
  },
  beforeMount() {
    this.selectedIcon = this.iconsForSelect[0]
  },
  mounted() {
    this.properties = Object.keys(this.dataJson.features[0].properties)
    this.propertySelected = this.properties.includes('water_depth_annual')
      ? 'water_depth_annual'
      : this.properties[0]

  },
}
</script>

<style lang="scss" scoped>
.select-marker {
  button {
    width: 60px;
    height: 60px;
    padding: 5px;
    margin: 7px;
    border-radius: 7px;
    border: 1px solid #eeeeee;
    background-color: #fbfbfb;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);

    &.active {
      border: 1px solid #bebebe;
      background-color: #f0f0f0;
      box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
