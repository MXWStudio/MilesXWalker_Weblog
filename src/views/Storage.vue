<template>
  <div class="storage-page">
    <!-- 页面头部 -->
    <div class="page-header bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">文件存储管理</h1>
        <p class="text-xl opacity-90">基于七牛云的高效文件存储解决方案</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="container mx-auto px-4 py-8">
      <!-- 统计信息 -->
      <div class="stats-grid grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="stat-icon bg-blue-100 dark:bg-blue-900 rounded-full p-3 mr-4">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalUploads }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">总上传次数</p>
            </div>
          </div>
        </div>

        <div class="stat-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="stat-icon bg-green-100 dark:bg-green-900 rounded-full p-3 mr-4">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.successUploads }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">成功上传</p>
            </div>
          </div>
        </div>

        <div class="stat-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="stat-icon bg-red-100 dark:bg-red-900 rounded-full p-3 mr-4">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.failedUploads }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">失败上传</p>
            </div>
          </div>
        </div>

        <div class="stat-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="stat-icon bg-purple-100 dark:bg-purple-900 rounded-full p-3 mr-4">
              <svg
                class="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatFileSize(stats.totalSize) }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">存储空间</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能选项卡 -->
      <div class="tabs-container mb-8">
        <div class="tab-buttons flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="[
              'tab-button px-4 py-2 rounded-md font-medium transition-all',
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
            ]"
            @click="activeTab = tab.key"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- 选项卡内容 -->
      <div class="tab-content">
        <!-- 文件上传 -->
        <div v-if="activeTab === 'upload'" class="upload-tab">
          <QiniuUploader
            :accepted-types="uploadConfig.acceptedTypes"
            :max-file-size="uploadConfig.maxFileSize"
            :path-prefix="uploadConfig.pathPrefix"
            @upload-success="handleUploadSuccess"
            @upload-error="handleUploadError"
            @upload-progress="handleUploadProgress"
          />
        </div>

        <!-- 文件管理 -->
        <div v-if="activeTab === 'manage'" class="manage-tab">
          <div class="file-manager bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="manager-header flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">文件管理</h3>
              <div class="manager-actions flex space-x-3">
                <button
                  :disabled="loading"
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  @click="refreshFileList"
                >
                  {{ loading ? '刷新中...' : '刷新列表' }}
                </button>
                <button
                  class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  @click="showCreateFolder = true"
                >
                  新建文件夹
                </button>
              </div>
            </div>

            <!-- 文件浏览器 -->
            <div class="file-browser">
              <div v-if="loading" class="loading-state py-12 text-center">
                <div
                  class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                ></div>
                <p class="text-gray-600 dark:text-gray-300">加载文件列表...</p>
              </div>

              <div v-else-if="fileList.length === 0" class="empty-state py-12 text-center">
                <svg
                  class="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300">暂无文件</p>
              </div>

              <div v-else class="file-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="file in fileList"
                  :key="file.key"
                  class="file-item bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  @click="selectFile(file)"
                >
                  <div class="file-icon mb-3">
                    <img
                      v-if="isImageFile(file.key)"
                      :src="getFileUrl(file.key)"
                      :alt="file.key"
                      class="w-full h-32 object-cover rounded"
                      @error="handleImageError"
                    />
                    <div
                      v-else
                      class="file-placeholder h-32 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center"
                    >
                      <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="file-info">
                    <p class="font-medium text-gray-900 dark:text-white truncate" :title="file.key">
                      {{ getFileName(file.key) }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatFileSize(file.fsize) }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ formatDate(file.putTime) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设置 -->
        <div v-if="activeTab === 'settings'" class="settings-tab">
          <div class="settings-panel bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">存储设置</h3>

            <div class="settings-form space-y-6">
              <!-- 上传配置 -->
              <div class="setting-group">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">上传配置</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      最大文件大小 (MB)
                    </label>
                    <input
                      v-model.number="uploadConfig.maxFileSizeMB"
                      type="number"
                      min="1"
                      max="100"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      文件路径前缀
                    </label>
                    <input
                      v-model="uploadConfig.pathPrefix"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- 连接信息 -->
              <div class="setting-group">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">连接信息</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      存储空间
                    </label>
                    <input
                      :value="config.bucket"
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      访问域名
                    </label>
                    <input
                      :value="config.domain"
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- 保存按钮 -->
              <div class="setting-actions">
                <button
                  class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  @click="saveSettings"
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import QiniuUploader from '@/components/storage/QiniuUploader.vue'
import qiniuService from '@/services/qiniuService'

