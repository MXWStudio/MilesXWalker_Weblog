// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 启用 Nuxt 开发工具
  devtools: { enabled: true },
  
  // 配置模块
  modules: [
    'motion-v/nuxt'
  ],

  // 配置构建选项
  build: {
    transpile: ['motion-v']
  },

  // 配置应用
  app: {
    head: {
      title: 'MilesXWalker Studio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'MilesXWalker Studio - 创意工作室' }
      ]
    }
  }
}) 