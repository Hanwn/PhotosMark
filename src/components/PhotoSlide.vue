<script setup>

import {defineImgList} from "@/store/defineImg";
import {ref} from "vue";
const {imgSrcList, clickImg} = defineImgList()
const border = ref("#3AAACF solid 2px")

</script>

<template>
  <div id="imgOutContainer">
    <div class="imgInnerContainer" v-for="(imgUrl, idx) in imgSrcList">
      <img :src="imgUrl" alt="" @click="clickImg(idx)"  :style="{}"/>
    </div>
  </div>
</template>

<style scoped>

#imgOutContainer {
  display: flex;
  height: 400px;
  width: 1100px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: auto;
  border: black 1px solid;
}
.imgInnerContainer {
  display: flex;
  height: 200px;
  width: 300px;
  justify-content: center;
  margin: 10px;
}
</style>