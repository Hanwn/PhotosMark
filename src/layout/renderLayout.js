import { PAGE_WIDTH, layoutCells, traceCell } from "./presets";

export function paintPage(targetCanvas, width, height, { photos, background, gap, preset }) {
  const context = targetCanvas?.getContext("2d");
  if (!context) return;
  const count = photos.length;
  if (!count) {
    context.clearRect(0, 0, width, height);
    return;
  }
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  const spacing = gap * width / PAGE_WIDTH;
  const cells = layoutCells(count, width, height, spacing, preset);
  photos.forEach(({ image, zoom, cropX, cropY }, index) => {
    const cell = cells[index];
    const { x, y, width, height: cellHeight } = cell;
    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;
    const scale = Math.max(width / sourceWidth, cellHeight / sourceHeight) * zoom;
    const cropWidth = width / scale;
    const cropHeight = cellHeight / scale;
    context.save();
    if (cell.polygon) {
      traceCell(context, cell);
      context.clip();
    }
    context.drawImage(image, (sourceWidth - cropWidth) * cropX, (sourceHeight - cropHeight) * cropY,
      cropWidth, cropHeight, x, y, width, cellHeight);
    context.restore();
  });
}
