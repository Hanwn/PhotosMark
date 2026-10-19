const getIconSrc = function (exifData) {
  const model = exifData.Model;
  const make = exifData.Make;

  const deviceModel = model.toLowerCase();
  const deviceMake = make.toLowerCase();
  let iconSrc = "Nikon2.svg";
  const deviceMap = new Map([
    ["nikon", "Nikon2.svg"],
    ["sony", "Sony.svg"],
    ["fujifilm", "Fujifilm.svg"],
    ["dji", "Dji.svg"],
    ["hasselblad", "hasselblad.svg"],
    ["leica", "leica.svg"],
    ["olympus", "olympus.svg"],
    ["panasonic", "panasonic.svg"],
    ["lumix", "panasonic.svg"],
    ["carl zeiss jena", "carl-zeiss-jena.svg"],
    ["zeiss", "zeiss.svg"],
  ]);

  for (let key of deviceMap.keys()) {
    if (deviceMake.includes(key) || deviceModel.includes(key)) {
      return deviceMap.get(key);
    }
  }

  return iconSrc;
};

export { getIconSrc };
