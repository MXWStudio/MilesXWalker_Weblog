<template>
  <section class="contact-us-section">
    <div class="contact-container">
      <div class="contact-header">
        <h2>与我联系</h2>
        <p>期待与您交流摄影、项目合作或任何有趣的想法。</p>
      </div>

      <div class="contact-layout">
        <div class="contact-visual-info">
          <div class="image-wrapper">
            <img src="https://placehold.co/600x800/6c757d/ffffff?text=摄影师工作照或相关艺术图片&font=roboto" alt="联系我们视觉图片" />
            <div class="image-overlay-text">
              <p>"光影之间，故事发生。"</p>
            </div>
          </div>
          <div class="quick-info">
            <div class="info-block">
              <span class="info-icon">📧</span>
              <a href="mailto:milesxwalkerstudio@example.com" class="info-link">milesxwalkerstudio@example.com</a>
            </div>
            <div class="info-block">
              <span class="info-icon">📞</span>
              <span class="info-text">(+86) 138 1234 5678 (可选)</span>
            </div>
          </div>
        </div>

        <div class="contact-details-form">
          <div class="social-media-links-detailed">
            <h3>关注我的社交媒体</h3>
            <div class="social-icons-row">
              <a href="YOUR_INSTAGRAM_LINK" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon-detailed">
                <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4c2.21 0 4 1.791 4 4s-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="YOUR_YOUTUBE_LINK" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="social-icon-detailed">
                <svg viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="YOUR_GITHUB_LINK" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="social-icon-detailed">
                 <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
               </div>
          </div>

          <form class="contact-form-main" @submit.prevent="handleSubmit">
            <p class="form-intro">或者，直接给我留言：</p>
            <div class="form-group">
              <input type="text" id="name" v-model="formData.name" placeholder="您的姓名 *" required />
            </div>
            <div class="form-group">
              <input type="email" id="email" v-model="formData.email" placeholder="您的邮箱 *" required />
            </div>
            <div class="form-group">
              <textarea id="message" v-model="formData.message" placeholder="您的留言内容 *" required></textarea>
            </div>
            <button type="submit" class="submit-button">发送</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  name: '',
  email: '',
  message: '',
});

const handleSubmit = () => {
  // 在这里添加您的表单提交逻辑，例如发送到后端API或邮件服务
  console.log('表单已提交:', formData.value);
  alert('感谢您的留言，我会尽快与您联系！'); // 简单的提示

  // 提交后重置表单
  formData.value = {
    name: '',
    email: '',
    message: '',
  };
};
</script>

<style scoped>
.contact-us-section {
  padding: 60px 20px 80px; /* 上 右/左 下 */
  background-color: #fff; /* 干净的白色背景 */
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-header {
  text-align: center;
  margin-bottom: 50px;
}

.contact-header h2 {
  font-size: 2.8em;
  color: #2c3e50; /* 深蓝灰色 */
  margin-bottom: 15px;
  font-weight: 500;
}

.contact-header p {
  font-size: 1.1em;
  color: #555;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr; /* 左侧稍窄，右侧稍宽 */
  gap: 50px; /* 两列之间的间距 */
  align-items: flex-start; /* 顶部对齐 */
}

/* 左侧：图片与简要信息 */
.contact-visual-info {
  position: sticky; /* 尝试让左侧在滚动时有一定粘性效果 */
  top: 100px; /* 粘性定位的起始点，根据您的Header高度调整 */
}

.image-wrapper {
  position: relative;
  border-radius: 12px; /* 图片圆角 */
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.image-wrapper img {
  display: block;
  width: 100%;
  height: auto; /* 或固定高度，如 height: 500px; object-fit: cover; */
  min-height: 400px; /* 确保图片有一定高度 */
  object-fit: cover;
  transition: transform 0.4s ease-out;
}
.image-wrapper:hover img {
  transform: scale(1.05);
}

.image-overlay-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 25px;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%);
  color: #fff;
  box-sizing: border-box;
  text-align: center;
}
.image-overlay-text p {
  margin: 0;
  font-size: 1.1em;
  font-style: italic;
}

.quick-info {
  padding: 10px 0;
}

.info-block {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  font-size: 1.05em;
}

.info-icon {
  font-size: 1.4em;
  margin-right: 12px;
  color: #007bff; /* 图标颜色 */
}

.info-link, .info-text {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}
.info-link:hover {
  color: #0056b3;
}

/* 右侧：详细信息与表单 */
.contact-details-form {
  padding: 20px 0; /* 给右侧一些呼吸空间 */
}

.social-media-links-detailed {
  margin-bottom: 40px;
  text-align: center;
}

.social-media-links-detailed h3 {
  font-size: 1.3em;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 500;
}

.social-icons-row {
  display: flex;
  justify-content: center;
  gap: 25px;
}

.social-icon-detailed {
  color: #495057; /* 社交图标颜色 */
  transition: color 0.3s ease, transform 0.3s ease;
}
.social-icon-detailed svg {
  width: 28px;
  height: 28px;
  fill: currentColor;
}
.social-icon-detailed:hover {
  color: #007bff; /* 悬停时变为主题色 */
  transform: scale(1.1);
}

.contact-form-main {
  background: #f8f9fa; /* 表单区域背景色，与页面背景稍作区分 */
  padding: 35px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.07);
}
.form-intro {
  text-align: center;
  margin-bottom: 25px;
  color: #555;
  font-size: 1em;
}

.form-group {
  margin-bottom: 25px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #ced4da; /* 更柔和的边框 */
  border-radius: 6px;
  font-size: 1em;
  font-family: inherit;
  box-sizing: border-box; /* 确保padding不影响总宽度 */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-group textarea {
  min-height: 130px;
  resize: vertical;
}

.submit-button {
  display: block;
  width: 100%;
  background-color: #007bff; /* 主题色 */
  color: white;
  padding: 14px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.05em;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button:hover {
  background-color: #0056b3; /* 深一点的主题色 */
  transform: translateY(-2px);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .contact-layout {
    grid-template-columns: 1fr; /* 中等屏幕变为单列 */
    gap: 30px;
  }
  .contact-visual-info {
    position: static; /* 取消粘性定位 */
    text-align: center; /* 居中图片和信息 */
  }
  .image-wrapper {
    max-width: 500px; /* 限制图片最大宽度 */
    margin-left: auto;
    margin-right: auto;
  }
  .quick-info {
    justify-content: center; /* 居中简要信息 */
  }
  .info-block {
     justify-content: center;
  }
  .social-media-links-detailed h3 {
    font-size: 1.2em;
  }
  .contact-details-form {
    padding-top: 0;
  }
}

@media (max-width: 576px) {
  .contact-header h2 {
    font-size: 2.2em;
  }
  .contact-header p {
    font-size: 1em;
  }
  .form-group input,
  .form-group textarea,
  .submit-button {
    font-size: 0.95em;
  }
  .image-overlay-text p {
    font-size: 1em;
  }
}
</style>
