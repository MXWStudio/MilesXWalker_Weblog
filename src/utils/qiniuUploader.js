/**
 * 七牛云大文件分片上传工具
 * 支持断点续传、进度跟踪、自动重试
 * @author MilesXWalkerStudio
 * @version 2.0.0
 */

import qiniuService from '@/services/qiniuService'
import axios from 'axios'

/**
 * 分片上传器类
 */
class ChunkUploader {
  constructor(options = {}) {
    this.file = options.file
    this.chunkSize = options.chunkSize || 4 * 1024 * 1024 // 默认4MB
    this.token = options.token
    this.key = options.key
    this.uploadUrl = options.uploadUrl || 'https://upload.qiniup.com'
    this.onProgress = options.onProgress
    this.onChunkComplete = options.onChunkComplete
    this.onError = options.onError
    this.maxRetries = options.maxRetries || 3
    this.debug = options.debug || false

    // 分片信息
    this.chunks = []
    this.totalChunks = 0
    this.uploadedChunks = 0
    this.failedChunks = []

    // 断点续传信息
    this.resumeData = null

    // 状态
    this.isPaused = false
    this.isCancelled = false

    this.init()
  }

  /**
   * 初始化分片信息
   */
  init() {
    const fileSize = this.file.size
    this.totalChunks = Math.ceil(fileSize / this.chunkSize)

    this.log('初始化分片上传', {
      fileName: this.file.name,
      fileSize,
      chunkSize: this.chunkSize,
      totalChunks: this.totalChunks,
    })

    // 创建分片列表
    for (let i = 0; i < this.totalChunks; i++) {
      const start = i * this.chunkSize
      const end = Math.min(start + this.chunkSize, fileSize)

      this.chunks.push({
        index: i,
        start,
        end,
        size: end - start,
        uploaded: false,
        retries: 0,
      })
    }
  }

  /**
   * 调试日志
   */
  log(message, data = null) {
    if (this.debug) {
      console.log(`[ChunkUploader] ${message}`, data || '')
    }
  }

  /**
   * 切分文件
   */
  sliceFile(chunk) {
    return this.file.slice(chunk.start, chunk.end)
  }

  /**
   * 上传单个分片
   */
  async uploadChunk(chunk) {
    if (this.isCancelled) {
      throw new Error('上传已取消')
    }

    if (this.isPaused) {
      // 如果暂停，等待恢复
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!this.isPaused || this.isCancelled) {
            clearInterval(checkInterval)
            resolve()
          }
        }, 100)
      })
    }

    if (this.isCancelled) {
      throw new Error('上传已取消')
    }

    try {
      const blob = this.sliceFile(chunk)

      const formData = new FormData()
      formData.append('file', blob)
      formData.append('token', this.token)
      formData.append('key', this.key)
      formData.append('chunk', chunk.index)
      formData.append('chunks', this.totalChunks)

      this.log(`上传分片 ${chunk.index + 1}/${this.totalChunks}`)

      const response = await axios.post(this.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
        onUploadProgress: progressEvent => {
          // 单个分片的进度
          const chunkProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.updateProgress(chunk.index, chunkProgress)
        },
      })

      chunk.uploaded = true
      this.uploadedChunks++

      if (this.onChunkComplete) {
        this.onChunkComplete({
          chunkIndex: chunk.index,
          totalChunks: this.totalChunks,
          uploadedChunks: this.uploadedChunks,
        })
      }

      this.log(`分片上传成功 ${chunk.index + 1}/${this.totalChunks}`)

      return response.data
    } catch (error) {
      chunk.retries++

      this.log(`分片上传失败 ${chunk.index + 1}/${this.totalChunks}`, {
        error: error.message,
        retries: chunk.retries,
      })

      if (chunk.retries < this.maxRetries) {
        // 重试
        this.log(`重试上传分片 ${chunk.index + 1}，第 ${chunk.retries} 次重试`)
        await new Promise(resolve => setTimeout(resolve, 1000 * chunk.retries)) // 延迟重试
        return this.uploadChunk(chunk)
      } else {
        // 超过最大重试次数
        this.failedChunks.push(chunk.index)
        if (this.onError) {
          this.onError({
            type: 'chunk',
            chunkIndex: chunk.index,
            error: error.message,
          })
        }
        throw error
      }
    }
  }

  /**
   * 更新总体进度
   */
  updateProgress(chunkIndex, chunkProgress) {
    // 计算总体进度：已完成分片 + 当前分片进度
    const completedProgress = (this.uploadedChunks / this.totalChunks) * 100
    const currentChunkProgress = (chunkProgress / 100 / this.totalChunks) * 100
    const totalProgress = Math.min(Math.round(completedProgress + currentChunkProgress), 100)

    if (this.onProgress) {
      this.onProgress({
        progress: totalProgress,
        uploadedChunks: this.uploadedChunks,
        totalChunks: this.totalChunks,
        uploadedBytes: this.uploadedChunks * this.chunkSize,
        totalBytes: this.file.size,
      })
    }
  }

  /**
   * 开始上传
   */
  async start() {
    try {
      this.log('开始分片上传')

      // 并发上传多个分片（同时上传3个）
      const concurrency = 3
      const results = []

      for (let i = 0; i < this.chunks.length; i += concurrency) {
        const batch = this.chunks.slice(i, i + concurrency)
        const batchPromises = batch.map(chunk => this.uploadChunk(chunk))

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
      }

      this.log('所有分片上传完成')

      return {
        success: true,
        message: '文件上传成功',
        uploadedChunks: this.uploadedChunks,
        totalChunks: this.totalChunks,
      }
    } catch (error) {
      this.log('分片上传失败', error)

      return {
        success: false,
        error: error.message || '上传失败',
        uploadedChunks: this.uploadedChunks,
        totalChunks: this.totalChunks,
        failedChunks: this.failedChunks,
      }
    }
  }

  /**
   * 暂停上传
   */
  pause() {
    this.log('暂停上传')
    this.isPaused = true
  }

  /**
   * 恢复上传
   */
  resume() {
    this.log('恢复上传')
    this.isPaused = false
  }

  /**
   * 取消上传
   */
  cancel() {
    this.log('取消上传')
    this.isCancelled = true
  }

  /**
   * 保存断点信息
   */
  saveResumeData() {
    const resumeData = {
      fileName: this.file.name,
      fileSize: this.file.size,
      key: this.key,
      chunks: this.chunks.map(chunk => ({
        index: chunk.index,
        uploaded: chunk.uploaded,
      })),
      uploadedChunks: this.uploadedChunks,
      timestamp: Date.now(),
    }

    localStorage.setItem(`qiniu_resume_${this.key}`, JSON.stringify(resumeData))

    this.log('保存断点信息', resumeData)

    return resumeData
  }

  /**
   * 加载断点信息
   */
  loadResumeData() {
    try {
      const resumeDataStr = localStorage.getItem(`qiniu_resume_${this.key}`)

      if (!resumeDataStr) {
        return null
      }

      const resumeData = JSON.parse(resumeDataStr)

      // 验证文件是否匹配
      if (resumeData.fileName !== this.file.name || resumeData.fileSize !== this.file.size) {
        this.log('断点信息不匹配，清除旧数据')
        this.clearResumeData()
        return null
      }

      this.log('加载断点信息', resumeData)

      // 恢复上传状态
      resumeData.chunks.forEach(savedChunk => {
        const chunk = this.chunks[savedChunk.index]
        if (chunk) {
          chunk.uploaded = savedChunk.uploaded
          if (savedChunk.uploaded) {
            this.uploadedChunks++
          }
        }
      })

      return resumeData
    } catch (error) {
      this.log('加载断点信息失败', error)
      return null
    }
  }

  /**
   * 清除断点信息
   */
  clearResumeData() {
    localStorage.removeItem(`qiniu_resume_${this.key}`)
    this.log('清除断点信息')
  }
}

