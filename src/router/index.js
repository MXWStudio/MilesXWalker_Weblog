import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../components/About.vue'
import Photos from '../views/photos/photoindex.vue'
import Videos from '../views/videos/videoindex.vue'
import Contact from '../views/Contact.vue'
import Ai from '../views/Ai.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'

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
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: '联系我们'
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
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，用于设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - MilesXWalker Studio` : 'MilesXWalker Studio'
  next()
})

export default router 