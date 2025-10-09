<template>
  <header class="app-header">
    <!-- 汉堡菜单按钮 - 仅在移动端显示 -->
    <button class="hamburger-btn" @click="toggleMobileMenu" aria-label="Toggle menu">
      <span :class="{ active: isMobileMenuOpen }"></span>
      <span :class="{ active: isMobileMenuOpen }"></span>
      <span :class="{ active: isMobileMenuOpen }"></span>
    </button>

    <div class="header-section left-section">
      <nav class="categories desktop-nav">
        <router-link to="/about" class="category-link">About</router-link>
        <div class="dropdown">
          <span class="category-link dropdown-trigger">Works</span>
          <div class="dropdown-menu">
            <router-link to="/photoindex" class="dropdown-item">Photos</router-link>
            <router-link to="/videoindex" class="dropdown-item">Videos</router-link>
            <router-link to="/ai" class="dropdown-item">AI</router-link>
          </div>
        </div>
        <div class="dropdown">
          <span class="category-link dropdown-trigger">Design</span>
          <div class="dropdown-menu">
            <router-link to="/flat-visual" class="dropdown-item">Flat Visual</router-link>
            <router-link to="/3d-modelling" class="dropdown-item">3D Modelling</router-link>
          </div>
        </div>
        <router-link to="/blog" class="category-link">Blog</router-link>
        <router-link to="/subscribe" class="category-link">Subscribe</router-link>
      </nav>
    </div>

    <div class="header-section center-section">
      <router-link to="/" class="logo-container">
        <img src="@/assets/images/logos/M_logo_combinatorial.png" alt="Logo" class="logo-badge" />
      </router-link>
    </div>

    <div class="header-section right-section">
      <button class="login-nav-btn" @click="$router.push('/login')">Login</button>
      <img class="user-avatar" src="https://i.pravatar.cc/100" alt="User Avatar" />
    </div>

    <!-- 移动端侧边栏导航 -->
    <transition name="slide">
      <div v-if="isMobileMenuOpen" class="mobile-nav-overlay" @click="closeMobileMenu">
        <nav class="mobile-nav" @click.stop>
          <div class="mobile-nav-header">
            <h3>导航菜单</h3>
            <button class="close-btn" @click="closeMobileMenu" aria-label="Close menu">✕</button>
          </div>

          <div class="mobile-nav-content">
            <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">
              About
            </router-link>

            <div class="mobile-dropdown">
              <div class="mobile-dropdown-trigger" @click="toggleDropdown('works')">
                <span>Works</span>
                <span class="arrow" :class="{ open: openDropdown === 'works' }">▼</span>
              </div>
              <transition name="expand">
                <div v-show="openDropdown === 'works'" class="mobile-dropdown-content">
                  <router-link
                    to="/photoindex"
                    class="mobile-dropdown-item"
                    @click="closeMobileMenu"
                  >
                    Photos
                  </router-link>
                  <router-link
                    to="/videoindex"
                    class="mobile-dropdown-item"
                    @click="closeMobileMenu"
                  >
                    Videos
                  </router-link>
                  <router-link to="/ai" class="mobile-dropdown-item" @click="closeMobileMenu">
                    AI
                  </router-link>
                </div>
              </transition>
            </div>

            <div class="mobile-dropdown">
              <div class="mobile-dropdown-trigger" @click="toggleDropdown('design')">
                <span>Design</span>
                <span class="arrow" :class="{ open: openDropdown === 'design' }">▼</span>
              </div>
              <transition name="expand">
                <div v-show="openDropdown === 'design'" class="mobile-dropdown-content">
                  <router-link
                    to="/flat-visual"
                    class="mobile-dropdown-item"
                    @click="closeMobileMenu"
                  >
                    Flat Visual
                  </router-link>
                  <router-link
                    to="/3d-modelling"
                    class="mobile-dropdown-item"
                    @click="closeMobileMenu"
                  >
                    3D Modelling
                  </router-link>
                </div>
              </transition>
            </div>

            <router-link to="/blog" class="mobile-nav-link" @click="closeMobileMenu">
              Blog
            </router-link>
            <router-link to="/subscribe" class="mobile-nav-link" @click="closeMobileMenu">
              Subscribe
            </router-link>
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// 移动端菜单状态
const isMobileMenuOpen = ref(false)
const openDropdown = ref(null)

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (!isMobileMenuOpen.value) {
    openDropdown.value = null
  }
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  openDropdown.value = null
}