/**
 * 大文件上传主函数
 * @param {File} file 文件对象
 * @param {Object} options 上传选项
 * @returns {Promise<Object>} 上传结果
 */
export async function uploadLargeFile(file, options = {}) {
  const debug = options.debug || import.meta.env.VITE_ENABLE_QINIU_DEBUG === 'true'

  const log = (message, data = null) => {
    if (debug) {
      console.log(`[uploadLargeFile] ${message}`, data || '')
    }
  }

  try {
    log('开始大文件上传', {
      fileName: file.name,
      fileSize: file.size,
    })

    // 1. 获取上传凭证
    const tokenResult = await qiniuService.getUploadToken({
      key: options.fileName || null,
      expires: options.expires || 7200, // 大文件给更长的过期时间
      fsizeLimit: options.fsizeLimit,
      mimeLimit: options.mimeLimit,
    })

    if (!tokenResult.success) {
      throw new Error(tokenResult.error)
    }

    // 2. 创建分片上传器
    const uploader = new ChunkUploader({
      file,
      chunkSize: options.chunkSize || 4 * 1024 * 1024, // 4MB
      token: tokenResult.token,
      key: options.fileName || tokenResult.key,
      uploadUrl: tokenResult.uploadUrl,
      onProgress: options.onProgress,
      onChunkComplete: options.onChunkComplete,
      onError: options.onError,
      maxRetries: options.maxRetries || 3,
      debug,
    })

    // 3. 检查断点续传
    if (options.enableResume) {
      uploader.loadResumeData()
    }

    // 4. 开始上传
    const result = await uploader.start()

    // 5. 清除断点信息
    if (result.success && options.enableResume) {
      uploader.clearResumeData()
    }

    // 6. 生成文件URL
    if (result.success) {
      const fileUrl = qiniuService.getFileUrl(options.fileName || tokenResult.key)

      log('大文件上传成功', { url: fileUrl })

      return {
        success: true,
        key: options.fileName || tokenResult.key,
        url: fileUrl,
        size: file.size,
        uploadedChunks: result.uploadedChunks,
        totalChunks: result.totalChunks,
      }
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    log('大文件上传失败', error)

    return {
      success: false,
      error: error.message || '上传失败',
    }
  }
}

/**
 * 智能上传 - 根据文件大小自动选择上传方式
 * @param {File} file 文件对象
 * @param {Object} options 上传选项
 * @returns {Promise<Object>} 上传结果
 */
export async function smartUpload(file, options = {}) {
  const threshold = options.threshold || 10 * 1024 * 1024 // 默认10MB

  if (file.size > threshold) {
    // 大文件使用分片上传
    return uploadLargeFile(file, {
      ...options,
      enableResume: true,
    })
  } else {
    // 小文件使用普通上传
    return qiniuService.uploadFile(file, options)
  }
}

export { ChunkUploader }
export default {
  uploadLargeFile,
  smartUpload,
  ChunkUploader,
}
