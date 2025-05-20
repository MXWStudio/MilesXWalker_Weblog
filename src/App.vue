<template>
  <!-- 根容器 -->
  <div id="app"> 
    <Header msg="Welcome to Your Vue.js App"/>
    <!-- 顶部导航组件 -->
    <router-view></router-view>
    <!-- 路由视图 -->
    <Gallery msg="Welcome to Your Vue.js App"/> 
    <!-- 作品图集组件 -->
    <Contact id="my-actual-contact-section" style="min-height: 2000px; background: #f9f9f9;">
      <!-- 这里可以加内容撑高页面 -->
      <div style="height: 2000px;"></div>
    </Contact>
    <!-- 联系组件 -->
    <Footer contactSectionSelector="#my-actual-contact-section" />
  </div>
</template>

<script>
// 导入所需的组件
import Header from './components/Header.vue'          // 导入顶部导航组件
import Gallery from './components/Gallery.vue'       // 导入作品图集组件
import Contact from './components/Contact.vue'       // 导入联系组件
import Footer from './components/Footer.vue'         // 导入底部导航组件

export default {
  name: 'app',                // 定义组件名称
  components: {
    Header,                  // 注册顶部导航组件
    Gallery,                 // 注册作品图集组件
    Contact,                 // 注册联系组件
    Footer                   // 注册底部导航组件      
  }
}
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
  /* display: flex; */
  /* flex-direction: column; */
}

/* 主要内容区域样式 */
.main-content {
  flex: 1;                    /* 占据剩余所有空间 */
  padding: 20px;              /* 内边距 */
  margin-top: 20px;           /* 顶部外边距，与Header保持间距 */
}

/* 标题样式 */
h1 {
  color: red;                 /* 标题文字颜色 */
}
</style>

/* eslint-disable */