// 切换移动端下拉菜单
const toggleDropdown = name => {
  openDropdown.value = openDropdown.value === name ? null : name
}
</script>

<style>
.app-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 2%; /* 左右内边距从4%改为2%，让内容更靠边 */
  background-color: #ffffff;
  min-height: 70px;
  height: 70px;
  width: 100%;
  box-sizing: border-box;
  /* overflow: hidden; */ /* 移除或注释掉这里，以允许下拉菜单溢出头部 */
}

.left-section,
.right-section {
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  min-width: 0;
  max-width: 40%;
}

.left-section {
  justify-content: flex-start;
  /* margin-right: 20px; 移除右边距，让左侧更贴边 */
}

.right-section {
  justify-content: flex-end;
  margin-left: 20px;
}

.center-section {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  z-index: 2;
  flex: 0 0 auto;
}

/* 左侧部分：分类 */
.categories {
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  /* overflow: hidden; */ /* 移除或注释掉这里，以允许下拉菜单溢出分类栏 */
  width: 100%;
}

.category-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.9em;
  position: relative;
  background-color: transparent;
  white-space: nowrap;
  flex-shrink: 0;
}

.category-link:hover {
  background-color: rgba(0, 123, 255, 0.08);
  color: #007bff;
  transform: translateY(-1px);
}

/* 使用 ::before 生成下划线，以避免与下拉箭头的 ::after 冲突 */
.category-link::before {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 4px;
  left: 50%;
  background-color: #007bff;
  transition: all 0.2s ease;
  transform: translateX(-50%);
  opacity: 0;
}

.category-link:hover::before {
  width: 70%;
  opacity: 1;
}

/* 针对 Works 下拉菜单触发器的下划线特殊调整 */
/* 现在针对 ::before 进行调整 */
.dropdown-trigger.category-link::before {
  /* 尝试将横线稍微向左移动，以补偿右侧箭头带来的宽度影响 */
  /* 这个值可能需要微调，5px 是一个基于箭头宽度的估算值 */
  left: calc(50% - 5px);
}

/* 中间部分：Logo */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0;
  background: none !important;
  flex: 0 0 auto;
}

.logo-container:hover .logo-badge {
  transform: scale(1.04);
  opacity: 0.88;
}

.logo-badge {
  height: 40px;
  width: auto;
  object-fit: contain;
  display: block;
  background: none;
  box-shadow: none;
  transition:
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 右侧部分：登录按钮和头像 */
.login-nav-btn {
  padding: 6px 16px;
  background: #769fcd;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.login-nav-btn:hover {
  background: #4a6fa5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 12px;
  border: 2px solid #e0e7ef;
  background: #f5f6fa;
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #769fcd;
}

/* 下拉菜单样式 */
.dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.dropdown-trigger {
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 90px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
  transform: translateY(8px);
  z-index: 1000;
  /* 添加一个透明的缓冲区区域 */
  padding-top: 8px;
  margin-top: -8px;
}

.dropdown:hover {
  z-index: 3;
}

.dropdown:hover .dropdown-menu,
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 10px 6px;
  color: #333;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s;
  /* 确保菜单项有足够的点击区域 */
  margin: 2px 0;
}

.dropdown-item:hover,
.dropdown-item.router-link-active {
  background: #f0f6ff;
  color: #007bff;
}

/* 第一个菜单项悬浮/激活时，顶部圆角 */
.dropdown-item:first-child:hover,
.dropdown-item:first-child.router-link-active {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

/* 最后一个菜单项悬浮/激活时，底部圆角 */
.dropdown-item:last-child:hover,
.dropdown-item:last-child.router-link-active {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* 添加一个伪元素作为缓冲区 */
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
  background: transparent;
}

/* 下拉箭头 */
.dropdown-trigger::after {
  content: '';
  display: inline-block;
  margin-left: 6px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #333;
  transition: transform 0.2s ease;
  vertical-align: middle; /* 尝试让箭头与文本垂直居中对齐 */
}

.dropdown:hover .dropdown-trigger::after {
  transform: rotate(180deg); /* 悬浮时箭头向上翻转 */
}

/* ===== 汉堡菜单按钮样式 ===== */
.hamburger-btn {
  display: none; /* 默认在桌面端隐藏 */
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  position: relative;
}

.hamburger-btn span {
  width: 100%;
  height: 3px;
  background-color: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-btn span.active:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}

.hamburger-btn span.active:nth-child(2) {
  opacity: 0;
}

.hamburger-btn span.active:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}

