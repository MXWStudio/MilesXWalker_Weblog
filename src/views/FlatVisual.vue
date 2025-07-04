<template>
  <div class="flat-visual-container">
    <div class="page-header">
      <h1 class="title">Flat Visual Design</h1>
      <p class="subtitle">探索简约而富有表现力的平面视觉设计</p>
    </div>

    <div class="content-section">
      <div class="intro-section">
        <h2>设计理念</h2>
        <p>
          平面视觉设计是一种以简约、清晰和功能性为核心的设计风格。我们致力于创造既美观又实用的视觉作品。
        </p>
      </div>

      <div class="works-grid">
        <div v-for="(work, index) in works" :key="index" class="work-item">
          <div class="work-image">
            <img :src="work.image" :alt="work.title" />
          </div>
          <div class="work-info">
            <h3>{{ work.title }}</h3>
            <p>{{ work.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const works = ref([
  {
    title: '品牌标识设计',
    description: '为新兴科技公司打造的现代简约品牌标识',
    image: 'https://picsum.photos/400/300?random=1',
  },
  {
    title: 'UI界面设计',
    description: '移动应用界面的平面化设计解决方案',
    image: 'https://picsum.photos/400/300?random=2',
  },
  {
    title: '海报设计',
    description: '艺术展览系列海报设计',
    image: 'https://picsum.photos/400/300?random=3',
  },
  {
    title: '包装设计',
    description: '环保产品包装的平面设计方案',
    image: 'https://picsum.photos/400/300?random=4',
  },
])
</script>

<style scoped>
.flat-visual-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 16px;
  font-weight: 600;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.intro-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.intro-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 16px;
}

.intro-section p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.work-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.work-item:hover {
  transform: translateY(-5px);
}

.work-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.work-item:hover .work-image img {
  transform: scale(1.05);
}

.work-info {
  padding: 20px;
}

.work-info h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.work-info p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .works-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .flat-visual-container {
    padding: 20px 15px;
  }

  .title {
    font-size: 1.8rem;
  }

  .works-grid {
    grid-template-columns: 1fr;
  }
}
</style>
