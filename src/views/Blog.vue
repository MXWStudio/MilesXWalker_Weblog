<!-- Blog页面组件 -->
<template>
  <div class="blog-page">
    <!-- 测试状态提示 -->
    <div class="publish-status">
      <span class="status-badge">测试中</span>
      <span class="status-text">当前内容为测试数据，实际内容待更新</span>
    </div>

    <!-- 搜索和订阅区域 -->
    <div class="blog-header">
      <h1>博客文章</h1>
      <p>分享我的摄影心得、技术探索和生活感悟</p>
    </div>

    <div class="blog-container">
      <!-- 侧边栏 -->
      <aside class="blog-sidebar">
        <!-- 虚拟人展示区域 -->
        <div class="sidebar-section avatar-section">
          <h3>我的虚拟形象</h3>
          <p class="avatar-intro">这是我的3D虚拟形象，可以旋转查看哦！</p>
          <Avatar3D
            mode="decorative"
            height="280px"
            :show-controls="false"
            :show-ground="false"
            :initial-scale="0.8"
            :initial-position="[0, -0.8, 0]"
          />
        </div>

        <!-- 搜索框放在分类上方 -->
        <div class="sidebar-section">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              @input="handleSearch"
            />
            <button class="search-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
        <!-- 分类列表 -->
        <div class="sidebar-section">
          <h3>文章分类</h3>
          <ul class="category-list">
            <li
              v-for="category in categories"
              :key="category"
              :class="{ active: currentCategory === category }"
              @click="filterByCategory(category)"
            >
              {{ category }}
              <span class="category-count">({{ getCategoryCount(category) }})</span>
            </li>
          </ul>
        </div>

        <!-- 近期文章 -->
        <div class="sidebar-section">
          <h3>近期文章</h3>
          <ul class="recent-posts">
            <li v-for="post in recentPosts" :key="post.id">
              <router-link :to="'/blog/' + post.id">
                <img :src="post.image" :alt="post.title" />
                <div class="recent-post-info">
                  <h4>{{ post.title }}</h4>
                  <span class="date">{{ post.date }}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </aside>

      <!-- 文章列表 -->
      <div class="blog-grid">
        <router-link
          v-for="post in filteredPosts"
          :key="post.id"
          :to="post.route ? post.route : '/blog/' + post.id"
          class="blog-card blog-card-link"
        >
          <div class="blog-image">
            <img :src="post.image" :alt="post.title" />
          </div>
          <div class="blog-content">
            <h2>{{ post.title }}</h2>
            <p class="blog-excerpt">{{ post.excerpt }}</p>
            <div class="blog-meta">
              <span class="date">{{ post.date }}</span>
              <span class="category">{{ post.category }}</span>
            </div>
            <span class="read-more">阅读更多</span>
          </div>
        </router-link>
      </div>
    </div>
    <!-- 订阅模块升级为长条模块 -->
    <div class="subscribe-section">
      <div class="subscribe-bar">
        <div class="subscribe-info">
          <h3>订阅博客</h3>
          <p>输入邮箱订阅，获取最新文章和推送</p>
        </div>
        <div class="subscribe-form">
          <input v-model="email" type="email" placeholder="输入邮箱地址" />
          <button class="subscribe-btn" @click="handleSubscribe">订阅</button>
          <label class="captcha-label">
            <input v-model="captchaChecked" type="checkbox" />
            我不是机器人
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import Avatar3D from '@/components/Avatar3D.vue'

  // 搜索和订阅状态
  const searchQuery = ref('')
  const email = ref('')
  const currentCategory = ref('全部')
  const captchaChecked = ref(false)

  // 示例博客文章数据
  const blogPosts = ref([
    {
      id: 1,
      title: '摄影入门：如何拍出好照片',
      excerpt: '分享一些基础的摄影技巧和构图方法，帮助初学者快速入门...',
      date: '2024-03-15',
      category: '摄影技巧',
      image: 'https://picsum.photos/800/400?random=1',
    },
    {
      id: 2,
      title: 'Vue3 组合式API实战心得',
      excerpt: '深入探讨Vue3组合式API的使用技巧和最佳实践...',
      date: '2024-03-10',
      category: '技术分享',
      image: 'https://picsum.photos/800/400?random=2',
    },
    {
      id: 3,
      title: '城市街拍：记录生活的瞬间',
      excerpt: '分享我在城市中捕捉到的精彩瞬间和背后的故事...',
      date: '2024-03-05',
      category: '摄影作品',
      image: 'https://picsum.photos/800/400?random=3',
    },
    {
      id: 4,
      title: '后期处理：提升照片质感的技巧',
      excerpt: '分享一些实用的照片后期处理技巧，让你的作品更出彩...',
      date: '2024-03-01',
      category: '摄影技巧',
      image: 'https://picsum.photos/800/400?random=4',
    },
    {
      id: 5,
      title: 'Vue3 性能优化实践',
      excerpt: '探讨Vue3项目中的性能优化策略和最佳实践...',
      date: '2024-02-28',
      category: '技术分享',
      image: 'https://picsum.photos/800/400?random=5',
    },
    {
      id: 1001,
      title: '我们需要一个属于创作者的 Web3D 虚拟人物标准',
      excerpt: 'Web3D与虚拟人物的未来，需要属于创作者的开放标准。点击阅读详细观点...',
      date: '2024-06-01',
      category: 'Web3D',
      image: 'https://picsum.photos/800/400?random=101',
      route: '/articles/web3d',
    },
  ])

  // 获取所有分类
  const categories = computed(() => {
    const cats = new Set(blogPosts.value.map(post => post.category))
    return ['全部', ...Array.from(cats)]
  })

  // 获取分类文章数量
  const getCategoryCount = category => {
    if (category === '全部') return blogPosts.value.length
    return blogPosts.value.filter(post => post.category === category).length
  }

  // 获取近期文章
  const recentPosts = computed(() => {
    return [...blogPosts.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
  })

  // 过滤文章
  const filteredPosts = computed(() => {
    let posts = blogPosts.value

    // 按分类过滤
    if (currentCategory.value !== '全部') {
      posts = posts.filter(post => post.category === currentCategory.value)
    }

    // 按搜索关键词过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      posts = posts.filter(
        post =>
          post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
      )
    }

    // 按日期降序排序（最新在前）
    return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  // 处理分类筛选
  const filterByCategory = category => {
    currentCategory.value = category
  }

  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑已通过计算属性实现
  }

  // 处理订阅
  const handleSubscribe = () => {
    if (!email.value) {
      alert('请输入邮箱地址')
      return
    }
    if (!captchaChecked.value) {
      alert('请勾选"我不是机器人"')
      return
    }
    alert(`感谢订阅！我们将发送最新文章到 ${email.value}`)
    email.value = ''
    captchaChecked.value = false
  }
