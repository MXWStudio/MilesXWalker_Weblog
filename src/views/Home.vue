<template>
  <div class="home">
    <Hero msg="Welcome to Your Vue.js App" />
    <!-- 欢迎页面组件 -->
    <!-- Gallery 模块已移除 -->
  </div>
</template>

<script setup>
import Hero from '@/components/ui/Hero.vue'
// Gallery 组件已移除
</script>

<style scoped>
.home {
  flex: 1;
}
</style>
