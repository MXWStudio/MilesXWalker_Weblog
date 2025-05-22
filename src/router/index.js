import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../components/About.vue'
import Photos from '../views/Photos.vue'
import Videos from '../views/Videos.vue'
import Contact from '../views/Contact.vue'

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
    path: '/photos',
    name: 'Photos',
    component: Photos,
    meta: {
      title: '照片作品集'
    }
  },
  {
    path: '/videos',
    name: 'Videos',
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