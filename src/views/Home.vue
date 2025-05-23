<template>
  <div class="home">
    <Hero msg="Welcome to Your Vue.js App"/>
    <!-- 欢迎页面组件 -->
    <Gallery />
  </div>
</template>

<script setup>
import Hero from '@/components/ui/Hero.vue'
import Gallery from '@/components/ui/Gallery.vue'
</script>

<style scoped>
.home {
  flex: 1;
}
</style> 