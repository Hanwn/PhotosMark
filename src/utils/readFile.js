const getImageData = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            resolve(e.target.result)
        }
        fileReader.onerror = (error) => {
            reject(error)
        }
        fileReader.readAsDataURL(file)
    })
}


export {getImageData}