// 响应式数据
const activeTab = ref('upload')
const loading = ref(false)
const showCreateFolder = ref(false)
const fileList = ref([])

// 配置信息
const config = reactive({
  bucket: import.meta.env.VITE_QINIU_BUCKET || '',
  domain: import.meta.env.VITE_QINIU_DOMAIN || '',
  region: import.meta.env.VITE_QINIU_REGION || 'cn-east-1',
})

// 上传配置
const uploadConfig = reactive({
  acceptedTypes: 'image/*,video/*,.pdf,.doc,.docx,.txt',
  maxFileSizeMB: 10,
  pathPrefix: 'uploads/',
  get maxFileSize() {
    return this.maxFileSizeMB * 1024 * 1024
  },
})

// 统计信息
const stats = reactive({
  totalUploads: 0,
  successUploads: 0,
  failedUploads: 0,
  totalSize: 0,
})

// 选项卡配置
const tabs = [
  { key: 'upload', name: '文件上传' },
  { key: 'manage', name: '文件管理' },
  { key: 'settings', name: '设置' },
]

// 格式化文件大小
const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期
const formatDate = timestamp => {
  const date = new Date(Math.floor(timestamp / 10000)) // 七牛云时间戳是纳秒
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

// 获取文件名
const getFileName = key => {
  return key.split('/').pop() || key
}

// 判断是否为图片文件
const isImageFile = key => {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const ext = key.toLowerCase().split('.').pop()
  return imageExts.includes('.' + ext)
}

// 获取文件URL
const getFileUrl = key => {
  return qiniuService.getFileUrl(key)
}

// 刷新文件列表
const refreshFileList = async () => {
  loading.value = true
  try {
    const result = await qiniuService.listFiles({ limit: 100 })
    if (result.success) {
      fileList.value = result.data.items || []
      updateStats()
    } else {
      console.error('获取文件列表失败:', result.error)
    }
  } catch (error) {
    console.error('获取文件列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 更新统计信息
const updateStats = () => {
  if (fileList.value.length > 0) {
    stats.totalSize = fileList.value.reduce((total, file) => total + file.fsize, 0)
  }
}

// 选择文件
const selectFile = file => {
  // 可以实现文件详情显示、编辑等功能
  console.log('选择文件:', file)
}

// 处理图片加载错误
const handleImageError = event => {
  event.target.style.display = 'none'
}

// 上传成功处理
const handleUploadSuccess = ({ upload, result }) => {
  stats.totalUploads++
  stats.successUploads++
  stats.totalSize += upload.file.size

  // 刷新文件列表
  if (activeTab.value === 'manage') {
    refreshFileList()
  }
}

// 上传失败处理
const handleUploadError = ({ upload, error }) => {
  stats.totalUploads++
  stats.failedUploads++
  console.error('上传失败:', error)
}

// 上传进度处理
const handleUploadProgress = ({ upload, progress }) => {
  console.log('上传进度:', upload.file.name, progress + '%')
}

// 保存设置
const saveSettings = () => {
  // 保存到本地存储
  localStorage.setItem('qiniu-upload-config', JSON.stringify(uploadConfig))
  alert('设置已保存')
}

// 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('qiniu-upload-config')
  if (saved) {
    Object.assign(uploadConfig, JSON.parse(saved))
  }
}

// 组件挂载时初始化
onMounted(() => {
  loadSettings()

  // 如果是管理页面，自动加载文件列表
  if (activeTab.value === 'manage') {
    refreshFileList()
  }
})
</script>

<style scoped>
.storage-page {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900;
}

.stat-card {
  @apply transition-transform duration-200 hover:scale-105;
}

.tab-button {
  @apply transition-all duration-200;
}

.file-item {
  @apply transition-all duration-200;
}

.file-item:hover {
  @apply transform scale-105 shadow-lg;
}

.settings-form input:focus {
  @apply ring-2 ring-blue-500 border-blue-500 outline-none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-content > div {
  animation: fadeIn 0.3s ease-out;
}
</style>
