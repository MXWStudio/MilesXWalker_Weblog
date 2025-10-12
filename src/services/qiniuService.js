/**
 * 七牛云对象存储服务 - 前端客户端
 * 通过服务端API安全地操作七牛云
 * @author MilesXWalkerStudio
 * @version 2.0.0
 * @note 重要改进：使用服务端签名，前端不再暴露密钥
 */

import axios from 'axios'

class QiniuService {
  constructor() {
    // 服务端API基础URL
    this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    this.apiPath = '/api/qiniu'

    // 前端可访问的配置
    this.domain = import.meta.env.VITE_QINIU_DOMAIN || ''
    this.debug = import.meta.env.VITE_ENABLE_QINIU_DEBUG === 'true'

    // 上传URL（固定）
    this.uploadUrl = 'https://upload.qiniup.com'

    // 创建axios实例
    this.api = axios.create({
      baseURL: `${this.apiBaseUrl}${this.apiPath}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 用于直接上传的axios实例
    this.uploadApi = axios.create({
      timeout: 0, // 上传不设置超时
    })

    this.log('七牛云服务初始化 v2.0', {
      apiUrl: `${this.apiBaseUrl}${this.apiPath}`,
      domain: this.domain,
    })
  }

  /**
   * 调试日志输出
   */
  log(message, data = null) {
    if (this.debug) {
      console.log(`[QiniuService v2.0] ${message}`, data || '')
    }
  }

  /**
   * 测试服务端连接
   * @returns {Promise<Object>} 测试结果
   */
  async testConnection() {
    try {
      this.log('测试服务端连接...')

      const response = await this.api.get('/test')

      this.log('连接测试成功', response.data)

      return response.data
    } catch (error) {
      this.log('连接测试失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || '连接测试失败',
      }
    }
  }

  /**
   * 获取配置信息
   * @returns {Promise<Object>} 配置信息
   */
  async getConfig() {
    try {
      const response = await this.api.get('/config')

      this.log('获取配置成功', response.data)

      return response.data
    } catch (error) {
      this.log('获取配置失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 从服务端获取上传凭证
   * @param {Object} options 上传选项
   * @returns {Promise<Object>} 上传凭证信息
   */
  async getUploadToken(options = {}) {
    try {
      this.log('获取上传凭证...', options)

      const response = await this.api.post('/upload-token', {
        key: options.key || null,
        expires: options.expires || 3600,
        fsizeLimit: options.fsizeLimit || 1024 * 1024 * 100, // 默认100MB
        mimeLimit: options.mimeLimit || null,
      })

      if (response.data.success) {
        this.log('获取上传凭证成功')
        return {
          success: true,
          token: response.data.token,
          uploadUrl: response.data.uploadUrl,
          domain: response.data.domain || this.domain,
          expiresIn: response.data.expiresIn,
        }
      } else {
        throw new Error(response.data.error || '获取上传凭证失败')
      }
    } catch (error) {
      this.log('获取上传凭证失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || '获取上传凭证失败',
      }
    }
  }

  /**
   * 上传文件
   * @param {File} file 文件对象
   * @param {Object} options 上传选项
   * @returns {Promise<Object>} 上传结果
   */
  async uploadFile(file, options = {}) {
    try {
      this.log('开始上传文件', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })

      // 1. 获取上传凭证
      const tokenResult = await this.getUploadToken({
        key: options.fileName || null,
        expires: options.expires,
        fsizeLimit: options.fsizeLimit,
        mimeLimit: options.mimeLimit,
      })

      if (!tokenResult.success) {
        throw new Error(tokenResult.error)
      }

      // 2. 准备上传数据
      const formData = new FormData()
      formData.append('file', file)
      formData.append('token', tokenResult.token)

      if (options.fileName) {
        formData.append('key', options.fileName)
      }

      // 3. 执行上传
      this.log('执行上传到七牛云...')

      const uploadResponse = await this.uploadApi.post(tokenResult.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          if (options.onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            options.onProgress(percentCompleted)
          }
        },
      })

      // 4. 处理上传结果
      const result = {
        success: true,
        key: uploadResponse.data.key,
        hash: uploadResponse.data.hash,
        url: this.getFileUrl(uploadResponse.data.key),
        size: uploadResponse.data.fsize || file.size,
        mimeType: uploadResponse.data.mimeType || file.type,
        data: uploadResponse.data,
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
   * @param {Array<File>} files 文件数组
   * @param {Object} options 上传选项
   * @returns {Promise<Object>} 批量上传结果
   */
  async uploadFiles(files, options = {}) {
    try {
      this.log('开始批量上传', { count: files.length })

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
   * @param {String} key 文件key
   * @param {Object} options 选项
   * @returns {String} 文件URL
   */
  getFileUrl(key, options = {}) {
    if (!key) return ''

    // 对于公开空间，直接返回URL
    // 对于私有空间，需要通过服务端API获取签名URL
    const baseUrl = `${this.domain}/${key}`

    // 如果指定了处理参数，添加到URL
    if (options.process) {
      return `${baseUrl}?${options.process}`
    }

    return baseUrl
  }

  /**
   * 获取私有空间的下载URL（通过服务端）
   * @param {String} key 文件key
   * @param {Number} expires 过期时间（秒）
   * @returns {Promise<Object>} 下载URL
   */
  async getDownloadUrl(key, expires = 3600) {
    try {
      this.log('获取下载URL...', { key, expires })

      const response = await this.api.post('/download-url', {
        key,
        expires,
      })

      if (response.data.success) {
        this.log('获取下载URL成功')
        return {
          success: true,
          url: response.data.url,
          expiresIn: response.data.expiresIn,
        }
      } else {
        throw new Error(response.data.error)
      }
    } catch (error) {
      this.log('获取下载URL失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 获取文件信息
   * @param {String} key 文件key
   * @returns {Promise<Object>} 文件信息
   */
  async getFileInfo(key) {
    try {
      this.log('获取文件信息...', { key })

      const response = await this.api.get(`/file-info/${encodeURIComponent(key)}`)

      if (response.data.success) {
        this.log('获取文件信息成功')
        return response.data
      } else {
        throw new Error(response.data.error)
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
   * @param {Object} options 列举选项
   * @returns {Promise<Object>} 文件列表
   */
  async listFiles(options = {}) {
    try {
      this.log('列举文件...', options)

      const params = {
        prefix: options.prefix || '',
        marker: options.marker || '',
        limit: options.limit || 100,
      }

      const response = await this.api.get('/files', { params })

      if (response.data.success) {
        this.log('列举文件成功', {
          count: response.data.data.items?.length || 0,
        })
        return response.data
      } else {
        throw new Error(response.data.error)
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
   * 删除文件
   * @param {String} key 文件key
   * @returns {Promise<Object>} 删除结果
   */
  async deleteFile(key) {
    try {
      this.log('删除文件...', { key })

      const response = await this.api.delete(`/file/${encodeURIComponent(key)}`)

      if (response.data.success) {
        this.log('文件删除成功')
        return response.data
      } else {
        throw new Error(response.data.error)
      }
    } catch (error) {
      this.log('文件删除失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 批量删除文件
   * @param {Array<String>} keys 文件key数组
   * @returns {Promise<Object>} 批量删除结果
   */
  async batchDelete(keys) {
    try {
      this.log('批量删除文件...', { count: keys.length })

      const response = await this.api.post('/batch-delete', { keys })

      if (response.data.success) {
        this.log('批量删除成功', {
          success: response.data.successCount,
          failed: response.data.failedCount,
        })
        return response.data
      } else {
        throw new Error(response.data.error)
      }
    } catch (error) {
      this.log('批量删除失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 移动/重命名文件
   * @param {String} srcKey 源文件key
   * @param {String} destKey 目标文件key
   * @param {Boolean} force 是否强制覆盖
   * @returns {Promise<Object>} 移动结果
   */
  async moveFile(srcKey, destKey, force = false) {
    try {
      this.log('移动文件...', { srcKey, destKey, force })

      const response = await this.api.post('/move', {
        srcKey,
        destKey,
        force,
      })

      if (response.data.success) {
        this.log('文件移动成功')
        return response.data
      } else {
        throw new Error(response.data.error)
      }
    } catch (error) {
      this.log('文件移动失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 复制文件
   * @param {String} srcKey 源文件key
   * @param {String} destKey 目标文件key
   * @param {Boolean} force 是否强制覆盖
   * @returns {Promise<Object>} 复制结果
   */
  async copyFile(srcKey, destKey, force = false) {
    try {
      this.log('复制文件...', { srcKey, destKey, force })

      const response = await this.api.post('/copy', {
        srcKey,
        destKey,
        force,
      })

      if (response.data.success) {
        this.log('文件复制成功')
        return response.data
      } else {
        throw new Error(response.data.error)
      }
    } catch (error) {
      this.log('文件复制失败', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      }
    }
  }

  /**
   * 图片处理 - 生成缩略图URL
   * @param {String} key 文件key
   * @param {Object} options 处理选项
   * @returns {String} 处理后的URL
   */
  getThumbnailUrl(key, options = {}) {
    const { width = 200, height = 200, mode = 1, format = null } = options

    let processStr = `imageView2/${mode}/w/${width}/h/${height}`

    if (format) {
      processStr += `/format/${format}`
    }

    return this.getFileUrl(key, { process: processStr })
  }

  /**
   * 图片处理 - 水印
   * @param {String} key 文件key
   * @param {String} text 水印文字
   * @returns {String} 处理后的URL
   */
  getWatermarkUrl(key, text) {
    const encodedText = btoa(unescape(encodeURIComponent(text)))
    const processStr = `watermark/2/text/${encodedText}`

    return this.getFileUrl(key, { process: processStr })
  }

  /**
   * 验证配置
   * @returns {Boolean} 是否配置完整
   */
  validateConfig() {
    if (!this.domain) {
      console.warn('七牛云域名未配置，请检查 VITE_QINIU_DOMAIN 环境变量')
      return false
    }

    return true
  }

  /**
   * 健康检查
   * @returns {Promise<Object>} 健康状态
   */
  async healthCheck() {
    try {
      const response = await this.api.get('/health')
      return response.data
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      }
    }
  }
}

// 创建单例实例
const qiniuService = new QiniuService()

export default qiniuService
export { QiniuService }
