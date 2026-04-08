/**
 * 七牛云 API 路由
 * 提供安全的服务端七牛云操作接口
 * @author MilesXWalkerStudio
 * @version 2.0.0
 */

import express from 'express'
import rateLimit from 'express-rate-limit'
import qiniuHelper from '../utils/qiniu-helper.js'

const router = express.Router()

// 安全限制常量
const MAX_FSIZE_LIMIT = 100 * 1024 * 1024 // 100MB
const MAX_EXPIRES = 7200 // 2小时
const ALLOWED_MIME_PATTERNS = [
  'image/*',
  'video/*',
  'audio/*',
  'model/*',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
]

/**
 * 验证 MIME 类型限制是否安全
 * @param {string} mimeLimit MIME限制字符串
 * @returns {boolean} 是否安全
 */
const isValidMimeLimit = mimeLimit => {
  if (!mimeLimit) return true
  const patterns = mimeLimit.split(';')
  return patterns.every(pattern => {
    const p = pattern.trim()
    if (!p) return true
    return ALLOWED_MIME_PATTERNS.some(allowed => {
      if (allowed.endsWith('/*')) {
        return p.startsWith(allowed.slice(0, -1))
      }
      return p === allowed
    })
  })
}

/**
 * 校验上传约束参数
 * @param {Object} params 校验参数
 * @param {number} params.expires 过期时间
 * @param {number} params.fsizeLimit 文件大小限制
 * @param {string} params.mimeLimit MIME类型限制
 * @returns {Object|null} 错误响应对象，校验通过则返回 null
 */
const validateUploadConstraints = ({ expires, fsizeLimit, mimeLimit }) => {
  if (expires && (typeof expires !== 'number' || expires > MAX_EXPIRES || expires < 0)) {
    return {
      success: false,
      error: `过期时间无效或超过最大限制 (${MAX_EXPIRES}秒)`,
    }
  }

  if (
    fsizeLimit &&
    (typeof fsizeLimit !== 'number' || fsizeLimit > MAX_FSIZE_LIMIT || fsizeLimit < 0)
  ) {
    return {
      success: false,
      error: `文件大小限制无效或超过最大限制 (${MAX_FSIZE_LIMIT / (1024 * 1024)}MB)`,
    }
  }

  if (mimeLimit && !isValidMimeLimit(mimeLimit)) {
    return {
      success: false,
      error: '包含不允许的 MIME 类型限制',
    }
  }

  return null
}

// 速率限制配置
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100个请求
  message: '上传请求过于频繁，请稍后再试',
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: '请求过于频繁，请稍后再试',
})

/**
 * 健康检查
 * GET /api/qiniu/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Qiniu Cloud Service',
    timestamp: new Date().toISOString(),
  })
})

/**
 * 测试连接
 * GET /api/qiniu/test
 */
router.get('/test', generalLimiter, async (req, res) => {
  try {
    const result = await qiniuHelper.testConnection()

    res.json(result)
  } catch (error) {
    console.error('测试连接失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '测试连接失败',
    })
  }
})

/**
 * 生成上传凭证
 * POST /api/qiniu/upload-token
 * Body: {
 *   key?: string,           // 文件名（可选）
 *   expires?: number,       // 过期时间（秒，默认3600）
 *   fsizeLimit?: number,    // 文件大小限制（字节，默认100MB）
 *   mimeLimit?: string,     // 文件类型限制（如 "image/*;video/*"）
 * }
 */
router.post('/upload-token', uploadLimiter, (req, res) => {
  try {
    const { key, expires, fsizeLimit, mimeLimit } = req.body

    // 安全校验
    const errorResponse = validateUploadConstraints({ expires, fsizeLimit, mimeLimit })
    if (errorResponse) {
      return res.status(400).json(errorResponse)
    }

    const token = qiniuHelper.generateUploadToken({
      key,
      expires: expires || 3600,
      fsizeLimit: fsizeLimit || 1024 * 1024 * 100, // 默认100MB
      mimeLimit,
    })

    res.json({
      success: true,
      token: token,
      uploadUrl: qiniuHelper.getUploadUrl(),
      domain: qiniuHelper.domain,
      expiresIn: expires || 3600,
    })
  } catch (error) {
    console.error('生成上传凭证失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '生成上传凭证失败',
    })
  }
})

