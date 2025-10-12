/**
 * 七牛云工具函数
 * 提供安全的服务端七牛云操作
 * @author MilesXWalkerStudio
 * @version 2.0.0
 */

import qiniu from 'qiniu'
import dotenv from 'dotenv'

dotenv.config()

/**
 * 七牛云配置类
 */
class QiniuHelper {
  constructor() {
    // 从环境变量加载配置
    this.accessKey = process.env.QINIU_ACCESS_KEY
    this.secretKey = process.env.QINIU_SECRET_KEY
    this.bucket = process.env.QINIU_BUCKET
    this.domain = process.env.VITE_QINIU_DOMAIN
    this.region = process.env.QINIU_REGION || 'cn-east-1'
    this.zone = process.env.QINIU_ZONE || 'z0'
    this.isPrivate = process.env.QINIU_PRIVATE_BUCKET === 'true'
    this.debug = process.env.VITE_ENABLE_QINIU_DEBUG === 'true'

    // 创建认证对象
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)

    // 创建配置对象
    this.config = new qiniu.conf.Config()
    // 配置区域
    this.config.regionsProvider = qiniu.httpc.Region.fromRegionId(this.zone)
    // 是否使用https域名
    this.config.useHttpsDomain = true
    // 是否使用cdn加速
    this.config.useCdnDomain = true

