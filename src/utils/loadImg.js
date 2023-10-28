
export function loadImg(imgSrc) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = imgSrc
        img.crossOrigin = "anonymous"
    })
}


async function getImg(src) {
    const img = await loadImg(src)
}