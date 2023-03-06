<template>
  <div class="saving-templates">
    <div class="container mx-auto w-5/12">
      <h1 class="text-xl font-medium mb-5">Here you can save your settings</h1>

      <label class="block mb-2"><b>Title for saving</b></label>
      <input v-model="savingTitle" type="text" class="saving-title-input" placeholder="Title" required>
      <button class="save-btn"
              @click='saveTemplate'>
        Save
      </button>
    </div>

    <h2 class="text-center mt-5 mb-2"><b>Saved templates</b></h2>

    <div class="container mx-auto w-5/12 border rounded-md mb-20">

      <div class="saved">
        <div v-if="!saved.length" class="text-center p-4">
          No saved items yet
        </div>

        <div
            class="saved-item p-3 m-2 flex justify-between rounded-md"
            v-for="savedItem in saved" :key="savedItem.id"
            @click="selectSavedTemplate(savedItem)"
        >
          <div class="title block w-full">
            {{ savedItem.savingTitle }}
          </div>
          <button @click.stop="removeSaved(savedItem)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "savingTemplates",
  emits: [
    'update:countOfColorsWeNeed',
    'update:properties',
    'update:propertySelected',
    'update:colorLegend',
    'update:styles',
    'update:nullColor',
    'update:noMatchingLegend',
  ],
  data(){
    return {
      savingTitle: "",

      saved: []
    }
  },
  props: {
    id: {
      type: String
    },
    type: {
      type: String
    },

    countOfColorsWeNeed: {
      type: Number
    },
    properties: {
      type: Object
    },
    propertySelected: {
      type: String
    },
    colorLegend: {
      type: Object
    },
    styles: {
      type: Object,
      required: true
    },
    nullColor: {
      type: String,
    },
    noMatchingLegend: {
      type: String
    },
    minWidth: {
      type: Number
    },
    maxWidth: {
      type: Number
    }
  },
  methods: {
    selectSavedTemplate(savedItem){
      if (this.type === 'Polygon'){
        this.$emit("update:countOfColorsWeNeed", JSON.parse(JSON.stringify(savedItem.countOfColorsWeNeed)))
        this.$emit("update:colorLegend", JSON.parse(JSON.stringify(savedItem.colorLegend)))
        this.$emit("update:nullColor", JSON.parse(JSON.stringify(savedItem.nullColor)))
        this.$emit("update:noMatchingLegend", JSON.parse(JSON.stringify(savedItem.noMatchingLegend)))

      } else if (this.type === 'Line') {
        this.$emit("update:minWidth", JSON.parse(JSON.stringify(savedItem.minWidth)))
        this.$emit("update:maxWidth", JSON.parse(JSON.stringify(savedItem.maxWidth)))
      }
      this.$emit("update:properties", JSON.parse(JSON.stringify(savedItem.properties)))
      this.$emit("update:propertySelected", JSON.parse(JSON.stringify(savedItem.propertySelected)))
      this.$emit("update:styles", JSON.parse(JSON.stringify(savedItem.styles)))
    },
    removeSaved(savedItem){
      this.saved = this.saved.filter(item => item.id !== savedItem.id)
    },
    saveTemplate(){
      this.saved.push({
        id: Date.now(),
        savingTitle: this.savingTitle,
        countOfColorsWeNeed: this.countOfColorsWeNeed,
        properties: this.properties,
        propertySelected: this.propertySelected,
        colorLegend: this.colorLegend,
        styles: this.styles,
        nullColor: this.nullColor,
        noMatchingLegend: this.noMatchingLegend,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth,
      })
    }
  },
  watch: {
    saved: {
      handler(){
        localStorage.setItem(this.id, JSON.stringify(this.saved));
      },
      deep: true
    },
  },
  mounted(){
    const localSavedTemplates = localStorage.getItem(this.id);
    if (localSavedTemplates) {
      this.saved = JSON.parse(localSavedTemplates);
    }
  }
}
</script>

<style scoped>
.saved{
  overflow: scroll;
  max-height: 400px;
  @apply rounded-md;
}

.saved-item{
  cursor: pointer;
  text-decoration: underline;
  @apply border my-1;
}

.save-btn {
  @apply my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
  focus:ring-blue-300 font-medium rounded-lg text-sm
  px-5 py-2.5 mr-2 mb-2;
}

.saving-title-input {
  @apply bg-gray-50 border border-gray-300 text-gray-900
  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
  block w-full p-2.5;
}
</style>