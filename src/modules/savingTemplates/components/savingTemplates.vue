<template>
  <div class="saving-templates">
    <div class="container mx-auto w-5/12 mt-24">
      <h1 class="text-2xl font-medium mb-5">Here you can save your settings</h1>

      <label for="first_name" class="block mb-2"><b>Title for saving</b></label>
      <input v-model="savingTitle" type="text" id="first_name" class="saving-title-input" placeholder="Title" required>
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
  emits: ['update:mapSettings', "update:mapLink"],
  data(){
    return {
      savingTitle: "",

      saved: []
    }
  },
  props: {
    mapSettings: {
      type: Object,
      required: true
    },
    mapLink: {
      type: String,
      required: true
    },
  },
  methods: {
    selectSavedTemplate(savedItem){
      this.$emit("update:mapSettings", JSON.parse(JSON.stringify(savedItem.data)))
      this.$emit("update:mapLink", JSON.parse(JSON.stringify(savedItem.mapLink)))
    },
    removeSaved(savedItem){
      this.saved = this.saved.filter(item => item.id !== savedItem.id)
    },
    saveTemplate(){
      this.saved.push({
        id: Date.now(),
        data: this.mapSettings,
        mapLink: this.mapLink,
        savingTitle: this.savingTitle
      })
    }
  },
  watch: {
    saved: {
      handler(){
        localStorage.setItem("savedTemplates", JSON.stringify(this.saved));
      },
      deep: true
    },
  },
  mounted(){
    const localSavedTemplates = localStorage.getItem("savedTemplates");
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