<!-- 照片作品展示页面，采用响应式设计，包含特色大图和瀑布流画廊 -->
<template>
  <div class="photo-detail-page">
    <!-- 特色大图区域：展示主要照片，带有标题和描述 -->
    <section class="featured-image-section">
      <img
        :src="featuredImage.src"
        :alt="featuredImage.alt"
        class="featured-image"
        @click="openLightbox(featuredImage.src)"
      />
      <div class="featured-image-caption">
        <h2>{{ featuredImage.title }}</h2>
        <p>{{ featuredImage.description }}</p>
      </div>
    </section>

    <!-- 瀑布流画廊区域：展示更多照片，采用响应式布局 -->
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

    <!-- 图片查看器：点击图片时显示大图 -->
    <div v-if="lightbox.visible" class="lightbox-overlay" @click.self="closeLightbox">
      <div class="lightbox-content">
        <img :src="lightbox.currentImageSrc" alt="放大的图片" class="lightbox-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入所需的Vue组件和图片资源
import { ref, onMounted } from 'vue';
import photoPreviews from '@/assets/images/photos/photo_previews.jpg';
import img1 from '@/assets/images/photos/photowork/lotus leaf.jpg';
import img2 from '@/assets/images/photos/photowork/city.jpg';
import img3 from '@/assets/images/photos/photowork/swan.jpg';
import img4 from '@/assets/images/photos/photowork/flow.jpg';
import img5 from '@/assets/images/photos/photowork/black.jpg';
import img6 from '@/assets/images/photos/photowork/limb.jpg';
import img7 from '@/assets/images/photos/photowork/chrysanthemum.jpg';
import img8 from '@/assets/images/photos/photowork/boat.jpg';
import img9 from '@/assets/images/photos/photowork/portraits.jpg';
import img10 from '@/assets/images/photos/photowork/Coffee.jpg';
import img11 from '@/assets/images/photos/photowork/Coffee2.jpg';
import img12 from '@/assets/images/photos/photowork/city1.jpg';
import img13 from '@/assets/images/photos/photowork/city2.jpg';
import img14 from '@/assets/images/photos/photowork/metro1.jpg';
import img15 from '@/assets/images/photos/photowork/metro2.jpg';
import img16 from '@/assets/images/photos/photowork/metro3.jpg';
import img17 from '@/assets/images/photos/photowork/lotus flower.jpg';
import img18 from '@/assets/images/photos/photowork/dog.jpeg';
import img19 from '@/assets/images/photos/photowork/boat2.jpeg';
import img20 from '@/assets/images/photos/photowork/boat3.jpeg';
import img21 from '@/assets/images/photos/photowork/boat4.jpeg';
import img22 from '@/assets/images/photos/photowork/water pipes.jpeg';
import img23 from '@/assets/images/photos/photowork/observation wheel.jpeg';
import img24 from '@/assets/images/photos/photowork/observation wheel black.jpeg';
import img25 from '@/assets/images/photos/photowork/microcosmic jungle.jpg';
import img26 from '@/assets/images/photos/photowork/夜鹭鸟.jpg';
import img27 from '@/assets/images/photos/photowork/blurred water feature.jpg';
import img28 from '@/assets/images/photos/photowork/chrysanthemum2.jpg';
import img29 from '@/assets/images/photos/photowork/flow - 01.jpg';
import img30 from '@/assets/images/photos/photowork/cat.jpg';
import img31 from '@/assets/images/photos/photowork/dilapidate.jpg';
import img32 from '@/assets/images/photos/photowork/swan2.jpg';
import img33 from '@/assets/images/photos/photowork/swan3.jpg';
import img34 from '@/assets/images/photos/photowork/swan4.jpg';
import img35 from '@/assets/images/photos/photowork/swan5.jpg';
import img36 from '@/assets/images/photos/photowork/swan6.jpg';
import img37 from '@/assets/images/photos/photowork/swan7.jpg';
import img38 from '@/assets/images/photos/photowork/夜鹭鸟2.jpg';
import img39 from '@/assets/images/photos/photowork/pigeons.jpg';
import img40 from '@/assets/images/photos/photowork/microcosmic jungle2.jpg';

// --- 响应式数据定义 ---
// 特色大图数据
const featuredImage = ref({
  id: 'featured-01',
  src: photoPreviews,
  alt: '主预览大图',
  title: 'Early Morning Blues',
  description: '凌晨四点，城市还没醒',
});

