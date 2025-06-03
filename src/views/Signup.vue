<template>
  <div class="register-page">
    <div class="register-form-container">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input id="email" v-model="email" type="email" required placeholder="请输入邮箱" />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="请输入密码"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="请再次输入密码"
          />
        </div>
        <button type="submit" class="register-btn">注册</button>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </form>
      <div class="to-login">
        已有账号？
        <a href="#" @click.prevent="goLogin">去登录</a>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const errorMsg = ref('')
  const router = useRouter()

  const handleRegister = () => {
    if (!email.value || !password.value || !confirmPassword.value) {
      errorMsg.value = '请填写所有信息'
      return
    }
    if (password.value !== confirmPassword.value) {
      errorMsg.value = '两次输入的密码不一致！'
      return
    }
    // 这里只做前端演示，实际应提交到后端
    router.push('/login')
  }
  const goLogin = () => {
    router.push('/login')
  }
</script>

<style scoped>
  .register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f6fb;
  }
  .register-form-container {
    background: #fff;
    padding: 40px 30px;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    width: 350px;
    max-width: 90vw;
  }
  .register-form-container h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #2c3e50;
  }
  .form-group {
    margin-bottom: 18px;
  }
  .form-group label {
    display: block;
    margin-bottom: 6px;
    color: #555;
    font-size: 1em;
  }
  .form-group input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1em;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-group input:focus {
    border-color: #769fcd;
  }
  .register-btn {
    width: 100%;
    padding: 12px 0;
    background: #769fcd;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .register-btn:hover {
    background: #4a6fa5;
  }
  .error-msg {
    color: #e74c3c;
    margin-top: 10px;
    text-align: center;
  }
  .to-login {
    margin-top: 18px;
    text-align: center;
    color: #555;
    font-size: 0.98em;
  }
  .to-login a {
    color: #769fcd;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 4px;
  }
  .to-login a:hover {
    color: #4a6fa5;
  }
</style>
