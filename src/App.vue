<script setup>
import PreviewCard from "@/components/PreviewCard.vue";
import PhotoSlide from "@/components/PhotoSlide.vue";
import ParameterArea from "@/components/ParameterArea.vue";
import Download from "@/components/Download.vue";
</script>

<template>
  <div class="container">
    <preview-card></preview-card>
    <parameter-area></parameter-area>
    <PhotoSlide></PhotoSlide>
    <download></download>
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
