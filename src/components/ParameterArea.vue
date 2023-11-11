<script setup>
import {defineRender} from "@/store/defineRender";
import {
  defineExifCache,
  defineIcon, pushToExifCache, pushToIconCache, uid2Src,
} from "@/store/defineImg";
import {loadImg} from "@/utils/loadImg";
import {getIconSrc} from "@/utils/getIcon";
import {Aim, Calendar, Camera, InfoFilled, Refresh} from "@element-plus/icons-vue";
import {ref, watch} from 'vue'
import {getImageData} from "@/utils/readFile";
import {getExifData, parseExifData} from "@/utils/readExif";
import {allCanvasConfigMap, defineCanvasConfig} from "@/store/defineCanvasConfig";
import {PreviewRender} from "@/themes/renderReouter";

const {exifCache} = defineExifCache()
const {iconCache} = defineIcon()
const {currentRenderUid, unMarshal,marshal, parameterDisable} = defineRender()


const {
  deviceInfoConfig,
  parameterInfoConfig,
  timeInfoConfig,
  lensInfoConfig
} = defineCanvasConfig()


async function reset() {
  if (allCanvasConfigMap.has(currentRenderUid.value) && currentRenderUid.value !== 0) {
    const uid = currentRenderUid.value
    const src = uid2Src.get(currentRenderUid.value).src
    const img = await loadImg(src)
    const exifData = exifCache.get(src)
    pushToExifCache(src, exifData)
    const iconName = getIconSrc(exifData)
    const iconSrc = `https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/${iconName}`
    let iconImg = ""
    if (iconCache.has(iconSrc)) {
      iconImg = iconCache.get(iconSrc)
    } else {
      iconImg = await loadImg(iconSrc)
      pushToIconCache(src)
    }
    PreviewRender(uid, img, exifData, iconImg)
    // not best practise
    unMarshal(uid)
  }
}

const value = ref('')

async function select() {
  console.log(value.value)
  const uid = currentRenderUid.value
  const uploadFile = uid2Src.get(currentRenderUid.value)
  const imgData = await getImageData(uploadFile.raw)
  let exifData = null
  try {
    exifData = getExifData(imgData)
  } catch (e) {
    exifData = parseExifData(null)
  }
  exifData.LEN = exifData.LEN.replace(/\u0000/g, "")
  const src = uid2Src.get(currentRenderUid.value).src
  let img = null
  try {
    img = await loadImg(src)
  } catch (e) {
    return
  }
  const iconName = getIconSrc(exifData)
  pushToExifCache(src, exifData)
  const iconSrc = value.value
  let iconImg = ""
  if (iconCache.has(iconSrc)) {
    iconImg = iconCache.get(iconSrc)
  } else {
    iconImg = await loadImg(iconSrc)
    pushToIconCache(iconSrc, iconImg)
  }

  PreviewRender(uid, img, exifData, iconImg)
  // not best practise
  unMarshal(uid)
}

const cities = ref([
  {
    value: 'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Nikon2.svg',
    label: 'Nikon',
  },
  {
    value: 'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Nikon100.svg',
    label: 'Nikon',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Nikon11.svg',
    label: 'Nikon',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Sony.svg',
    label: 'Sony',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Canon.svg',
    label: 'Canon',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Lumix.svg',
    label: 'Lumix',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Fujifilm.svg',
    label: 'Fujifilm',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Zeiss.svg',
    label: 'Zeiss',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/gopro.svg',
    label: 'GoPro',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/pentax.svg',
    label: 'Pentax',
  },
  {
    value:'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Dji.svg',
    label: 'Dji',
  },
  {
    value: 'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Hasselblad.svg',
    label: 'Hasselblad'
  },
  {
    value: 'https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/Leica.svg',
    label: 'Leica'
  }

])



</script>

<template>
  <div class="inputContainer">
      <el-input
        v-model="deviceInfoConfig.text"
        class="w-50 m-2"
        placeholder="Device info"
        :prefix-icon="Camera"
        :disabled="parameterDisable"
      />

    <el-input
        v-model="lensInfoConfig.text"
        class="w-50 m-2"
        placeholder="Lens Info"
        :prefix-icon="Aim"
        :disabled="parameterDisable"
    />
    <el-input
        v-model="parameterInfoConfig.text"
        class="w-50 m-2"
        placeholder="parameter Info"
        :prefix-icon="InfoFilled"
        :disabled="parameterDisable"
    />
    <el-input
        v-model="timeInfoConfig.text"
        class="w-50 m-2"
        placeholder="time info"
        :prefix-icon="Calendar"
        :disabled="parameterDisable"
    />

    <el-select v-model="value" placeholder="Select" :disabled="parameterDisable" @change="select">
      <el-option
          v-for="item in cities"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      >
        <el-image style="float:right; display: inline-block; width: 20px; height: 20px" :src="item.value" fit="contain" />
      </el-option>
    </el-select>

    <el-button type="danger" @click="reset" :disabled="parameterDisable">
      Reset
      <el-icon class="el-icon--left">
        <Refresh/>
      </el-icon>
    </el-button>

  </div>

</template>

<style scoped>
.inputContainer{
  display: flex;
  width: 800px;
  flex-direction: column;
  justify-content: center;
  margin: 20px;
}
.inputArea{
  padding: 5px;
}
</style>