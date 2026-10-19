<script setup>
import GitHubIcon from "./GitHubIcon.vue";
</script>

<template>
  <footer class="footer"><span>PhotosMark · 照片水印工具</span><div><a href="https://github.com/Hanwn/PhotoMark" target="_blank" rel="noopener noreferrer" aria-label="在 GitHub 查看项目" title="GitHub"><GitHubIcon /></a><a href="https://www.buymeacoffee.com/hanwn7721n" target="_blank" rel="noopener noreferrer">支持项目</a></div></footer>
</template>

<style scoped>
.footer { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 24px 0 32px; font-size: 12px; line-height: 1.5; color: var(--muted-foreground); }
.footer div { display: flex; align-items: center; gap: 18px; white-space: nowrap; }
.footer a { color: inherit; text-decoration: none; }
.footer a:hover { color: var(--foreground); }
.footer a:first-child { display: inline-flex; align-items: center; }
@media (max-width: 650px) { .footer { flex-direction: column; text-align: center; gap: 10px; } .footer div { justify-content: center; } }
</style>
