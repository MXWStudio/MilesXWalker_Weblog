<template>
  <div class="ai-wrapper">
    <div class="ai-card">
      <div class="ai-bg">
        <Rays />
        <Beams />
      </div>
      <div class="ai-content">
        <div class="ai-img-lens-wrapper" ref="imgWrapperRef" @mousemove="onMouseMove" @mouseleave="onMouseLeave" @mouseenter="onMouseEnter">
          <img
            ref="imgRef"
            :src="imgSrc"
            alt="image"
            class="ai-img"
            width="520"
            height="400"
            :class="{ 'ai-img-zoom': imgZoom }"
          />
          <Lens
            :img="imgSrc"
            :x="lensX"
            :y="lensY"
            :imgWidth="imgWidth"
            :imgHeight="imgHeight"
            :show="showLens"
            :lens-size="220"
            :transition="'left 0.13s cubic-bezier(.4,1.6,.6,1), top 0.13s cubic-bezier(.4,1.6,.6,1)'"
          />
        </div>
        <div class="ai-text" :style="{ filter: showLens ? 'blur(4px)' : 'none' }">
          <h2>Apple Vision Pro</h2>
          <p>
            The all new apple vision pro was the best thing that happened around 8 months ago, not anymore.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Rays from "/Users/neo/MXWStudio/MilesXWalkerStudio_vue3.js_frame_inspiraUi/src/components/ui/templates/Rays.vue";
import Beams from "/Users/neo/MXWStudio/MilesXWalkerStudio_vue3.js_frame_inspiraUi/src/components/ui/templates/Beams.vue";
import Lens from "/Users/neo/MXWStudio/MilesXWalkerStudio_vue3.js_frame_inspiraUi/src/components/ui/templates/Lens.vue";

const imgSrc = "https://images.unsplash.com/photo-1713869820987-519844949a8a?q=80&w=3500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const imgRef = ref<HTMLImageElement | null>(null)
const imgWrapperRef = ref<HTMLDivElement | null>(null)
const showLens = ref(false)
const lensX = ref(0)
const lensY = ref(0)
const imgWidth = ref(0)
const imgHeight = ref(0)
const imgZoom = ref(false)
let zoomedOnce = false

function onMouseMove(e: MouseEvent) {
  if (!imgRef.value) return
  const rect = imgRef.value.getBoundingClientRect()
  lensX.value = e.clientX - rect.left
  lensY.value = e.clientY - rect.top
  imgWidth.value = rect.width
  imgHeight.value = rect.height
  showLens.value =
    lensX.value > 0 && lensY.value > 0 && lensX.value < rect.width && lensY.value < rect.height
}
function onMouseLeave() {
  showLens.value = false
  zoomedOnce = false
}
function onMouseEnter() {
  if (!zoomedOnce) {
    imgZoom.value = true
    zoomedOnce = true
    setTimeout(() => {
      imgZoom.value = false
    }, 320)
  }
}
</script>

<style scoped>
.ai-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1D2235 0%, #121318 100%);
}
.ai-card {
  position: relative;
  width: 540px;
  padding: 32px 24px;
  border-radius: 32px;
  background: rgba(30, 30, 40, 0.95);
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  overflow: hidden;
}
.ai-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.ai-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ai-img-lens-wrapper {
  position: relative;
  width: 520px;
  height: 400px;
  margin: 0 auto;
}
.ai-img {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 24px;
  transition: transform 0.33s cubic-bezier(.4,1.6,.6,1);
}
.ai-img-zoom {
  transform: scale(1.04);
}
.ai-text {
  margin-top: 24px;
  color: #fff;
  text-align: center;
}
.ai-text h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 12px;
}
.ai-text p {
  color: #e0e0e0;
}
.vision-card-content {
  width: 540px;
  padding: 0;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1.5px solid rgba(255,255,255,0.28);
}
</style>