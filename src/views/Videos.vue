<template>
  <div class="video-gallery-page">
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
          <div class="video-embed-container">
            <iframe
              :src="getEmbedUrl(video.youtubeId)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              class="video-iframe"
            ></iframe>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <p v-if="video.description" class="video-description">{{ video.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 示例视频数据
// 您应该从API获取或在props中传入这些数据
const videos = ref([
  {
    id: 'vid001',
    youtubeId: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up (示例ID)
    title: '示例视频：永不放弃',
    description: '这是一个经典的YouTube视频示例，用于演示嵌入功能。',
  },
  {
    id: 'vid002',
    youtubeId: 'LXb3EKWsInQ', // COSTA RICA IN 4K 🇨🇷 - Cinematic Travel Video (示例ID)
    title: '旅行电影：哥斯达黎加 4K',
    description: '令人惊叹的哥斯达黎加自然风光，以电影般的质感呈现。',
  },
  {
    id: 'vid003',
    youtubeId: 'zUwEIt9-M fugitive', // Cinematic Drone Footage (示例ID)
    title: '航拍集锦：城市与自然',
    description: '通过无人机的视角，探索城市天际线与壮丽的自然景观。',
  },
  {
    id: 'vid004',
    youtubeId: '6v2L2UGZJAM', // A DAY IN PARIS - Cinematic Travel Video (示例ID)
    title: '巴黎一日游',
    description: '漫步在巴黎街头，感受这座浪漫之都的独特魅力。',
  }
  // 您可以添加更多视频对象
]);

/**
 * 根据YouTube视频ID生成嵌入式URL
 * @param {string} youtubeId - YouTube视频的ID
 * @returns {string} 嵌入式URL
 */
const getEmbedUrl = (youtubeId) => {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&showinfo=0&modestbranding=1`;
  // rel=0: 播放结束后不显示相关视频 (YouTube可能已更改此行为)
  // showinfo=0: 不显示视频标题和上传者信息 (YouTube可能已弃用此参数)
  // modestbranding=1: 减少YouTube Logo的显示
};

</script>

<style scoped>
.video-gallery-page {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #ffffff; /* 页面背景色，可以根据您的网站风格调整 */
  padding: 40px 20px;
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

.video-gallery-header p {
  font-size: 1.1em;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
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
  display: flex;
  flex-direction: column; /* 视频和信息垂直排列 */
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.video-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.video-embed-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 (9 / 16 * 100) */
  background-color: #000; /* iframe加载时的黑色背景 */
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none; /* 移除iframe边框 */
}

.video-info {
  padding: 20px;
  background-color: #ffffff; /* 信息区域背景色 */
}

.video-title {
  font-size: 1.3em;
  color: #343a40;
  margin: 0 0 10px 0;
  font-weight: 500;
  line-height: 1.3;
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
}

@media (max-width: 480px) {
   .video-grid {
    grid-template-columns: 1fr; /* 超小屏幕，单列显示 */
  }
}
</style>
