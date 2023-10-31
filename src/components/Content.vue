<template>
  <div id="cvsContainer">
    <div id="innerContainer">
      {{renderIdx}}
      {{renderList[renderIdx].previewKonvaConfig.width}}
      <v-stage :config="renderList[renderIdx].previewKonvaConfig" ref="stage" id="previewStage">
        <v-layer>
          <v-image :config="renderList[renderIdx].configImg"></v-image>
          <v-group :config="renderList[renderIdx].iconGroupConfig">
            <v-rect :config="renderList[renderIdx].iconRectConfig"></v-rect>
            <v-text :config="renderList[renderIdx].deviceInfoConfig"></v-text>
            <v-text :config="renderList[renderIdx].lensInfoConfig"></v-text>
            <v-image :config="renderList[renderIdx].iconInfoConfig"></v-image>
            <v-rect :config="renderList[renderIdx].verticalBarInfoConfig"></v-rect>
            <v-text :config="renderList[renderIdx].parameterInfoConfig"></v-text>
            <v-text :config="renderList[renderIdx].timeInfoConfig"></v-text>
          </v-group>
        </v-layer>
      </v-stage>
    </div>
  </div>

  <div id="imgOutContainer">
    <div class="imgInnerContainer" v-for="(imgUrl, idx) in imgSrcList">
      <img :src="imgUrl" alt="" @click="click(idx)"/>
    </div>
  </div>

  <div class="downloadDiv">
    <v-stage :config="renderList[renderIdx].downloadKonvaConfig" ref="downloadStage" id="downloadStage">
      <v-layer>
        <v-image :config="renderList[renderIdx].configImg"></v-image>
        <v-group :config="renderList[renderIdx].iconGroupConfig">
          <v-rect :config="renderList[renderIdx].iconRectConfig"></v-rect>
          <v-text :config="renderList[renderIdx].deviceInfoConfig"></v-text>
          <v-text :config="renderList[renderIdx].lensInfoConfig"></v-text>
          <v-image :config="renderList[renderIdx].iconInfoConfig" @dragEnd="dragIconEnd"></v-image>
          <v-rect :config="renderList[renderIdx].verticalBarInfoConfig"></v-rect>
          <v-text :config="renderList[renderIdx].parameterInfoConfig"></v-text>
          <v-text :config="renderList[renderIdx].timeInfoConfig"></v-text>
        </v-group>
      </v-layer>
    </v-stage>
  </div>
  <div>
    <input type="file" id="upload" multiple="multiple" @change="uploadFiles">
    <input type="button" @click="download" value="下载">
    <input type="button" @click="add" value="add">
  </div>
</template>

<script setup>
  import {ref, reactive} from "vue";
  import {getImageData} from "@/utils/readFile";
  import {getExifData} from "@/utils/readExif";
  import {loadImg} from "@/utils/loadImg"
  import {getIconSrc} from "@/utils/getIcon";
  import {getMarkInfo} from "@/utils/parameterInfoConfig";

  const v = ref(0)
  const add = function() {
    v.value+=1
    renderList[1].deviceInfoConfig.text = v.value
  }

  const dragIconEnd = function (e) {
    // renderList[1].iconInfoConfig.x = e.target.
    console.log(e)
  }

  const click = function (idx) {
    renderIdx.value = idx + 1
  }

  let stage = ref()
  let downloadStage = ref()
  const download = async function(evt) {
    renderIdx.value = 1
    for (let i = 0; i < imgSrcList.length; i++) {
      const idx = renderIdx.value
      console.log(idx)
      renderList[idx].downloadKonvaConfig.visible = true
      const outputConfig = {
        "mimeType":"image/jpeg",
        "width": downloadStage.value.width,
        "height": downloadStage.value.height
      }
      let node = await downloadStage.value.getNode()
      let href = node.toDataURL(outputConfig)
      let a = document.createElement("a")
      a.href = href
      a.download = "xx" + i
      a.click()
      if (renderIdx.value === renderList.length) {
        break
      }
      renderIdx.value = idx +1
    }
  }

  const readImgData = async function(file) {
    let imgData = ""
    try {
      imgData = await getImageData(file)
    } catch (e) {
      console.log(e)
      return
    }
    const exifData = getExifData(imgData)
    exifData.LEN = exifData.LEN.replace(/\u0000/g, "")
    let src = URL.createObjectURL(file)
    imgSrcList.push(src)
    metaDataMap.set(src, exifData)

    const iconName = getIconSrc(exifData)
    const iconSrc = `https://pic-1301492519.cos.ap-shanghai.myqcloud.com/icon/${iconName}`
    const iconImg = await loadImg(iconSrc)

    const img = await loadImg(src)

    const padding = 100
    const rectH = img.height * factor.value
    const middle = img.height + rectH/3
    const rectW = img.width
    const genMarkInfo = getMarkInfo(exifData, padding, middle, rectW, rectH, img.height, iconImg)

    renderList.push({
      previewKonvaConfig:{
        width : img.width/10,
        height : (img.height * (1 + factor.value))/10,
        scaleX:0.1,
        scaleY:0.1,
      },
      downloadKonvaConfig:{
        width : img.width,
        height : (img.height * (1 + factor.value)),
        visible: true
      },
      configImg: {
        image: img,
      },
      iconGroupConfig: {},
      iconRectConfig: {
        height : img.height * factor.value,
        width : img.width,
        y : img.height,
        fill : "white"
      },
      deviceInfoConfig: genMarkInfo["left"]["deviceInfoConfig"],
      lensInfoConfig: genMarkInfo["left"]["lensInfoConfig"],
      iconInfoConfig: genMarkInfo["right"]["iconInfoConfig"],
      verticalBarInfoConfig: genMarkInfo["right"]["verticalBarInfoConfig"],
      parameterInfoConfig: genMarkInfo["right"]["parameterInfoConfig"],
      timeInfoConfig: genMarkInfo["right"]["timeInfoConfig"]
    })

    if (renderIdx.value === 0) {
      renderIdx.value = 1
    }
  }

  function uploadFiles(e) {
    let files = e.target.files
    if (!files.length) {
      return
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      readImgData(file)
    }
  }

  const imgSrcList = reactive([])
  const metaDataMap = reactive(new Map())
  const rendered = ref(false)
  const renderList = reactive([{
    previewKonvaConfig:{
      width: 800,
      height: 600,
      scaleX:1,
      scaleY:1
    }
  }])
  const renderIdx = ref(0)
  const factor = ref(0.1)
</script>

<style>
#cvsContainer{
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
}
#innerContainer {
}

#imgOutContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 1000px;
  overflow-x: scroll;
}
.imgInnerContainer {
  display: flex;
  height: 200px;
  width: 300px;
  padding: 10px;
}

.downloadDiv{
  height: 1px;
  width: 1px;
  overflow: auto;
}
</style>