/* ===== 移动端导航覆盖层和侧边栏 ===== */
.mobile-nav-overlay {
  display: none; /* 默认隐藏 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(4px);
}

.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  max-width: 85vw;
  height: 100%;
  background: #ffffff;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  z-index: 1000;
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e7ef;
  background: #f8f9fa;
}

.mobile-nav-header h3 {
  margin: 0;
  font-size: 1.2em;
  color: #2c3e50;
  font-weight: 600;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 28px;
  color: #333;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: rotate(90deg);
}

.mobile-nav-content {
  padding: 10px 0;
}

.mobile-nav-link {
  display: block;
  padding: 16px 20px;
  color: #333;
  text-decoration: none;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: #f0f6ff;
  color: #007bff;
  border-left-color: #007bff;
}

/* 移动端下拉菜单 */
.mobile-dropdown {
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

.mobile-dropdown-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: #333;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-dropdown-trigger:hover {
  background: #f0f6ff;
  color: #007bff;
}

.mobile-dropdown-trigger .arrow {
  font-size: 0.7em;
  transition: transform 0.3s ease;
  color: #666;
}

.mobile-dropdown-trigger .arrow.open {
  transform: rotate(-180deg);
  color: #007bff;
}

.mobile-dropdown-content {
  background: #f8f9fa;
}

.mobile-dropdown-item {
  display: block;
  padding: 12px 20px 12px 36px;
  color: #555;
  text-decoration: none;
  font-size: 0.95em;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.mobile-dropdown-item:hover,
.mobile-dropdown-item.router-link-active {
  background: #e3f2fd;
  color: #007bff;
  border-left-color: #007bff;
}

/* ===== 过渡动画 ===== */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-active .mobile-nav,
.slide-leave-active .mobile-nav {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .mobile-nav {
  transform: translateX(-100%);
}

.slide-leave-to .mobile-nav {
  transform: translateX(-100%);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-header {
    padding: 10px 4%; /* 相应调整中等屏幕的左右内边距 */
  }

  .categories {
    gap: 6px;
  }

  .category-link {
    padding: 5px 8px;
    font-size: 0.85em;
  }

  .login-nav-btn {
    padding: 5px 12px;
    font-size: 0.85em;
  }

  .logo-badge {
    height: 32px;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    margin-left: 8px;
  }

  .dropdown-menu {
    min-width: 140px;
    padding: 6px 0;
  }

  .dropdown-item {
    padding: 6px 12px;
    font-size: 0.9em;
  }

  /* .dropdown-trigger 会从 .category-link 继承响应式的 padding 和 font-size,
     此处特定的覆盖是不必要的，并且导致了不一致。 */
}

@media (max-width: 600px) {
  .app-header {
    padding: 8px 3%; /* 在较小屏幕上，可以将内边距调整为3%，避免内容区过窄 */
  }

  .categories {
    gap: 4px;
  }

  .category-link {
    padding: 4px 6px;
    font-size: 0.8em;
  }

  .login-nav-btn {
    padding: 4px 10px;
    font-size: 0.8em;
  }

  .logo-badge {
    height: 28px;
  }

  .user-avatar {
    width: 24px;
    height: 24px;
    margin-left: 6px;
  }

  .dropdown-menu {
    min-width: 120px;
    padding: 4px 0;
  }

  .dropdown-item {
    padding: 5px 10px;
    font-size: 0.85em;
  }

  /* .dropdown-trigger 会从 .category-link 继承响应式的 padding 和 font-size,
     此处特定的覆盖是不必要的，并且导致了不一致。 */
}

@media (max-width: 768px) {
  /* 在移动端显示汉堡菜单按钮 */
  .hamburger-btn {
    display: flex;
  }

  /* 在移动端隐藏桌面导航 */
  .desktop-nav {
    display: none !important;
  }

  /* 在移动端显示移动导航覆盖层（由 v-if 控制） */
  .mobile-nav-overlay {
    display: block;
  }

  /* 调整左侧区域 */
  .left-section {
    flex: 0 0 auto;
    min-width: auto;
    max-width: none;
  }
}

/* 路由链接激活状态 */
.router-link-active {
  color: #007bff;
  font-weight: 600;
  background-color: rgba(0, 123, 255, 0.08);
}

/* 激活状态的下划线也应针对 ::before */
.router-link-active::before {
  width: 70%;
  opacity: 1;
}
</style>