/**
 * 生成批量上传凭证
 * POST /api/qiniu/batch-upload-tokens
 * Body: {
 *   count: number,          // 凭证数量
 *   expires?: number,       // 过期时间（秒）
 *   fsizeLimit?: number,    // 文件大小限制
 *   mimeLimit?: string,     // 文件类型限制
 * }
 */
router.post('/batch-upload-tokens', uploadLimiter, (req, res) => {
  try {
    const { count, expires, fsizeLimit, mimeLimit } = req.body

    if (!count || count < 1 || count > 50) {
      return res.status(400).json({
        success: false,
        error: '凭证数量必须在1-50之间',
      })
    }

    // 安全校验
    const errorResponse = validateUploadConstraints({ expires, fsizeLimit, mimeLimit })
    if (errorResponse) {
      return res.status(400).json(errorResponse)
    }

    const tokens = []
    for (let i = 0; i < count; i++) {
      const token = qiniuHelper.generateUploadToken({
        key: null, // 不指定文件名
        expires: expires || 3600,
        fsizeLimit: fsizeLimit || 1024 * 1024 * 100,
        mimeLimit,
      })
      tokens.push(token)
    }

    res.json({
      success: true,
      tokens: tokens,
      uploadUrl: qiniuHelper.getUploadUrl(),
      domain: qiniuHelper.domain,
      expiresIn: expires || 3600,
    })
  } catch (error) {
    console.error('生成批量上传凭证失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '生成批量上传凭证失败',
    })
  }
})

/**
 * 生成下载URL（私有空间）
 * POST /api/qiniu/download-url
 * Body: {
 *   key: string,            // 文件key
 *   expires?: number,       // 过期时间（秒，默认3600）
 * }
 */
router.post('/download-url', generalLimiter, (req, res) => {
  try {
    const { key, expires } = req.body

    if (!key) {
      return res.status(400).json({
        success: false,
        error: '缺少文件key参数',
      })
    }

    const url = qiniuHelper.generateDownloadUrl(key, expires || 3600)

    res.json({
      success: true,
      url: url,
      expiresIn: expires || 3600,
    })
  } catch (error) {
    console.error('生成下载URL失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '生成下载URL失败',
    })
  }
})

/**
 * 获取文件信息
 * GET /api/qiniu/file-info/:key
 */
router.get('/file-info/:key(*)', generalLimiter, async (req, res) => {
  try {
    const key = req.params.key

    if (!key) {
      return res.status(400).json({
        success: false,
        error: '缺少文件key参数',
      })
    }

    const result = await qiniuHelper.getFileInfo(key)

    res.json(result)
  } catch (error) {
    console.error('获取文件信息失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '获取文件信息失败',
    })
  }
})

/**
 * 列举文件
 * GET /api/qiniu/files
 * Query: {
 *   prefix?: string,        // 文件前缀
 *   marker?: string,        // 分页标记
 *   limit?: number,         // 返回数量（默认100，最大1000）
 * }
 */
router.get('/files', generalLimiter, async (req, res) => {
  try {
    const { prefix = '', marker = '', limit = 100 } = req.query

    const limitNum = parseInt(limit)
    if (limitNum > 1000) {
      return res.status(400).json({
        success: false,
        error: 'limit参数不能超过1000',
      })
    }

    const result = await qiniuHelper.listFiles({
      prefix,
      marker,
      limit: limitNum,
    })

    res.json(result)
  } catch (error) {
    console.error('列举文件失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '列举文件失败',
    })
  }
})

/**
 * 删除文件
 * DELETE /api/qiniu/file/:key
 */
