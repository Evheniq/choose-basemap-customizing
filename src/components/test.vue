<template>
  <div id="maptiler"></div>
</template>

<script>
import riverJson from "../gjson/river.json";

export default {
  name: "maptiler",
  data() {
    return {

      map: undefined,
      tile: undefined,
      riverTile: undefined,
      mapLink: "https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9",
      maplibreGL: undefined,

      borderColor: "#4f4f4f",
      borderSize: 1,
      opacity: 0.6,
      fill: true,

      savingTitle: "",

      saved: []
    }
  },
  methods: {
    buildDataLayer(){
      this.riverTileObj.addTo(this.map);
    },
  },
  computed: {
    riverTileObj(){
      return this.riverTile = L.geoJSON(riverJson, {
        style: (t) => {
          return {
            color: this.borderColor,
            fill: this.fill,
            fillColor: "rgba(254,98,98,0.91)",
            fillOpacity: this.opacity,
            weight: this.borderSize,
          }
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
    }
  }
}

</script>

<style scoped>
#maptiler{
  height: 600px;
}
</style>