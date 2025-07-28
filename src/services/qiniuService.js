/**
 * 七牛云对象存储服务
 * 提供文件上传、下载、管理等功能
 * @author MilesXWalkerStudio
 * @version 1.0.0
 */

import axios from 'axios'
import crypto from 'crypto-js'

class QiniuService {
  constructor() {
    this.accessKey = import.meta.env.QINIU_ACCESS_KEY || ''
    this.secretKey = import.meta.env.QINIU_SECRET_KEY || ''
    this.bucket = import.meta.env.QINIU_BUCKET || ''
    this.domain = import.meta.env.VITE_QINIU_DOMAIN || ''
    this.region = import.meta.env.VITE_QINIU_REGION || 'cn-east-1'
    this.uploadUrl = import.meta.env.VITE_QINIU_UPLOAD_URL || 'https://upload.qiniup.com'
    this.pathPrefix = import.meta.env.QINIU_PATH_PREFIX || 'uploads/'
    this.maxFileSize = parseInt(import.meta.env.QINIU_MAX_FILE_SIZE || '10485760')
    this.expireTime = parseInt(import.meta.env.QINIU_EXPIRE_TIME || '3600')
    this.isPrivate = import.meta.env.QINIU_PRIVATE_BUCKET === 'true'
    this.debug = import.meta.env.VITE_ENABLE_QINIU_DEBUG === 'true'

    // 初始化axios实例
    this.api = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.log('七牛云服务初始化', {
      bucket: this.bucket,
      region: this.region,
      domain: this.domain,
      isPrivate: this.isPrivate,
    })
  }

  /**
   * 调试日志输出
   */
  log(message, data = null) {
    if (this.debug) {
      console.log(`[QiniuService] ${message}`, data)
    }
  }

  /**
   * 生成Base64安全编码
   */
  base64UrlSafeEncode(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  /**
   * 生成HMAC-SHA1签名
   */
  hmacSha1(message, secret) {
    return crypto.HmacSHA1(message, secret).toString(crypto.enc.Base64)
  }

  /**
   * 生成上传Token
   */
  generateUploadToken(key = null, expires = null) {
    try {
      const deadline = Math.floor(Date.now() / 1000) + (expires || this.expireTime)

      const putPolicy = {
        scope: key ? `${this.bucket}:${key}` : this.bucket,
        deadline: deadline,
        returnBody: JSON.stringify({
          key: '$(key)',
          hash: '$(etag)',
          bucket: '$(bucket)',
          fname: '$(fname)',
          fsize: '$(fsize)',
          mimeType: '$(mimeType)',
          endUser: '$(endUser)',
          persistentId: '$(persistentId)',
          imageInfo: '$(imageInfo.width)x$(imageInfo.height)',
          avinfo: '$(avinfo.video.duration)',
        }),
      }

      const putPolicyStr = JSON.stringify(putPolicy)
      const encodedPutPolicy = this.base64UrlSafeEncode(putPolicyStr)

      const sign = this.hmacSha1(encodedPutPolicy, this.secretKey)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')

      const token = `${this.accessKey}:${sign}:${encodedPutPolicy}`

      this.log('生成上传Token成功', { key, expires: deadline })
      return token
    } catch (error) {
      this.log('生成上传Token失败', error)
      throw new Error('生成上传Token失败: ' + error.message)
    }
  }

  /**
   * 生成下载Token（私有空间）
   */
  generateDownloadToken(url, expires = null) {
    try {
      if (!this.isPrivate) {
        return url // 公开空间直接返回URL
      }

      const deadline = Math.floor(Date.now() / 1000) + (expires || this.expireTime)
      const urlWithDeadline = `${url}?e=${deadline}`

      const sign = this.hmacSha1(urlWithDeadline, this.secretKey)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')

      const tokenUrl = `${urlWithDeadline}&token=${this.accessKey}:${sign}`

      this.log('生成下载Token成功', { url: tokenUrl })
      return tokenUrl
    } catch (error) {
      this.log('生成下载Token失败', error)
      throw new Error('生成下载Token失败: ' + error.message)
    }
  }

  /**
   * 上传文件
   * @param {File} file - 文件对象
   * @param {Object} options - 上传选项
   * @returns {Promise} 上传结果
   */
  async uploadFile(file, options = {}) {
    try {
      // 文件大小检查
      if (file.size > this.maxFileSize) {
        throw new Error(`文件大小超过限制 ${this.maxFileSize / 1024 / 1024}MB`)
      }

      // 生成文件名
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const fileName = options.fileName || `${timestamp}_${randomStr}.${extension}`
      const key = `${this.pathPrefix}${fileName}`

      // 生成上传Token
      const token = this.generateUploadToken(key, options.expires)

      // 准备上传数据
      const formData = new FormData()
      formData.append('file', file)
      formData.append('key', key)
      formData.append('token', token)

      if (options.mimeType) {
        formData.append('mimeType', options.mimeType)
      }

      this.log('开始上传文件', {
        fileName: file.name,
        size: file.size,
        key: key,
      })

      // 执行上传
      const response = await axios.post(this.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options.onProgress || null,
      })

      const result = {
        success: true,
        data: response.data,
        url: this.getFileUrl(response.data.key),
        key: response.data.key,
        hash: response.data.hash,
        size: response.data.fsize,
      }

      this.log('文件上传成功', result)
      return result
    } catch (error) {
      this.log('文件上传失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || '上传失败',
      }
    }
  }

