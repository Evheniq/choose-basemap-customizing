<template>

  <div class="my-5 border pt-5 pb-3 px-7">
    <h1 class="text-2xl font-medium">
      {{ title }}
      <button @click="open = !open" class="border rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1 mr-2 mb-3">
        {{ !!open ? "-" : "+" }}
      </button>
    </h1>

    <div v-if="showSetting">
      <div v-show="open">
        <slot></slot>
      </div>
    </div>
    <div v-else>
      <div v-if="open">
        <slot></slot>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "dropDown",
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String
    },
    openedByDefault: {
      type: Boolean,
      default: false
    },
    showSetting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      open: this.openedByDefault
    }
  }
}
</script>