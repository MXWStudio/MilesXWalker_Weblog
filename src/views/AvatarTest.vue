<template>
  <div class="avatar-test-page">
    <div class="test-container">
      <h1>3D虚拟形象测试页面</h1>
      <p>用于测试和调试Ready Player Me模型加载</p>

      <!-- 模式选择 -->
      <div class="mode-selection">
        <h3>选择模式:</h3>
        <div class="mode-buttons">
          <button
            :class="{ active: currentTestMode === 'create' }"
            class="mode-btn"
            @click="setMode('create')"
          >
            🎨 创建新虚拟人物
          </button>
          <button
            :class="{ active: currentTestMode === 'test' }"
            class="mode-btn"
            @click="setMode('test')"
          >
            🔧 测试现有URL
          </button>
        </div>
      </div>

      <!-- 虚拟人物创建器模式 -->
      <div v-if="currentTestMode === 'create'" class="creator-mode">
        <AvatarCreator
          @avatar-created="handleAvatarCreated"
          @avatar-selected="handleAvatarSelected"
          @user-changed="handleUserChanged"
        />

        <!-- 创建器状态信息 -->
        <div v-if="creatorStats.totalCreated > 0 || currentUser" class="creator-stats">
          <h3>📊 创建统计 & 用户信息</h3>
          <div class="stats-grid">
            <div class="stat-item"><strong>总创建数:</strong> {{ creatorStats.totalCreated }}</div>
            <div class="stat-item"><strong>v1版本:</strong> {{ creatorStats.v1Count }}</div>
            <div class="stat-item"><strong>v2版本:</strong> {{ creatorStats.v2Count }}</div>
            <div class="stat-item">
              <strong>当前用户:</strong>
              <span v-if="currentUser">
                {{ currentUser.id }}
                <span class="account-badge" :class="currentUser.accountType">
                  {{ getAccountTypeLabel(currentUser.accountType) }}
                </span>
              </span>
              <span v-else class="no-user">未登录</span>
            </div>
          </div>

          <!-- 用户详细信息 -->
          <div v-if="currentUser" class="user-detail-info">
            <h4>👤 用户详情</h4>
            <div class="user-info-grid">
              <div class="info-item">
                <strong>用户ID:</strong> <code>{{ currentUser.id }}</code>
              </div>
              <div class="info-item">
                <strong>账户类型:</strong>
                <span class="account-type-detail" :class="currentUser.accountType">
                  {{ getAccountTypeLabel(currentUser.accountType) }}
                </span>
              </div>
              <div class="info-item">
                <strong>状态:</strong>
                <span class="status-detail" :class="getStatusClass(currentUser.status)">
                  {{ currentUser.status }}
                </span>
              </div>
              <div class="info-item">
                <strong>用户体验:</strong>
                <span class="experience-level">
                  {{ getUserExperienceLevel(currentUser) }}
                </span>
              </div>
            </div>

            <!-- 账户建议 -->
            <div v-if="currentUser.accountType === 'guest'" class="account-suggestion-test">
              <h5>💡 测试环境建议</h5>
              <p>当前测试的是访客账户体验。在生产环境中，系统会：</p>
              <ul>
                <li>自动显示升级建议</li>
                <li>提供便捷的注册入口</li>
                <li>保留用户创建的虚拟形象</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 最近创建的虚拟人物 -->
        <div v-if="recentAvatars.length > 0" class="recent-avatars">
          <h3>🕒 最近创建</h3>
          <div class="recent-grid">
            <div v-for="avatar in recentAvatars" :key="avatar.avatarId" class="recent-item">
              <div class="recent-info">
                <p class="recent-time">{{ formatTime(avatar.createdAt) }}</p>
                <p class="recent-version">{{ avatar.version.toUpperCase() }}</p>
                <p v-if="avatar.metadata?.gender" class="recent-meta">
                  {{ avatar.metadata.gender }} · {{ avatar.metadata.bodyType }}
                </p>
              </div>
              <div class="recent-actions">
                <button class="preview-recent-btn" @click="previewRecentAvatar(avatar)">
                  预览
                </button>
                <button class="use-recent-btn" @click="useRecentAvatar(avatar)">使用</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- URL测试模式 -->
      <div v-if="currentTestMode === 'test'" class="test-mode">
        <!-- 模型URL输入 -->
        <div class="url-input-section">
          <label for="modelUrl">模型URL:</label>
          <input
            id="modelUrl"
            v-model="currentModelUrl"
            type="url"
            placeholder="输入Ready Player Me模型URL"
            @keyup.enter="reloadModel"
          />
          <button @click="reloadModel">重新加载</button>
        </div>

        <!-- 加载状态显示 -->
        <div class="status-section">
          <h3>加载状态:</h3>
          <div
            class="status-indicator"
            :class="{ loading: isLoading, error: hasError, success: isLoaded }"
          >
            <span v-if="isLoading">🔄 正在加载...</span>
            <span v-else-if="hasError">❌ 加载失败</span>
            <span v-else-if="isLoaded">✅ 加载成功</span>
            <span v-else>⏳ 等待加载</span>
          </div>
          <div v-if="loadingMessage" class="loading-message">{{ loadingMessage }}</div>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </div>

        <!-- 控制面板 -->
        <div class="control-panel">
          <h3>控制面板:</h3>
          <div class="control-buttons">
            <button @click="changeMode('decorative')">装饰模式</button>
            <button @click="changeMode('simple')">简化模式</button>
            <button @click="changeMode('full')">完整模式</button>
            <button @click="toggleControls">{{ showControls ? '隐藏' : '显示' }}控制器</button>
            <button @click="toggleGround">{{ showGround ? '隐藏' : '显示' }}地面</button>
          </div>
        </div>
      </div>

      <!-- 3D显示区域 (两种模式共用) -->
      <div v-if="currentModelUrl" class="avatar-display-section">
        <h3>3D显示:</h3>
        <div class="avatar-wrapper">
          <Avatar3D
            :key="modelKey"
            :model-url="currentModelUrl"
            :mode="currentMode"
            height="500px"
            :show-controls="showControls"
            :show-ground="showGround"
            @loaded="handleModelLoaded"
            @error="handleModelError"
          />
        </div>
      </div>

      <!-- 技术信息 -->
      <div class="tech-info">
        <h3>技术信息:</h3>
        <div class="info-grid">
          <div class="info-item"><strong>当前模式:</strong> {{ currentMode }}</div>
          <div class="info-item">
            <strong>测试模式:</strong> {{ currentTestMode === 'create' ? '创建模式' : '测试模式' }}
          </div>
          <div class="info-item">
            <strong>模型URL:</strong>
            <a v-if="currentModelUrl" :href="currentModelUrl" target="_blank" class="model-link">
              {{ currentModelUrl }}
            </a>
            <span v-else class="no-url">未设置</span>
          </div>
          <div class="info-item"><strong>浏览器兼容性:</strong> {{ browserSupport }}</div>
          <div class="info-item"><strong>WebGL版本:</strong> {{ webglVersion }}</div>
        </div>
      </div>

      <!-- 调试日志 -->
      <div class="debug-section">
        <h3>调试日志:</h3>
        <div class="debug-log">
          <div v-for="(log, index) in debugLogs" :key="index" class="log-entry" :class="log.type">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
        <button @click="clearLogs">清除日志</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Avatar3D from '@/components/Avatar3D.vue'
