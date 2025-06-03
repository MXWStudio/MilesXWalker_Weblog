<template>
  <TresGroup v-if="model" :position="position" :scale="scale">
    <primitive :object="model.scene" />
  </TresGroup>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useGLTF } from '@tresjs/cientos'

// Props定义
const props = defineProps({
  scale: {
    type: Number,
    default: 1.0,
  },
  position: {
    type: Array,
    default: () => [0, 0, 0],
  },
  mode: {
    type: String,
    default: 'full',
  },
  modelUrl: {
    type: String,
    default: 'https://models.readyplayer.me/683e4e978bc98dc94b73ae87.glb',
  },
})

// 模型加载状态
const model = ref(null)
const isLoading = ref(true)

// 发射事件给父组件
const emit = defineEmits(['loaded', 'error'])

// 加载3D模型的函数
const loadModel = async () => {
  try {
    console.log('开始加载3D虚拟形象...', props.modelUrl)
    isLoading.value = true

    // 使用useGLTF加载模型
    const gltf = await useGLTF(props.modelUrl)

    if (gltf && gltf.scene) {
      // 优化模型渲染
      gltf.scene.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true

          // 确保材质正确
          if (child.material) {
            child.material.needsUpdate = true
          }
        }
      })

      // 根据模式调整模型
      switch (props.mode) {
        case 'decorative':
          gltf.scene.scale.setScalar(0.8)
          break
        case 'simple':
          gltf.scene.scale.setScalar(1.0)
          break
        case 'full':
        default:
          gltf.scene.scale.setScalar(1.0)
          break
      }

      model.value = gltf
      isLoading.value = false
      emit('loaded', gltf)
      console.log('3D虚拟形象加载成功！', gltf)
    } else {
      throw new Error('模型场景数据无效')
    }
  } catch (error) {
    console.error('3D虚拟形象加载失败:', error)
    isLoading.value = false
    emit('error', error)
  }
}

// 组件挂载时加载模型
onMounted(() => {
  loadModel()
})

// 监听modelUrl变化，重新加载模型
watch(
  () => props.modelUrl,
  () => {
    if (props.modelUrl) {
      model.value = null
      loadModel()
    }
  }
)
</script>

<style scoped>
/* AvatarModel组件无需额外样式 */
</style>
