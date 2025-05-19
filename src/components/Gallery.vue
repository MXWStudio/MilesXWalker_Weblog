<template>
    <div class="image-gallery-container">
      <div class="gallery-column" v-for="columnIndex in 3" :key="`column-${columnIndex}`">
        <div
          class="image-wrapper"
          v-for="image in getImagesForColumn(columnIndex - 1)"
          :key="image.id"
        >
          <div v-if="!image.loaded" class="loading-placeholder" :style="{paddingBottom: image.aspectRatioPadding}">
            <div class="spinner"></div>
            <span>加载中...</span>
          </div>
          <img
            v-show="image.loaded"
            :src="image.url"
            :alt="image.alt"
            @load="onImageLoad(image)"
            @error="onImageError(image)"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // --- 配置项 ---
  const TOTAL_IMAGES = 18; // 要显示的总图片数量 (最好是3的倍数)
  const IMAGE_WIDTH = 300; // 图片的基础宽度，用于计算随机高度和宽高比
  const MIN_IMAGE_HEIGHT = 200; // 图片的最小随机高度
  const MAX_IMAGE_HEIGHT = 500; // 图片的最大随机高度
  
  // --- 响应式状态 ---
  const allImages = ref([]); // 存储所有图片对象的数组
  
  // --- 工具函数 ---
  /**
   * 生成一个在指定范围内的随机整数
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number} 随机整数
   */
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // --- 图片数据处理 ---
  /**
   * 生成图片数据数组
   * 每个图片对象包含 id, url, alt, loaded 状态, 和用于占位符的宽高比
   */
  const generateImageData = () => {
    const images = [];
    for (let i = 0; i < TOTAL_IMAGES; i++) {
      const uniqueSeed = `${Date.now()}-${i}-${Math.random().toString(36).substring(7)}`; // 生成更独特的种子
      const randomHeight = getRandomInt(MIN_IMAGE_HEIGHT, MAX_IMAGE_HEIGHT);
      images.push({
        id: `img-${uniqueSeed}`,
        url: `https://picsum.photos/seed/${uniqueSeed}/${IMAGE_WIDTH}/${randomHeight}`,
        alt: `随机图片 ${i + 1} - 高度: ${randomHeight}px`,
        loaded: false,
        error: false, // 新增错误状态
        aspectRatioPadding: `${(randomHeight / IMAGE_WIDTH) * 100}%`, // 根据宽高计算padding以撑开空间
      });
    }
    allImages.value = images;
  };
  
  /**
   * 根据列索引获取该列应显示的图片
   * @param {number} columnIndex - 列的索引 (0, 1, 或 2)
   * @returns {Array} 该列的图片对象数组
   */
  const getImagesForColumn = (columnIndex) => {
    return allImages.value.filter((_, index) => index % 3 === columnIndex);
  };
  
  // --- 事件处理 ---
  /**
   * 图片加载成功时的回调函数
   * @param {object} image - 加载成功的图片对象
   */
  const onImageLoad = (image) => {
    // 确保在Vue的下一次DOM更新循环之后更新状态，以允许CSS过渡生效
    requestAnimationFrame(() => {
      image.loaded = true;
    });
  };
  
  /**
   * 图片加载失败时的回调函数
   * @param {object} image - 加载失败的图片对象
   */
  const onImageError = (image) => {
    console.error(`图片加载失败: ${image.url}`);
    image.error = true;
    image.loaded = true; // 标记为loaded以隐藏加载动画，并显示错误信息（如果需要）
    // 可以在这里设置一个默认的错误图片URL
    // image.url = 'path/to/your/error-image.png';
  };
  
  // --- 生命周期钩子 ---
  /**
   * 组件挂载后执行，用于生成初始图片数据
   */
  onMounted(() => {
    generateImageData();
  });
  
  </script>
  
  <style scoped>
  /* 主容器样式 */
  .image-gallery-container {
    display: flex; /* 使用flex布局创建列 */
    flex-direction: row; /* 水平排列列 */
    gap: 15px; /* 列之间的间距 */
    padding: 15px; /* 容器内边距 */
    background-color: #f8f9fa; /* 容器背景色 */
    border-radius: 8px; /* 容器圆角 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 容器阴影 */
  }
  
  /* 列样式 */
  .gallery-column {
    flex: 1; /* 每列平均分配可用宽度 */
    display: flex;
    flex-direction: column; /* 列内图片垂直排列 */
    gap: 15px; /* 列内图片之间的间距 */
  }
  
  /* 图片包裹容器样式 */
  .image-wrapper {
    position: relative; /* 为占位符和可能的覆盖元素提供定位上下文 */
    background-color: #e9ecef; /* 图片加载前的背景色 */
    border-radius: 8px; /* 包裹容器圆角 */
    overflow: hidden; /* 确保图片和占位符的圆角生效 */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); /* 图片轻微阴影 */
  }
  
  /* 图片元素样式 */
  .gallery-column img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    object-fit: cover;
  }
  
  /* 图片加载完成后的样式 */
  .gallery-column img[src] {
    opacity: 1;
  }
  
  /* 图片加载占位符样式 */
  .loading-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    font-size: 0.9em;
    background-color: #f8f9fa;
    transition: opacity 0.3s ease-in-out;
  }
  
  .loading-placeholder span {
    margin-top: 8px;
    font-size: 0.85em;
  }
  
  /* 简单的CSS加载动画 (spinner) */
  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-left-color: #007bff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .image-gallery-container {
      flex-direction: column;
      gap: 10px;
      padding: 10px;
    }

    .gallery-column {
      gap: 10px;
    }

    .loading-placeholder {
      min-height: 80px;
    }
  }
  </style> 