import AvatarCreator from '@/components/AvatarCreator.vue'

// 响应式数据
const currentTestMode = ref('create') // 'create' 或 'test'
const currentModelUrl = ref('') // 默认为空，让用户选择
const currentMode = ref('full')
const showControls = ref(true)
const showGround = ref(true)
const isLoading = ref(false)
const isLoaded = ref(false)
const hasError = ref(false)
const loadingMessage = ref('')
const errorMessage = ref('')
const modelKey = ref(0)
const debugLogs = ref([])

// 新增：创建器相关数据
const currentUser = ref(null)
const recentAvatars = ref([])
const creatorStats = ref({
  totalCreated: 0,
  v1Count: 0,
  v2Count: 0,
})

// 浏览器兼容性检测
const browserSupport = computed(() => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  return gl ? '✅ 支持WebGL' : '❌ 不支持WebGL'
})

const webglVersion = computed(() => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2')
  if (gl) return 'WebGL 2.0'
  const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  return gl1 ? 'WebGL 1.0' : '不支持'
})

// 添加调试日志
const addLog = (message, type = 'info') => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  debugLogs.value.unshift({ time, message, type })

  // 保持日志数量在合理范围内
  if (debugLogs.value.length > 50) {
    debugLogs.value = debugLogs.value.slice(0, 50)
  }
}

