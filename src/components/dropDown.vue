<template>

  <div class="my-5">
    <h1 class="text-2xl font-medium">
      {{ title }}
      <button @click="open = !open" class="border rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1 mr-2 mb-3">
        {{ !!open ? "-" : "+" }}
      </button>
    </h1>

    <div v-if="open">
      <slot></slot>
    </div>

    <hr class="my-5">
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
    }
  },
  data () {
    return {
      open: this.openedByDefault
    }
  }
}
</script>

<style scoped>
</style>