<template>
  <section  class="range-slider">
    <input type="range" :min="minValue" :max="maxValue" :step="step"
           v-model="selectedRange[0]" class="range-slider"/>

    <input type="range" :min="minValue" :max="maxValue" :step="step"
           v-model="selectedRange[1]" class="range-slider" />

  </section>
</template>

<script>
export default {
  data() {
    return {
      minValue: 0,
      maxValue: 100,
      step: 1,
      selectedRange: [25, 75],
    };
  },
};
</script>

<style scoped>
section.range-slider {
  position: relative;
  width: 200px;
  height: 35px;
  text-align: center;
}

section.range-slider input {
  pointer-events: none;
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 15px;
  width: 200px;
  outline: none;
  height: 18px;
  margin: 0;
  padding: 0;
}

section.range-slider input::-webkit-slider-thumb {
  pointer-events: all;
  position: relative;
  z-index: 1;
  outline: 0;
}

section.range-slider input::-moz-range-thumb {
  pointer-events: all;
  position: relative;
  z-index: 10;
  -moz-appearance: none;
  width: 9px;
}

section.range-slider input::-moz-range-track {
  position: relative;
  z-index: -1;
  background-color: rgba(0, 0, 0, 1);
  border: 0;
}
section.range-slider input:last-of-type::-moz-range-track {
  -moz-appearance: none;
  background: none transparent;
  border: 0;
}
section.range-slider input[type=range]::-moz-focus-outer {
  border: 0;
}

/* Добавляем псевдоэлемент для линии */
section.range-slider::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 3px;
  background-color: blue;
}


</style>
