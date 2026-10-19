export const MAX_PHOTOS = 9;
export const PAGE_WIDTH = 1200;
export const ratios = {
  square: { label: "正方形 1:1", height: 1200 },
  portrait: { label: "竖版 4:5", height: 1500 },
  landscape: { label: "横版 3:2", height: 800 },
};
export const presets = [
  { id: "grid-2", name: "经典网格", preview: [[2, 2, 29, 19], [33, 2, 29, 19], [2, 23, 29, 19], [33, 23, 29, 19]] },
  { id: "grid-3", name: "密集网格", preview: [[2, 2, 19, 19], [23, 2, 18, 19], [43, 2, 19, 19], [2, 23, 19, 19], [23, 23, 18, 19], [43, 23, 19, 19]] },
  { id: "hero-left", name: "左侧主图", preview: [[2, 2, 36, 40], [40, 2, 22, 19], [40, 23, 22, 19]] },
  { id: "hero-right", name: "右侧主图", preview: [[26, 2, 36, 40], [2, 2, 22, 19], [2, 23, 22, 19]] },
  { id: "hero-top", name: "顶部主图", preview: [[2, 2, 60, 23], [2, 27, 29, 15], [33, 27, 29, 15]] },
  { id: "hero-bottom", name: "底部主图", preview: [[2, 19, 60, 23], [2, 2, 29, 15], [33, 2, 29, 15]] },
  { id: "strips", name: "横向长条", preview: [[2, 2, 60, 12], [2, 16, 60, 12], [2, 30, 60, 12]] },
  { id: "vertical-strips", name: "竖向长条", preview: [[2, 2, 19, 40], [23, 2, 18, 40], [43, 2, 19, 40]] },
  { id: "diagonal-right", name: "斜条 · 右倾", preview: [], previewPolygons: ["2,2 62,2 62,17 2,12", "2,15 62,20 62,31 2,27", "2,30 62,34 62,42 2,42"] },
  { id: "diagonal-left", name: "斜条 · 左倾", preview: [], previewPolygons: ["2,2 62,2 62,12 2,17", "2,20 62,15 62,27 2,31", "2,34 62,30 62,42 2,42"] },
  { id: "staggered", name: "错落双列", preview: [[2, 2, 29, 19], [33, 2, 29, 40], [2, 23, 29, 19]] },
  { id: "alternating", name: "交错拼接", preview: [[2, 2, 36, 19], [40, 2, 22, 19], [2, 23, 22, 19], [26, 23, 36, 19]] },
];


function gridCells(count, cols, x, y, width, height, spacing) {
  if (!count) return [];
  const actualCols = Math.min(count, cols);
  const rows = Math.ceil(count / actualCols);
  const cellWidth = (width - spacing * (actualCols - 1)) / actualCols;
  const cellHeight = (height - spacing * (rows - 1)) / rows;
  return Array.from({ length: count }, (_, index) => ({
    x: x + (index % actualCols) * (cellWidth + spacing),
    y: y + Math.floor(index / actualCols) * (cellHeight + spacing),
    width: cellWidth,
    height: cellHeight,
  }));
}

