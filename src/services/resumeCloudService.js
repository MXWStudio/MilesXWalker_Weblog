/**
 * 简历云端存储服务
 * 使用七牛云存储用户简历数据
 * @author MilesXWalkerStudio
 * @version 1.0.0
 */

import qiniuService from './qiniuService'

class ResumeCloudService {
  constructor() {
    this.pathPrefix = 'resumes/' // 简历文件存储路径前缀
    this.debug = import.meta.env.VITE_ENABLE_QINIU_DEBUG === 'true'
  }

  /**
   * 调试日志
   */
  log(message, data = null) {
    if (this.debug) {
      console.log(`[ResumeCloudService] ${message}`, data)
    }
  }

  /**
   * 获取或创建用户唯一ID
   * 使用设备指纹 + 时间戳确保唯一性
   */
  getUserId() {
    let userId = localStorage.getItem('mxw-user-id')

    if (!userId) {
      // 生成唯一用户ID
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 15)
      const deviceInfo = navigator.userAgent.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '')
      userId = `user_${deviceInfo}_${timestamp}_${random}`.substring(0, 64)

      localStorage.setItem('mxw-user-id', userId)
      this.log('创建新用户ID', { userId })
    }

    return userId
  }

  /**
   * 生成简历文件的云端key
   * @param {String} resumeId - 简历ID（可选，默认使用'default'）
   */
  getResumeKey(resumeId = 'default') {
    const userId = this.getUserId()
    return `${this.pathPrefix}${userId}/${resumeId}.json`
  }

  /**
   * 保存简历到云端
   * @param {Object} resumeData - 简历数据对象
   * @param {Object} options - 保存选项
   * @returns {Promise<Object>} 保存结果
   */
  async saveResume(resumeData, options = {}) {
    try {
      this.log('开始保存简历到云端', { resumeId: options.resumeId })

      // 准备保存的数据
      const dataToSave = {
        version: '1.0',
        savedAt: new Date().toISOString(),
        userId: this.getUserId(),
        data: resumeData,
        metadata: {
          userAgent: navigator.userAgent,
          savedFrom: window.location.href,
        },
      }

      // 将数据转换为JSON字符串
      const jsonString = JSON.stringify(dataToSave, null, 2)

      // 创建Blob对象
      const blob = new Blob([jsonString], { type: 'application/json' })

      // 创建File对象
      const fileName = `${options.resumeId || 'default'}.json`
      const file = new File([blob], fileName, { type: 'application/json' })

      // 生成文件key
      const key = this.getResumeKey(options.resumeId)

      // 上传到七牛云
      const result = await qiniuService.uploadFile(file, {
        fileName: key,
        onProgress: options.onProgress,
      })

      if (result.success) {
        this.log('简历保存成功', {
          key: result.key,
          url: result.url,
          size: result.size,
        })

        return {
          success: true,
          message: '简历已保存到云端',
          data: {
            key: result.key,
            url: result.url,
            size: result.size,
            savedAt: dataToSave.savedAt,
          },
        }
      } else {
        throw new Error(result.error || '上传失败')
      }
    } catch (error) {
      this.log('保存简历失败', error)
      return {
        success: false,
        error: error.message || '保存失败',
      }
    }
  }

  /**
   * 从云端加载简历
   * @param {String} resumeId - 简历ID
   * @returns {Promise<Object>} 简历数据
   */
  async loadResume(resumeId = 'default') {
    try {
      this.log('开始从云端加载简历', { resumeId })

      const key = this.getResumeKey(resumeId)
      const url = qiniuService.getFileUrl(key)

      // 下载文件
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('云端没有找到简历数据')
        }
        throw new Error(`加载失败: ${response.statusText}`)
      }

      const cloudData = await response.json()

      this.log('简历加载成功', {
        version: cloudData.version,
        savedAt: cloudData.savedAt,
      })

      return {
        success: true,
        message: '简历已从云端加载',
        data: cloudData.data,
        metadata: {
          savedAt: cloudData.savedAt,
          version: cloudData.version,
        },
      }
    } catch (error) {
      this.log('加载简历失败', error)
      return {
        success: false,
        error: error.message || '加载失败',
      }
    }
  }

  /**
   * 获取用户的所有简历列表
   * @returns {Promise<Array>} 简历列表
   */
  async listResumes() {
    try {
      const userId = this.getUserId()
      const prefix = `${this.pathPrefix}${userId}/`

      this.log('获取简历列表', { prefix })

      const result = await qiniuService.listFiles({
        prefix: prefix,
        limit: 100,
      })

      if (result.success) {
        const items = result.data.items || []

        const resumes = items
          .filter(item => item.key.endsWith('.json'))
          .map(item => ({
            key: item.key,
            resumeId: item.key.split('/').pop().replace('.json', ''),
            size: item.fsize,
            updatedAt: new Date(item.putTime / 10000).toISOString(),
            url: qiniuService.getFileUrl(item.key),
          }))

        this.log('获取简历列表成功', { count: resumes.length })

        return {
          success: true,
          data: resumes,
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      this.log('获取简历列表失败', error)
      return {
        success: false,
        error: error.message || '获取列表失败',
      }
    }
  }

  /**
   * 删除云端简历
   * @param {String} resumeId - 简历ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteResume(resumeId = 'default') {
    try {
      this.log('删除云端简历', { resumeId })

      const key = this.getResumeKey(resumeId)
      const result = await qiniuService.deleteFile(key)

      if (result.success) {
        this.log('简历删除成功', { key })
        return {
          success: true,
          message: '简历已从云端删除',
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      this.log('删除简历失败', error)
      return {
        success: false,
        error: error.message || '删除失败',
      }
    }
  }

  /**
   * 自动保存简历（带防抖）
   * @param {Object} resumeData - 简历数据
   * @param {Number} delay - 延迟时间（毫秒）
   */
  autoSave(resumeData, delay = 3000) {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer)
    }

    this.autoSaveTimer = setTimeout(() => {
      this.saveResume(resumeData, { resumeId: 'autosave' })
        .then(result => {
          if (result.success) {
            this.log('自动保存成功')
          }
        })
        .catch(error => {
          this.log('自动保存失败', error)
        })
    }, delay)
  }

  /**
   * 取消自动保存
   */
  cancelAutoSave() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer)
      this.autoSaveTimer = null
    }
  }

  /**
   * 同步：先保存到云端，再从云端加载（确保数据一致性）
   * @param {Object} resumeData - 简历数据
   * @returns {Promise<Object>} 同步结果
   */
  async syncResume(resumeData) {
    try {
      // 先保存到云端
      const saveResult = await this.saveResume(resumeData)

      if (!saveResult.success) {
        throw new Error(saveResult.error)
      }

      // 再从云端加载（验证数据一致性）
      const loadResult = await this.loadResume()

      return {
        success: true,
        message: '简历已同步到云端',
        data: loadResult.data,
      }
    } catch (error) {
      this.log('同步简历失败', error)
      return {
        success: false,
        error: error.message || '同步失败',
      }
    }
  }

  /**
   * 检查云端是否有简历数据
   * @param {String} resumeId - 简历ID
   * @returns {Promise<Boolean>} 是否存在
   */
  async hasResume(resumeId = 'default') {
    try {
      const key = this.getResumeKey(resumeId)
      const result = await qiniuService.getFileInfo(key)
      return result.success
    } catch (error) {
      return false
    }
  }
}

// 创建单例实例
const resumeCloudService = new ResumeCloudService()

export default resumeCloudService