router.delete('/file/:key(*)', generalLimiter, async (req, res) => {
  try {
    const key = req.params.key

    if (!key) {
      return res.status(400).json({
        success: false,
        error: '缺少文件key参数',
      })
    }

    const result = await qiniuHelper.deleteFile(key)

    res.json(result)
  } catch (error) {
    console.error('删除文件失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '删除文件失败',
    })
  }
})

/**
 * 批量删除文件
 * POST /api/qiniu/batch-delete
 * Body: {
 *   keys: string[]          // 文件key数组
 * }
 */
router.post('/batch-delete', generalLimiter, async (req, res) => {
  try {
    const { keys } = req.body

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({
        success: false,
        error: '缺少keys参数或参数格式错误',
      })
    }

    if (keys.length > 100) {
      return res.status(400).json({
        success: false,
        error: '批量删除最多支持100个文件',
      })
    }

    const result = await qiniuHelper.batchDelete(keys)

    res.json(result)
  } catch (error) {
    console.error('批量删除失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '批量删除失败',
    })
  }
})

/**
 * 移动/重命名文件
 * POST /api/qiniu/move
 * Body: {
 *   srcKey: string,         // 源文件key
 *   destKey: string,        // 目标文件key
 *   force?: boolean,        // 是否强制覆盖（默认false）
 * }
 */
router.post('/move', generalLimiter, async (req, res) => {
  try {
    const { srcKey, destKey, force = false } = req.body

    if (!srcKey || !destKey) {
      return res.status(400).json({
        success: false,
        error: '缺少srcKey或destKey参数',
      })
    }

    const result = await qiniuHelper.moveFile(srcKey, destKey, force)

    res.json(result)
  } catch (error) {
    console.error('移动文件失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '移动文件失败',
    })
  }
})

/**
 * 复制文件
 * POST /api/qiniu/copy
 * Body: {
 *   srcKey: string,         // 源文件key
 *   destKey: string,        // 目标文件key
 *   force?: boolean,        // 是否强制覆盖（默认false）
 * }
 */
router.post('/copy', generalLimiter, async (req, res) => {
  try {
    const { srcKey, destKey, force = false } = req.body

    if (!srcKey || !destKey) {
      return res.status(400).json({
        success: false,
        error: '缺少srcKey或destKey参数',
      })
    }

    const result = await qiniuHelper.copyFile(srcKey, destKey, force)

    res.json(result)
  } catch (error) {
    console.error('复制文件失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '复制文件失败',
    })
  }
})

/**
 * 上传回调验证
 * POST /api/qiniu/callback
 * 用于验证七牛云的上传回调请求
 */
router.post('/callback', (req, res) => {
  try {
    const requestUri = req.originalUrl
    const requestBody = JSON.stringify(req.body)
    const authHeader = req.headers.authorization || ''

    const isValid = qiniuHelper.verifyCallback(requestUri, requestBody, authHeader)

    if (isValid) {
      // 回调验证成功，处理业务逻辑
      console.log('上传回调验证成功:', req.body)

      // 返回自定义内容给七牛云
      res.json({
        success: true,
        message: '文件上传成功',
        data: req.body,
      })
    } else {
      console.error('上传回调验证失败')
      res.status(401).json({
        success: false,
        error: '回调验证失败',
      })
    }
  } catch (error) {
    console.error('处理回调失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '处理回调失败',
    })
  }
})

/**
 * 获取配置信息（安全的）
 * GET /api/qiniu/config
 */
router.get('/config', (req, res) => {
  res.json({
    success: true,
    config: {
      bucket: qiniuHelper.bucket,
      region: qiniuHelper.region,
      zone: qiniuHelper.zone,
      domain: qiniuHelper.domain,
      isPrivate: qiniuHelper.isPrivate,
      uploadUrl: qiniuHelper.getUploadUrl(),
    },
  })
})

// 错误处理
router.use((error, req, res, next) => {
  console.error('七牛云API错误:', error)

  res.status(500).json({
    success: false,
    error: error.message || '服务器内部错误',
  })
})

export default router
