import { defineCanvasConfig } from "@/store/defineCanvasConfig";

function getScale(img) {
  let imgH = img.height;
  let imgW = img.width;
  const scale = imgH / imgW;

  if (imgH > imgW) {
    imgH = 600;
    imgW = imgH / scale;
  } else {
    imgW = 800;
    imgH = imgW * scale;
  }
  const scaleX = imgW / img.width;
  const scaleY = imgH / img.height;

  const { StageCenter } = defineCanvasConfig();
  const posX = (StageCenter.value.x - imgW / 2) / scaleX;
  const posY = (StageCenter.value.y - imgH / 2) / scaleY;

  imgH = img.height;
  imgW = img.width;

  return {
    imgH,
    imgW,
    scaleX,
    scaleY,
    posX,
    posY,
  };
}
function loadImg(imgSrc) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imgSrc;
    img.crossOrigin = "anonymous";
  });
}

export { loadImg, getScale };
