<!-- 视频作品页，原Videos.vue内容迁移于此 -->
<template>
  <div class="video-gallery-page" :class="{ 'dark-mode': isDarkMode }">
    <section class="video-gallery-header">
      <h1>视频作品</h1>
      <p>动态光影，讲述每一个动人故事。</p>
    </section>

    <section class="video-list-section">
      <div v-if="videos.length === 0" class="no-videos-message">
        <p>暂无视频内容。</p>
      </div>
      <div v-else class="video-grid">
        <div v-for="video in videos" :key="video.id" class="video-item">
          <div class="video-thumbnail" @click="openVideoPreview(video)">
            <img :src="getThumbnailUrl(video.youtubeId)" alt="视频缩略图" />
            <div class="play-overlay">
              <span class="play-icon">▶</span>
            </div>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <p v-if="video.description" class="video-description">{{ video.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 视频预览模态框 -->
    <Teleport to="body">
      <div v-if="selectedVideo" class="video-preview-modal" @click="closeVideoPreview">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="closeVideoPreview">&times;</button>
          <div class="video-preview-container">
            <iframe
              :src="getEmbedUrl(selectedVideo.youtubeId, true)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              class="preview-iframe"
            ></iframe>
          </div>
          <div class="preview-info">
            <h2>{{ selectedVideo.title }}</h2>
            <p>{{ selectedVideo.description }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 示例视频数据
const videos = ref([
  {
    id: 'vid001',
    youtubeId: 'T1MYVEbxKw0',
    title: '五一Vlog',
    description: '视频内容：记录五一假期的精彩瞬间，分享旅行见闻和生活点滴。',
  },
  {
    id: 'vid002',
    youtubeId: 'gTyxBG5VP6U',
    title: '第一次冲洗彩色负片',
    description:
      '视频内容：分享首次尝试冲洗彩色负片的完整过程，包括设备准备、冲洗步骤和最终效果展示。',
  },
  {
    id: 'vid003',
    youtubeId: 'zUwEIt9-M fugitive',
    title: '航拍集锦：城市与自然',
    description: '通过无人机的视角，探索城市天际线与壮丽的自然景观。',
  },
  {
    id: 'vid004',
    youtubeId: '6v2L2UGZJAM',
    title: '巴黎一日游',
    description: '漫步在巴黎街头，感受这座浪漫之都的独特魅力。',
  },
])

// 视频预览状态
const selectedVideo = ref(null)
const isDarkMode = ref(false)

// 获取视频缩略图URL
const getThumbnailUrl = youtubeId => {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
}

// 打开视频预览
const openVideoPreview = video => {
  selectedVideo.value = video
  isDarkMode.value = true
  document.body.style.overflow = 'hidden'
  document.body.classList.add('modal-open')
}

// 关闭视频预览
const closeVideoPreview = () => {
  selectedVideo.value = null
  isDarkMode.value = false
  document.body.style.overflow = ''
  document.body.classList.remove('modal-open')
}

/**
 * 根据YouTube视频ID生成嵌入式URL
 * @param {string} youtubeId - YouTube视频的ID
 * @param {boolean} autoplay - 是否自动播放
 * @returns {string} 嵌入式URL
 */
const getEmbedUrl = (youtubeId, autoplay = false) => {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&showinfo=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`
}

// 监听ESC键关闭预览
const handleKeyDown = e => {
  if (e.key === 'Escape' && selectedVideo.value) {
    closeVideoPreview()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* ...原Videos.vue样式全部复制... */
.video-gallery-page {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #ffffff; /* 页面背景色，可以根据您的网站风格调整 */
  padding: 40px 20px;
  transition: background-color 0.3s ease;
}

.video-gallery-page.dark-mode {
  background-color: #1a1a1a;
  color: #ffffff;
}

.video-gallery-header {
  text-align: center;
  margin-bottom: 50px;
}

.video-gallery-header h1 {
  font-size: 2.8em;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 500;
}

.dark-mode .video-gallery-header h1 {
  color: #ffffff;
}

.video-gallery-header p {
  font-size: 1.1em;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.dark-mode .video-gallery-header p {
  color: #cccccc;
}

.video-list-section {
  max-width: 1400px; /* 视频列表内容最大宽度 */
  margin: 0 auto;
}

.no-videos-message {
  text-align: center;
  font-size: 1.2em;
  color: #777;
  padding: 50px 0;
}

.video-grid {
  display: grid;
  /* 响应式列数：根据屏幕宽度调整，每列最小350px */
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px; /* 视频项之间的间距 */
}

.video-item {
  background-color: #f8f9fa; /* 每个视频项的背景色 */
  border-radius: 10px; /* 圆角 */
  overflow: hidden; /* 确保iframe的圆角生效 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); /* 轻微阴影 */
  cursor: pointer;
  display: flex;
  flex-direction: column; /* 视频和信息垂直排列 */
  transition:
    transform 0.3s ease-out,
    box-shadow 0.3s ease-out;
}

.dark-mode .video-item {
  background-color: #2a2a2a;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.video-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.video-thumbnail:hover img {
  transform: scale(1.05);
}

.video-info {
  padding: 20px;
  background-color: #ffffff; /* 信息区域背景色 */
}

.dark-mode .video-info {
  background-color: #2a2a2a;
}

.video-title {
  font-size: 1.3em;
  color: #343a40;
  margin: 0 0 10px 0;
  font-weight: 500;
  line-height: 1.3;
}

.dark-mode .video-title {
  color: #ffffff;
}

.video-description {
  font-size: 0.9em;
  color: #6c757d;
  line-height: 1.6;
  margin: 0;
  /* 限制描述文字行数，可选 */
  /* display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; */
}

.dark-mode .video-description {
  color: #cccccc;
}

/* 视频预览模态框样式 */
.video-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 1200px;
  background-color: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease;
}

.video-preview-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background-color: #000;
}

.preview-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.preview-info {
  padding: 20px;
  background-color: #1a1a1a;
  color: #ffffff;
}

.preview-info h2 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
  color: #ffffff;
}

.preview-info p {
  margin: 0;
  color: #cccccc;
  line-height: 1.6;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

/* 添加全局样式 */
:global(.modal-open) {
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .video-gallery-header h1 {
    font-size: 2.2em;
  }
  .video-gallery-header p {
    font-size: 1em;
  }
  .video-grid {
    /* 小屏幕上，minmax的最小值可以小一些，或者直接设为1fr */
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  .video-title {
    font-size: 1.15em;
  }
  .video-description {
    font-size: 0.85em;
  }
  .modal-content {
    width: 95%;
  }
}

@media (max-width: 480px) {
  .video-grid {
    grid-template-columns: 1fr; /* 超小屏幕，单列显示 */
  }
  .modal-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .video-preview-container {
    padding-top: 56.25%;
  }

  .preview-info {
    padding: 15px;
  }

  .preview-info h2 {
    font-size: 1.2em;
  }

  .preview-info p {
    font-size: 0.9em;
  }
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.video-thumbnail:hover .play-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.play-icon {
  color: white;
  font-size: 48px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.video-thumbnail:hover .play-icon {
  opacity: 1;
  transform: scale(1.1);
}
</style>
