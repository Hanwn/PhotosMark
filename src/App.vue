<script setup>
import PreviewCard from "@/views/PreviewCard.vue";
import PhotoSlide from "@/views/PhotoSlide.vue";
import ParameterArea from "@/views/ParameterArea.vue";
import Download from "@/views/Download.vue";
import Header from "@/views/Header.vue";
import Footer from "@/views/Footer.vue";
</script>

<template>
  <div class="container">
    <Header />
    <main class="workspace">
      <aside class="photo-panel" aria-label="照片库">
        <div class="library-heading"><div><span class="eyebrow">LIBRARY</span><h2>照片库</h2></div><span class="library-format">JPG</span></div>
        <PhotoSlide />
      </aside>
      <section class="workspace-main">
        <div class="section-heading"><div><span class="eyebrow">WORKSPACE</span><h2>照片预览</h2></div><p>拖动水印元素，调整到理想位置</p></div>
        <PreviewCard />
      </section>
      <aside class="workspace-side">
        <ParameterArea />
        <Download />
      </aside>
    </main>
    <div class="footer-wrap">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 1600px; margin: 0 auto; padding: 0 28px; }
.workspace { display: grid; grid-template-columns: 184px minmax(0, 1fr) 340px; gap: 20px; align-items: start; padding: 28px 0 48px; }
.workspace-main, .workspace-side { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
.section-heading { display: flex; justify-content: space-between; align-items: end; gap: 16px; margin-bottom: 16px; }
.section-heading h2 { margin: 4px 0 0; font-size: 18px; letter-spacing: -.02em; }
.section-heading p { margin: 0; color: var(--muted-foreground); font-size: 13px; }
.eyebrow { color: var(--muted-foreground); font-size: 10px; font-weight: 700; letter-spacing: .16em; }
.photo-panel { min-width: 0; position: sticky; top: 18px; border: 1px solid #35363a; background: #222326; color: #f4f4f5; border-radius: 12px; padding: 14px; }
.library-heading { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 14px; }
.library-heading h2 { margin: 3px 0 0; font-size: 15px; font-weight: 650; }
.photo-panel .eyebrow { color: #a1a1aa; }
.library-format { color: #a1a1aa; border: 1px solid #494a4f; border-radius: 4px; padding: 2px 5px; font-size: 10px; }
.workspace-side { position: sticky; top: 18px; max-height: calc(100vh - 36px); overflow-y: auto; scrollbar-width: thin; }
.footer-wrap { border-top: 1px solid var(--border); }
@media (max-width: 1180px) { .workspace { grid-template-columns: 174px minmax(0, 1fr); } .workspace-side { grid-column: 2; position: static; max-height: none; overflow: visible; } }
@media (max-width: 700px) { .container { padding: 0 14px; } .workspace { grid-template-columns: minmax(0, 1fr); padding-top: 20px; gap: 18px; } .photo-panel { position: static; } .workspace-side { grid-column: 1; } .section-heading { align-items: start; } .section-heading p { max-width: 130px; text-align: right; } }
</style>
