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

<script>
export default {
  name: 'Hero',
  data() {
    return {
      // 可以在这里添加数据
    }
  }
}
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 5%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 500px;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  padding-right: 40px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
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
  max-width: 600px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
    padding: 40px 5%;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
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
    padding: 30px 15px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 