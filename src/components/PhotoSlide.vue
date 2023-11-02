<script setup>

import {defineImgList} from "@/store/defineImg";
const {imgSrcList, clickImg} = defineImgList()

</script>

<template>
  <div id="imgOutContainer">
    <div class="imgInnerContainer" v-for="(imgUrl, idx) in imgSrcList">
      <img :src="imgUrl" alt="" @click="clickImg(idx)"/>
    </div>
  </div>
</template>

<style scoped>

#imgOutContainer {
  display: flex;
  flex-direction: row;
  height: 400px;
  width: 1000px;
  align-items: center;
  justify-content: center;
  overflow: auto;
}
.imgInnerContainer {
  display: flex;
  height: 200px;
  width: 300px;
  padding: 10px;
}
</style>