// 清除日志
const clearLogs = () => {
  debugLogs.value = []
  addLog('日志已清除', 'info')
}

// 设置测试模式
const setMode = mode => {
  currentTestMode.value = mode
  addLog(`切换到${mode === 'create' ? '创建' : '测试'}模式`, 'info')

  // 如果切换到测试模式且没有URL，使用默认URL
  if (mode === 'test' && !currentModelUrl.value) {
    currentModelUrl.value = 'https://models.readyplayer.me/683e4e978bc98dc94b73ae87.glb'
    addLog('已设置默认测试URL', 'info')
  }
}

// 处理虚拟人物创建完成
const handleAvatarCreated = data => {
  addLog(`虚拟人物创建成功 (${data.version}): ${data.url}`, 'success')

  // 更新统计
  creatorStats.value.totalCreated++
  if (data.version === 'v1') {
    creatorStats.value.v1Count++
  } else if (data.version === 'v2') {
    creatorStats.value.v2Count++
  }

  // 添加到最近创建列表
  const avatarInfo = {
    ...data.data,
    url: data.url,
    version: data.version,
  }

  recentAvatars.value.unshift(avatarInfo)

  // 限制最近列表数量
  if (recentAvatars.value.length > 5) {
    recentAvatars.value = recentAvatars.value.slice(0, 5)
  }

  // 如果是v2版本，记录元数据
  if (data.version === 'v2' && data.data.metadata) {
    addLog(
      `获取到详细信息 - 性别:${data.data.metadata.gender}, 体型:${data.data.metadata.bodyType}`,
      'info'
    )
  }

  // 保存到本地存储
  localStorage.setItem('avatarTestStats', JSON.stringify(creatorStats.value))
  localStorage.setItem('recentAvatars', JSON.stringify(recentAvatars.value))
}

// 处理虚拟人物选择使用
const handleAvatarSelected = url => {
  currentModelUrl.value = url
  addLog(`选择使用虚拟人物: ${url}`, 'success')
  // 强制重新加载模型
  reloadModel()
}

// 处理用户状态变化
const handleUserChanged = user => {
  currentUser.value = user
  if (user) {
    addLog(
      `用户已登录: ${user.id} (${getAccountTypeLabel(user.accountType)}) - ${user.status}`,
      'success'
    )

    // 根据账户类型添加不同的日志信息
    if (user.accountType === 'guest') {
      addLog('检测到访客账户，建议在生产环境中引导用户升级', 'info')
    } else if (user.accountType === 'registered') {
      addLog('Ready Player Me账户已连接，享受完整功能', 'success')
    }
  } else {
    addLog('用户已注销', 'info')
  }
}

// 用户管理辅助函数
const getAccountTypeLabel = accountType => {
  switch (accountType) {
    case 'guest':
      return '访客'
    case 'registered':
      return 'RPM账户'
    default:
      return '未知'
  }
}

const getStatusClass = status => {
  switch (status) {
    case '已登录':
    case '已授权':
      return 'status-success'
    case '信息已更新':
      return 'status-info'
    default:
      return 'status-default'
  }
}

const getUserExperienceLevel = user => {
  if (!user) return '未知'

  switch (user.accountType) {
    case 'guest':
      return '基础体验'
    case 'registered':
      return '完整体验'
    default:
      return '标准体验'
  }
}

// 预览最近的虚拟人物
const previewRecentAvatar = avatar => {
  currentModelUrl.value = avatar.url
  addLog(`预览最近创建的虚拟人物: ${avatar.avatarId}`, 'info')
  reloadModel()
}

// 使用最近的虚拟人物
const useRecentAvatar = avatar => {
  currentModelUrl.value = avatar.url
  addLog(`使用最近创建的虚拟人物: ${avatar.avatarId}`, 'success')
  reloadModel()
}

// 格式化时间
const formatTime = timeString => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

// 重新加载模型
const reloadModel = () => {
  if (!currentModelUrl.value) {
    addLog('没有设置模型URL', 'error')
    return
  }

  addLog(`开始重新加载模型: ${currentModelUrl.value}`, 'info')
  modelKey.value++
  isLoading.value = true
  isLoaded.value = false
  hasError.value = false
  loadingMessage.value = '正在初始化...'
  errorMessage.value = ''
}

