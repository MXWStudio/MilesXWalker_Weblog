/**
 * Ready Player Me API 客户端服务
 * 与服务器端API通信，处理访客账户和令牌管理
 */

import axios from 'axios'

// 获取API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// 创建API客户端
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/rpm`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    console.log('RPM API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  error => {
    console.error('RPM API Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    console.log('RPM API Response:', response.status, response.data)
    return response
  },
  error => {
    console.error('RPM API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * Ready Player Me API 服务类
 */
class ReadyPlayerMeAPI {
  /**
   * 创建访客账户
   * @returns {Promise<{userId: string, accountType: string, createdAt: string}>}
   */
  async createGuestAccount() {
    try {
      const response = await apiClient.post('/guest-account')

      if (response.data.success) {
        return {
          userId: response.data.data.userId,
          accountType: response.data.data.accountType,
          createdAt: response.data.data.createdAt,
          applicationIds: response.data.data.applicationIds,
          partners: response.data.data.partners,
        }
      } else {
        throw new Error(response.data.error || 'Failed to create guest account')
      }
    } catch (error) {
      console.error('Create guest account error:', error)
      throw new Error(
        error.response?.data?.details || error.message || 'Failed to create guest account'
      )
    }
  }

  /**
   * 获取用户授权令牌
   * @param {string} userId - 用户ID
   * @param {string} subdomain - Ready Player Me子域名
   * @returns {Promise<{token: string, expiresIn: number, userId: string}>}
   */
  async getAuthToken(userId, subdomain) {
    try {
      if (!userId || !subdomain) {
        throw new Error('userId and subdomain are required')
      }

      const response = await apiClient.get('/auth-token', {
        params: { userId, subdomain },
      })

      if (response.data.success) {
        return {
          token: response.data.data.token,
          expiresIn: response.data.data.expiresIn,
          userId: response.data.data.userId,
          subdomain: response.data.data.subdomain,
        }
      } else {
        throw new Error(response.data.error || 'Failed to get auth token')
      }
    } catch (error) {
      console.error('Get auth token error:', error)
      throw new Error(error.response?.data?.details || error.message || 'Failed to get auth token')
    }
  }

  /**
   * 获取用户状态
   * @param {string} userId - 用户ID
   * @returns {Promise<{userId: string, accountType: string, status: string}>}
   */
  async getUserStatus(userId) {
    try {
      if (!userId) {
        throw new Error('userId is required')
      }

      const response = await apiClient.get(`/user-status/${userId}`)

      if (response.data.success) {
        return {
          userId: response.data.data.userId,
          accountType: response.data.data.accountType,
          status: response.data.data.status,
          checkedAt: response.data.data.checkedAt,
        }
      } else {
        throw new Error(response.data.error || 'Failed to get user status')
      }
    } catch (error) {
      console.error('Get user status error:', error)
      throw new Error(error.response?.data?.details || error.message || 'Failed to get user status')
    }
  }

  /**
   * 迁移账户（从访客账户到正式账户）
   * @param {string} guestUserId - 访客用户ID
   * @param {string} newUserId - 新的正式用户ID
   * @returns {Promise<{oldUserId: string, newUserId: string, migratedAt: string}>}
   */
  async migrateAccount(guestUserId, newUserId) {
    try {
      if (!guestUserId || !newUserId) {
        throw new Error('Both guestUserId and newUserId are required')
      }

      const response = await apiClient.post('/migrate-account', {
        guestUserId,
        newUserId,
      })

      if (response.data.success) {
        return {
          oldUserId: response.data.data.oldUserId,
          newUserId: response.data.data.newUserId,
          migratedAt: response.data.data.migratedAt,
          accountType: response.data.data.accountType,
        }
      } else {
        throw new Error(response.data.error || 'Failed to migrate account')
      }
    } catch (error) {
      console.error('Migrate account error:', error)
      throw new Error(error.response?.data?.details || error.message || 'Failed to migrate account')
    }
  }

  /**
   * 检查服务器健康状态
   * @returns {Promise<{status: string, timestamp: string}>}
   */
  async checkHealth() {
    try {
      const response = await apiClient.get('/health')

      if (response.data.success) {
        return {
          status: response.data.status,
          service: response.data.service,
          timestamp: response.data.timestamp,
          config: response.data.config,
        }
      } else {
        throw new Error('Health check failed')
      }
    } catch (error) {
      console.error('Health check error:', error)
      throw new Error(error.response?.data?.details || error.message || 'Health check failed')
    }
  }

  /**
   * 构建带令牌的iframe URL
   * @param {string} subdomain - Ready Player Me子域名
   * @param {string} token - 授权令牌
   * @param {Object} options - 其他URL参数
   * @returns {string} 完整的iframe URL
   */
  buildIframeUrl(subdomain, token, options = {}) {
    const params = new URLSearchParams()

    // 必要参数
    params.append('frameApi', 'true')

    // 添加令牌
    if (token) {
      params.append('token', token)
    }

    // 其他配置参数
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })

    return `https://${subdomain}.readyplayer.me/avatar?${params.toString()}`
  }

  /**
   * 检测用户账户类型（客户端辅助函数）
   * @param {string} userId - 用户ID
   * @returns {string} 账户类型：'guest' | 'registered' | 'unknown'
   */
  detectAccountType(userId) {
    if (!userId) return 'unknown'

    // Ready Player Me访客账户通常包含特定前缀或格式
    if (userId.includes('guest_') || userId.length < 10) {
      return 'guest'
    } else if (userId.length > 10) {
      return 'registered'
    }

    return 'unknown'
  }

  /**
   * 本地存储管理
   */
  storage = {
    /**
     * 保存用户信息到本地存储
     * @param {Object} userInfo - 用户信息
     */
    saveUserInfo(userInfo) {
      try {
        localStorage.setItem('rpm_user_info', JSON.stringify(userInfo))
      } catch (error) {
        console.error('Failed to save user info:', error)
      }
    },

    /**
     * 从本地存储获取用户信息
     * @returns {Object|null} 用户信息
     */
    getUserInfo() {
      try {
        const saved = localStorage.getItem('rpm_user_info')
        return saved ? JSON.parse(saved) : null
      } catch (error) {
        console.error('Failed to get user info:', error)
        return null
      }
    },

    /**
     * 清除本地存储的用户信息
     */
    clearUserInfo() {
      try {
        localStorage.removeItem('rpm_user_info')
      } catch (error) {
        console.error('Failed to clear user info:', error)
      }
    },

    /**
     * 保存令牌信息
     * @param {Object} tokenInfo - 令牌信息
     */
    saveTokenInfo(tokenInfo) {
      try {
        // 令牌有效期很短(15秒)，添加过期时间
        const tokenWithExpiry = {
          ...tokenInfo,
          expiresAt: Date.now() + tokenInfo.expiresIn * 1000,
        }
        localStorage.setItem('rpm_token_info', JSON.stringify(tokenWithExpiry))
      } catch (error) {
        console.error('Failed to save token info:', error)
      }
    },

    /**
     * 获取有效的令牌信息
     * @returns {Object|null} 令牌信息（如果未过期）
     */
    getValidTokenInfo() {
      try {
        const saved = localStorage.getItem('rpm_token_info')
        if (!saved) return null

        const tokenInfo = JSON.parse(saved)

        // 检查是否过期
        if (Date.now() >= tokenInfo.expiresAt) {
          this.clearTokenInfo()
          return null
        }

        return tokenInfo
      } catch (error) {
        console.error('Failed to get token info:', error)
        return null
      }
    },

    /**
     * 清除令牌信息
     */
    clearTokenInfo() {
      try {
        localStorage.removeItem('rpm_token_info')
      } catch (error) {
        console.error('Failed to clear token info:', error)
      }
    },
  }
}

// 创建单例实例
const readyPlayerMeAPI = new ReadyPlayerMeAPI()

export default readyPlayerMeAPI