</script>

<style scoped>
  .blog-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .publish-status {
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    color: #856404;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .status-badge {
    background-color: #ffc107;
    color: #000;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 600;
    white-space: nowrap;
  }

  .status-text {
    font-size: 0.95em;
    line-height: 1.4;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 50px;
  }

  .blog-header h1 {
    font-size: 2.5em;
    color: #2c3e50;
    margin-bottom: 15px;
  }

  .blog-header p {
    font-size: 1.1em;
    color: #666;
    margin-bottom: 30px;
  }

  /* 博客容器布局 */
  .blog-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 40px;
  }

  /* 侧边栏样式 */
  .blog-sidebar {
    position: sticky;
    top: 100px;
    height: fit-content;
  }

  .sidebar-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .sidebar-section h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.2em;
    padding-bottom: 10px;
    border-bottom: 2px solid #e0e7ef;
  }

  .category-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .category-list li {
    padding: 10px 0;
    cursor: pointer;
    color: #666;
    transition: all 0.3s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .category-list li:hover {
    color: #769fcd;
  }

  .category-list li.active {
    color: #769fcd;
    font-weight: 600;
  }

  .category-count {
    font-size: 0.9em;
    color: #999;
  }

  .recent-posts {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .recent-posts li {
    margin-bottom: 15px;
  }

  .recent-posts a {
    display: flex;
    gap: 15px;
    text-decoration: none;
    color: inherit;
  }

  .recent-posts img {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
  }

  .recent-post-info h4 {
    margin: 0 0 5px 0;
    font-size: 0.95em;
    color: #2c3e50;
  }

  .recent-post-info .date {
    font-size: 0.85em;
    color: #888;
  }

  /* 文章网格样式 */
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
  }

  .blog-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .blog-card:hover {
    transform: translateY(-5px);
  }

  .blog-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .blog-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .blog-card:hover .blog-image img {
    transform: scale(1.05);
  }

  .blog-content {
    padding: 20px;
  }

  .blog-content h2 {
    font-size: 1.4em;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .blog-excerpt {
    color: #666;
    font-size: 0.95em;
    line-height: 1.6;
    margin-bottom: 15px;
  }

  .blog-meta {
    display: flex;
    justify-content: space-between;
    color: #888;
    font-size: 0.9em;
    margin-bottom: 15px;
  }

  .read-more {
    display: inline-block;
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .read-more:hover {
    color: #0056b3;
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .blog-container {
      grid-template-columns: 1fr;
    }

    .blog-sidebar {
      position: static;
      margin-bottom: 40px;
    }
  }

  @media (max-width: 900px) {
    .search-subscribe-container {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
    .search-box,
    .subscribe-box {
      min-width: 0;
      width: 100%;
      margin-bottom: 0;
    }
  }

  @media (max-width: 768px) {
    .blog-header h1 {
      font-size: 2em;
    }

    .publish-status {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 15px;
    }

    .status-badge {
      font-size: 0.85em;
    }

    .status-text {
      font-size: 0.9em;
    }
  }

  /* 新增底部长条订阅模块样式 */
  .subscribe-section {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 60px 0 30px 0;
  }
  .subscribe-bar {
    background: #f5f8fd;
    border-radius: 16px;
    box-shadow: 0 4px 18px rgba(118, 159, 205, 0.08);
    padding: 32px 40px;
    display: flex;
    align-items: center;
    gap: 40px;
    max-width: 900px;
    width: 100%;
    flex-wrap: wrap;
  }
  .subscribe-info h3 {
    margin: 0 0 8px 0;
    font-size: 1.4em;
    color: #2c3e50;
  }
  .subscribe-info p {
    margin: 0;
    color: #666;
    font-size: 1em;
  }
  .subscribe-form {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .subscribe-form input[type='email'] {
    padding: 12px 20px;
    border: 2px solid #e0e7ef;
    border-radius: 8px;
    font-size: 1em;
    min-width: 220px;
  }
  .subscribe-btn {
    padding: 12px 25px;
    background: #769fcd;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .captcha-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.98em;
    color: #555;
    user-select: none;
  }
  @media (max-width: 700px) {
    .subscribe-bar {
      flex-direction: column;
      align-items: stretch;
      gap: 18px;
      padding: 24px 10px;
    }
    .subscribe-form {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 18px rgba(118, 159, 205, 0.08);
    padding: 8px 12px;
    margin-bottom: 0;
    position: relative;
  }

  .search-box input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1em;
    padding: 10px 8px;
    border-radius: 8px 0 0 8px;
  }

  .search-btn {
    background: #769fcd;
    border: none;
    border-radius: 0 8px 8px 0;
    color: #fff;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
    margin-left: 0;
  }

  .search-btn:hover {
    background: #4a6fa5;
  }

  .search-btn svg {
    width: 22px;
    height: 22px;
    stroke: #fff;
  }

  /* 让卡片可点击时鼠标为手型 */
  .blog-card-link {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    display: block;
  }

  /* 虚拟人展示区域样式 */
  .avatar-section {
    margin-bottom: 35px;
  }

  .avatar-intro {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 15px;
    text-align: center;
    line-height: 1.4;
  }

  .avatar-section h3 {
    text-align: center;
    margin-bottom: 12px;
  }

  /* 响应式设计 - 移动端隐藏虚拟人 */
  @media (max-width: 1024px) {
    .avatar-section {
      display: none;
    }
  }
</style>
