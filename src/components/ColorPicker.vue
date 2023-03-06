<template>
  <color-picker
    :disable-history="disableHistory"
    :is-widget="isWidget"
    v-model:pure-color="pureColor"
  />
</template>

<script>
import { ColorPicker } from 'vue3-colorpicker'

export default {
  components: { ColorPicker },

  props: {
    pureColor: {
      type: String,
    },
    disableHistory: {
      type: Boolean,
      default: false,
    },
    isWidget: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