// 画廊图片数据数组
const galleryImages = ref([
  { id: 'img1', src: img1, alt: 'lotus leaf' },
  { id: 'img2', src: img2, alt: 'city' },
  { id: 'img3', src: img3, alt: 'swan' },
  { id: 'img4', src: img4, alt: 'flow' },
  { id: 'img5', src: img5, alt: 'black' },
  { id: 'img6', src: img6, alt: 'limb' },
  { id: 'img7', src: img7, alt: 'chrysanthemum' },
  { id: 'img8', src: img8, alt: 'boat' },
  { id: 'img9', src: img9, alt: 'portraits' },
  { id: 'img10', src: img10, alt: 'Coffee' },
  { id: 'img11', src: img11, alt: 'Coffee2' },
  { id: 'img12', src: img12, alt: 'city1' },
  { id: 'img13', src: img13, alt: 'city2' },
  { id: 'img14', src: img14, alt: 'metro1' },
  { id: 'img15', src: img15, alt: 'metro2' },
  { id: 'img16', src: img16, alt: 'metro3' },
  { id: 'img17', src: img17, alt: 'lotus flower' },
  { id: 'img18', src: img18, alt: 'dog' },
  { id: 'img19', src: img19, alt: 'boat2' },
  { id: 'img20', src: img20, alt: 'boat3' },
  { id: 'img21', src: img21, alt: 'boat4' },
  { id: 'img22', src: img22, alt: 'water pipes' },
  { id: 'img23', src: img23, alt: 'observation wheel' },
  { id: 'img24', src: img24, alt: 'observation wheel black' },
  { id: 'img25', src: img25, alt: 'microcosmic jungle' },
  { id: 'img26', src: img26, alt: '夜鹭鸟' },
  { id: 'img27', src: img27, alt: 'blurred water feature' },
  { id: 'img28', src: img28, alt: 'chrysanthemum2' },
  { id: 'img29', src: img29, alt: 'flow - 01' },
  { id: 'img30', src: img30, alt: 'cat' },
  { id: 'img31', src: img31, alt: 'dilapidate' },
  { id: 'img32', src: img32, alt: 'swan2' },
  { id: 'img33', src: img33, alt: 'swan3' },
  { id: 'img34', src: img34, alt: 'swan4' },
  { id: 'img35', src: img35, alt: 'swan5' },
  { id: 'img36', src: img36, alt: 'swan6' },
  { id: 'img37', src: img37, alt: 'swan7' },
  { id: 'img38', src: img38, alt: '夜鹭鸟2' },
  { id: 'img39', src: img39, alt: 'pigeons' },
  { id: 'img40', src: img40, alt: 'microcosmic jungle2' },
]);

// 图片查看器状态控制
const lightbox = ref({
  visible: false,
  currentImageSrc: '',
});

// --- 方法定义 ---
// 打开图片查看器
const openLightbox = (imageSrc) => {
  lightbox.value.currentImageSrc = imageSrc;
  lightbox.value.visible = true;
  document.body.style.overflow = 'hidden'; // 禁止背景滚动
};

// 关闭图片查看器
const closeLightbox = () => {
  lightbox.value.visible = false;
  lightbox.value.currentImageSrc = '';
  document.body.style.overflow = ''; // 恢复背景滚动
};
</script>

<style scoped>
/* 页面整体样式 */
.photo-detail-page {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #fff; /* 纯白色背景 */
  padding-bottom: 50px; /* 底部留白 */
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 1. 特色大图区域样式 */
.featured-image-section {
  position: relative; /* 用于文字说明的绝对定位 */
  width: 100%;
  max-height: 90vh; /* 限制最大高度，避免过大，原为80vh */
  overflow: hidden; /* 保证圆角生效 */
  background-color: #fff; /* 与页面背景一致，避免有色块 */
  border-radius: 18px; /* 四角圆角，和图片一致 */
}

.featured-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持图片比例并填充容器 */
  cursor: pointer;
  transition: transform 0.3s ease-out; /* 添加悬停动画效果 */
  border-radius: 18px; /* 四周圆角 */
}

.featured-image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: none;
  border-radius: 0 0 18px 18px; /* 只给下方圆角，避免遮挡主图下圆角 */
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

/* 2. 画廊区域样式 - 采用CSS多列布局实现瀑布流 */
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
  column-count: 4; /* 默认显示3列 */
  column-gap: 20px; /* 列间距 */
  width: 100%;
}

/* 响应式布局调整 */
@media (max-width: 1100px) {
  .gallery-grid {
    column-count: 2; /* 中等屏幕显示2列 */
  }
}
@media (max-width: 700px) {
  .gallery-grid {
    column-count: 1; /* 小屏幕显示1列 */
  }
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 20px;
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

/* 3. 图片查看器样式 */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95); /* 更暗的半透明黑色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000; /* 确保显示在最上层 */
  padding: 20px;
  box-sizing: border-box;
  animation: fadeIn 0.3s ease-out; /* 淡入动画 */
}

/* 动画效果定义 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { transform: scale(0.8); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
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

.lightbox-image {
  display: block;
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px; /* 略微圆角更柔和 */
  border: 12px solid #fff; /* 白色边框 */
  padding: 8px; /* 内边距，增加相框感 */
  background: #fff; /* 防止图片有透明像素时边框不完整 */
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
  margin: 0 auto;
}

.footer-copyright {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.45); /* 版权文字颜色更淡 */
  letter-spacing: 0.3px;
}

.footer-copyright p {
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .featured-image-caption h2 {
    font-size: 1.8em; /* 减小标题字号 */
  }
  .featured-image-caption p {
    font-size: 0.9em; /* 减小描述文字字号 */
  }
  .gallery-title {
    font-size: 1.5em;
  }
  .gallery-grid {
    column-count: 1; /* 移动端单列显示 */
  }
  /* 移动端关闭按钮样式调整 */
  .lightbox-close-btn {
    width: 32px;
    height: 32px;
    font-size: 20px;
    line-height: 32px;
    top: 5px;
    right: 5px;
    background-color: rgba(0,0,0,0.5);
    color: white;
  }
}
</style> 