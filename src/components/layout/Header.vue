<template>
  <header class="app-header">
    <div class="header-section left-section">
      <nav class="categories">
        <router-link to="/about" class="category-link">About</router-link>
        <div class="dropdown">
          <router-link to="/works" class="category-link">Works</router-link>
          <div class="dropdown-content">
            <router-link to="/photoindex" class="dropdown-item">Photos</router-link>
            <router-link to="/videoindex" class="dropdown-item">Videos</router-link>
            <router-link to="/ai" class="dropdown-item">AI</router-link>
          </div>
        </div>
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
  </header>
</template>

<script setup>
// Logo相关的 ref 和方法已移除，因为现在使用静态SVG徽标
</script>

<style scoped>
.app-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 8%;
  background-color: #ffffff;
  min-height: 70px;
  height: 70px;
}

.left-section, .right-section {
  flex: 0 0 auto;     /* 左右区域固定宽度 */
  height: 100%;
  display: flex;
  align-items: center;
}

.center-section {
  position: static;
  flex: 0 0 auto;     /* 改回固定宽度 */
  justify-content: center;
  align-items: center;
  display: flex;
  width: 380px;       /* 固定宽度 */
  margin: 0 auto;     /* 水平居中 */
  padding: 0;
  z-index: 1;
  height: 100%;
}

/* 左侧部分：分类 */
.left-section {
  justify-content: flex-start;
  padding-left: 0;
}

.categories {
  display: flex;
  gap: 15px;
  margin-left: 0;
}

.category-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.95em;
  position: relative;
  background-color: transparent;
}

.category-link:hover {
  background-color: rgba(0, 123, 255, 0.08);
  color: #007bff;
  transform: translateY(-1px);
}

.category-link::after {
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

.category-link:hover::after {
  width: 70%;
  opacity: 1;
}

/* 中间部分：Logo */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 15px;
  border-radius: 0;
  height: 100%;
  background: none !important;
}

.logo-container:hover .logo-badge {
  transform: scale(1.04);
  opacity: 0.88;
}

.logo-badge {
  height: 48px;
  max-width: 180px;
  width: auto;
  object-fit: contain;
  display: block;
  margin-right: 90px;
  background: none;
  box-shadow: none;
  transition: transform 0.18s cubic-bezier(.4,0,.2,1), opacity 0.18s cubic-bezier(.4,0,.2,1);
}

/* 右侧部分：社交媒体图标 */
.login-nav-btn {
  margin-left: 18px;
  padding: 8px 22px;
  background: #769fcd;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-nav-btn:hover {
  background: #4a6fa5;
}

.signup-nav-btn {
  margin-left: 10px;
  padding: 8px 22px;
  background: #e0e7ef;
  color: #4a6fa5;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.signup-nav-btn:hover {
  background: #b6c6e3;
  color: #2c3e50;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-header {
    padding: 10px 15px;
    min-height: 56px;
  }

  .categories {
    gap: 6px;
  }

  .category-link {
    padding: 6px 10px;
    font-size: 0.9em;
  }

  .login-nav-btn {
    padding: 6px 18px;
  }

  .signup-nav-btn {
    padding: 6px 10px;
  }

  .logo-badge {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 600px) {
  .left-section .categories {
    font-size: 0.85em;
    gap: 4px;
  }

  .category-link {
    padding: 5px 8px;
  }

  .app-header {
    padding: 8px 12px;
  }

  .login-nav-btn {
    padding: 5px 18px;
  }

  .signup-nav-btn {
    padding: 5px 10px;
  }

  .logo-badge {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 450px) {
  .left-section .categories {
    display: none;
  }

  .app-header {
    justify-content: space-between;
    padding: 6px 10px;
  }

  .left-section {
    flex: 0 0 auto;
  }

  .right-section {
    justify-content: flex-end;
  }

  .login-nav-btn {
    padding: 4px 18px;
  }

  .signup-nav-btn {
    padding: 4px 10px;
  }

  .logo-badge {
    width: 16px;
    height: 16px;
  }
}

/* 路由链接激活状态 */
.router-link-active {
  color: #007bff;
  font-weight: 600;
  background-color: rgba(0, 123, 255, 0.08);
}

.router-link-active::after {
  width: 70%;
  opacity: 1;
}

.login-content-overlay {
  display: flex;
  flex-direction: column;
  align-items: center; /* 保证内容水平居中 */
}
.login-form-wrapper {
  max-width: 380px;
  width: 100%;
  margin: 0 auto;
}

/* 下拉菜单样式 */
.dropdown {
  position: relative;
  display: inline-block;
  height: 100%;
  display: flex;
  align-items: center;
}

.dropdown .category-link {
  height: 100%;
  display: flex;
  align-items: center;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgba(0, 123, 255, 0.08);
  color: #007bff;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 20px;
  margin-right: 0;
  border: 2px solid #e0e7ef;
  background: #f5f6fa;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #769fcd;
}
</style>