// 模型加载成功处理
const handleModelLoaded = data => {
  isLoading.value = false
  isLoaded.value = true
  hasError.value = false
  loadingMessage.value = ''
  addLog('模型加载成功！', 'success')
  if (data && data.scene) {
    addLog(`模型包含 ${data.scene.children.length} 个子对象`, 'info')
  }
}

// 模型加载失败处理
const handleModelError = error => {
  isLoading.value = false
  isLoaded.value = false
  hasError.value = true
  loadingMessage.value = ''
  errorMessage.value = error.message || '未知错误'
  addLog(`模型加载失败: ${error.message || error}`, 'error')
}

// 改变模式
const changeMode = mode => {
  currentMode.value = mode
  addLog(`切换到${mode}模式`, 'info')
  reloadModel()
}

// 切换控制器
const toggleControls = () => {
  showControls.value = !showControls.value
  addLog(`${showControls.value ? '显示' : '隐藏'}控制器`, 'info')
}

// 切换地面
const toggleGround = () => {
  showGround.value = !showGround.value
  addLog(`${showGround.value ? '显示' : '隐藏'}地面`, 'info')
}

// 组件挂载
onMounted(() => {
  addLog('测试页面已加载', 'info')
  addLog(`浏览器WebGL支持: ${browserSupport.value}`, 'info')
  addLog(`WebGL版本: ${webglVersion.value}`, 'info')

  // 加载本地存储的数据
  try {
    const savedStats = localStorage.getItem('avatarTestStats')
    if (savedStats) {
      creatorStats.value = JSON.parse(savedStats)
      addLog(`加载历史统计: 总计${creatorStats.value.totalCreated}个虚拟人物`, 'info')
    }

    const savedRecent = localStorage.getItem('recentAvatars')
    if (savedRecent) {
      recentAvatars.value = JSON.parse(savedRecent)
      addLog(`加载最近创建记录: ${recentAvatars.value.length}个`, 'info')
    }
  } catch (error) {
    addLog('加载本地数据失败', 'error')
  }

  // 默认不自动加载，让用户选择模式
  addLog('请选择测试模式开始使用', 'info')
})
</script>

<style scoped>
.avatar-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.test-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

h3 {
  color: #34495e;
  margin-top: 30px;
  margin-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 5px;
}

/* 模式选择样式 */
.mode-selection {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
}

.mode-selection h3 {
  margin-bottom: 16px;
  color: #495057;
}

.mode-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.mode-btn {
  background: white;
  border: 2px solid #dee2e6;
  padding: 16px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 200px;
}

.mode-btn:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.mode-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.creator-mode {
  margin-bottom: 30px;
}

.test-mode {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
}

/* 创建器统计样式 */
.creator-stats {
  background: #e8f5e8;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.creator-stats h3 {
  color: #2e7d32;
  margin-bottom: 16px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  background: white;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  border-left: 4px solid #4caf50;
}

.stat-item strong {
  color: #2e7d32;
}

/* 账户徽章 */
.account-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 600;
  margin-left: 6px;
}

.account-badge.guest {
  background: #fff3e0;
  color: #ef6c00;
}

.account-badge.registered {
  background: #e8f5e8;
  color: #2e7d32;
}

.no-user {
  color: #9e9e9e;
  font-style: italic;
}

/* 用户详细信息 */
.user-detail-info {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  border: 2px solid #e8f5e8;
}

.user-detail-info h4 {
  margin: 0 0 12px 0;
  color: #2e7d32;
  font-size: 1.1em;
}

.user-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.user-info-grid .info-item {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #4caf50;
  text-align: left;
}

.user-info-grid code {
  background: #e8f5e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.85em;
  color: #2e7d32;
}

/* 账户类型详情 */
.account-type-detail {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
}

.account-type-detail.guest {
  background: #fff3e0;
  color: #ef6c00;
}

.account-type-detail.registered {
  background: #e8f5e8;
  color: #2e7d32;
}

/* 状态详情 */
.status-detail {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
}

.status-detail.status-success {
  background: #4caf50;
  color: white;
}

.status-detail.status-info {
  background: #2196f3;
  color: white;
}

.status-detail.status-default {
  background: #9e9e9e;
  color: white;
}

