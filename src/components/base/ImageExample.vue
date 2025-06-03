<!-- ImageExample.vue 图片示例组件 -->
<template>
  <div class="image-examples">
    <!-- 1. 基础图片展示 -->
    <div class="image-section">
      <h2>基础图片展示</h2>
      <img src="@/assets/images/photos/example.jpg" alt="示例图片" class="basic-image" />
    </div>

    <!-- 2. 响应式图片 -->
    <div class="image-section">
      <h2>响应式图片</h2>
      <img
        :src="require('@/assets/images/photos/example.jpg')"
        alt="响应式图片"
        class="responsive-image"
      />
    </div>

    <!-- 3. 懒加载图片 -->
    <div class="image-section">
      <h2>懒加载图片</h2>
      <img
        v-lazy="require('@/assets/images/photos/example.jpg')"
        alt="懒加载图片"
        class="lazy-image"
      />
    </div>

    <!-- 4. 背景图片 -->
    <div class="image-section">
      <h2>背景图片</h2>
      <div class="background-image" :style="{ backgroundImage: `url(${backgroundImage})` }">
        背景图片内容
      </div>
    </div>

    <!-- 5. 图片预览 -->
    <div class="image-section">
      <h2>图片预览</h2>
      <div class="image-preview" @click="showPreview">
        <img :src="previewImage" alt="预览图片" class="preview-thumbnail" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 背景图片
const backgroundImage = new URL('@/assets/images/backgrounds/example-bg.jpg', import.meta.url).href

// 预览图片
const previewImage = new URL('@/assets/images/photos/example.jpg', import.meta.url).href

// 预览方法
const showPreview = () => {
  // 这里可以实现图片预览逻辑
  console.log('显示图片预览')
}
</script>

<style scoped>
.image-examples {
  padding: 20px;
}

.image-section {
  margin-bottom: 30px;
}

.basic-image {
  max-width: 100%;
  height: auto;
}

.responsive-image {
  width: 100%;
  max-width: 500px;
  height: auto;
}

.background-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.preview-thumbnail {
  width: 200px;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.preview-thumbnail:hover {
  transform: scale(1.05);
}
</style>
