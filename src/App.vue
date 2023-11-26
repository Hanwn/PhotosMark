<script setup>
import PreviewCard from "@/views/PreviewCard.vue";
import PhotoSlide from "@/views/PhotoSlide.vue";
import ParameterArea from "@/views/ParameterArea.vue";
import Download from "@/views/Download.vue";
import Header from "@/views/Header.vue";
import Footer from "@/views/Footer.vue";
import { useAppOnMountedHook } from "@/hooks/defineOnMountedHook";
import { onMounted } from "vue";

const { fetchSettings } = useAppOnMountedHook();

// load setting firstly
onMounted(() => {
  // appOnMountedHook();
  fetchSettings();
});
</script>

<template>
  <div class="container">
    <Header></Header>
    <preview-card></preview-card>
    <parameter-area></parameter-area>
    <PhotoSlide></PhotoSlide>
    <download></download>
    <Footer></Footer>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
