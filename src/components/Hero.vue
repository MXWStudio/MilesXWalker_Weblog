<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">欢迎来到我的网站</h1>
      <p class="hero-subtitle">探索、创造、分享</p>
      <div class="hero-buttons">
        <button class="btn primary">开始探索</button>
        <button class="btn secondary">了解更多</button>
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
  padding: 100px 8%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 700px;
}

.hero-content {
  flex: 1;
  max-width: 700px;
  padding-right: 60px;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 30px;
  line-height: 1.15;
}

.hero-subtitle {
  font-size: 2rem;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.7;
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
  max-width: 750px;
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