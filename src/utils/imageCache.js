import { uid2Src } from "@/store/defineImg";
import { allCanvasConfigMap } from "@/store/defineCanvasConfig";
import { loadImg } from "@/utils/loadImg";

const pendingImages = new Map();

async function ensureImage(uid) {
  const file = uid2Src.get(uid);
  if (!file) throw new Error("Image was removed");
  if (file.img) return file.img;

  if (!pendingImages.has(uid)) {
    const pending = loadImg(file.src).then((img) => {
      if (uid2Src.get(uid) !== file) throw new Error("Image was removed");
      file.img = img;
      const config = allCanvasConfigMap.get(uid);
      if (config) config.mainImgConfig.image = img;
      return img;
    }).finally(() => pendingImages.delete(uid));
    pendingImages.set(uid, pending);
  }
  return pendingImages.get(uid);
}

function releaseImage(uid) {
  const file = uid2Src.get(uid);
  if (file) file.img = null;
  const config = allCanvasConfigMap.get(uid);
  if (config) config.mainImgConfig.image = null;
}

export { ensureImage, releaseImage };
