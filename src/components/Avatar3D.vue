<template>
  <div class="avatar-container" :style="{ height: height }">
    <TresCanvas :camera="{ position: cameraPosition, fov: 45 }">
      <TresPerspectiveCamera :position="cameraPosition" />
      <OrbitControls v-if="showControls" />
      <TresAmbientLight :intensity="0.8" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="1.2" />

      <!-- 地面网格 -->
      <TresMesh v-if="showGround" :position="[0, -1, 0]" :rotation="[-Math.PI / 2, 0, 0]">
        <TresPlaneGeometry :args="[10, 10]" />
        <TresMeshBasicMaterial color="#f0f0f0" :wireframe="true" :opacity="0.3" transparent />
      </TresMesh>

      <Suspense>
        <template #default>
          <AvatarModel
            :scale="initialScale"
            :position="initialPosition"
            :mode="mode"
            :model-url="modelUrl"
            @loaded="handleModelLoaded"
            @error="handleModelError"
          />
        </template>
        <template #fallback>
          <TresMesh :position="initialPosition" :scale="initialScale">
            <TresBoxGeometry :args="[1, 2, 0.5]" />
            <TresMeshStandardMaterial color="#cccccc" />
          </TresMesh>
        </template>
      </Suspense>
    </TresCanvas>

    <!-- 加载提示 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在加载3D虚拟形象...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import AvatarModel from './AvatarModel.vue'

// Props定义
const props = defineProps({
  mode: {
    type: String,
    default: 'full',
  },
  height: {
    type: String,
    default: '600px',
  },
  showControls: {
    type: Boolean,
    default: true,
  },
  showGround: {
    type: Boolean,
    default: false,
  },
  initialScale: {
    type: Number,
    default: 1.0,
  },
  initialPosition: {
    type: Array,
    default: () => [0, 0, 0],
  },
  modelUrl: {
    type: String,
    default: 'https://models.readyplayer.me/683e4e978bc98dc94b73ae87.glb',
  },
})

const isLoading = ref(true)

// 根据模式计算摄像机位置
const cameraPosition = computed(() => {
  switch (props.mode) {
    case 'decorative':
      return [0, 1.2, 2.5]
    case 'simple':
      return [0, 1.5, 3]
    case 'full':
    default:
      return [0, 1.5, 4]
  }
})

// 监听加载状态
const handleModelLoaded = () => {
  isLoading.value = false
  console.log('3D虚拟形象已加载完成')
}

const handleModelError = error => {
  isLoading.value = false
  console.error('3D虚拟形象加载失败:', error)
}
</script>

<style scoped>
.avatar-container {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
}

canvas {
  display: block;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  font-size: 1rem;
  text-align: center;
  margin: 0;
}
</style>
