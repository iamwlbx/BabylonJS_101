<!-- <template>
  <div>
    <h3>Babylon Examples</h3>
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import { BasicScene } from '@/BabylonExamples/BasicScene'
import { StandardMaterials } from "@/BabylonExamples/StandardMaterials";

export default defineComponent({
  name: "BabylonExamples",

  mounted() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement; //!让vue知道这不会是空的
    new StandardMaterials(canvas); //if(canvas){ new BasicScene(canvas) }
  },
});
</script>

 Add "scoped" attribute to limit CSS to this component only 
<style scoped>
canvas {
  width: 70%;
  height: 70%;
}
</style> -->

<template>
  <main>
    <!-- <div id="loader">
      <p>Loading</p>

      <div id="loadingContainer">
        <div id="loadingBar"></div>
      </div>

      <p id="percentLoaded">25%</p>
    </div> -->
    <LoadingScreen :isLoaded="loaded" />
    <p>Custom Loading Screen</p>
    <canvas></canvas>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CustomLoading } from "@/BabylonExamples/CustomLoading";
import LoadingScreen from "./LoadingScreen.vue";
export default defineComponent({
  name: "BabylonExamples",

  data() {
    return {
      loaded: false,
    };
  },
  components: { LoadingScreen },
  mounted() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement; // !让vue知道这不会是空的
    const stage = new CustomLoading(canvas, this.setLoaded); // if(canvas){ new BasicScene(canvas) }
    // const loader = document.getElementById("loader") as HTMLElement;
    // const loadingBar = document.getElementById("loadingBar") as HTMLElement;
    // const percentLoaded = document.getElementById("percentLoaded") as HTMLElement;
    // const stage = new CustomLoading(canvas, loader, loadingBar, percentLoaded);
    window.addEventListener("resize", () => {
      if (stage) {
        stage.resize();
      }
    });
  },
  methods: {
    setLoaded() {
      this.loaded = true;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed&family=Roboto:wght@100;700&display=swap");

main {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

#loader {
  width: 100%;
  height: 100%;
  background: slategrey;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#loaded {
  width: 100%;
  height: 100%;
  background: slategrey;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 1s ease;
}

#loadingContainer {
  width: 30%;
  height: 2rem;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 6px;
  margin: 0.5rem;
}

#loadingBar {
  height: 100%;
  background: green;
  border-radius: 6px;
}

p {
  color: white;
  background: none;
  margin-bottom: 1rem;
  font-family: "Roboto Condensed";
  font-weight: 400;
  font-size: 2rem;
}

canvas {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  box-shadow: 8px 8px 10px -6px #000000;
}
</style>

