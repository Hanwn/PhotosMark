<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { presets } from "@/layout/presets";

const props = defineProps({ modelValue: { type: String, required: true } });
const emit = defineEmits(["update:modelValue"]);
const open = ref(false);
const picker = ref(null);
const trigger = ref(null);
const selected = computed(
  () => presets.find((item) => item.id === props.modelValue) || presets[0],
);

async function openMenu() {
  open.value = true;
  await nextTick();
  focusOption(presets.findIndex((item) => item.id === props.modelValue));
}
function focusOption(index) {
  const options = picker.value?.querySelectorAll('[role="option"]');
  options?.[Math.max(0, Math.min(index, options.length - 1))]?.focus();
}
function choose(id) {
  emit("update:modelValue", id);
  open.value = false;
  trigger.value?.focus();
}
function onKeydown(event) {
  if (event.key === "Escape" && open.value) {
    event.preventDefault();
    open.value = false;
    trigger.value?.focus();
  } else if (
    open.value &&
    ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
  ) {
    event.preventDefault();
    const options = [...picker.value.querySelectorAll('[role="option"]')];
    const current = options.indexOf(document.activeElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
        ? options.length - 1
        : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
          options.length;
    options[next]?.focus();
  }
}
function onOutsidePointer(event) {
  if (!picker.value?.contains(event.target)) open.value = false;
}
onMounted(() => document.addEventListener("pointerdown", onOutsidePointer));
onBeforeUnmount(() =>
  document.removeEventListener("pointerdown", onOutsidePointer),
);
</script>

<template>
  <div class="setting-field">
    <span id="layout-preset-label" class="field-label">布局预设</span>
    <div ref="picker" class="preset-picker" @keydown="onKeydown">
      <button
        id="layout-preset-trigger"
        ref="trigger"
        type="button"
        class="preset-trigger ui-input"
        aria-haspopup="listbox"
        :aria-expanded="open"
        aria-controls="layout-preset-options"
        aria-labelledby="layout-preset-label layout-preset-value"
        @click="open ? (open = false) : openMenu()"
        @keydown.down.prevent="openMenu"
        @keydown.up.prevent="openMenu"
      >
        <svg viewBox="0 0 64 44" aria-hidden="true">
          <rect
            v-for="(cell, index) in selected.preview"
            :key="index"
            :x="cell[0]"
            :y="cell[1]"
            :width="cell[2]"
            :height="cell[3]"
            rx="2"
          />
          <polygon
            v-for="(points, index) in selected.previewPolygons || []"
            :key="`p-${index}`"
            :points="points"
          />
        </svg>
        <span id="layout-preset-value">{{ selected.name }}</span
        ><span class="preset-chevron" aria-hidden="true">⌄</span>
      </button>
      <div
        v-if="open"
        id="layout-preset-options"
        class="preset-menu"
        role="listbox"
        aria-labelledby="layout-preset-label"
      >
        <button
          v-for="item in presets"
          :key="item.id"
          type="button"
          role="option"
          class="preset-menu-option"
          :aria-selected="modelValue === item.id"
          @click="choose(item.id)"
        >
          <svg viewBox="0 0 64 44" aria-hidden="true">
            <rect
              v-for="(cell, index) in item.preview"
              :key="index"
              :x="cell[0]"
              :y="cell[1]"
              :width="cell[2]"
              :height="cell[3]"
              rx="2"
            />
            <polygon
              v-for="(points, index) in item.previewPolygons || []"
              :key="`p-${index}`"
              :points="points"
            />
          </svg>
          <span>{{ item.name }}</span
          ><span
            v-if="modelValue === item.id"
            class="preset-check"
            aria-hidden="true"
            >✓</span
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setting-field {
  display: grid;
  gap: 8px;
}
.field-label {
  font-size: 12px;
  font-weight: 600;
}
.preset-picker {
  position: relative;
}
.preset-trigger {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 2px 8px;
  text-align: left;
  cursor: pointer;
}
.preset-trigger svg,
.preset-menu-option svg {
  flex: none;
  width: 42px;
  height: 30px;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--muted);
  fill: var(--muted-foreground);
}
.preset-trigger > span:nth-child(2) {
  flex: 1;
}
.preset-chevron {
  color: var(--muted-foreground);
  font-size: 18px;
  line-height: 1;
}
.preset-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  max-height: min(52vh, 390px);
  overflow-y: auto;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  box-shadow: 0 12px 30px #0002;
}
.preset-menu-option {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 5px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--foreground);
  text-align: left;
  font-size: 12px;
}
.preset-menu-option:hover,
.preset-menu-option:focus-visible,
.preset-menu-option[aria-selected="true"] {
  background: var(--muted);
}
.preset-menu-option:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: -2px;
}
.preset-check {
  margin-left: auto;
}
</style>
