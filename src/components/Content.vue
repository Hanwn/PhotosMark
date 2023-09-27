<template>
  <div class="outContainer">
    <div class="picContainer">
      <img :src="src">
    </div>

    <div class="bannerContainer">
      <div class="leftContainer">
        <div class="deviceInfo parameterContainer">

        </div>
        <div class="timeInfo parameterContainer">

        </div>
      </div>
      <div class="rightContainer">
        <div class="icon">
            <img src="./icons/nikon.png">
        </div>
        <div class="verticalBar">

        </div>
        <div class="rightParameter">

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";

  const src = ref("https://cdn.pixabay.com/photo/2023/09/03/11/13/mountains-8230502_1280.jpg")
  const photoWidth = ref("")
  const photoHeight = ref("")
  const markHeight = ref("")
  const outerContainerHeight = ref("")

  // 计算图片宽度
  let img = new Image()
  img.src = src.value
  img.onload = function () {
    photoWidth.value= img.width + "px"
    photoHeight.value = img.height + "px"
    markHeight.value = img.height * 0.1 + "px"
    outerContainerHeight.value = img.height * 1.1 + "px"
  }

</script>


<style scoped>
.outContainer {
  width: v-bind(photoWidth);
  height: v-bind(outerContainerHeight);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

img {
  vertical-align: bottom;
  max-width: 100%;
  max-height: 100%;
}

.bannerContainer {
  background: aqua;
  width: v-bind(photoWidth);
  height: v-bind(markHeight);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.leftContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.parameterContainer {
  width: 100px;
  height: 30px;
  background: cadetblue;
}
.deviceInfo {

}

.deviceInfo {

}

.rightContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.icon {
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>