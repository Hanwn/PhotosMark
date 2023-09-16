<template>
  <div>
    <div class="photoContainer container">
      <img :src="src">
    </div>


    <div class="markContainer container" :style="{width: photoWidth,background:highlightColor, height: highlightHeight}">
      <div class="container leftParameter">
        <div class="container camera"> {{deviceInfo}}</div>
        <div class="container time">{{createTime}}</div>
      </div>
      <div class="container rightContainer">
        <div class="container icon"><img src="./icons/nikon.png" style="width: 50%"></div>
        <div class="container parameterContainer">
          <div class="container parameter">{{parameters}}</div>
          <div class="container parameter" id="gps">{{gpsInfo}}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="numberContainer container">

  </div>

  <div class="bannerContainer container">

  </div>

</template>

<script setup>

import {computed, h, ref} from "vue";

  const src = ref("https://cdn.pixabay.com/photo/2023/09/03/11/13/mountains-8230502_1280.jpg")
  const photoWidth = ref("")
  const highlightColor = ref('green')
  const highlightHeight = ref("80px")
  const deviceInfo = ref("Nikon Z9")
  const createTime = ref("2023.9.16")
  const icon = ref("nikon")
  const parameters = ref("50mm f/1.8 10s")
  const gpsInfo = ref("")

  // 计算图片宽度
  let img = new Image()
  img.src = src.value
  img.onload = function () {
    photoWidth.value= img.width + "px"
  }

</script>

<style scoped>
.markContainer{
  margin: 0;
  display: grid;
  grid-template-columns: 3fr 2fr;
  align-items: center;
}
.photoContainer{
  margin: 0;
  padding: 0;
  border-width: 0;
}

img{
  display: block;
  margin: 0;
  padding: 0;
}
</style>