<template>
  <div id="cvsContainer">
    <div id="innerContainer">
    <v-stage :config="configKonva" ref="stage" @click="download">
      <v-layer>
        <v-image :config="configImg"></v-image>
        <v-group :config="iconGroupConfig">
          <v-rect :config="iconRectConfig"></v-rect>
          <v-text :config="deviceInfoConfig"></v-text>
          <v-text :config="lensInfoConfig"></v-text>
          <v-image :config="iconInfoConfig"></v-image>
          <v-rect :config="verticalBarInfoConfig"></v-rect>
          <v-text :config="parameterInfoConfig"></v-text>
          <v-text :config="timeInfoConfig"></v-text>
        </v-group>
      </v-layer>
    </v-stage>

      <div id="imgOutContainer">
        <div class="imgInnerContainer" v-for="imgUrl in imgSrcList">
          <img :src="imgUrl" alt="" @click="click"/>
        </div>
      </div>
    </div>
  </div>
  <input type="file" id="upload" multiple="multiple" @change="uploadFiles">
  <input type="button" @click="download" value="下载">
</template>

<script setup>
  import {ref, reactive, getCurrentInstance} from "vue";
  import {getImageData} from "@/utils/readFile";
  import {getExifData} from "@/utils/readExif";
  import {calcDeviceFontSize} from "@/utils/calcFontSize";
  import {calcIconSize} from "@/utils/calcIconSize";
  import {loadImg} from "@/utils/loadImg"

  const click = function (e) {
    render(e.target.src, metaDataMap.get(e.target.src))
  }

  const stage = ref()
  function download(evt) {
    for (let i = 0; i < imgSrcList.length; i++) {
      console.log(imgSrcList[i])
      render(imgSrcList[i], metaDataMap.get(imgSrcList[i])).then(() => {
        let href = stage.value.getNode().toDataURL()
        const a = document.createElement("a")
        a.href = href
        a.download = "xx" + i
        a.click()
      })
    }
  }

  const render = async function (src, exifData) {
    const img = await loadImg(src)
    // iconImg.src = ""
    const iconSrc = ""
    const iconImg = await loadImg(iconSrc)

    configImg.image = img
    configKonva.width = img.width
    configKonva.height = img.height * (1 + factor.value)

    iconRectConfig.height = img.height * factor.value
    iconRectConfig.width = img.width
    iconRectConfig.y = img.height
    iconRectConfig.fill = "white"

    const middle = img.height + iconRectConfig.height/3

    let fontInfo = calcDeviceFontSize(exifData.M, 60, iconRectConfig.height, true)
    let fontSize = fontInfo.fontSize
    let textSize = fontInfo.textSize
    deviceInfoConfig.text = exifData.M
    deviceInfoConfig.y = middle
    deviceInfoConfig.fontSize = fontSize
    deviceInfoConfig.offsetY = textSize.height/2

    console.log(textSize.height/iconRectConfig.height)


    fontInfo = calcDeviceFontSize(exifData.LEN, 45, iconRectConfig.height, false)
    fontSize = fontInfo.fontSize
    textSize = fontInfo.textSize
    lensInfoConfig.text = exifData.LEN
    lensInfoConfig.y = middle + iconRectConfig.height/3
    lensInfoConfig.offsetY = textSize.height/2
    lensInfoConfig.fontSize = fontSize

    console.log(textSize.height/iconRectConfig.height)

    const parameterText = exifData.L +  "mm f/" + exifData.F + " 1/" + exifData.S + " ISO" + exifData.ISO
    const parameterTextSize = 60
    fontInfo = calcDeviceFontSize(parameterText, parameterTextSize, iconRectConfig.height, true)
    fontSize = fontInfo.fontSize
    textSize = fontInfo.textSize
    parameterInfoConfig.text = parameterText
    parameterInfoConfig.x = img.width - textSize.width - 100
    parameterInfoConfig.y = middle
    parameterInfoConfig.offsetY = textSize.height/2
    parameterInfoConfig.fontSize = fontSize

    debugConfig.x = deviceInfoConfig.x
    debugConfig.y = middle

    const timeTextSize = 45
    fontInfo = calcDeviceFontSize(exifData.T, timeTextSize, iconRectConfig.height, false)
    fontSize = fontInfo.fontSize
    textSize = fontInfo.textSize
    timeInfoConfig.text = exifData.T
    timeInfoConfig.x = parameterInfoConfig.x
    timeInfoConfig.y = lensInfoConfig.y
    timeInfoConfig.offsetY = textSize.height/2
    timeInfoConfig.fontSize = fontSize

    // debugConfig.x = parameterInfoConfig.x
    // debugConfig.y = middle

    const dist = 50
    verticalBarInfoConfig.x = parameterInfoConfig.x - verticalBarInfoConfig.width - dist
    verticalBarInfoConfig.y = img.height + iconRectConfig.height / 6
    verticalBarInfoConfig.height = iconRectConfig.height * 2 / 3


    const calcIconData = calcIconSize(iconImg.width, iconImg.height, iconRectConfig.height, iconRectConfig.width)
    iconInfoConfig.image = iconImg
    iconInfoConfig.x = verticalBarInfoConfig.x - dist - calcIconData.iconImgWidth
    iconInfoConfig.y = iconRectConfig.y + (iconRectConfig.height - calcIconData.iconImgHeight)/2
    iconInfoConfig.height = calcIconData.iconImgHeight
    iconInfoConfig.width = calcIconData.iconImgWidth
  }

  const readImgData = async function(file) {
    const imgData = await getImageData(file)
    const exifData = getExifData(imgData)
    exifData.LEN = exifData.LEN.replace(/\u0000/g, "")
    let src = URL.createObjectURL(file)
    imgSrcList.push(src)
    metaDataMap.set(src, exifData)
    if (rendered.value === false) {
      await render(src, exifData)
      rendered.value = true
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

  const configImg = reactive({
    image:null,
  })
  const iconGroupConfig = reactive({
    x: 0,
    y: 0,
    width:0,
    height:0
  })
  const iconRectConfig = reactive({
    x: 0,
    y: 0,
    width:0,
    height:0,
    fill:"",
    stroke: "black",
  })

  const deviceInfoConfig = reactive({
    x:100,
    y:0,
    text:"",
    fontSize:0,
    fontStyle:"bold",
    offsetY:0,
    fill:"black",
    draggable:true,
  })

  const lensInfoConfig = reactive({
    x:100,
    y:0,
    text:"",
    fontSize:0,
    offsetY:0,
    fontStyle:"normal",
    align:"center",
    fill:"gray",
    draggable:true,
  })
  const iconInfoConfig = reactive({
    image: null,
    x: 0,
    y:0,
    height:0,
    width:0,
  })
  const verticalBarInfoConfig = reactive({
    x: 0,
    y: 0,
    width:5,
    height:0,
    fill: "gray",
  })
  const parameterInfoConfig = reactive({
    x:100,
    y:0,
    text:"",
    fontSize:0,
    fontStyle:"bold",
    align:"center",
    offsetY:0,
    verticalAlign:"middle",
    fill:"black",
    draggable:true,
  })
  const timeInfoConfig = reactive({
    x:100,
    y:0,
    text:"",
    fontSize:0,
    fontStyle:"normal",
    align:"center",
    verticalAlign:"middle",
    offsetY:0,
    fill:"gray",
    draggable:true,

  })
  const debugConfig = reactive({
    x:100,
    y:100,
    radius: 10,
    fill: "red",
  })


  const factor = ref(0.08)

  const configKonva = reactive({
    width: 200,
    height: 200
  })

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
  justify-content: center;
  height: 400px;
  width: 600px;
}
.imgInnerContainer {
  display: flex;
  height: 200px;
  width: 300px;
  padding: 10px;
}
</style>
