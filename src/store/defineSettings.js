import { ref, computed } from "vue";
const settings = ref({
  logoPrefix: "",
  iconPrefix: "",
});

function readSettings() {
  return settings;
}

function setSettings(setting) {
  settings.value = setting;
}

const AliPay = computed(() => {
  return settings.value.logoPrefix + "alipay.svg";
});

const AliQRCodeSetting = computed(() => {
  return settings.value.logoPrefix + "AliQRCode.svg";
});

const wechatQRCodeSetting = computed(() => {
  return settings.value.logoPrefix + "WeChatQRCode.png";
});

const wechat = computed(() => {
  return settings.value.logoPrefix + "wechat.svg";
});

const logoSetting = computed(() => {
  return settings.value.logoPrefix + "logo1.png";
});

function defineComputedSettings() {
  return {
    AliPay,
    AliQRCodeSetting,
    wechatQRCodeSetting,
    wechat,
    logoSetting,
  };
}

export { readSettings, setSettings, defineComputedSettings };
