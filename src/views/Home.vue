<template>
  <div class="home">
    <Hero msg="Welcome to Your Vue.js App"/>
    <!-- 欢迎页面组件 -->
  </div>
</template>

<script>
import Hero from '../components/Hero.vue'
  
export default {
  name: 'Home',
  components: {
    Hero
  }
}
</script>

<style scoped>
.home {
  flex: 1;
}
</style> 