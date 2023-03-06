<template>
  <label class="block text-gray-900 mt-5">
    <b>Stroke pattern</b>
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash#some_common_patterns"
      title="[] = ________________________
1, 1 = .........................................
10, 10 = _ _ _ _ _ _ _ _ _ _ _ _
20, 5 = __ __ __ __ __ __ __ __
15, 3, 3, 3 = _._._._._._._._._._._
20, 3, 3, 3, 3, 3, 3, 3 = _..._..._
12, 3, 3 = _. ._. ._. ._. ._. ._. ._."
    >
      [?]
    </a>
  </label>
  <input
    type="text"
    :value="value"
    @change="$emit('update:value', $event.target.value)"
    class="mb-5 w-16 bg-gray-100 mx-3 py-0.5 px-2 rounded"
  />
</template>

<script>
export default {
  name: 'stroke-pattern',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
}
</script>
