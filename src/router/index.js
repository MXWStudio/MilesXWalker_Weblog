import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../components/About.vue'
import Photos from '../views/photos/photoindex.vue'
import Videos from '../views/videos/videoindex.vue'
import Subscribe from '../views/Subscribe.vue'
import Ai from '../views/Ai.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Terms from '../views/Terms.vue'
import Privacy from '../views/Privacy.vue'
import Blog from '../views/Blog.vue'
import Web3D from '../views/articles/Web3D.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/photoindex',
    name: 'PhotoIndex',
    component: Photos,
    meta: {
      title: '照片作品集'
    }
  },
  {
    path: '/videoindex',
    name: 'VideoIndex',
    component: Videos,
    meta: {
      title: '视频作品集'
    }
  },
  {
    path: '/subscribe',
    name: 'Subscribe',
    component: Subscribe,
    meta: {
      title: '订阅我们'
    }
  },
  {
    path: '/ai',
    name: 'Ai',
    component: Ai,
    meta: {
      title: 'AI专区'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: {
      title: '博客文章'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/terms',
    name: 'terms',
    component: Terms
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: Privacy
  },
  {
    path: '/articles/web3d',
    name: 'Web3DArticle',
    component: Web3D,
    meta: { title: 'Web3D虚拟人物标准' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫，用于设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - MilesXWalker Studio` : 'MilesXWalker Studio'
  next()
})

export default router 