/* 用户体验等级 */
.experience-level {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
  background: #e3f2fd;
  color: #1976d2;
}

/* 账户建议测试 */
.account-suggestion-test {
  background: #fff8e1;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #ffc107;
  margin-top: 16px;
}

.account-suggestion-test h5 {
  margin: 0 0 8px 0;
  color: #f57f17;
  font-size: 1em;
}

.account-suggestion-test p {
  margin: 0 0 8px 0;
  color: #ef6c00;
  font-size: 0.9em;
}

.account-suggestion-test ul {
  margin: 8px 0 0 20px;
  color: #ef6c00;
  font-size: 0.85em;
}

.account-suggestion-test li {
  margin: 4px 0;
}

/* 最近创建样式 */
.recent-avatars {
  background: #e3f2fd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.recent-avatars h3 {
  color: #1976d2;
  margin-bottom: 16px;
  text-align: center;
}

.recent-grid {
  display: grid;
  gap: 12px;
}

.recent-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #2196f3;
}

.recent-info {
  flex: 1;
}

.recent-time {
  margin: 0 0 4px 0;
  font-size: 0.85em;
  color: #1565c0;
  font-weight: 500;
}

.recent-version {
  margin: 0 0 4px 0;
  font-size: 0.8em;
  background: #1976d2;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  font-weight: 600;
}

.recent-meta {
  margin: 0;
  font-size: 0.8em;
  color: #666;
}

.recent-actions {
  display: flex;
  gap: 8px;
}

.preview-recent-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background 0.3s ease;
}

.preview-recent-btn:hover {
  background: #138496;
}

.use-recent-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background 0.3s ease;
}

.use-recent-btn:hover {
  background: #218838;
}

/* URL输入区域 */
.url-input-section {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.url-input-section label {
  font-weight: 600;
  min-width: 80px;
}

.url-input-section input {
  flex: 1;
  min-width: 300px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.url-input-section button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.url-input-section button:hover {
  background: #2980b9;
}

/* 状态指示器 */
.status-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.status-indicator {
  padding: 15px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
}

.status-indicator.loading {
  background: #fff3cd;
  color: #856404;
}

.status-indicator.success {
  background: #d4edda;
  color: #155724;
}

.status-indicator.error {
  background: #f8d7da;
  color: #721c24;
}

.loading-message {
  color: #6c757d;
  font-style: italic;
}

.error-message {
  color: #dc3545;
  font-weight: 600;
  background: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

/* Avatar显示区域 */
.avatar-display-section {
  margin: 30px 0;
}

.avatar-wrapper {
  border: 2px solid #dee2e6;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
}

/* 控制面板 */
.control-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.control-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.control-buttons button {
  padding: 10px 15px;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.control-buttons button:hover {
  background: #138496;
}

/* 技术信息 */
.tech-info {
  background: #e9ecef;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.info-item {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.model-link {
  color: #007bff;
  word-break: break-all;
  text-decoration: none;
}

.model-link:hover {
  text-decoration: underline;
}

.no-url {
  color: #6c757d;
  font-style: italic;
}

/* 调试日志 */
.debug-section {
  margin-top: 30px;
}

.debug-log {
  background: #1e1e1e;
  color: #f8f8f2;
  padding: 20px;
  border-radius: 8px;
  height: 300px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  margin-bottom: 10px;
}

.log-entry {
  display: flex;
  gap: 10px;
  padding: 2px 0;
  border-bottom: 1px solid #333;
}

.log-entry.error {
  color: #ff6b6b;
}

.log-entry.success {
  color: #51cf66;
}

.log-entry.info {
  color: #74c0fc;
}

.log-time {
  color: #868e96;
  min-width: 70px;
  font-size: 12px;
}

.log-message {
  flex: 1;
}

.debug-section button {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.debug-section button:hover {
  background: #5a6268;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-container {
    padding: 20px;
    margin: 10px;
  }

  .url-input-section {
    flex-direction: column;
    align-items: stretch;
  }

  .url-input-section input {
    min-width: unset;
  }

  .control-buttons {
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .mode-buttons {
    flex-direction: column;
    align-items: center;
  }

  .mode-btn {
    min-width: 250px;
  }

  .test-mode {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .recent-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .recent-actions {
    justify-content: center;
  }
}
</style>
