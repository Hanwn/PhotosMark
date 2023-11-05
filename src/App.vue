<script setup>
import PreviewCard from "@/components/PreviewCard.vue";
import PhotoSlide from "@/components/PhotoSlide.vue";
import ParameterArea from "@/components/ParameterArea.vue";
import Download from "@/components/Download.vue";
import {Headset} from "@element-plus/icons-vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
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
