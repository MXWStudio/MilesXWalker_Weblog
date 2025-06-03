<template>
  <div class="login-page-container">
    <!-- Removed canvas for wavy background -->
    <div class="login-content-overlay">
      <div class="login-form-wrapper">
        <h2 class="login-title">USER LOGIN</h2>
        <form class="space-y-6 mt-10" @submit.prevent="handleLogin">
          <div class="input-wrapper">
            <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              required
              class="login-input"
              placeholder="邮箱 (Email)"
            />
          </div>
          <div class="input-wrapper">
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              required
              class="login-input"
              placeholder="密码 (Password)"
            />
          </div>
          <button type="submit" class="login-button">LOGIN</button>
        </form>

        <div class="mt-6 login-register-row">
          <a href="#" class="register-link-btn" @click.prevent="goToSignup">
            <span class="icon">📝</span>
            Sign up
          </a>
          <a href="#" class="forgot-password-link">
            <span class="icon">🔑</span>
            Forgot password?
          </a>
        </div>

        <div class="social-login-divider">
          <span class="divider-text">Or login with</span>
        </div>

        <div class="social-login-buttons">
          <button class="social-button google-button" @click="handleSocialLogin('google')">
            <Icon icon="mdi:google" class="social-icon" />
            Google
          </button>
          <button class="social-button github-button" @click="handleSocialLogin('github')">
            <Icon icon="mdi:github" class="social-icon" />
            GitHub
          </button>
          <button class="social-button instagram-button" @click="handleSocialLogin('instagram')">
            <Icon icon="mdi:instagram" class="social-icon" />
            Instagram
          </button>
          <button class="social-button x-button" @click="handleSocialLogin('x')">
            <Icon icon="simple-icons:x" class="social-icon" />
            X
          </button>
        </div>

        <div class="user-info-statement">
          <p>
            By clicking "Login" or using social accounts, you agree to our
            <a href="/terms" target="_blank">Terms of Service</a>
            and
            <a href="/privacy" target="_blank">Privacy Policy</a>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Icon } from '@iconify/vue'

  const loginForm = ref({
    email: '',
    password: '',
  })

  const router = useRouter()

  const handleLogin = () => {
    console.log('登录信息:', loginForm.value)
    alert(`登录: ${loginForm.value.email}`)
  }

  const handleSocialLogin = provider => {
    console.log(`尝试使用 ${provider} 登录`)
    alert(`尝试 ${provider} 登录... (实际集成需要OAuth)`)
  }

  const goToSignup = () => {
    router.push('/signup')
  }
</script>

