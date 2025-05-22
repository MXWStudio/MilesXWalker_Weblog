<template>
  <header class="app-header">
    <div class="header-section left-section">
      <nav class="categories">
        <router-link to="/about" class="category-link">About</router-link>
        <router-link to="/photos" class="category-link">Photos</router-link>
        <router-link to="/videos" class="category-link">Videos</router-link>
        <router-link to="/contact" class="category-link">Contact</router-link>
      </nav>
    </div>

    <div class="header-section center-section">
      <router-link to="/" class="logo-container">
        <svg class="logo-badge" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      </router-link>
    </div>

    <div class="header-section right-section">
      <div class="social-media-icons">
        <a href="https://www.youtube.com/channel/UCWsm3OC_I_S572PVoz85CBg" aria-label="YouTube" class="social-icon" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
        </a>
        <a href="mailto:milesxwalkerstudio@gmail.com" aria-label="Email" class="social-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
        </a>
        <a href="https://www.instagram.com/milesxwalker/" aria-label="Instagram" class="social-icon" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4c2.21 0 4 1.791 4 4s-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
// Logo相关的 ref 和方法已移除，因为现在使用静态SVG徽标
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between; /* 主要部分之间留有空间 */
  align-items: center; /* 垂直居中对齐 */
  padding: 15px 25px; /* 增加上下内边距 */
  background-color: #ffffff; /* 页眉背景色 */
  border-bottom: 1px solid #e0e0e0; /* 页眉底部分割线 */
  min-height: 70px; /* 增加最小高度 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* 调整阴影 */
}

.header-section {
  display: flex;
  align-items: center;
  flex: 1; /* 平均分配空间，有助于居中 */
}

/* 左侧部分：分类 */
.left-section {
  justify-content: flex-start; /* 改为靠左对齐 */
  padding-left: 20px; /* 添加左侧内边距 */
}

.categories {
  display: flex;
  gap: 15px; /* 分类链接之间的间距 */
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
.center-section {
  flex: 0 0 auto;
  justify-content: center;
  padding: 0 15px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  text-decoration: none;
}

.logo-container:hover {
  background-color: rgba(0, 123, 255, 0.08);
}

.logo-badge {
  color: #007bff;
  width: 42px;
  height: 42px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.logo-badge:hover {
  transform: scale(1.05);
  color: #0056b3;
}

/* 右侧部分：社交媒体图标 */
.right-section {
  justify-content: flex-end; /* 改为靠右对齐 */
  padding-right: 20px; /* 添加右侧内边距 */
}

.social-media-icons {
  display: flex;
  gap: 12px; /* 图标之间的间距 */
}

.social-icon {
  color: #555;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background-color: transparent;
}

.social-icon:hover {
  color: #007bff;
  transform: translateY(-1px);
  background-color: rgba(0, 123, 255, 0.08);
}

.social-icon svg {
  width: 22px;
  height: 22px;
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

  .social-media-icons {
    gap: 6px;
  }

  .social-icon {
    padding: 6px;
  }

  .social-icon svg {
    width: 20px;
    height: 20px;
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

  .social-icon {
    padding: 5px;
  }

  .social-icon svg {
    width: 18px;
    height: 18px;
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

  .social-icon {
    padding: 4px;
  }

  .social-icon svg {
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
</style>
