import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref({ email: '', phone: '' })

  function login(data) {
    isLoggedIn.value = true
    userInfo.value = data
  }

  function logout() {
    isLoggedIn.value = false
    userInfo.value = { email: '', phone: '' }
  }

  return { isLoggedIn, userInfo, login, logout }
}) 