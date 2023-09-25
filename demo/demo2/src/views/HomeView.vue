<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { getCourse } from "@/apis/course";

export default defineComponent({
  name: "HomeView",
  components: {
    HelloWorld,
  },
  async created() {
    const res = await getCourse({
      pageNum: 1,
      pageSize: 8,
    });
    console.log(res);
  },
});
</script>
