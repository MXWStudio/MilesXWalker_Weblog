<template>
  <div class="avatar-container">
    <div class="avatar-placeholder">
      <div class="avatar-icon">🤖</div>
      <p>虚拟人形象</p>
      <small>3D模型加载中...</small>
    </div>
  </div>
</template>

<script setup>
  console.log('Avatar3D组件已加载')
</script>
<style scoped>
  .avatar-container {
    width: 100%;
    height: 280px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-placeholder {
    text-align: center;
    color: white;
  }
  .avatar-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }
</style>
