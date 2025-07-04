<template>
  <div class="modelling-container">
    <div class="page-header">
      <h1 class="title">3D Modelling</h1>
      <p class="subtitle">探索三维世界的无限可能</p>
    </div>

    <div class="content-section">
      <div class="intro-section">
        <h2>设计理念</h2>
        <p>3D建模是将创意转化为立体现实的艺术。我们专注于创造具有视觉冲击力和实用价值的3D作品。</p>
      </div>

      <div class="works-showcase">
        <div v-for="(work, index) in works" :key="index" class="work-card">
          <div class="work-preview">
            <img :src="work.image" :alt="work.title" />
            <div class="work-overlay">
              <span class="work-category">{{ work.category }}</span>
            </div>
          </div>
          <div class="work-details">
            <h3>{{ work.title }}</h3>
            <p>{{ work.description }}</p>
            <div class="work-tags">
              <span v-for="(tag, tagIndex) in work.tags" :key="tagIndex" class="tag">
                {{ tag }}
              </span>
            </div>
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
    title: '建筑可视化',
    description: '现代商业建筑群的3D渲染与动画展示',
    image: 'https://picsum.photos/600/400?random=5',
    category: '建筑',
    tags: ['建筑可视化', '渲染', '动画'],
  },
  {
    title: '产品设计',
    description: '创新家居产品的3D建模与材质表现',
    image: 'https://picsum.photos/600/400?random=6',
    category: '产品',
    tags: ['产品设计', '材质', '渲染'],
  },
  {
    title: '角色建模',
    description: '游戏角色的3D建模与动画制作',
    image: 'https://picsum.photos/600/400?random=7',
    category: '角色',
    tags: ['角色建模', '动画', '游戏'],
  },
  {
    title: '环境设计',
    description: '虚拟场景的环境设计与氛围营造',
    image: 'https://picsum.photos/600/400?random=8',
    category: '环境',
    tags: ['环境设计', '场景', '氛围'],
  },
])
</script>

<style scoped>
.modelling-container {
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

.works-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.work-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.work-card:hover {
  transform: translateY(-5px);
}

.work-preview {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.work-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.work-card:hover .work-preview img {
  transform: scale(1.05);
}

.work-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 12px;
  border-radius: 20px;
}

.work-category {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
}

.work-details {
  padding: 20px;
}

.work-details h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.work-details p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
}

.work-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #f0f6ff;
  color: #007bff;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .works-showcase {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .modelling-container {
    padding: 20px 15px;
  }

  .title {
    font-size: 1.8rem;
  }

  .works-showcase {
    grid-template-columns: 1fr;
  }

  .work-preview {
    height: 200px;
  }
}
</style>
