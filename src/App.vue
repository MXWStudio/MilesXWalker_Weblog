<template>
  <!-- 根容器 -->
  <div id="app"> 
    <Header msg="Welcome to Your Vue.js App"/>
    <!-- 顶部导航组件 -->
    <router-view></router-view>
    <!-- 路由视图 -->
    <Footer />
    <!-- Stagewise 工具栏 -->
    <StagewiseToolbar v-if="isDevelopment" :config="stagewiseConfig" />
  </div>
</template>

<script setup>
// 导入所需的组件
import Header from './components/layout/Header.vue'          // 导入顶部导航组件
import Footer from './components/layout/Footer.vue'         // 导入底部导航组件
import { StagewiseToolbar } from '@stagewise/toolbar-vue'  // 导入 Stagewise 工具栏组件
import { computed } from 'vue'

// Stagewise 配置
const stagewiseConfig = {
  plugins: []
}

// 判断是否为开发环境
const isDevelopment = computed(() => import.meta.env.DEV)
</script>

<style>
#app {
  /* 基础字体设置 */
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /* 字体平滑渲染，提升显示效果 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* 文字颜色设置 */
  color: #2c3e50;
  /* 确保页面至少占满整个视口高度 */
  min-height: 100vh;
}

/* 主要内容区域样式 */
.main-content {
  flex: 1;                    /* 占据剩余所有空间 */
  padding: 20px;              /* 内边距 */
  margin-top: 20px;           /* 顶部外边距，与Header保持间距 */
}

/* 标题样式 */
h1 {
  color: #2c3e50;            /* 修改标题颜色为深灰色 */
}
</style>

/* eslint-disable */
