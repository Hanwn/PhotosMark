<script setup>
import Banner from "@/components/Banner.vue";
import Content from "@/components/Content.vue";
</script>

<template>
  <div class="container">
    <Content></Content>
    <Banner></Banner>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}
</style>
