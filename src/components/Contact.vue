<template>
  <section class="contact-section">
    <div class="contact-container">
      <h2>联系我们</h2>
      <div class="contact-content">
        <div class="contact-info">
          <div class="info-item">
            <h3>邮箱</h3>
            <a href="mailto:milesxwalkerstudio@gmail.com">milesxwalkerstudio@gmail.com</a>
          </div>
          <div class="info-item">
            <h3>社交媒体</h3>
            <div class="social-links">
              <a href="https://www.youtube.com/channel/UCWsm3OC_I_S572PVoz85CBg" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://www.instagram.com/milesxwalker/" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <form class="contact-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="formData.name" required>
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" id="email" v-model="formData.email" required>
          </div>
          <div class="form-group">
            <label for="message">留言</label>
            <textarea id="message" v-model="formData.message" required></textarea>
          </div>
          <button type="submit" class="submit-btn">发送消息</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  // 这里可以添加表单提交逻辑
  console.log('表单数据：', formData.value)
  // 重置表单
  formData.value = {
    name: '',
    email: '',
    message: ''
  }
}
</script>

<style scoped>
.contact-section {
  padding: 80px 20px;
  background-color: #f8f9fa;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-container h2 {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
  font-size: 2.5em;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.contact-info {
  padding: 20px;
}

.info-item {
  margin-bottom: 30px;
}

.info-item h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.info-item a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.info-item a:hover {
  color: #0056b3;
}

.social-links {
  display: flex;
  gap: 20px;
}

.contact-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group textarea {
  height: 150px;
  resize: vertical;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    order: 2;
  }
  
  .contact-form {
    order: 1;
  }
}
</style> 