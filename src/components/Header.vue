<script setup>
import { defineComputedSettings, readSettings } from "@/store/defineSettings";

const settings = readSettings();
const { logoSetting } = defineComputedSettings();
</script>

<template>
  <div id="headerContainer">
    <div class="container">
      <a href="https://github.com/Hanwn/PhotoMark" target="_blank">
        <img
          :src="logoSetting.charAt(0) !== 'h' ? '' : logoSetting"
          alt=""
          style="height: 60px !important; width: 217px !important"
        />
      </a>
    </div>
  </div>
</template>

<style scoped>
#headerContainer {
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
