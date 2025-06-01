<!-- 照片作品页，原Photos.vue内容迁移于此 -->
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
      <h3 class="gallery-title">More moments</h3>
      <div class="gallery-grid">
        <div
          v-for="image in galleryImages"
          :key="image.id"
          class="gallery-item"
          @click="openLightbox(image.src)"
        >
          <img :src="image.src" :alt="image.alt" loading="lazy" />
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
import photoPreviews from '@/assets/images/photos/photo_previews.png';
import img1 from '@/assets/images/photos/photowork/lotus leaf.jpeg';
import img2 from '@/assets/images/photos/photowork/_DSC7941.jpeg';
import img3 from '@/assets/images/photos/photowork/swan.jpeg';
import img4 from '@/assets/images/photos/photowork/flow.jpeg';
import img5 from '@/assets/images/photos/photowork/black.jpeg';
import img6 from '@/assets/images/photos/photowork/limb.jpeg';
import img7 from '@/assets/images/photos/photowork/chrysanthemum.jpeg';
import img8 from '@/assets/images/photos/photowork/boat.jpeg';
import img9 from '@/assets/images/photos/photowork/portraits.jpeg';
import img10 from '@/assets/images/photos/photowork/Coffee.jpeg';
import img11 from '@/assets/images/photos/photowork/Coffee2.jpeg';

// --- 响应式数据 ---
const featuredImage = ref({
  id: 'featured-01',
  src: photoPreviews,
  alt: '主预览大图',
  title: 'Early Morning Blues',
  description: '凌晨四点，城市还没醒',
});

const galleryImages = ref([
  { id: 'img1', src: img1, alt: 'lotus leaf' },
  { id: 'img2', src: img2, alt: '_DSC7941' },
  { id: 'img3', src: img3, alt: 'swan' },
  { id: 'img4', src: img4, alt: 'flow' },
  { id: 'img5', src: img5, alt: 'black' },
  { id: 'img6', src: img6, alt: 'limb' },
  { id: 'img7', src: img7, alt: 'chrysanthemum' },
  { id: 'img8', src: img8, alt: 'boat' },
  { id: 'img9', src: img9, alt: 'portraits' },
  { id: 'img10', src: img10, alt: 'Coffee' },
  { id: 'img11', src: img11, alt: 'Coffee2' },
]);

const lightbox = ref({
  visible: false,
  currentImageSrc: '',
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
/* ...原Photos.vue样式全部复制... */
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

/* 2. 画廊区域 - Pinterest瀑布流布局 */
.gallery-section {
  max-width: 1300px;
  margin: 40px auto 0;
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
  column-count: 3;
  column-gap: 24px;
  width: 100%;
}
@media (max-width: 1100px) {
  .gallery-grid {
    column-count: 2;
  }
}
@media (max-width: 700px) {
  .gallery-grid {
    column-count: 1;
  }
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 24px;
  background-color: #e0e0e0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.gallery-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.gallery-item img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: opacity 0.4s;
  border-radius: 10px;
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
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
  margin: 0 auto;
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

.footer-copyright {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.45); /* 版权文字颜色更淡 */
  letter-spacing: 0.3px;
}

.footer-copyright p {
  margin: 0;
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
    column-count: 1;
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