    // 创建操作管理器
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config)
    this.formUploader = new qiniu.form_up.FormUploader(this.config)
    this.resumeUploader = new qiniu.resume_up.ResumeUploader(this.config)

    this.log('七牛云助手初始化完成', {
      bucket: this.bucket,
      region: this.region,
      zone: this.zone,
      isPrivate: this.isPrivate,
    })
  }

  /**
   * 调试日志
   */
  log(message, data = null) {
    if (this.debug) {
      console.log(`[QiniuHelper] ${message}`, data || '')
    }
  }

  /**
   * 获取上传URL（根据区域）
   * @returns {String} 上传URL
   */
  getUploadUrl() {
    const zoneMap = {
      z0: 'https://upload.qiniup.com', // 华东
      z1: 'https://up-z1.qiniup.com', // 华北
      z2: 'https://up-z2.qiniup.com', // 华南
      na0: 'https://up-na0.qiniup.com', // 北美
      as0: 'https://up-as0.qiniup.com', // 东南亚
    }

    return zoneMap[this.zone] || 'https://upload.qiniup.com'
  }

  /**
   * 验证配置完整性
   */
  validateConfig() {
    const required = [
      { key: 'accessKey', value: this.accessKey, name: 'QINIU_ACCESS_KEY' },
      { key: 'secretKey', value: this.secretKey, name: 'QINIU_SECRET_KEY' },
      { key: 'bucket', value: this.bucket, name: 'QINIU_BUCKET' },
      { key: 'domain', value: this.domain, name: 'VITE_QINIU_DOMAIN' },
    ]

    const missing = required.filter(item => !item.value)

    if (missing.length > 0) {
      const missingNames = missing.map(item => item.name).join(', ')
      throw new Error(`七牛云配置不完整，缺少环境变量: ${missingNames}`)
    }

    return true
  }

  /**
   * 生成上传凭证
   * @param {Object} options 上传选项
   * @returns {String} 上传凭证
   */
  generateUploadToken(options = {}) {
    try {
      this.validateConfig()

      const {
        key = null, // 文件名，null表示不指定
        expires = 3600, // 过期时间（秒）
        returnBody = null, // 自定义返回内容
        callbackUrl = null, // 回调URL
        callbackBody = null, // 回调内容
        persistentOps = null, // 数据处理指令
        persistentPipeline = null, // 数据处理队列
        persistentNotifyUrl = null, // 处理结果通知
        fsizeLimit = 1024 * 1024 * 100, // 文件大小限制（100MB）
        mimeLimit = null, // 文件类型限制
      } = options

      // 构建上传策略
      const putPolicyOptions = {
        scope: key ? `${this.bucket}:${key}` : this.bucket,
        expires: expires,
        fsizeLimit: fsizeLimit,
      }

      // 自定义返回内容
      if (returnBody) {
        putPolicyOptions.returnBody = returnBody
      } else {
        // 默认返回内容
        putPolicyOptions.returnBody = JSON.stringify({
          key: '$(key)',
          hash: '$(etag)',
          fsize: '$(fsize)',
          bucket: '$(bucket)',
          fname: '$(fname)',
          mimeType: '$(mimeType)',
          imageInfo: {
            width: '$(imageInfo.width)',
            height: '$(imageInfo.height)',
          },
        })
      }

      // 上传回调
      if (callbackUrl) {
        putPolicyOptions.callbackUrl = callbackUrl
        putPolicyOptions.callbackBody = callbackBody || 'key=$(key)&hash=$(etag)&fsize=$(fsize)'
        putPolicyOptions.callbackBodyType = 'application/json'
      }

      // 数据处理
      if (persistentOps) {
        putPolicyOptions.persistentOps = persistentOps
        if (persistentPipeline) {
          putPolicyOptions.persistentPipeline = persistentPipeline
        }
        if (persistentNotifyUrl) {
          putPolicyOptions.persistentNotifyUrl = persistentNotifyUrl
        }
      }

      // 文件类型限制
      if (mimeLimit) {
        putPolicyOptions.mimeLimit = mimeLimit
      }

      const putPolicy = new qiniu.rs.PutPolicy(putPolicyOptions)
      const uploadToken = putPolicy.uploadToken(this.mac)

      this.log('生成上传凭证成功', { key, expires })

      return uploadToken
    } catch (error) {
      this.log('生成上传凭证失败', error)
      throw error
    }
  }

  /**
   * 生成下载URL
   * @param {String} key 文件key
   * @param {Number} expires 过期时间（秒，仅私有空间需要）
   * @returns {String} 下载URL
   */
  generateDownloadUrl(key, expires = 3600) {
    try {
      if (!this.isPrivate) {
        // 公开空间：使用官方方法生成URL（自动处理urlencode）
        const publicUrl = this.bucketManager.publicDownloadUrl(this.domain, key)
        this.log('生成公开空间下载URL成功', { key })
        return publicUrl
      }

      // 私有空间：生成带签名的URL
      const deadline = Math.floor(Date.now() / 1000) + expires
      const privateUrl = this.bucketManager.privateDownloadUrl(this.domain, key, deadline)

      this.log('生成私有空间下载URL成功', { key, expires })
      return privateUrl
    } catch (error) {
      this.log('生成下载URL失败', error)
      throw error
    }
  }

  /**
   * 验证回调请求
   * @param {String} requestUri 请求URI
   * @param {String} requestBody 请求Body
   * @param {String} authHeader Authorization头
   * @returns {Boolean} 是否验证通过
   */
  verifyCallback(requestUri, requestBody, authHeader) {
    try {
      return qiniu.util.isQiniuCallback(this.mac, requestUri, requestBody, authHeader)
    } catch (error) {
      this.log('验证回调失败', error)
      return false
    }
  }

  /**
   * 获取文件信息
   * @param {String} key 文件key
   * @returns {Promise} 文件信息
   */
  async getFileInfo(key) {
    return new Promise((resolve, reject) => {
      this.bucketManager.stat(this.bucket, key, (err, respBody, respInfo) => {
        if (err) {
          this.log('获取文件信息失败', err)
          reject(err)
          return
        }

        if (respInfo.statusCode === 200) {
          this.log('获取文件信息成功', { key })
          resolve({
            success: true,
            data: respBody,
          })
        } else {
          const error = new Error(respBody.error || '获取文件信息失败')
          this.log('获取文件信息失败', error)
          reject(error)
        }
      })
    })
  }

  /**
   * 删除文件
   * @param {String} key 文件key
   * @returns {Promise} 删除结果
   */
  async deleteFile(key) {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.bucket, key, (err, respBody, respInfo) => {
        if (err) {
          this.log('删除文件失败', err)
          reject(err)
          return
        }

        if (respInfo.statusCode === 200) {
          this.log('删除文件成功', { key })
          resolve({
            success: true,
            message: '文件已删除',
          })
        } else {
          const error = new Error(respBody.error || '删除文件失败')
          this.log('删除文件失败', error)
          reject(error)
        }
      })
    })
  }

  /**
   * 列举文件
   * @param {Object} options 列举选项
   * @returns {Promise} 文件列表
   */
  async listFiles(options = {}) {
    const { prefix = '', marker = '', limit = 100 } = options

    return new Promise((resolve, reject) => {
      this.bucketManager.listPrefix(
        this.bucket,
        { prefix, marker, limit },
        (err, respBody, respInfo) => {
          if (err) {
            this.log('列举文件失败', err)
            reject(err)
            return
          }

          if (respInfo.statusCode === 200) {
            this.log('列举文件成功', {
              count: respBody.items?.length || 0,
              marker: respBody.marker,
            })
            resolve({
              success: true,
              data: {
                items: respBody.items || [],
                marker: respBody.marker || null,
                commonPrefixes: respBody.commonPrefixes || [],
              },
            })
          } else {
            const error = new Error(respBody.error || '列举文件失败')
            this.log('列举文件失败', error)
            reject(error)
          }
        }
      )
    })
  }

  /**
   * 批量删除文件
   * @param {Array<String>} keys 文件key数组
   * @returns {Promise} 删除结果
   */
  async batchDelete(keys) {
    const deleteOps = keys.map(key => qiniu.rs.deleteOp(this.bucket, key))

    return new Promise((resolve, reject) => {
      this.bucketManager.batch(deleteOps, (err, respBody, respInfo) => {
        if (err) {
          this.log('批量删除失败', err)
          reject(err)
          return
        }

        if (respInfo.statusCode === 200) {
          const results = respBody.map((item, index) => ({
            key: keys[index],
            success: item.code === 200,
            error: item.data?.error || null,
          }))

          const successCount = results.filter(r => r.success).length
          this.log('批量删除完成', { total: keys.length, success: successCount })

          resolve({
            success: true,
            results: results,
            successCount: successCount,
            failedCount: keys.length - successCount,
          })
        } else {
          const error = new Error(respBody.error || '批量删除失败')
          this.log('批量删除失败', error)
          reject(error)
        }
      })
    })
  }

  /**
   * 移动/重命名文件
   * @param {String} srcKey 源文件key
   * @param {String} destKey 目标文件key
   * @param {Boolean} force 是否强制覆盖
   * @returns {Promise} 移动结果
   */
  async moveFile(srcKey, destKey, force = false) {
    return new Promise((resolve, reject) => {
      const options = { force }

      this.bucketManager.move(
        this.bucket,
        srcKey,
        this.bucket,
        destKey,
        options,
        (err, respBody, respInfo) => {
          if (err) {
            this.log('移动文件失败', err)
            reject(err)
            return
          }

          if (respInfo.statusCode === 200) {
            this.log('移动文件成功', { srcKey, destKey })
            resolve({
              success: true,
              message: '文件已移动',
            })
          } else {
            const error = new Error(respBody.error || '移动文件失败')
            this.log('移动文件失败', error)
            reject(error)
          }
        }
      )
    })
  }

  /**
   * 复制文件
   * @param {String} srcKey 源文件key
   * @param {String} destKey 目标文件key
   * @param {Boolean} force 是否强制覆盖
   * @returns {Promise} 复制结果
   */
  async copyFile(srcKey, destKey, force = false) {
    return new Promise((resolve, reject) => {
      const options = { force }

      this.bucketManager.copy(
        this.bucket,
        srcKey,
        this.bucket,
        destKey,
        options,
        (err, respBody, respInfo) => {
          if (err) {
            this.log('复制文件失败', err)
            reject(err)
            return
          }

          if (respInfo.statusCode === 200) {
            this.log('复制文件成功', { srcKey, destKey })
            resolve({
              success: true,
              message: '文件已复制',
            })
          } else {
            const error = new Error(respBody.error || '复制文件失败')
            this.log('复制文件失败', error)
            reject(error)
          }
        }
      )
    })
  }

  /**
   * 测试连接
   * @returns {Promise} 测试结果
   */
  async testConnection() {
    try {
      this.validateConfig()

      // 测试列举文件
      const result = await this.listFiles({ limit: 1 })

      if (result.success) {
        this.log('连接测试成功')
        return {
          success: true,
          message: '七牛云连接测试成功',
          config: {
            bucket: this.bucket,
            region: this.region,
            zone: this.zone,
            domain: this.domain,
            isPrivate: this.isPrivate,
          },
        }
      } else {
        throw new Error('连接测试失败')
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

// 创建单例
const qiniuHelper = new QiniuHelper()

export default qiniuHelper
export { QiniuHelper }
