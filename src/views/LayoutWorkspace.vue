<script setup>
import { useLayoutEditor } from "./layout/useLayoutEditor";
import LayoutPresetSelect from "./layout/LayoutPresetSelect.vue";

const {
  MAX_PHOTOS,
  PAGE_WIDTH,
  ratios,
  photos,
  preset,
  ratio,
  gap,
  background,
  canvas,
  fileInput,
  importing,
  exporting,
  dragIndex,
  selectedPhotoId,
  pageHeight,
  selectedIndex,
  selectedPhoto,
  selectedCellStyle,
  selectedPolygonPoints,
  exportSize,
  onSelect,
  onFileDrop,
  removePhoto,
  movePhoto,
  onTileDragStart,
  onTileDrop,
  onCanvasPointerDown,
  onCanvasPointerMove,
  onCanvasPointerUp,
  resetPhotoCrop,
  updatePhotoCrop,
  download,
} = useLayoutEditor();
</script>

<template>
  <main class="layout-workspace">
    <div class="layout-grid">
      <aside class="ui-card layout-library" aria-label="排版照片">
        <div class="panel-heading">
          <h2>照片</h2>
          <span>{{ photos.length }} / {{ MAX_PHOTOS }}</span>
        </div>
        <div class="upload-zone" @dragover.prevent @drop.prevent="onFileDrop">
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            aria-label="添加排版照片"
            @change="onSelect"
          />
          <button
            class="ui-button"
            type="button"
            :disabled="photos.length >= MAX_PHOTOS || importing"
            @click="fileInput.click()"
          >
            {{ importing ? "正在添加…" : "＋ 添加照片" }}
          </button>
          <span>支持 JPG、PNG、WebP，也可拖到这里</span>
        </div>
        <p v-if="!photos.length" class="library-hint">
          添加 2–9 张照片，开始制作拼版。
        </p>
        <p v-else class="library-hint">拖动缩略图调整顺序，也可使用箭头。</p>
        <div class="layout-photo-list">
          <div
            v-for="(photo, index) in photos"
            :key="photo.id"
            class="layout-photo"
            draggable="true"
            @dragstart="onTileDragStart($event, index)"
            @dragend="dragIndex = -1"
            @dragover.prevent
            @drop.prevent="onTileDrop(index)"
          >
            <button
              class="photo-select"
              type="button"
              :aria-label="`调整 ${photo.name}`"
              :aria-pressed="selectedPhotoId === photo.id"
              @click="selectedPhotoId = photo.id"
            >
              <img :src="photo.url" alt="" /><span class="photo-detail"
                ><span class="photo-order">{{
                  String(index + 1).padStart(2, "0")
                }}</span
                ><span class="photo-name" :title="photo.name">{{
                  photo.name
                }}</span></span
              >
            </button>
            <div class="photo-actions">
              <button
                type="button"
                :disabled="index === 0"
                :aria-label="`上移 ${photo.name}`"
                @click="movePhoto(index, index - 1)"
              >
                ↑</button
              ><button
                type="button"
                :disabled="index === photos.length - 1"
                :aria-label="`下移 ${photo.name}`"
                @click="movePhoto(index, index + 1)"
              >
                ↓</button
              ><button
                type="button"
                :aria-label="`删除 ${photo.name}`"
                @click="removePhoto(index)"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </aside>

      <section class="layout-preview" aria-label="排版预览">
        <div class="section-heading">
          <div>
            <span class="eyebrow">WORKSPACE</span>
            <h2>整页预览</h2>
          </div>
          <p>{{ PAGE_WIDTH }} × {{ pageHeight }} px</p>
        </div>
        <div class="preview-shell">
          <div class="page-frame">
            <canvas
              ref="canvas"
              :width="PAGE_WIDTH"
              :height="pageHeight"
              :class="{ 'canvas-draggable': photos.length }"
              aria-label="照片排版画布，在网格内拖动调整取景，拖到另一网格交换照片"
              @pointerdown="onCanvasPointerDown"
              @pointermove="onCanvasPointerMove"
              @pointerup="onCanvasPointerUp"
              @pointercancel="onCanvasPointerUp"
            ></canvas>
            <div
              v-if="selectedCellStyle"
              class="selected-cell-outline"
              :style="selectedCellStyle"
              aria-hidden="true"
            ></div>
            <svg
              v-if="selectedPolygonPoints"
              class="selected-cell-polygon"
              :viewBox="`0 0 ${PAGE_WIDTH} ${pageHeight}`"
              aria-hidden="true"
            >
              <polygon
                class="polygon-underlay"
                :points="selectedPolygonPoints"
              />
              <polygon
                class="polygon-highlight"
                :points="selectedPolygonPoints"
              />
            </svg>
            <div v-if="!photos.length" class="preview-empty">
              添加照片后，在这里预览排版效果
            </div>
          </div>
        </div>
        <p class="preview-caption">
          在网格内拖动调整取景；拖到另一网格交换照片。点击照片后，可在右侧单独调整。
        </p>
      </section>

      <aside class="layout-controls">
        <section class="ui-card settings-card">
          <h2>排版设置</h2>
          <div class="setting-field">
            <label for="layout-ratio">画布比例</label
            ><select id="layout-ratio" v-model="ratio" class="ui-input">
              <option v-for="(item, key) in ratios" :key="key" :value="key">
                {{ item.label }}
              </option>
            </select>
          </div>
          <LayoutPresetSelect v-model="preset" />
          <div class="setting-field">
            <label for="layout-gap"
              >照片间距 <span>{{ gap }} px</span></label
            ><input
              id="layout-gap"
              v-model.number="gap"
              class="ui-range"
              type="range"
              min="0"
              max="48"
              step="2"
            />
          </div>
          <div class="setting-field">
            <label for="layout-background">背景颜色</label
            ><input
              id="layout-background"
              v-model="background"
              type="color"
              class="color-input"
            />
          </div>
        </section>
        <section class="ui-card crop-card">
          <div class="panel-heading">
            <h2>网格内调整</h2>
            <button
              class="ui-button"
              type="button"
              :disabled="!selectedPhoto"
              @click="resetPhotoCrop"
            >
              重置
            </button>
          </div>
          <p v-if="!selectedPhoto" class="crop-hint">
            添加并选中一张照片后调整。
          </p>
          <template v-else
            ><p class="selected-photo-name" :title="selectedPhoto.name">
              {{ selectedIndex + 1 }} · {{ selectedPhoto.name }}
            </p>
            <div class="setting-field">
              <label for="photo-zoom"
                >缩放
                <span>{{ Math.round(selectedPhoto.zoom * 100) }}%</span></label
              ><input
                id="photo-zoom"
                class="ui-range"
                type="range"
                min="1"
                max="3"
                step="0.05"
                :value="selectedPhoto.zoom"
                @input="
                  updatePhotoCrop(selectedPhoto.id, {
                    zoom: Number($event.target.value),
                  })
                "
              />
            </div>
            <div class="setting-field">
              <label for="photo-crop-x"
                >水平位置
                <span>{{ Math.round(selectedPhoto.cropX * 100) }}%</span></label
              ><input
                id="photo-crop-x"
                class="ui-range"
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="selectedPhoto.cropX"
                @input="
                  updatePhotoCrop(selectedPhoto.id, {
                    cropX: Number($event.target.value),
                  })
                "
              />
            </div>
            <div class="setting-field">
              <label for="photo-crop-y"
                >垂直位置
                <span>{{ Math.round(selectedPhoto.cropY * 100) }}%</span></label
              ><input
                id="photo-crop-y"
                class="ui-range"
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="selectedPhoto.cropY"
                @input="
                  updatePhotoCrop(selectedPhoto.id, {
                    cropY: Number($event.target.value),
                  })
                "
              /></div
          ></template>
        </section>
        <section class="ui-card export-card">
          <h2>导出照片</h2>
          <p>
            根据原始照片尺寸生成 {{ exportSize.width }} ×
            {{ exportSize.height }} px 的 JPG。照片只在浏览器中处理。
          </p>
          <button
            class="ui-button ui-button-primary"
            type="button"
            :disabled="photos.length < 2 || exporting"
            @click="download"
          >
            {{ exporting ? "正在导出…" : "↓ 下载排版照片" }}
          </button>
        </section>
      </aside>
    </div>
  </main>
</template>

<style scoped src="./layout/LayoutWorkspace.css"></style>
