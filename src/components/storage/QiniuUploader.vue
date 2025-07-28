<template>
  <div class="qiniu-uploader">
    <!-- 标题区域 -->
    <div class="uploader-header mb-6">
      <h3 class="text-2xl font-bold text-gray-800 dark:text-white">七牛云文件上传</h3>
      <p class="text-gray-600 dark:text-gray-300 mt-2">
        支持拖拽上传，最大文件大小 {{ formatFileSize(maxFileSize) }}
      </p>
    </div>

    <!-- 连接状态 -->
    <div class="connection-status mb-4">
      <div
        :class="[
          'inline-flex items-center px-3 py-1 rounded-full text-sm',
          connectionStatus.success
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        ]"
      >
        <div
          :class="[
            'w-2 h-2 rounded-full mr-2',
            connectionStatus.success ? 'bg-green-500' : 'bg-red-500',
          ]"
        ></div>
        {{ connectionStatus.message }}
      </div>
      <button
        @click="testConnection"
        :disabled="testing"
        class="ml-3 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ testing ? '测试中...' : '重新测试' }}
      </button>
    </div>

    <!-- 上传区域 -->
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      :class="[
        'upload-area border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400',
      ]"
    >
      <div class="upload-icon mb-4">
        <svg
          class="w-12 h-12 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-2">
        拖拽文件到此处或
        <label class="text-blue-500 hover:text-blue-600 cursor-pointer underline">
          点击选择文件
          <input
            type="file"
            multiple
            @change="handleFileSelect"
            class="hidden"
            :accept="acceptedTypes"
          />
        </label>
      </p>
      <p class="text-sm text-gray-500">支持 {{ acceptedTypes || '所有文件类型' }}</p>
    </div>

    <!-- 上传列表 -->
    <div v-if="uploads.length > 0" class="upload-list mt-6">
      <h4 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        上传列表 ({{ uploads.length }})
      </h4>

      <div class="space-y-3">
        <div
          v-for="upload in uploads"
          :key="upload.id"
          class="upload-item p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 flex-1">
              <!-- 文件图标 -->
              <div class="file-icon">
                <svg
                  v-if="isImageFile(upload.file)"
                  class="w-8 h-8 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg v-else class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <!-- 文件信息 -->
              <div class="file-info flex-1">
                <p class="font-medium text-gray-800 dark:text-white">
                  {{ upload.file.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatFileSize(upload.file.size) }}
                  <span v-if="upload.status === 'uploading'"> - {{ upload.progress }}% </span>
                </p>
              </div>
            </div>

            <!-- 状态和操作 -->
            <div class="flex items-center space-x-2">
              <!-- 状态图标 -->
              <div class="status-icon">
                <svg
                  v-if="upload.status === 'uploading'"
                  class="w-5 h-5 text-blue-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <svg
                  v-else-if="upload.status === 'success'"
                  class="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else-if="upload.status === 'error'"
                  class="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <!-- 操作按钮 -->
              <button
                v-if="upload.status === 'success' && upload.url"
                @click="copyUrl(upload.url)"
                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                title="复制链接"
              >
                复制链接
              </button>

              <button
                v-if="upload.status === 'success'"
                @click="deleteFile(upload)"
                class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                title="删除文件"
              >
                删除
              </button>
            </div>
          </div>

          <!-- 进度条 -->
          <div v-if="upload.status === 'uploading'" class="progress-bar mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: upload.progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- 错误信息 -->
          <div
            v-if="upload.status === 'error'"
            class="error-message mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300 text-sm"
          >
            {{ upload.error }}
          </div>

          <!-- 成功信息 -->
          <div
            v-if="upload.status === 'success'"
            class="success-info mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-green-700 dark:text-green-300 text-sm"
          >
            <p>上传成功！文件地址：</p>
            <code class="text-xs bg-white dark:bg-gray-800 px-1 py-0.5 rounded">{{
              upload.url
            }}</code>
          </div>
        </div>
      </div>

      <!-- 批量操作 -->
      <div class="batch-actions mt-4 flex space-x-3">
        <button
          @click="clearUploads"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          清空列表
        </button>
        <button
          @click="retryFailedUploads"
          v-if="failedUploads.length > 0"
          class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          重试失败 ({{ failedUploads.length }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import qiniuService from '@/services/qiniuService'

// Props
const props = defineProps({
  acceptedTypes: {
    type: String,
    default: '',
  },
  maxFileSize: {
    type: Number,
    default: 10485760, // 10MB
  },
  pathPrefix: {
    type: String,
    default: 'uploads/',
  },
})

// Emits
const emit = defineEmits(['upload-success', 'upload-error', 'upload-progress'])

// 响应式数据
const isDragging = ref(false)
const testing = ref(false)
const uploads = ref([])
const connectionStatus = reactive({
  success: false,
  message: '未连接',
})

// 计算属性
const failedUploads = computed(() => uploads.value.filter(u => u.status === 'error'))

// 格式化文件大小
const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 判断是否为图片文件
const isImageFile = file => {
  return file.type && file.type.startsWith('image/')
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 测试连接
const testConnection = async () => {
  testing.value = true
  try {
    const result = await qiniuService.testConnection()
    connectionStatus.success = result.success
    connectionStatus.message = result.success ? '连接正常' : result.error
  } catch (error) {
    connectionStatus.success = false
    connectionStatus.message = '连接失败: ' + error.message
  } finally {
    testing.value = false
  }
}

// 处理文件选择
const handleFileSelect = event => {
  const files = Array.from(event.target.files)
  handleFiles(files)
  event.target.value = '' // 清空input，允许重复选择相同文件
}

// 处理拖拽
const handleDrop = event => {
  event.preventDefault()
  isDragging.value = false

  const files = Array.from(event.dataTransfer.files)
  handleFiles(files)
}

// 处理文件
const handleFiles = files => {
  if (!connectionStatus.success) {
    alert('请先测试连接成功后再上传文件')
    return
  }

  files.forEach(file => {
    // 文件大小检查
    if (file.size > props.maxFileSize) {
      alert(`文件 "${file.name}" 大小超过限制 ${formatFileSize(props.maxFileSize)}`)
      return
    }

    // 文件类型检查
    if (props.acceptedTypes && !isFileTypeAccepted(file)) {
      alert(`文件 "${file.name}" 类型不被支持`)
      return
    }

    const upload = {
      id: generateId(),
      file,
      status: 'uploading',
      progress: 0,
      url: null,
      key: null,
      error: null,
    }

    uploads.value.push(upload)
    startUpload(upload)
  })
}

// 检查文件类型
const isFileTypeAccepted = file => {
  if (!props.acceptedTypes) return true

  const acceptedTypes = props.acceptedTypes.split(',').map(type => type.trim())
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    return file.type.match(type.replace('*', '.*'))
  })
}

// 开始上传
const startUpload = async upload => {
  try {
    const result = await qiniuService.uploadFile(upload.file, {
      pathPrefix: props.pathPrefix,
      onProgress: progressEvent => {
        upload.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        emit('upload-progress', { upload, progress: upload.progress })
      },
    })

    if (result.success) {
      upload.status = 'success'
      upload.url = result.url
      upload.key = result.key
      upload.progress = 100

      emit('upload-success', { upload, result })
    } else {
      upload.status = 'error'
      upload.error = result.error

      emit('upload-error', { upload, error: result.error })
    }
  } catch (error) {
    upload.status = 'error'
    upload.error = error.message

    emit('upload-error', { upload, error: error.message })
  }
}

// 复制URL
const copyUrl = async url => {
  try {
    await navigator.clipboard.writeText(url)
    alert('链接已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)

    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = url
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('链接已复制到剪贴板')
  }
}

// 删除文件
const deleteFile = async upload => {
  if (!confirm('确定要删除这个文件吗？')) return

  try {
    const result = await qiniuService.deleteFile(upload.key)
    if (result.success) {
      // 从列表中移除
      const index = uploads.value.findIndex(u => u.id === upload.id)
      if (index > -1) {
        uploads.value.splice(index, 1)
      }
      alert('文件删除成功')
    } else {
      alert('文件删除失败: ' + result.error)
    }
  } catch (error) {
    alert('文件删除失败: ' + error.message)
  }
}

// 清空上传列表
const clearUploads = () => {
  if (uploads.value.length === 0) return

  if (confirm('确定要清空上传列表吗？')) {
    uploads.value = []
  }
}

// 重试失败的上传
const retryFailedUploads = () => {
  failedUploads.value.forEach(upload => {
    upload.status = 'uploading'
    upload.progress = 0
    upload.error = null
    startUpload(upload)
  })
}

// 拖拽事件处理
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

// 组件挂载时测试连接
onMounted(() => {
  testConnection()
})
</script>

<style scoped>
.qiniu-uploader {
  @apply max-w-4xl mx-auto p-6;
}

.upload-area {
  @apply transition-all duration-200;
}

.upload-area:hover {
  @apply border-blue-300;
}

.upload-item {
  @apply transition-all duration-200;
}

.upload-item:hover {
  @apply shadow-md;
}

.progress-bar {
  @apply transition-all duration-300;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
