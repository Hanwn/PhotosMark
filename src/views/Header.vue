<script setup>
import { ref } from "vue";
import GitHubIcon from "./GitHubIcon.vue";

const colorMode = ref(document.documentElement.dataset.theme || "light");

function toggleColorMode() {
  colorMode.value = colorMode.value === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = colorMode.value;
  try { localStorage.setItem("photosmark-theme", colorMode.value); } catch { /* Storage may be unavailable. */ }
}
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/" aria-label="PhotosMark 首页"><span class="brand-mark">◩</span><span>PhotosMark</span></a>
    <div class="header-right"><span class="header-tag">纯前端 · 本地处理</span><button class="ui-button icon-button" type="button" :aria-label="colorMode === 'dark' ? '切换到日间模式' : '切换到暗色模式'" :title="colorMode === 'dark' ? '日间模式' : '暗色模式'" @click="toggleColorMode"><svg v-if="colorMode === 'dark'" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg><svg v-else viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg></button><a class="ui-button icon-button" href="https://github.com/Hanwn/PhotoMark" target="_blank" rel="noopener noreferrer" aria-label="在 GitHub 查看项目" title="GitHub"><GitHubIcon /></a></div>
  </header>
</template>

<style scoped>
.site-header { height: 68px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
.brand { display: inline-flex; align-items: center; gap: 10px; color: var(--foreground); text-decoration: none; font-size: 18px; font-weight: 750; letter-spacing: -.04em; }
.brand-mark { width: 29px; height: 29px; border-radius: 8px; display: inline-grid; place-items: center; background: var(--foreground); color: var(--background); font-size: 21px; line-height: 1; }
.header-right { display: flex; align-items: center; gap: 14px; }
.header-right a { text-decoration: none; }
.icon-button { width: 36px; padding: 0; }
.header-tag { font-size: 12px; color: var(--muted-foreground); }
@media(max-width: 650px) { .site-header { height: 60px; } .header-tag { display: none; } }
</style>