export function layoutCells(count, width, height, spacing, selectedPreset) {
  if (!count) return [];
  const innerWidth = width - spacing * 2;
  const innerHeight = height - spacing * 2;
  if (["hero-left", "hero-right"].includes(selectedPreset) && count > 1) {
    const heroWidth = (innerWidth - spacing) * 0.56;
    const sideWidth = innerWidth - heroWidth - spacing;
    const heroOnLeft = selectedPreset === "hero-left";
    return [
      { x: heroOnLeft ? spacing : spacing * 2 + sideWidth, y: spacing, width: heroWidth, height: innerHeight },
      ...gridCells(count - 1, count > 5 ? 2 : 1,
        heroOnLeft ? spacing * 2 + heroWidth : spacing,
        spacing, sideWidth, innerHeight, spacing),
    ];
  }
  if (["hero-top", "hero-bottom"].includes(selectedPreset) && count > 1) {
    const heroHeight = (innerHeight - spacing) * 0.54;
    const sideHeight = innerHeight - heroHeight - spacing;
    const heroOnTop = selectedPreset === "hero-top";
    return [
      { x: spacing, y: heroOnTop ? spacing : spacing * 2 + sideHeight, width: innerWidth, height: heroHeight },
      ...gridCells(count - 1, count > 5 ? 3 : 2, spacing,
        heroOnTop ? spacing * 2 + heroHeight : spacing, innerWidth, sideHeight, spacing),
    ];
  }
  if (selectedPreset === "strips") {
    return gridCells(count, 1, spacing, spacing, innerWidth, innerHeight, spacing);
  }
  if (selectedPreset === "vertical-strips") {
    return gridCells(count, count, spacing, spacing, innerWidth, innerHeight, spacing);
  }
  if (selectedPreset.startsWith("diagonal-")) {
    const leftEdge = spacing;
    const rightEdge = width - spacing;
    const shift = Math.min(innerHeight * 0.22, innerHeight / count * 0.65)
      * (selectedPreset === "diagonal-right" ? 1 : -1);
    const leftBoundary = (index) => spacing + innerHeight * index / count;
    const rightBoundary = (index) => leftBoundary(index) + shift * Math.sin(Math.PI * index / count);
    return Array.from({ length: count }, (_, index) => {
      const insetTop = index === 0 ? 0 : spacing / 2;
      const insetBottom = index === count - 1 ? 0 : spacing / 2;
      const topLeft = leftBoundary(index) + insetTop;
      const topRight = rightBoundary(index) + insetTop;
      const bottomLeft = leftBoundary(index + 1) - insetBottom;
      const bottomRight = rightBoundary(index + 1) - insetBottom;
      return {
        x: leftEdge,
        y: Math.min(topLeft, topRight),
        width: innerWidth,
        height: Math.max(bottomLeft, bottomRight) - Math.min(topLeft, topRight),
        polygon: [
          { x: leftEdge, y: topLeft }, { x: rightEdge, y: topRight },
          { x: rightEdge, y: bottomRight }, { x: leftEdge, y: bottomLeft },
        ],
      };
    });
  }
  if (selectedPreset === "staggered") {
    const leftCount = Math.ceil(count / 2);
    const rightCount = Math.floor(count / 2);
    const columnWidth = (innerWidth - spacing) / 2;
    const left = gridCells(leftCount, 1, spacing, spacing, columnWidth, innerHeight, spacing);
    const right = gridCells(rightCount, 1, spacing * 2 + columnWidth,
      spacing, columnWidth, innerHeight, spacing);
    return Array.from({ length: count }, (_, index) => index % 2 === 0
      ? left[index / 2] : right[(index - 1) / 2]);
  }
  if (selectedPreset === "alternating") {
    const rows = Math.ceil(count / 2);
    const rowHeight = (innerHeight - spacing * (rows - 1)) / rows;
    return Array.from({ length: count }, (_, index) => {
      const row = Math.floor(index / 2);
      const first = index % 2 === 0;
      const hasPair = row * 2 + 1 < count;
      const firstWidth = hasPair ? (innerWidth - spacing) * (row % 2 === 0 ? 0.6 : 0.4) : innerWidth;
      return {
        x: first ? spacing : spacing * 2 + firstWidth,
        y: spacing + row * (rowHeight + spacing),
        width: first ? firstWidth : innerWidth - firstWidth - spacing,
        height: rowHeight,
      };
    });
  }
  return gridCells(count, selectedPreset === "grid-3" ? 3 : 2,
    spacing, spacing, innerWidth, innerHeight, spacing);
}

export function traceCell(context, cell) {
  context.beginPath();
  if (cell.polygon) {
    context.moveTo(cell.polygon[0].x, cell.polygon[0].y);
    for (const point of cell.polygon.slice(1)) context.lineTo(point.x, point.y);
    context.closePath();
  } else {
    context.rect(cell.x, cell.y, cell.width, cell.height);
  }
}

export function cellContainsPoint(cell, x, y) {
  if (!cell.polygon) return x >= cell.x && x < cell.x + cell.width
    && y >= cell.y && y < cell.y + cell.height;
  let inside = false;
  const points = cell.polygon;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const a = points[index];
    const b = points[previous];
    if ((a.y > y) !== (b.y > y)
      && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
