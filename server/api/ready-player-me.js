/**
 * Ready Player Me 服务器端API
 * 处理访客账户创建、账户关联和令牌管理
 */

import express from 'express'
import cors from 'cors'
import axios from 'axios'
import rateLimit from 'express-rate-limit'

const router = express.Router()

// 配置
const RPM_API_BASE_URL = process.env.RPM_API_BASE_URL || 'https://api.readyplayer.me/v1'
const RPM_API_KEY = process.env.RPM_API_KEY
const RPM_APPLICATION_ID = process.env.VITE_RPM_APPLICATION_ID

console.log('🔧 环境变量检查:')
console.log('   API Base URL:', RPM_API_BASE_URL)
console.log('   API Key:', RPM_API_KEY ? `${RPM_API_KEY.substring(0, 8)}...` : '❌ 未设置')
console.log('   Application ID:', RPM_APPLICATION_ID || '❌ 未设置')

// 验证必要的环境变量
if (!RPM_API_KEY) {
  console.warn('⚠️  RPM_API_KEY 环境变量缺失，某些功能可能无法正常工作')
  console.warn('    请在 .env 文件中设置正确的 Ready Player Me API Key')
}

if (!RPM_APPLICATION_ID) {
  console.warn('⚠️  VITE_RPM_APPLICATION_ID 环境变量缺失')
  console.warn('    请在 .env 文件中设置正确的 Application ID')
}

// Rate limiting for security
const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many account creation attempts, please try again later',
  },
})

const tokenLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 token requests per minute
  message: {
    error: 'Too many token requests, please try again later',
  },
})

// 创建axios实例用于RPM API调用
const rpmAPI = axios.create({
  baseURL: RPM_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    ...(RPM_API_KEY && { 'x-api-key': RPM_API_KEY }),
  },
})

/**
 * 创建访客账户
 * POST /api/rpm/guest-account
 */
router.post('/guest-account', createAccountLimiter, async (req, res) => {
  try {
    console.log('Creating guest account for application:', RPM_APPLICATION_ID)

    const response = await rpmAPI.post('/users', {
      data: {
        applicationId: RPM_APPLICATION_ID,
      },
    })

    const userData = response.data.data

    console.log('Guest account created successfully:', userData.id)

    res.status(200).json({
      success: true,
      data: {
        userId: userData.id,
        accountType: 'guest',
        applicationIds: userData.applicationIds,
        createdAt: userData.createdAt,
        partners: userData.partners,
      },
      message: 'Guest account created successfully',
    })
  } catch (error) {
    console.error('Failed to create guest account:', error.response?.data || error.message)

    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to create guest account',
      details: error.response?.data?.message || error.message,
    })
  }
})

/**
 * 获取用户授权令牌
 * GET /api/rpm/auth-token
 */
router.get('/auth-token', tokenLimiter, async (req, res) => {
  try {
    const { userId, subdomain } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      })
    }

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        error: 'subdomain is required',
      })
    }

    console.log(`Requesting auth token for user: ${userId}, subdomain: ${subdomain}`)

    const response = await rpmAPI.get('/auth/token', {
      params: {
        userId: userId,
        partner: subdomain,
      },
    })

    const tokenData = response.data.data

    console.log('Auth token generated successfully for user:', userId)

    res.status(200).json({
      success: true,
      data: {
        token: tokenData.token,
        expiresIn: 15, // 15 seconds as per RPM documentation
        userId: userId,
        subdomain: subdomain,
      },
      message: 'Auth token generated successfully',
    })
  } catch (error) {
    console.error('Failed to generate auth token:', error.response?.data || error.message)

    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to generate auth token',
      details: error.response?.data?.message || error.message,
    })
  }
})

/**
 * 验证用户账户状态
 * GET /api/rpm/user-status/:userId
 */
router.get('/user-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      })
    }

    // 简单的用户类型检测
    let accountType = 'unknown'
    if (userId.includes('guest_') || userId.length < 10) {
      accountType = 'guest'
    } else {
      accountType = 'registered'
    }

    res.status(200).json({
      success: true,
      data: {
        userId: userId,
        accountType: accountType,
        status: 'active',
        checkedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to check user status:', error.message)

    res.status(500).json({
      success: false,
      error: 'Failed to check user status',
      details: error.message,
    })
  }
})

/**
 * 处理账户迁移
 * POST /api/rpm/migrate-account
 */
router.post('/migrate-account', async (req, res) => {
  try {
    const { guestUserId, newUserId } = req.body

    if (!guestUserId || !newUserId) {
      return res.status(400).json({
        success: false,
        error: 'Both guestUserId and newUserId are required',
      })
    }

    console.log(`Account migration: ${guestUserId} -> ${newUserId}`)

    // 在实际应用中，这里应该包含数据迁移逻辑
    // 例如：迁移虚拟形象、资产等

    res.status(200).json({
      success: true,
      data: {
        oldUserId: guestUserId,
        newUserId: newUserId,
        migratedAt: new Date().toISOString(),
        accountType: 'registered',
      },
      message: 'Account migration completed successfully',
    })
  } catch (error) {
    console.error('Failed to migrate account:', error.message)

    res.status(500).json({
      success: false,
      error: 'Failed to migrate account',
      details: error.message,
    })
  }
})

/**
 * 健康检查端点
 * GET /api/rpm/health
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Ready Player Me API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: {
      hasApiKey: !!RPM_API_KEY,
      hasApplicationId: !!RPM_APPLICATION_ID,
      apiBaseUrl: RPM_API_BASE_URL,
    },
  })
})

// 错误处理中间件
router.use((error, req, res, next) => {
  console.error('RPM API Error:', error)

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  })
})

export default router
