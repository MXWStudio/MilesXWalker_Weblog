<template>
  <div class="photo-detail-page">
    <section class="featured-image-section">
      <img :src="featuredImage.src" :alt="featuredImage.alt" class="featured-image" @click="openLightbox(featuredImage.src)"/>
      <div class="featured-image-caption">
        <h2>{{ featuredImage.title }}</h2>
        <p>{{ featuredImage.description }}</p>
      </div>
    </section>

    <section class="gallery-section">
      <h3 class="gallery-title">更多精彩瞬间</h3>
      <div class="gallery-grid">
        <div
          v-for="image in galleryImages"
          :key="image.id"
          class="gallery-item"
          @click="openLightbox(image.src)"
        >
          <img :src="image.src" :alt="image.alt" :style="{ height: image.displayHeight }" />
        </div>
      </div>
    </section>

    <div v-if="lightbox.visible" class="lightbox-overlay" @click.self="closeLightbox">
      <div class="lightbox-content">
        <img :src="lightbox.currentImageSrc" alt="放大的图片" class="lightbox-image" />
        <button @click="closeLightbox" class="lightbox-close-btn" aria-label="关闭">
          &times;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// --- 响应式数据 ---
const featuredImage = ref({
  id: 'featured-01',
  src: 'https://placehold.co/1200x700/2c3e50/ffffff?text=特色大图&font=roboto',
  alt: '特色展示图片',
  title: '山峦之巅的日出',
  description: '清晨的第一缕阳光洒在连绵起伏的山脉上，云海翻腾，如梦似幻。',
});

const galleryImages = ref([]);
const NUM_GALLERY_IMAGES = 9; // 画廊图片数量

const lightbox = ref({
  visible: false,
  currentImageSrc: '',
});

// --- 工具函数 ---
const getRandomHeight = (min = 200, max = 500) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- 生命周期钩子 ---
onMounted(() => {
  // 生成画廊图片数据
  for (let i = 0; i < NUM_GALLERY_IMAGES; i++) {
    const width = 400; // 假设小图的基础宽度
    const height = getRandomHeight(250, 600); // 随机高度
    galleryImages.value.push({
      id: `gallery-${i}-${Date.now()}`,
      // 使用 picsum.photos 生成不同尺寸的图片
      src: `https://picsum.photos/seed/${Math.random()}/${width}/${height}`,
      alt: `画廊图片 ${i + 1}`,
      displayHeight: `${getRandomHeight(150, 400)}px`, // 用于CSS的随机高度
    });
  }
});

// --- 方法 ---
const openLightbox = (imageSrc) => {
  lightbox.value.currentImageSrc = imageSrc;
  lightbox.value.visible = true;
  document.body.style.overflow = 'hidden'; // 禁止背景滚动
};

const closeLightbox = () => {
  lightbox.value.visible = false;
  lightbox.value.currentImageSrc = '';
  document.body.style.overflow = ''; // 恢复背景滚动
};
</script>

<style scoped>
.photo-detail-page {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f8f9fa; /* 淡雅的背景色 */
  padding-bottom: 50px; /* 给底部一些空间 */
}

/* 1. 特色大图区域 */
.featured-image-section {
  position: relative; /* 为了文字说明的定位 */
  width: 100%;
  max-height: 80vh; /* 限制最大高度，避免过大 */
  overflow: hidden; /* 确保图片不超出容器 */
  background-color: #e9ecef; /* 图片加载前的占位背景 */
}

.featured-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 裁剪并填充，保持宽高比 */
  cursor: pointer;
  transition: transform 0.3s ease-out;
}
.featured-image:hover {
  transform: scale(1.03);
}

.featured-image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
  color: #fff;
  padding: 40px 30px 20px; /* 增加底部padding */
  box-sizing: border-box;
}

.featured-image-caption h2 {
  font-size: 2.2em;
  margin: 0 0 10px 0;
  font-weight: 500;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

.featured-image-caption p {
  font-size: 1em;
  margin: 0;
  line-height: 1.6;
  max-width: 800px; /* 限制描述文字宽度 */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
}

/* 2. 画廊区域 */
.gallery-section {
  max-width: 1300px; /* 画廊内容最大宽度 */
  margin: 40px auto 0; /* 顶部间距 */
  padding: 0 20px;
}

.gallery-title {
  font-size: 1.8em;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 400;
}

.gallery-grid {
  display: grid;
  /* 响应式列数：小屏幕1列，中等屏幕2列，大屏幕3列 */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px; /* 图片间距 */
}

.gallery-item {
  background-color: #e0e0e0; /* 图片加载时的占位背景 */
  overflow: hidden; /* 确保图片圆角和悬停效果 */
  border-radius: 8px; /* 轻微圆角 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.gallery-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.gallery-item img {
  display: block;
  width: 100%;
  /* height 通过 :style 动态设置 */
  object-fit: cover; /* 裁剪并填充，保持宽高比 */
  transition: opacity 0.4s ease-in-out;
}

/* 3. Lightbox 弹窗 */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85); /* 深色半透明背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000; /* 确保在最顶层 */
  padding: 20px;
  box-sizing: border-box;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-content {
  position: relative;
  max-width: 90vw;  /* 图片最大宽度为视口宽度的90% */
  max-height: 90vh; /* 图片最大高度为视口高度的90% */
  display: flex; /* 用于内部图片对齐 */
  align-items: center;
  justify-content: center;
  animation: scaleUp 0.3s ease-out;
}

@keyframes scaleUp {
  from { transform: scale(0.8); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
}

.lightbox-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 完整显示图片，保持宽高比 */
  border-radius: 4px; /* 轻微圆角 */
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
}

.lightbox-close-btn {
  position: absolute;
  top: -10px; /* 调整到内容框外部 */
  right: -10px; /* 调整到内容框外部 */
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 24px;
  line-height: 36px; /* 使 "×" 垂直居中 */
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: background-color 0.2s ease, transform 0.2s ease;
  z-index: 2001; /* 确保在图片之上 */
}

.lightbox-close-btn:hover {
  background-color: #fff;
  transform: scale(1.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .featured-image-caption h2 {
    font-size: 1.8em;
  }
  .featured-image-caption p {
    font-size: 0.9em;
  }
  .gallery-title {
    font-size: 1.5em;
  }
  .gallery-grid {
    /* 小屏幕上，minmax的最小值可以小一些，或者直接设为1fr */
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
  }
  .lightbox-close-btn {
    width: 32px;
    height: 32px;
    font-size: 20px;
    line-height: 32px;
    top: 5px; /* 在小屏幕上，关闭按钮可能更适合在图片区域内 */
    right: 5px;
    background-color: rgba(0,0,0,0.5);
    color: white;
  }
   .lightbox-close-btn:hover {
    background-color: rgba(0,0,0,0.7);
   }
}
</style>
