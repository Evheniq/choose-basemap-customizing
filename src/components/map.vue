<template>
  <div id="maptiler"></div>
</template>

<script>
import {nextTick} from "vue";

export default {
  name: "map",

  props: {
    map: {
      type: Object,
      required: true
    },
    maplibreGL: {
      type: Object,
      required: true
    }
  },

  async mounted() {
    this.$emit("update:map", L.map('maptiler').setView([48.505, 32.09], 6));
    await nextTick()
    this.$emit("update:maplibreGL", L.maplibreGL({
      attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      style: `https://api.maptiler.com/maps/71fbd881-eacc-46eb-8209-7d87658dd5a4/style.json?key=BvrtwMrSBaJInDrAfqu9`
    }).addTo(this.map));
  },
}
</script>

<style scoped>
#maptiler{
  height: 600px;
}
</style>