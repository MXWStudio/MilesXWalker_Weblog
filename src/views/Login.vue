<template>
    <div class="login-page-container">
      <canvas ref="wavyBackgroundCanvas" class="wavy-background"></canvas>
      <div class="login-content-overlay">
        <div class="login-form-wrapper">
          <form @submit.prevent="handleLogin" class="space-y-6 mt-10">
            <div>
              <input type="email" id="login-email" v-model="loginForm.email" required
                     class="login-input"
                     placeholder="邮箱 (Email)">
            </div>
            <div>
              <input type="password" id="login-password" v-model="loginForm.password" required
                     class="login-input"
                     placeholder="密码 (Password)">
            </div>
            <button type="submit" class="login-button">
              登 录
            </button>
          </form>
  
          <div class="mt-6 text-center">
            <span class="login-register-tip">还没有账户？</span>
            <span class="login-register-actions">
              <a href="/signup" class="register-link-btn">立即注册</a>
              <a href="#" class="forgot-password-link">忘记密码?</a>
            </span>
          </div>
  
          <div class="social-login-divider">
            <span class="divider-text">或通过以下方式登录</span>
          </div>
  
          <div class="social-login-buttons">
            <button @click="handleSocialLogin('google')" class="social-button google-button">
              <span class="social-icon">🇬</span> 使用 Google 登录
            </button>
            <button @click="handleSocialLogin('github')" class="social-button github-button">
              <span class="social-icon">🐙</span> 使用 GitHub 登录
            </button>
            <button @click="handleSocialLogin('instagram')" class="social-button instagram-button">
              <span class="social-icon">📸</span> 使用 Instagram 登录
            </button>
            <button @click="handleSocialLogin('x')" class="social-button x-button">
              <span class="social-icon">X</span> 使用 X 登录
            </button>
          </div>
  
          <div class="user-info-statement">
            <p>
              点击"登录"或使用社交账户，即表示您同意我们的
              <a href="/terms" target="_blank">服务条款</a> 和
              <a href="/privacy" target="_blank">隐私政策</a>。
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  // 假设您的 HyperTextEffect 组件保存在 './HyperTextEffect.vue'
  // 如果路径不同，请修改
  import HyperTextEffect from '@/components/effects/HyperTextEffect.vue'; 
  // 新增导入
  
  const wavyBackgroundCanvas = ref(null);
  let animationFrameId = null;
  
  const loginForm = ref({
    email: '',
    password: '',
  });
  
  const handleLogin = () => {
    console.log('登录信息:', loginForm.value);
    alert(`登录: ${loginForm.value.email}`);
  };
  
  const handleSocialLogin = (provider) => {
    console.log(`尝试使用 ${provider} 登录`);
    alert(`尝试 ${provider} 登录... (实际集成需要OAuth)`);
  };
  
  // --- Wavy Background Logic (保持不变) ---
  let waves = [];
  const waveColors = ['rgba(25, 118, 210, 0.3)', 'rgba(106, 27, 154, 0.3)', 'rgba(0, 150, 136, 0.3)', 'rgba(76, 175, 80, 0.2)'];
  
  class Wave {
    constructor(amplitude, wavelength, speed, yOffset, color, ctx) {
      this.amplitude = amplitude;
      this.wavelength = wavelength;
      this.speed = speed;
      this.yOffset = yOffset;
      this.color = color;
      this.ctx = ctx;
      this.time = Math.random() * 100;
    }
  
    draw(canvasWidth, canvasHeight) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.yOffset);
      for (let x = 0; x < canvasWidth; x++) {
        const y = this.yOffset + this.amplitude * Math.sin((x / this.wavelength) * 2 * Math.PI + this.time);
        this.ctx.lineTo(x, y);
      }
      this.ctx.lineTo(canvasWidth, canvasHeight);
      this.ctx.lineTo(0, canvasHeight);
      this.ctx.closePath();
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.time += this.speed;
    }
  }
  
  function initWaves(canvas, ctx) {
    waves = [];
    const baseAmplitude = canvas.height / 8;
    const baseWavelength = canvas.width / 2;
  
    for (let i = 0; i < waveColors.length; i++) {
      waves.push(new Wave(
        baseAmplitude * (0.6 + Math.random() * 0.8),
        baseWavelength * (0.8 + Math.random() * 0.4),
        0.01 + Math.random() * 0.02,
        canvas.height * (0.4 + i * 0.1 + Math.random() * 0.1),
        waveColors[i],
        ctx
      ));
    }
  }
  
  function animateWaves() {
    const canvas = wavyBackgroundCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    waves.forEach(wave => wave.draw(canvas.width, canvas.height));
    animationFrameId = requestAnimationFrame(animateWaves);
  }
  
  function resizeCanvas() {
      nextTick(() => {
          const canvas = wavyBackgroundCanvas.value;
          if (canvas) {
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                   initWaves(canvas, ctx);
              }
          }
      });
  }
  
  // --- 移除了旧的 Hypertext Logo Logic (handleLogoMouseMove, resetLogoTransform, logoElement) ---
  
  onMounted(() => {
    const canvas = wavyBackgroundCanvas.value;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        initWaves(canvas, ctx);
        animateWaves();
      }
    }
    window.addEventListener('resize', resizeCanvas);
  });
  
  onBeforeUnmount(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', resizeCanvas);
  });
  
  </script>
  
  <style scoped>
  /* ... (之前的 .login-page-container, .wavy-background, .login-content-overlay, .login-form-wrapper 样式保持不变) ... */
  .login-page-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* Prevent scrollbars from canvas */
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  }
  
  .wavy-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  
  .login-content-overlay {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: rgba(0, 0, 0, 0.1); /* Slight dark overlay for content readability */
    backdrop-filter: blur(2px);
  }
  
  .login-form-wrapper {
    background: rgba(20, 20, 30, 0.65);
    backdrop-filter: blur(15px) saturate(150%);
    -webkit-backdrop-filter: blur(15px) saturate(150%);
    padding: 30px 35px;
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 380px;
    min-width: 260px;
    margin: 0 auto;
    color: #e0e0e0;
  }
  
  .login-input,
  .login-button {
    width: 100%;
    max-width: 340px;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
  
  .login-input {
    padding: 14px 16px;
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: #f0f0f0;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    margin-bottom: 18px;
  }
  .login-input::placeholder {
    color: rgba(200, 200, 200, 0.6);
  }
  .login-input:focus {
    outline: none;
    border-color: rgba(0, 220, 220, 0.7);
    background-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 15px rgba(0, 220, 220, 0.3);
  }
  
  .login-register-tip {
    color: #b0b8c9;
    font-size: 0.97rem;
    margin-top: 18px;
    margin-bottom: 0;
    display: inline;
  }
  .login-register-actions {
    display: inline-flex;
    gap: 10px;
    vertical-align: middle;
  }
  
  .register-link-btn,
  .forgot-password-link {
    display: inline-block;
    font-size: 0.95rem;
    color: #5eead4;
    background: rgba(94, 234, 212, 0.08);
    border-radius: 6px;
    padding: 2px 12px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    text-decoration: none;
    min-width: 72px;
    text-align: center;
  }
  .register-link-btn:hover,
  .forgot-password-link:hover {
    background: #2dd4bf;
    color: #fff;
    text-decoration: none;
  }
  
  .login-button {
    background: linear-gradient(90deg, #0d9488, #0d9488);
    color: white;
    padding-top: 0.85rem;
    padding-bottom: 0.85rem;
    border-radius: 10px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 15px rgba(0, 128, 128, 0.3);
    transform-origin: center;
    margin-bottom: 18px;
  }
  .login-button:hover {
    background: linear-gradient(90deg, #0d9488, #14b8a6);
    box-shadow: 0 6px 20px rgba(0, 128, 128, 0.4);
    transform: scale(1.03) translateY(-1px);
  }
  .login-button:active {
    transform: scale(0.98) translateY(0px);
    box-shadow: 0 2px 10px rgba(0, 128, 128, 0.2);
  }
  
  
  .social-login-divider {
    margin-top: 18px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
  }
  .social-login-divider::before,
  .social-login-divider::after {
    content: '';
    flex-grow: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  .divider-text {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 0.75rem;
    color: rgba(200, 200, 200, 0.7);
    font-weight: 500;
  }
  
  .social-login-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  
  .social-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    color: #e0e0e0;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    background-color: rgba(255, 255, 255, 0.05);
  }
  .social-button:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
  .social-button:active {
    transform: translateY(0px) scale(0.98);
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  }
  
  .social-icon {
    font-size: 1.25rem;
    margin-right: 0.75rem;
    transition: transform 0.3s ease;
  }
  .social-button:hover .social-icon {
    transform: scale(1.2) rotate(-5deg);
  }
  .x-button .social-icon {
    font-weight: bold;
  }
  
  .user-info-statement {
    margin-top: 2rem;
    text-align: center;
  }
  .user-info-statement p {
    font-size: 0.75rem;
    color: rgba(200, 200, 200, 0.6);
    line-height: 1.6;
    margin: 0 auto;
    text-align: center;
    word-break: break-all;
    white-space: normal;
    display: inline-block;
    max-width: 90%;
  }
  .user-info-statement a {
    text-decoration: underline;
    transition: color 0.3s ease;
    color: #5eead4;
    display: inline-block;
    word-break: break-all;
  }
  
  </style>
 