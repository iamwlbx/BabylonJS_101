<template>
  <div>
    <h3>
      Babylon Examples
    </h3>
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BasicScene } from '@/Babylon Examples/BasicScene'
export default defineComponent({
  name: 'BabylonExamples',

  mounted() {
    const canvas = document.querySelector("canvas")!  //!让vue知道这不会是空的
    new BasicScene(canvas)  //if(canvas){ new BasicScene(canvas) }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 70%;
  height: 70%;
}
</style>
