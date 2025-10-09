/**
 * Ready Player Me 用户管理服务器
 * 提供访客账户创建、账户关联和令牌管理功能
 */

import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 导入API路由
import readyPlayerMeRoutes from './api/ready-player-me.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// 安全中间件
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://api.readyplayer.me',
          'https://models.readyplayer.me',
        ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'", 'https://*.readyplayer.me'],
      },
    },
  })
)

// CORS 配置
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://your-domain.com', 'https://your-subdomain.readyplayer.me']
      : [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
          'http://127.0.0.1:5173',
        ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(cors(corsOptions))

// 基础中间件
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Ready Player Me User Management',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// API 路由
app.use('/api/rpm', readyPlayerMeRoutes)

// API 根路径
app.get('/api', (req, res) => {
  res.json({
    message: 'Ready Player Me User Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      rpmHealth: '/api/rpm/health',
      createGuestAccount: 'POST /api/rpm/guest-account',
      getAuthToken: 'GET /api/rpm/auth-token?userId=xxx&subdomain=xxx',
      getUserStatus: 'GET /api/rpm/user-status/:userId',
      migrateAccount: 'POST /api/rpm/migrate-account',
    },
    documentation: 'See README.md for detailed API documentation',
  })
})

// 错误处理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  })
})

app.use((error, req, res, next) => {
  console.error('Server Error:', error)

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 Ready Player Me User Management Server')
  console.log(`📡 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`📋 API docs: http://localhost:${PORT}/api`)

  // 配置检查
  const hasApiKey = !!process.env.RPM_API_KEY
  const hasAppId = !!process.env.VITE_RPM_APPLICATION_ID

  console.log('\n⚙️  Configuration:')
  console.log(`   RPM API Key: ${hasApiKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   Application ID: ${hasAppId ? '✅ Set' : '❌ Missing'}`)

  if (!hasApiKey || !hasAppId) {
    console.log('\n⚠️  Warning: Missing required environment variables!')
    console.log('   Please check your .env file configuration.')
  }
})

export default app
