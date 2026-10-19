<script setup>
import { computed, ref } from "vue";
import { defineRender } from "@/store/defineRender";
import { uid2Src } from "@/store/defineImg";
import { allCanvasConfigMap, defineCanvasConfig } from "@/store/defineCanvasConfig";
import { PreviewRender, SelectIcon } from "@/themes/renderReouter";
import { requestNotifyStatus } from "@/utils/notify";
import { getTheme, getThemeOptions } from "@/themes/registry";
import { themeIdx } from "@/store/defineThemes";
import ThemeOptionControl from "@/themes/ThemeOptionControl.vue";

const { currentRenderUid, unMarshal, parameterDisable } = defineRender();
const canvasConfigs = defineCanvasConfig();
const selectedIcon = ref("");
const currentTheme = computed(() => getTheme(themeIdx.value));
const visibleFields = computed(() => (currentTheme.value.fields || [])
  .map((field) => ({ ...field, config: canvasConfigs[field.key] }))
  .filter((field) => field.config));
const themeOptions = computed(() => getThemeOptions(currentRenderUid.value, currentTheme.value));
const appearanceOptions = computed(() => (currentTheme.value.options || []).filter((option) => option.section !== "icon"));
const iconOptions = computed(() => (currentTheme.value.options || []).filter((option) => option.section === "icon"));
const activeTab = ref("appearance");
const tabs = computed(() => [
  { key: "appearance", label: "外观", visible: Boolean(currentTheme.value.appearance?.length || appearanceOptions.value.length) },
  { key: "text", label: "文字", visible: Boolean(visibleFields.value.length) },
  { key: "icon", label: "Logo", visible: Boolean(currentTheme.value.iconPicker || iconOptions.value.length) },
].filter((tab) => tab.visible));
const currentTab = computed(() => tabs.value.some((tab) => tab.key === activeTab.value)
  ? activeTab.value : tabs.value[0]?.key);

function reset() {
  const uid = currentRenderUid.value;
  if (uid !== 0 && allCanvasConfigMap.has(uid) && uid2Src.has(uid)) {
    delete uid2Src.get(uid).themeOptions?.[currentTheme.value.id];
    PreviewRender(uid);
    unMarshal(uid);
  }
}
function optionValue(option) {
  return themeOptions.value?.[option.key]
    ?? (option.target ? canvasConfigs[option.target]?.[option.property] : option.defaultValue);
}
function setOption(option, value) {
  const options = themeOptions.value;
  if (!options) return;
  const previousValue = options[option.key] ?? option.defaultValue;
  if (option.type === "number") {
    options[option.key] = Math.min(option.max ?? Infinity, Math.max(option.min ?? -Infinity, value));
  } else {
    options[option.key] = value;
  }
  if (option.target) canvasConfigs[option.target][option.property] = options[option.key];
  option.apply?.(options[option.key], previousValue);
}
async function selectIcon() {
  if (!selectedIcon.value) return;
  try { await SelectIcon(selectedIcon.value); }
  catch (error) { requestNotifyStatus("图标加载失败", "error"); }
}
function toggleBold(config) { config.fontStyle = config.fontStyle.includes("bold") ? "normal" : "bold"; }
function normalizeFontSize(config) { config.fontSize = Math.max(1, Math.round(Number(config.fontSize) || 1)); }
</script>

