<template>
  <header class="app-header">
    <div class="header-section left-section">
      <nav class="categories">
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
  </header>
</template>

<script setup>
// Logo相关的 ref 和方法已移除，因为现在使用静态SVG徽标
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

@media (max-width: 450px) {
  .left-section .categories {
    display: none;
  }

  .app-header {
    padding: 6px 3%; /* 在非常小的屏幕上，同样调整为3% */
  }

  .left-section {
    margin-right: 10px;
  }

  .right-section {
    margin-left: 10px;
  }

  .login-nav-btn {
    padding: 4px 8px;
    font-size: 0.75em;
  }

  .logo-badge {
    height: 24px;
  }

  .user-avatar {
    width: 20px;
    height: 20px;
    margin-left: 4px;
  }

  .dropdown-menu {
    min-width: 100px;
  }

  .dropdown-item {
    padding: 4px 8px;
    font-size: 0.8em;
  }

  /* .dropdown-trigger 会从 .category-link 继承响应式的 padding 和 font-size,
     此处特定的覆盖是不必要的，并且导致了不一致。 */
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