<style scoped>
  .login-page-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* Prevent scrollbars from canvas */
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f6fb; /* Match Signup.vue background */
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif; /* Common system font stack */
  }

  .login-content-overlay {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 20px; /* Keep padding for content */
    padding-left: 1px; /* 你可以根据需要调整数值 */
  }

  .login-form-wrapper {
    background: #fff; /* Match Signup.vue form background */
    padding: 30px 35px;
    border-radius: 10px; /* Match Signup.vue form border-radius */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); /* Match Signup.vue form box-shadow */
    width: 100%;
    max-width: 380px;
    min-width: 260px;
    margin: 0 auto;
    color: #333; /* Default text color for light theme */
  }

  .login-title {
    text-align: center;
    margin-bottom: 25px;
    color: #2c3e50; /* Match Signup.vue h2 color */
    font-size: 1.75rem; /* Adjust as needed */
    font-weight: 600;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 0;
    padding: 0 1px; /* 添加微小内边距防止溢出 */
  }

  .login-input,
  .login-button {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    display: block;
    box-sizing: border-box; /* 确保padding和border包含在宽度内 */
  }

  .login-input {
    padding: 10px 12px; /* Match Signup.vue input padding */
    background-color: #fff;
    border: 1px solid #d1d5db; /* Match Signup.vue input border */
    border-radius: 6px; /* Match Signup.vue input border-radius */
    color: #333;
    font-size: 1em; /* Match Signup.vue input font-size */
    transition: all 0.3s ease;
    margin-bottom: 18px;
  }
  .login-input::placeholder {
    color: #9ca3af; /* Lighter placeholder text */
  }
  .login-input:focus {
    outline: none;
    border-color: #769fcd; /* Match Signup.vue input focus border */
    box-shadow: 0 0 0 3px rgba(118, 159, 205, 0.2); /* Optional focus ring */
  }

  .login-register-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 380px;
    margin: 18px auto 0 auto;
    padding: 0 2px;
  }
  .login-register-tip {
    color: #555;
    font-size: 0.97rem;
    display: inline-block;
    vertical-align: middle;
    margin: 0;
  }
  .register-link-btn,
  .forgot-password-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
    color: #769fcd;
    background: transparent;
    border-radius: 6px;
    padding: 4px 8px;
    border: none;
    cursor: pointer;
    transition:
      color 0.2s,
      background-color 0.2s;
    text-decoration: none;
    min-width: 72px;
    text-align: center;
    margin: 0;
  }
  .register-link-btn:hover,
  .forgot-password-link:hover {
    color: #4a6fa5; /* Match Signup.vue link hover color */
    background-color: rgba(74, 107, 165, 0.1);
    text-decoration: none;
  }

  .login-button {
    background: #769fcd; /* Match Signup.vue button background */
    color: white;
    padding: 12px 0; /* Match Signup.vue button padding */
    border-radius: 6px; /* Match Signup.vue button border-radius */
    font-weight: 600;
    font-size: 1.1em; /* Match Signup.vue button font-size */
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: none; /* Cleaner look */
    margin-bottom: 18px;
  }
  .login-button:hover {
    background: #4a6fa5; /* Match Signup.vue button hover background */
    /* transform: scale(1.03) translateY(-1px); Optional: keep if desired */
  }
  .login-button:active {
    transform: scale(0.99);
    /* box-shadow: 0 2px 10px rgba(0, 128, 128, 0.2); */
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
    border-bottom: 1px solid #d1d5db; /* Lighter divider line */
  }
  .divider-text {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 0.85rem;
    color: #555; /* Darker text for light theme */
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
    padding: 0.65rem 1rem;
    border: 1px solid #d1d5db; /* Standard border */
    border-radius: 6px;
    color: #333; /* Default text color */
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    background-color: #fff; /* White background for social buttons */
  }
  .social-button:hover {
    color: #fff; /* Text color on hover for all social buttons */
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  /* Google Button */
  .google-button:hover {
    background-color: #4285f4;
    border-color: #4285f4;
  }

  /* GitHub Button */
  .github-button:hover {
    background-color: #333;
    border-color: #333;
  }

  /* Instagram Button */
  .instagram-button:hover {
    background-color: #e1306c; /* Solid pink/magenta */
    border-color: #e1306c;
  }
  /* Optional: Instagram gradient on hover - more complex */
  /*
  .instagram-button:hover {
    background-image: linear-gradient(to right, #833ab4, #fd1d1d, #fcb045);
    border-color: transparent;
  }
  */

  /* X Button */
  .x-button:hover {
    background-color: #000000;
    border-color: #000000;
  }

  .social-button:active {
    transform: translateY(0px) scale(0.98);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  .social-icon {
    font-size: 1.5rem;
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
    color: #555; /* Darker text for light theme */
    line-height: 1.6;
    margin: 0 auto;
    text-align: center;
    word-break: break-all;
    white-space: normal;
    display: inline-block;
    max-width: 100%;
  }
  .user-info-statement a {
    text-decoration: underline;
    transition: color 0.3s ease;
    color: #5eead4;
    display: inline-block;
    word-break: break-all;
  }

  .icon {
    font-size: 1.1em;
    margin-right: 3px;
  }
</style>
