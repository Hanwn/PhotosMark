let context;

function measureTextWidth(text, fontSize, fontStyle = "normal", fontFamily = "Arial") {
  context ??= document.createElement("canvas").getContext("2d");
  context.font = `${fontStyle} ${fontSize || 1}px ${fontFamily}`;
  return context.measureText(text || "").width;
}

export { measureTextWidth };
