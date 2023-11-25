<script setup>
import { defineComputedSettings } from "@/store/defineSettings";

const { AliPay, wechat, AliQRCodeSetting, wechatQRCodeSetting } =
  defineComputedSettings();
</script>

<template>
  <div class="sponsorContainer">
    <div class="alipay-icon sponsorContainer">
      <el-popover placement="top-start" :width="200" trigger="hover">
        <template #reference>
          <img
            :src="AliPay"
            alt="Buy Me A Coffee"
            style="height: 60px !important; width: 217px !important"
          />
        </template>
        <div style="display: flex; align-items: center">
          <el-image
            style="width: 200px; height: 200px"
            :src="AliQRCodeSetting"
            fit="contain"
          />
        </div>
      </el-popover>
    </div>

    <div class="wechat-icon sponsorContainer">
      <el-popover placement="top-start" :width="200" trigger="hover">
        <template #reference>
          <img
            :src="wechat"
            alt="Buy Me A Coffee"
            style="height: 60px !important; width: 217px !important"
          />
        </template>
        <div style="display: flex; align-items: center">
          <el-image
            style="width: 200px; height: 200px"
            :src="wechatQRCodeSetting"
            fit="contain"
          />
        </div>
      </el-popover>
    </div>
    <div class="bmc-icon sponsorContainer">
      <a href="https://www.buymeacoffee.com/hanwn7721n" target="_blank">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
          alt="Buy Me A Coffee"
          style="height: 60px !important; width: 217px !important"
        />
      </a>
    </div>
  </div>
</template>

<style scoped>
.sponsorContainer {
  margin: 20px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  flex-wrap: nowrap;
}
</style>
