<template>

  <div id="maptiler"></div>

  <ul class="container my-5 mx-auto flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
    <li v-for="map in mapForChoice" class="mr-2">
      <a href="#"
         class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50"
         @click="changeMap(map)"
      >{{ map.name }}</a>
    </li>
  </ul>

  <div class="container mx-auto">
    <div class="mx-auto text-center">
      <div class="picker-color">
        <b>Gradient for segments:</b>
        <br>
        {{ gradientColor }}
        <br>
        <color-picker
            :disable-history="true"
            :is-widget="false"
            picker-type="chrome"
            useType="gradient"
            v-model:gradientColor="gradientColor"
        />
      </div>
      <div class="border-map my-3">
        <label for="default-range" class="block text-gray-900">
          <b>Border color</b>
          <br>
          {{borderColor}}
        </label>

        <color-picker
            :disable-history="true"
            :is-widget="false"
            picker-type="chrome"
            v-model:pure-color="this.borderColor"
        />

        <label for="default-range" class="block text-gray-900">
          <b>Border size </b> ({{borderSize}})
        </label>
        <input id="default-range"
               type="range"
               min="0" max="5"
               step="1"
               v-model="borderSize"
               class="w-44 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
      </div>

      <div class="opacity-map my-3">
        <label for="default-range" class="block text-gray-900">
          <b>Opacity</b> ({{opacity*100}}%)
        </label>
        <input id="default-range"
               type="range"
               min="0" max="1"
               step="0.1"
               v-model="opacity"
               class="w-44 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
      </div>
      <div class="opacity-map my-3">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer" v-model="fill">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span class="ml-3"><b>Fill</b></span>
        </label>
      </div>
    </div>
  </div>

  <div class="container mx-auto w-5/12">
    <label for="first_name" class="block mb-2 mt-24"><b>Title for saving</b></label>
    <input v-model="savingTitle" type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Title" required>
    <button class="my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            @click='() => saved.push({
              id: Date.now(),
              title: savingTitle,
              borderColor: borderColor,
              borderSize: borderSize,
              opacity: opacity,
              fill: fill,
              mapLink: mapLink,
              gradientColor: gradientColor,
            })'
    >
      Save
    </button>
  </div>

  <h2 class="text-center mt-5 mb-2"><b>Saved templates</b></h2>

  <div class="container mx-auto w-5/12 border rounded-md  mb-20">

    <div class="saved rounded-md">
      <div v-if="!saved.length" class="text-center p-4">
        No saved items yet
      </div>

      <div
          class="saved-item p-3 m-2 flex justify-between rounded-md"
          v-for="savedItem in saved" :key="savedItem.id"
          @click="selectSavedTemplate(savedItem)"
      >
        <div class="title block w-full">
          {{ savedItem.title }}
        </div>
        <button @click.stop="removeSaved(savedItem)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import data from "../gjson/test.json";
import data from "../gjson/second.json";
import {ColorPicker} from "vue3-colorpicker";
import {betweenColors} from "../helpers/betweenTwoColors";
import "vue3-colorpicker/style.css";

