<template>
  <div
    v-if="show"
    class="lens"
    :style="lensStyle"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  img: string
  x: number
  y: number
  imgWidth: number
  imgHeight: number
  show: boolean
  lensSize?: number
  transition?: string
}>()

const lensSize = computed(() => props.lensSize ?? 120)
const zoom = 2

const lensStyle = computed(() => ({
  left: `${props.x - lensSize.value / 2}px`,
  top: `${props.y - lensSize.value / 2}px`,
  width: `${lensSize.value}px`,
  height: `${lensSize.value}px`,
  backgroundImage: `url(${props.img})`,
  backgroundPosition: `-${props.x * zoom - lensSize.value / 2}px -${props.y * zoom - lensSize.value / 2}px`,
  backgroundSize: `${props.imgWidth * zoom}px ${props.imgHeight * zoom}px`,
  transition: props.transition ?? 'left 0.13s cubic-bezier(.4,1.6,.6,1), top 0.13s cubic-bezier(.4,1.6,.6,1)'
}))
</script>

<style scoped>
.lens {
  position: absolute;
  border-radius: 50%;
  /* border: 2px solid #fff; */
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  pointer-events: none;
  z-index: 10;
  background-repeat: no-repeat;
}
</style> 