<template>
  <section class="ui-card settings-panel">
    <div class="panel-head"><div><span class="eyebrow">CUSTOMIZE</span><h2>水印设置</h2></div><button class="ui-button" :disabled="parameterDisable" @click="reset">重置</button></div>
    <p v-if="parameterDisable" class="panel-description empty-settings">添加照片后，这里会显示对应主题的外观和参数设置。</p>
    <template v-else>
      <div class="settings-tabs" role="tablist" aria-label="水印设置分类"><button v-for="tab in tabs" :key="tab.key" :id="`settings-tab-${tab.key}`" type="button" role="tab" :aria-selected="currentTab === tab.key" :aria-controls="`settings-panel-${tab.key}`" :class="{ active: currentTab === tab.key }" @click="activeTab = tab.key">{{ tab.label }}</button></div>
      <div v-if="currentTab === 'appearance'" id="settings-panel-appearance" role="tabpanel" aria-labelledby="settings-tab-appearance" class="tab-content">
        <div v-if="currentTheme.appearance?.length" class="setting-section"><h3>外观 · {{ currentTheme.name }}</h3><ThemeOptionControl v-for="option in currentTheme.appearance" :key="option.key" id-prefix="appearance" :option="option" :value="optionValue(option)" @change="setOption(option, $event)" /></div>
        <div v-if="currentTheme.appearance?.length && appearanceOptions.length" class="divider"></div>
        <div v-if="appearanceOptions.length" class="setting-section"><h3>{{ currentTheme.name }}主题设置</h3><ThemeOptionControl v-for="option in appearanceOptions" :key="option.key" :option="option" :value="optionValue(option)" @change="setOption(option, $event)" /></div>
      </div>
      <div v-else-if="currentTab === 'text'" id="settings-panel-text" role="tabpanel" aria-labelledby="settings-tab-text" class="tab-content setting-section"><div v-for="field in visibleFields" :key="field.key" class="field"><label>{{ field.label }}</label><input v-model="field.config.text" class="ui-input" :disabled="parameterDisable" :placeholder="field.placeholder" /><div class="field-tools"><label class="color-tool" title="文字颜色"><input v-model="field.config.fill" type="color" :disabled="parameterDisable" /><span>颜色</span></label><label class="size-tool">字号<input v-model.number="field.config.fontSize" class="ui-input" type="number" min="1" step="1" :disabled="parameterDisable" @change="normalizeFontSize(field.config)" /></label><button class="ui-button bold-button" :aria-pressed="field.config.fontStyle.includes('bold')" :disabled="parameterDisable" @click="toggleBold(field.config)">B</button></div></div></div>
      <div v-else-if="currentTab === 'icon'" id="settings-panel-icon" role="tabpanel" aria-labelledby="settings-tab-icon" class="tab-content setting-section"><div v-if="currentTheme.iconPicker" class="field"><label class="field-label" for="icon-select">品牌</label><select id="icon-select" v-model="selectedIcon" class="ui-input" :disabled="parameterDisable" @change="selectIcon"><option value="">选择图标</option><option v-for="icon in currentTheme.icons || []" :key="icon.src" :value="icon.src">{{ icon.label }}</option></select></div><ThemeOptionControl v-for="option in iconOptions" :key="option.key" id-prefix="icon" :option="option" :value="optionValue(option)" @change="setOption(option, $event)" /></div>
    </template>
  </section>
</template>

<style scoped>
.settings-panel { padding: 18px; }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.panel-head h2 { margin: 4px 0 0; font-size: 18px; letter-spacing: -.02em; }
.panel-description { margin: 12px 0 0; color: var(--muted-foreground); font-size: 12px; line-height: 1.6; }
.empty-settings { padding: 28px 0 8px; text-align: center; }
.settings-tabs { display: flex; gap: 3px; margin-top: 16px; padding: 3px; border: 1px solid var(--border); border-radius: 8px; background: var(--muted); }
.settings-tabs button { flex: 1; min-width: 0; height: 32px; padding: 0 6px; border: 0; border-radius: 5px; background: transparent; color: var(--muted-foreground); font-size: 12px; font-weight: 600; }
.settings-tabs button.active { background: var(--card); color: var(--foreground); box-shadow: 0 1px 3px #00000012; }
.settings-tabs button:focus-visible { outline: 2px solid #a1a1aa; outline-offset: 1px; }
.tab-content { min-height: 96px; padding-top: 18px; }
.divider { height: 1px; background: var(--border); margin: 18px 0; }
.setting-section { display: grid; gap: 12px; }
.setting-section h3 { margin: 0 0 2px; font-size: 13px; font-weight: 650; }
.field { display: grid; gap: 8px; }
.field > label, .field-label { font-size: 12px; font-weight: 600; }
.field-tools { display: flex; gap: 8px; align-items: center; }
.color-tool, .size-tool { display: flex; align-items: center; gap: 6px; color: var(--muted-foreground); font-size: 11px; }
.color-tool input { width: 36px; height: 35px; padding: 3px; border: 1px solid var(--border); border-radius: 7px; background: var(--card); }
.size-tool { margin-left: auto; }
.size-tool input { width: 86px; min-width: 86px; padding-right: 8px; text-align: right; appearance: textfield; }
.size-tool input::-webkit-inner-spin-button, .size-tool input::-webkit-outer-spin-button { appearance: none; margin: 0; }
.bold-button { width: 36px; padding: 0; font-weight: 700; }
.bold-button[aria-pressed="true"] { background: var(--muted); border-color: #a1a1aa; }
.ui-range { margin: 0; }
</style>