export default {
  name: "maptiler",
  components: { ColorPicker },
  data() {
    return {
      mapForChoice: [
        {
          name: "Variant #1",
          link: "https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9"
        },
        {
          name: "Variant #2",
          link: "https://api.maptiler.com/maps/c9cffbf9-6870-4463-b6e0-8dc21c9c7d87/style.json?key=BvrtwMrSBaJInDrAfqu9"
        },
        {
          name: "Variant #3",
          link: "https://api.maptiler.com/maps/1ffed11c-6e41-44b7-b0d2-ac03f35bc1df/style.json?key=BvrtwMrSBaJInDrAfqu9"
        },
        {
          name: "Streets v2 Dark",
          link: "https://api.maptiler.com/maps/f1c8294a-8809-43a1-824b-d82bf0e02190/style.json?key=BvrtwMrSBaJInDrAfqu9"
        },
        {
          name: "Latest Outdoor",
          link: "https://api.maptiler.com/maps/2d14166d-bce5-4afc-a9af-0c623e02935d/style.json?key=BvrtwMrSBaJInDrAfqu9"
        },
        {
          name: "Latest Outdoor dark",
          link: "https://api.maptiler.com/maps/c95c2ec8-e504-4e56-9b2e-5f1fa3062b40/style.json?key=zy6r4urHUmPNSCyc5Cij"
        },
      ],

      map: undefined,
      gradientColor: "linear-gradient(90deg, rgba(31, 135, 232, 1) 0%, rgba(3, 30, 58, 1) 100%)",
      tile: undefined,
      mapLink: "https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9",
      maplibreGL: undefined,

      borderColor: "#4f4f4f",
      borderSize: 1,
      opacity: 0.6,
      fill: true,

      savingTitle: "",

      saved: [
        // {
        //   id: 123,
        //   title: "test1",
        //   borderColor: "#4f4f4f",
        //   borderSize: 1,
        //   opacity: 0.1,
        //   fill: true,
        //   mapLink: "https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9",
        //   gradientColor: "linear-gradient(90deg, rgba(31, 135, 232, 1) 0%, rgba(32, 151, 243, 1) 100%)",
        // },
        // {
        //   id: 121,
        //   title: "test1",
        //   borderColor: "#4f4f4f",
        //   borderSize: 1,
        //   opacity: 0.1,
        //   fill: true,
        //   mapLink: "https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9",
        //   gradientColor: "linear-gradient(90deg, rgba(31, 135, 232, 1) 0%, rgba(32, 151, 243, 1) 100%)",
        // }
      ]
    }
  },
  methods: {
    buildDataLayer(){
      this.tileObj.addTo(this.map);
    },
    changeMap(map){
      this.mapLink = map.link
    },
    selectSavedTemplate(savedItem){
      this.borderColor = savedItem.borderColor
      this.borderSize = savedItem.borderSize
      this.opacity = savedItem.opacity
      this.fill = savedItem.fill
      this.mapLink = savedItem.mapLink
      this.gradientColor = savedItem.gradientColor
    },
    removeSaved(savedItem){
      this.saved = this.saved.filter(item => item.id !== savedItem.id)
    }
  },
  computed: {
    tileObj(){
      return this.tile = L.geoJSON(data, {
        style: (feature) => {
          let colorSegm = "";

          if (!feature.properties.water_depth_annual){
            colorSegm = "rgba(254,98,98,0.91)"
          } else {
            colorSegm = betweenColors(
                this.gradientColor,
                feature.properties.water_depth_annual,
                23, 300
            );
          }

          return {
            color: this.borderColor,
            fill: this.fill,
            fillColor: colorSegm,
            fillOpacity: this.opacity,
            weight: this.borderSize,
          };
        }
      })
    }
  },
  mounted() {
    this.map = L.map('maptiler').setView([48.505, 32.09], 6);

    this.maplibreGL = L.maplibreGL({
      attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      style: `https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9`
    }).addTo(this.map);

    this.buildDataLayer();

    const localSavedTemplates = localStorage.getItem("savedTemplates");
    if (localSavedTemplates) {
      this.saved = JSON.parse(localSavedTemplates);
      debugger
    }
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
    gradientColor(val){
      if (this.tile) this.tile.remove()
      this.buildDataLayer()
    },
    borderSize(val){
      if (this.tile) this.tile.remove()
      this.buildDataLayer()
    },
    opacity(val){
      if (this.tile) this.tile.remove()
      this.buildDataLayer()
    },
    fill(val){
      if (this.tile) this.tile.remove()
      this.buildDataLayer()
    },
    borderColor(val){
      if (this.tile) this.tile.remove()
      this.buildDataLayer()
    },
    pureColor(val){
      console.log("pureColor", val)
    },
    saved: {
      handler(){
        localStorage.setItem("savedTemplates", JSON.stringify(this.saved));
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#maptiler{
  height: 600px;
}

.saved{
  overflow: scroll;
  max-height: 300px;
}

.saved-item{
  cursor: pointer;
  text-decoration: underline;
  @apply border my-1;
}
</style>