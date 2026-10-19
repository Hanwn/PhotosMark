import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { requestNotifyStatus } from "@/utils/notify";
import { MAX_PHOTOS, PAGE_WIDTH, ratios, layoutCells, traceCell, cellContainsPoint } from "@/layout/presets";
import { paintPage } from "@/layout/renderLayout";

const MAX_EXPORT_PIXELS = 40_000_000;
const MAX_EXPORT_SIDE = 8192;

export function useLayoutEditor() {
  const photos = shallowRef([]);
  const preset = ref("grid-2");
  const ratio = ref("square");
  const gap = ref(16);
  const background = ref("#ffffff");
  const canvas = ref(null);
  const fileInput = ref(null);
  const importing = ref(false);
  const exporting = ref(false);
  const dragIndex = ref(-1);
  const selectedPhotoId = ref(null);
  const pageHeight = computed(() => ratios[ratio.value].height);
  const selectedIndex = computed(() => photos.value.findIndex((photo) => photo.id === selectedPhotoId.value));
  const selectedPhoto = computed(() => photos.value[selectedIndex.value] || null);
  const selectedCell = computed(() => selectedIndex.value < 0 ? null
    : layoutCells(photos.value.length, PAGE_WIDTH, pageHeight.value, gap.value, preset.value)[selectedIndex.value]);
  const selectedCellStyle = computed(() => {
    const cell = selectedCell.value;
    if (!cell || cell.polygon) return null;
    return {
      left: `${cell.x / PAGE_WIDTH * 100}%`,
      top: `${cell.y / pageHeight.value * 100}%`,
      width: `${cell.width / PAGE_WIDTH * 100}%`,
      height: `${cell.height / pageHeight.value * 100}%`,
    };
  });
  const selectedPolygonPoints = computed(() => selectedCell.value?.polygon
    ?.map((point) => `${point.x},${point.y}`).join(" ") || "");
  const exportSize = computed(() => {
    if (!photos.value.length) return { width: PAGE_WIDTH, height: pageHeight.value };
    const pageRatio = pageHeight.value / PAGE_WIDTH;
    const cells = layoutCells(photos.value.length, PAGE_WIDTH, pageHeight.value, gap.value, preset.value);
    const sourceScale = Math.min(...photos.value.map(({ image }, index) => {
      const cell = cells[index];
      return Math.min(image.naturalWidth / cell.width, image.naturalHeight / cell.height);
    }));
    const maxWidth = Math.min(MAX_EXPORT_SIDE, MAX_EXPORT_SIDE / pageRatio,
      Math.sqrt(MAX_EXPORT_PIXELS / pageRatio));
    const width = Math.max(PAGE_WIDTH, Math.floor(Math.min(sourceScale || 1, maxWidth / PAGE_WIDTH) * PAGE_WIDTH));
    return { width, height: Math.round(width * pageRatio) };
  });
  let nextPhotoId = 1;
  let canvasDragFrom = -1;
  let canvasDragTarget = -1;
  let canvasDragPointer = null;
  let cropDragStart = null;

  function drawPage() {
    paintPage(canvas.value, PAGE_WIDTH, pageHeight.value, { photos: photos.value, background: background.value, gap: gap.value, preset: preset.value });
    if (canvasDragPointer === null || canvasDragTarget === canvasDragFrom) return;
    const context = canvas.value.getContext("2d");
    const cells = layoutCells(photos.value.length, PAGE_WIDTH, pageHeight.value, gap.value, preset.value);
    for (const index of [canvasDragFrom, canvasDragTarget]) {
      if (index < 0 || !cells[index]) continue;
      const cell = cells[index];
      context.save();
      context.lineWidth = 8;
      context.strokeStyle = index === canvasDragTarget ? "#ffffff" : "#3b82f6";
      traceCell(context, cell);
      context.stroke();
      context.restore();
    }
  }

  function cellAtPointer(event) {
    const bounds = canvas.value.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * PAGE_WIDTH / bounds.width;
    const y = (event.clientY - bounds.top) * pageHeight.value / bounds.height;
    return layoutCells(photos.value.length, PAGE_WIDTH, pageHeight.value, gap.value, preset.value)
      .findIndex((cell) => cellContainsPoint(cell, x, y));
  }

  function onCanvasPointerDown(event) {
    if (event.button !== 0 || !photos.value.length) return;
    const index = cellAtPointer(event);
    if (index < 0) return;
    selectedPhotoId.value = photos.value[index].id;
    canvasDragFrom = index;
    canvasDragTarget = index;
    canvasDragPointer = event.pointerId;
    const photo = photos.value[index];
    cropDragStart = { clientX: event.clientX, clientY: event.clientY,
      cropX: photo.cropX, cropY: photo.cropY, photoId: photo.id };
    canvas.value.setPointerCapture(event.pointerId);
  }

  function applyCropDrag(event) {
    const photo = photos.value.find((item) => item.id === cropDragStart.photoId);
    if (!photo) return;
    const cell = layoutCells(photos.value.length, PAGE_WIDTH, pageHeight.value, gap.value, preset.value)[canvasDragFrom];
    const bounds = canvas.value.getBoundingClientRect();
    const scale = Math.max(cell.width / photo.image.naturalWidth,
      cell.height / photo.image.naturalHeight) * photo.zoom;
    const availableX = photo.image.naturalWidth - cell.width / scale;
    const availableY = photo.image.naturalHeight - cell.height / scale;
    const deltaX = (event.clientX - cropDragStart.clientX) * PAGE_WIDTH / bounds.width;
    const deltaY = (event.clientY - cropDragStart.clientY) * pageHeight.value / bounds.height;
    updatePhotoCrop(photo.id, {
      cropX: availableX > 1e-6 ? clamp(cropDragStart.cropX - deltaX / (scale * availableX), 0, 1) : 0.5,
      cropY: availableY > 1e-6 ? clamp(cropDragStart.cropY - deltaY / (scale * availableY), 0, 1) : 0.5,
    });
  }

  function restoreCropDrag() {
    if (cropDragStart) updatePhotoCrop(cropDragStart.photoId,
      { cropX: cropDragStart.cropX, cropY: cropDragStart.cropY });
  }

  function onCanvasPointerMove(event) {
    if (canvasDragPointer !== event.pointerId) return;
    const target = cellAtPointer(event);
    if (target === canvasDragFrom) {
      const wasOverOtherCell = canvasDragTarget !== canvasDragFrom;
      canvasDragTarget = target;
      applyCropDrag(event);
      if (wasOverOtherCell) drawPage();
      return;
    }
    if (canvasDragTarget === canvasDragFrom) restoreCropDrag();
    if (target === canvasDragTarget) return;
    canvasDragTarget = target;
    drawPage();
  }

  function onCanvasPointerUp(event) {
    if (canvasDragPointer !== event.pointerId) return;
    const target = event.type === "pointercancel" ? -1 : cellAtPointer(event);
    if (target >= 0 && target !== canvasDragFrom) {
      restoreCropDrag();
      const swapped = [...photos.value];
      [swapped[canvasDragFrom], swapped[target]] = [swapped[target], swapped[canvasDragFrom]];
      photos.value = swapped;
    } else if (target === canvasDragFrom) {
      applyCropDrag(event);
    } else {
      restoreCropDrag();
    }
    canvasDragFrom = -1;
    canvasDragTarget = -1;
    canvasDragPointer = null;
    cropDragStart = null;
    if (canvas.value.hasPointerCapture(event.pointerId)) canvas.value.releasePointerCapture(event.pointerId);
    drawPage();
  }

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function updatePhotoCrop(id, updates) {
    const current = photos.value.find((photo) => photo.id === id);
    if (!current || Object.entries(updates).every(([key, value]) => current[key] === value)) return;
    photos.value = photos.value.map((photo) => photo.id === id ? { ...photo, ...updates } : photo);
  }
  function resetPhotoCrop() {
    if (selectedPhoto.value) updatePhotoCrop(selectedPhoto.value.id,
      { zoom: 1, cropX: 0.5, cropY: 0.5 });
  }

  watch([photos, preset, ratio, gap, background], drawPage, { flush: "post" });
  onMounted(drawPage);
  onBeforeUnmount(() => {
    photos.value.forEach(({ url }) => URL.revokeObjectURL(url));
  });

  function loadPhoto(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => resolve({ name: file.name, url, image, id: nextPhotoId++,
        zoom: 1, cropX: 0.5, cropY: 0.5 });
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image load failed"));
      };
      image.src = url;
    });
  }

  async function addFiles(files) {
    if (importing.value) return;
    const available = MAX_PHOTOS - photos.value.length;
    if (available <= 0) {
      requestNotifyStatus("最多添加 9 张照片", "warning");
      return;
    }
    const images = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (images.length !== files.length) requestNotifyStatus("已跳过非图片文件", "warning");
    const selected = images.slice(0, available);
    if (images.length > available) requestNotifyStatus("最多添加 9 张照片", "warning");
    importing.value = true;
    try {
      for (const file of selected) {
        try {
          const photo = await loadPhoto(file);
          photos.value = [...photos.value, photo];
          if (selectedPhotoId.value === null) selectedPhotoId.value = photo.id;
        } catch {
          requestNotifyStatus(`${file.name} 无法读取`, "error");
        }
      }
    } finally {
      importing.value = false;
    }
  }

  function onSelect(event) {
    addFiles(event.target.files);
    event.target.value = "";
  }
  function onFileDrop(event) { addFiles(event.dataTransfer.files); }
  function removePhoto(index) {
    const removed = photos.value[index];
    photos.value = photos.value.filter((_, position) => position !== index);
    if (selectedPhotoId.value === removed.id) {
      selectedPhotoId.value = photos.value[Math.min(index, photos.value.length - 1)]?.id ?? null;
    }
    URL.revokeObjectURL(removed.url);
  }
  function movePhoto(from, to) {
    if (from < 0 || to < 0 || from === to || to >= photos.value.length) return;
    const reordered = [...photos.value];
    reordered.splice(to, 0, reordered.splice(from, 1)[0]);
    photos.value = reordered;
  }
  function onTileDragStart(event, index) {
    dragIndex.value = index;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }
  function onTileDrop(index) {
    movePhoto(dragIndex.value, index);
    dragIndex.value = -1;
  }
  async function download() {
    if (photos.value.length < 2 || exporting.value) return;
    exporting.value = true;
    const exportCanvas = document.createElement("canvas");
    try {
      const { width, height } = exportSize.value;
      exportCanvas.width = width;
      exportCanvas.height = height;
      paintPage(exportCanvas, width, height, { photos: photos.value, background: background.value, gap: gap.value, preset: preset.value });
      const blob = await new Promise((resolve) => exportCanvas.toBlob(resolve, "image/jpeg", 0.98));
      if (!blob) throw new Error("Image export failed");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "photos-layout.jpg";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      requestNotifyStatus("排版照片已下载", "success");
    } catch {
      requestNotifyStatus("导出失败，请重试", "error");
    } finally {
      exportCanvas.width = 0;
      exportCanvas.height = 0;
      exporting.value = false;
    }
  }

  return {
    MAX_PHOTOS, PAGE_WIDTH, ratios, photos, preset, ratio, gap, background,
    canvas, fileInput, importing, exporting, dragIndex, selectedPhotoId,
    pageHeight, selectedIndex, selectedPhoto, selectedCellStyle,
    selectedPolygonPoints, exportSize, onSelect, onFileDrop, removePhoto, movePhoto,
    onTileDragStart, onTileDrop, onCanvasPointerDown, onCanvasPointerMove,
    onCanvasPointerUp, resetPhotoCrop, updatePhotoCrop, download,
  };
}