  /**
   * 批量上传文件
   */
  async uploadFiles(files, options = {}) {
    try {
      const uploadPromises = Array.from(files).map(file => this.uploadFile(file, options))

      const results = await Promise.all(uploadPromises)

      const successResults = results.filter(r => r.success)
      const failedResults = results.filter(r => !r.success)

      this.log('批量上传完成', {
        total: files.length,
        success: successResults.length,
        failed: failedResults.length,
      })

      return {
        success: failedResults.length === 0,
        results: results,
        successCount: successResults.length,
        failedCount: failedResults.length,
      }
    } catch (error) {
      this.log('批量上传失败', error)
      throw error
    }
  }

  /**
   * 获取文件访问URL
   */
  getFileUrl(key, options = {}) {
    const baseUrl = `${this.domain}/${key}`

    if (this.isPrivate) {
      return this.generateDownloadToken(baseUrl, options.expires)
    }

    return baseUrl
  }

  /**
   * 删除文件
   */
  async deleteFile(key) {
    try {
      const url = `https://rs.qbox.me/delete/${this.base64UrlSafeEncode(`${this.bucket}:${key}`)}`
      const sign = this.hmacSha1(`DELETE ${url.split('://')[1]}`, this.secretKey)

      const response = await this.api.delete(url, {
        headers: {
          Authorization: `QBox ${this.accessKey}:${sign}`,
        },
      })

      this.log('文件删除成功', { key })
      return { success: true }
    } catch (error) {
      this.log('文件删除失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(key) {
    try {
      const url = `https://rs.qbox.me/stat/${this.base64UrlSafeEncode(`${this.bucket}:${key}`)}`
      const sign = this.hmacSha1(`GET ${url.split('://')[1]}`, this.secretKey)

      const response = await this.api.get(url, {
        headers: {
          Authorization: `QBox ${this.accessKey}:${sign}`,
        },
      })

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      this.log('获取文件信息失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 列举文件
   */
  async listFiles(options = {}) {
    try {
      const params = new URLSearchParams({
        bucket: this.bucket,
        limit: options.limit || 100,
        ...(options.prefix && { prefix: options.prefix }),
        ...(options.marker && { marker: options.marker }),
      })

      const url = `https://rsf.qbox.me/list?${params}`
      const sign = this.hmacSha1(`GET ${url.split('://')[1]}`, this.secretKey)

      const response = await this.api.get(url, {
        headers: {
          Authorization: `QBox ${this.accessKey}:${sign}`,
        },
      })

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      this.log('列举文件失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 验证配置
   */
  validateConfig() {
    const required = [
      { key: 'accessKey', value: this.accessKey, name: '访问密钥' },
      { key: 'secretKey', value: this.secretKey, name: '私钥' },
      { key: 'bucket', value: this.bucket, name: '存储空间' },
      { key: 'domain', value: this.domain, name: '访问域名' },
    ]

    const missing = required.filter(item => !item.value)

    if (missing.length > 0) {
      const missingNames = missing.map(item => item.name).join('、')
      throw new Error(`七牛云配置不完整，缺少: ${missingNames}`)
    }

    this.log('配置验证通过')
    return true
  }

  /**
   * 测试连接
   */
  async testConnection() {
    try {
      this.validateConfig()

      // 测试获取存储空间信息
      const result = await this.listFiles({ limit: 1 })

      if (result.success) {
        this.log('连接测试成功')
        return { success: true, message: '七牛云连接测试成功' }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      this.log('连接测试失败', error)
      return {
        success: false,
        error: error.message || '连接测试失败',
      }
    }
  }
}

// 创建单例实例
const qiniuService = new QiniuService()

export default qiniuService

// 导出类以便于测试
export { QiniuService }
