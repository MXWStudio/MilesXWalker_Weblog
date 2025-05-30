<!-- Hero.vue 首页顶部展示组件 -->
<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Hi! My name is Miles.👋</h1>
      <h2 class="hero-subtitle">摄影爱好者 & 前端小白</h2>
      <p class="hero-subtitle-content">
        我热爱摄影，喜欢用镜头记录生活。在技术领域，我自学编程，目前精通Vue，仍在前端领域不断探索成长。同时也喜欢用代码创造有趣的东西，希望和大家一起进步。
      </p>
      <div class="hero-buttons">
        <button class="btn primary">联系我</button>
        <button class="btn secondary">我的作品</button>
      </div>
    </div>
    <div class="hero-image">
      <img src="https://picsum.photos/800/400" alt="Hero Image" />
    </div>
  </section>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 8%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 600px;
}

.hero-content {
  flex: 1;
  max-width: 700px;
  padding-right: 60px;
  margin-top: -40px;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 18px;
  line-height: 1.15;
  white-space: nowrap;
}

.hero-subtitle {
  font-size: 2rem;
  color: #666;
  margin-bottom: 18px;
  line-height: 1.5;
  font-weight: 600;
  white-space: nowrap;
}

.hero-subtitle-content {
  font-size: 1.15rem;
  font-weight: 300;
  color: #555;
  margin-bottom: 32px;
  line-height: 1.8;
  letter-spacing: 0.02em;
  max-width: 700px;
  text-align: left;
  white-space: normal;
}

.hero-buttons {
  display: flex;
  gap: 28px;
}

.btn {
  padding: 18px 40px;
  border-radius: 36px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn.primary {
  background-color: #007bff;
  color: white;
}

.btn.primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.btn.secondary {
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn.secondary:hover {
  background-color: #007bff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
}

.hero-image {
  flex: 1;
  max-width: 400px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.hero-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.hero-image:hover img {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero {
    padding: 60px 5%;
    min-height: 500px;
  }
  .hero-title {
    font-size: 3.2rem;
  }
  .hero-subtitle {
    font-size: 1.4rem;
  }
  .hero-image {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
    min-height: 400px;
  }
  .hero-content {
    padding-right: 0;
    margin-bottom: 40px;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-subtitle {
    font-size: 1.2rem;
  }
  .hero-image {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 30px 10px;
    min-height: 250px;
  }
  .hero-title {
    font-size: 1.5rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
  .hero-buttons {
    flex-direction: column;
    gap: 12px;
  }
  .btn {
    width: 100%;
    font-size: 1rem;
    padding: 12px 0;
  }
}
</style> 