<template>
  <BabylonExamples />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BabylonExamples from "./components/BabylonExamples.vue";

export default defineComponent({
  name: "App",
  components: {
    BabylonExamples,
  },
});
</script>

<style>
#app {
  text-align: center;

  margin-top: 60px;
}
</style>
