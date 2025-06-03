<template>
  <div class="avatar-creator">
    <div class="creator-header">
      <h2>创建你的虚拟形象</h2>
      <p>使用Ready Player Me创建专属的3D虚拟人物</p>
    </div>

    <!-- 配置选项 -->
    <div class="config-section">
      <h3>创建器配置</h3>
      <div class="config-grid">
        <div class="config-item">
          <label>
            <input v-model="config.clearCache" type="checkbox" @change="updateFrameUrl" />
            清除缓存模式
          </label>
          <small>每次重新启动创建器</small>
        </div>

        <div class="config-item">
          <label>
            <input v-model="config.selectBodyType" type="checkbox" @change="updateFrameUrl" />
            允许选择体型
          </label>
          <small>让用户选择半身或全身</small>
        </div>

        <div class="config-item">
          <label>体型设置:</label>
          <select
            v-model="config.bodyType"
            :disabled="config.selectBodyType"
            @change="updateFrameUrl"
          >
            <option value="">自动</option>
            <option value="halfbody">半身像</option>
            <option value="fullbody">全身像</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 控制按钮区域 -->
    <div class="control-section">
      <button
        v-if="!showCreator"
        class="open-creator-btn"
        :disabled="isLoading"
        @click="openCreator"
      >
        {{ isLoading ? '正在加载...' : '打开虚拟人物创建器' }}
      </button>

      <div v-if="showCreator" class="creator-controls">
        <button class="close-creator-btn" @click="closeCreator">关闭创建器</button>
        <button class="logout-btn" :disabled="!userInfo" @click="logoutUser">注销用户</button>
        <button class="refresh-btn" @click="refreshAssets">刷新资产</button>
        <button v-if="serverConnected" class="server-status connected" disabled>
          🟢 服务器已连接
        </button>
        <button v-else class="server-status disconnected" @click="checkServerHealth">
          🔴 服务器未连接
        </button>
      </div>
    </div>

    <!-- 用户信息显示 -->
    <div v-if="userInfo" class="user-info">
      <h4>👤 当前用户</h4>
      <div class="user-details">
        <div class="user-basic">
          <p>
            <strong>用户ID:</strong> <code>{{ userInfo.id }}</code>
          </p>
          <p>
            <strong>账户类型:</strong>
            <span :class="`account-type ${userInfo.accountType}`">
              {{ getAccountTypeLabel(userInfo.accountType) }}
            </span>
          </p>
          <p>
            <strong>状态:</strong>
            <span :class="`user-status ${getStatusClass(userInfo.status)}`">
              {{ userInfo.status }}
            </span>
          </p>
        </div>

        <!-- 账户管理建议 -->
        <div v-if="userInfo.accountType === 'guest'" class="account-suggestion">
          <div class="suggestion-content">
            <h5>💡 建议</h5>
            <p>您当前使用访客账户。创建Ready Player Me账户可以：</p>
            <ul>
              <li>在所有设备间同步虚拟形象</li>
              <li>永久保存已解锁的资产</li>
              <li>访问更多自定义选项</li>
            </ul>
            <button class="upgrade-btn" @click="suggestAccountUpgrade">创建正式账户</button>
          </div>
        </div>

        <div v-else-if="userInfo.accountType === 'registered'" class="account-benefits">
          <div class="benefits-content">
            <h5>✅ Ready Player Me账户优势</h5>
            <ul>
              <li>跨设备同步虚拟形象</li>
              <li>已解锁资产永久保存</li>
              <li>访问高级自定义功能</li>
              <li>优先获得新功能</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户引导信息 -->
    <div v-if="!userInfo && !showCreator" class="user-guide">
      <h4>🚀 开始创建虚拟形象</h4>
      <div class="guide-content">
        <p>您可以选择以下方式开始：</p>
        <div class="user-options">
          <div class="option-card guest-option">
            <h5>🎯 快速开始（访客模式）</h5>
            <p>无需注册，立即开始创建虚拟形象。虚拟形象将保存在本地浏览器中。</p>
            <button class="start-guest-btn" @click="startAsGuest">快速开始</button>
          </div>

          <div class="option-card account-option">
            <h5>👑 使用Ready Player Me账户</h5>
            <p>登录或注册Ready Player Me账户，享受跨设备同步和更多功能。</p>
            <button class="start-account-btn" @click="openWithAccount">登录/注册</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态提示 -->
    <div v-if="statusMessage" class="status-message" :class="statusType">
      {{ statusMessage }}
    </div>

    <!-- 已创建的虚拟人物URL显示 -->
    <div v-if="avatarData" class="avatar-result">
      <h3>✅ 虚拟人物创建成功！</h3>

      <!-- 基本信息 -->
      <div class="avatar-basic-info">
        <div class="url-display">
          <label>虚拟人物URL:</label>
          <div class="url-container">
            <input :value="avatarData.url" readonly class="url-input" @click="selectUrl" />
            <button class="copy-btn" @click="copyUrl">
              {{ copied ? '已复制!' : '复制' }}
            </button>
          </div>
        </div>

        <div class="avatar-ids">
          <p>
            <strong>头像ID:</strong> <code>{{ avatarData.avatarId }}</code>
          </p>
          <p>
            <strong>用户ID:</strong> <code>{{ avatarData.userId }}</code>
          </p>
        </div>
      </div>

      <!-- 元数据信息 (v2版本) -->
      <div v-if="avatarData.metadata" class="avatar-metadata">
        <h4>📋 虚拟人物信息</h4>
        <div class="metadata-grid">
          <div v-if="avatarData.metadata.gender" class="metadata-item">
            <strong>性别:</strong> {{ avatarData.metadata.gender }}
          </div>
          <div v-if="avatarData.metadata.bodyType" class="metadata-item">
            <strong>体型:</strong> {{ avatarData.metadata.bodyType }}
          </div>
          <div v-if="avatarData.metadata.age" class="metadata-item">
            <strong>年龄组:</strong> {{ avatarData.metadata.age }}
          </div>
          <div v-if="avatarData.metadata.ethnicity" class="metadata-item">
            <strong>族裔:</strong> {{ avatarData.metadata.ethnicity }}
          </div>
        </div>
      </div>

      <!-- 预览按钮 -->
      <div class="preview-actions">
        <button class="preview-btn" @click="previewAvatar">
          {{ showPreview ? '隐藏预览' : '预览虚拟人物' }}
        </button>
        <button class="use-btn" @click="useAvatar">使用这个虚拟人物</button>
        <button class="save-btn" @click="saveToHistory">保存到历史</button>
      </div>
    </div>

    <!-- Ready Player Me iFrame -->
    <iframe
      v-show="showCreator"
      ref="creatorFrame"
      :src="currentFrameUrl"
      class="creator-frame"
      allow="camera *; microphone *; clipboard-write"
      @load="handleFrameLoad"
    />

    <!-- 3D预览区域 -->
    <div v-if="showPreview && avatarData" class="preview-section">
      <h3>3D预览</h3>
      <div class="preview-wrapper">
        <Avatar3D
          :model-url="avatarData.url"
          mode="simple"
          height="400px"
          :show-controls="true"
          :show-ground="false"
        />
      </div>
    </div>

    <!-- 历史记录 -->
    <div v-if="avatarHistory.length > 0" class="history-section">
      <h3>📚 创建历史</h3>
      <div class="history-grid">
        <div
          v-for="(avatar, index) in avatarHistory"
          :key="avatar.avatarId || index"
          class="history-item"
        >
          <div class="history-info">
            <p class="history-date">{{ formatDate(avatar.createdAt) }}</p>
            <p class="history-id">{{ avatar.avatarId }}</p>
          </div>
          <div class="history-actions">
            <button class="load-btn" @click="loadFromHistory(avatar)">使用</button>
            <button class="remove-btn" @click="removeFromHistory(index)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Avatar3D from './Avatar3D.vue'
import readyPlayerMeAPI from '@/services/readyPlayerMeApi.js'

// Props
const props = defineProps({
  subdomain: {
    type: String,
    default: 'demo',
  },
})

// Emits
const emit = defineEmits(['avatar-created', 'avatar-selected', 'user-changed'])

// 响应式数据
const showCreator = ref(false)
const isLoading = ref(false)
const avatarData = ref(null)
const userInfo = ref(null)
const statusMessage = ref('')
const statusType = ref('info')
const copied = ref(false)
const showPreview = ref(false)
const creatorFrame = ref(null)
const avatarHistory = ref([])
const serverConnected = ref(false)
const currentAuthToken = ref(null)

// 配置选项
const config = ref({
  clearCache: false,
  selectBodyType: false,
  bodyType: '',
})

// 构建Frame URL
const currentFrameUrl = ref('')

const updateFrameUrl = () => {
  const params = new URLSearchParams()
  params.append('frameApi', 'true')

  if (config.value.clearCache) {
    params.append('clearCache', 'true')
  }

  if (config.value.selectBodyType) {
    params.append('selectBodyType', 'true')
  }

  if (config.value.bodyType && !config.value.selectBodyType) {
    params.append('bodyType', config.value.bodyType)
  }

  currentFrameUrl.value = `https://${props.subdomain}.readyplayer.me/avatar?${params.toString()}`
}

// 用户管理功能
const getAccountTypeLabel = accountType => {
  switch (accountType) {
    case 'guest':
      return '访客账户'
    case 'registered':
      return 'Ready Player Me账户'
    default:
      return '未知类型'
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

const suggestAccountUpgrade = () => {
  statusMessage.value = '正在引导您创建Ready Player Me账户...'
  statusType.value = 'info'

  // 打开Ready Player Me注册页面
  const registrationUrl = `https://${props.subdomain}.readyplayer.me/signup`
  window.open(registrationUrl, '_blank')
}

const startAsGuest = async () => {
  statusMessage.value = '正在创建访客账户...'
  statusType.value = 'loading'

  try {
    // 创建访客账户
    const guestAccount = await readyPlayerMeAPI.createGuestAccount()

    // 保存用户信息
    userInfo.value = {
      id: guestAccount.userId,
      accountType: guestAccount.accountType,
      status: '已登录',
      createdAt: guestAccount.createdAt,
    }

    // 保存到本地存储
    readyPlayerMeAPI.storage.saveUserInfo(userInfo.value)

    statusMessage.value = '访客账户创建成功，正在启动创建器...'
    statusType.value = 'success'

    // 发送用户变化事件
    emit('user-changed', userInfo.value)

    // 打开创建器
    await openCreatorWithAuth()
  } catch (error) {
    console.error('创建访客账户失败:', error)
    statusMessage.value = `创建访客账户失败: ${error.message}`
    statusType.value = 'error'
  }
}

const openWithAccount = () => {
  statusMessage.value = '正在打开Ready Player Me登录...'
  statusType.value = 'loading'

  // 设置参数以要求登录
  const params = new URLSearchParams()
  params.append('frameApi', 'true')
  params.append('requireLogin', 'true')

  if (config.value.clearCache) {
    params.append('clearCache', 'true')
  }

  if (config.value.selectBodyType) {
    params.append('selectBodyType', 'true')
  }

  if (config.value.bodyType && !config.value.selectBodyType) {
    params.append('bodyType', config.value.bodyType)
  }

  currentFrameUrl.value = `https://${props.subdomain}.readyplayer.me/avatar?${params.toString()}`
  openCreator()
}

const openCreatorWithAuth = async () => {
  if (!userInfo.value) {
    console.error('No user info available for authentication')
    return
  }

  try {
    // 获取授权令牌
    const tokenInfo = await readyPlayerMeAPI.getAuthToken(userInfo.value.id, props.subdomain)

    currentAuthToken.value = tokenInfo

    // 保存令牌信息
    readyPlayerMeAPI.storage.saveTokenInfo(tokenInfo)

    // 构建带令牌的URL
    currentFrameUrl.value = readyPlayerMeAPI.buildIframeUrl(props.subdomain, tokenInfo.token, {
      clearCache: config.value.clearCache,
      selectBodyType: config.value.selectBodyType,
      bodyType: config.value.bodyType,
    })

    // 打开创建器
    openCreator()
  } catch (error) {
    console.error('获取授权令牌失败:', error)
    statusMessage.value = `获取授权令牌失败: ${error.message}`
    statusType.value = 'error'
  }
}

const checkServerHealth = async () => {
  try {
    statusMessage.value = '正在检查服务器状态...'
    statusType.value = 'loading'

    const health = await readyPlayerMeAPI.checkHealth()

    serverConnected.value = true
    statusMessage.value = '服务器连接正常'
    statusType.value = 'success'

    console.log('服务器健康状态:', health)
  } catch (error) {
    console.error('服务器健康检查失败:', error)
    serverConnected.value = false
    statusMessage.value = `服务器连接失败: ${error.message}`
    statusType.value = 'error'
  }
}

const handleAccountMigration = async (oldUserId, newUserId) => {
  try {
    statusMessage.value = '正在迁移账户数据...'
    statusType.value = 'loading'

    // 调用账户迁移API
    const migrationResult = await readyPlayerMeAPI.migrateAccount(oldUserId, newUserId)

    // 更新用户信息
    userInfo.value = {
      ...userInfo.value,
      id: migrationResult.newUserId,
      accountType: migrationResult.accountType,
      status: '已迁移',
      migratedAt: migrationResult.migratedAt,
    }

    // 保存更新的用户信息
    readyPlayerMeAPI.storage.saveUserInfo(userInfo.value)

    statusMessage.value = '账户迁移成功'
    statusType.value = 'success'

    // 发送用户变化事件
    emit('user-changed', userInfo.value)

    console.log('账户迁移完成:', migrationResult)
  } catch (error) {
    console.error('账户迁移失败:', error)
    statusMessage.value = `账户迁移失败: ${error.message}`
    statusType.value = 'error'
  }
}

// 消息处理函数
const handleMessage = event => {
  const json = parseMessage(event)

  if (json?.source !== 'readyplayerme') {
    return
  }

  console.log('收到Ready Player Me消息:', json)

  // Frame准备就绪
  if (json.eventName === 'v1.frame.ready') {
    statusMessage.value = 'Avatar Creator已加载完成'
    statusType.value = 'success'
    isLoading.value = false

    // 订阅所有事件
    sendMessageToFrame({
      target: 'readyplayerme',
      type: 'subscribe',
      eventName: 'v1.**',
    })
  }

  // 订阅创建成功
  if (json.eventName === 'v1.subscription.created') {
    console.log('事件订阅成功:', json.data.eventName)
  }

  // v1版本头像导出
  if (json.eventName === 'v1.avatar.exported') {
    handleAvatarExported(json.data, 'v1')
  }

  // v2版本头像导出 (包含更多元数据)
  if (json.eventName === 'v2.avatar.exported') {
    handleAvatarExported(json.data, 'v2')
  }

  // 用户设置
  if (json.eventName === 'v1.user.set') {
    const accountType = detectAccountType(json.data.id)
    userInfo.value = {
      id: json.data.id,
      status: '已登录',
      accountType: accountType,
    }

    // 保存用户信息
    readyPlayerMeAPI.storage.saveUserInfo(userInfo.value)

    emit('user-changed', userInfo.value)
    console.log('用户已设置:', json.data.id, `(${accountType})`)

    // 根据账户类型显示不同提示
    if (accountType === 'guest') {
      statusMessage.value = '访客模式已启动，您可以创建虚拟形象'
    } else {
      statusMessage.value = 'Ready Player Me账户已连接'
    }
    statusType.value = 'success'
  }

  // 用户更新
  if (json.eventName === 'v1.user.updated') {
    if (userInfo.value) {
      userInfo.value.status = '信息已更新'
      readyPlayerMeAPI.storage.saveUserInfo(userInfo.value)
    }
    console.log('用户信息已更新:', json.data.id)
  }

  // 用户注销
  if (json.eventName === 'v1.user.logout') {
    readyPlayerMeAPI.storage.clearUserInfo()
    readyPlayerMeAPI.storage.clearTokenInfo()
    userInfo.value = null
    currentAuthToken.value = null
    statusMessage.value = '用户已注销'
    statusType.value = 'info'
    emit('user-changed', null)
  }

  // 用户授权 - 可能涉及账户迁移
  if (json.eventName === 'v1.user.authorized') {
    if (userInfo.value) {
      const oldUserId = userInfo.value.id
      const newUserId = json.data.id

      // 如果用户ID发生变化，可能是账户迁移
      if (oldUserId !== newUserId && userInfo.value.accountType === 'guest') {
        handleAccountMigration(oldUserId, newUserId)
      } else {
        userInfo.value.status = '已授权'
        readyPlayerMeAPI.storage.saveUserInfo(userInfo.value)
      }
    }
    statusMessage.value = '用户授权成功'
    statusType.value = 'success'
  }
}

// 处理头像导出
const handleAvatarExported = (data, version) => {
  avatarData.value = {
    ...data,
    version,
    createdAt: new Date().toISOString(),
  }

  statusMessage.value = `虚拟人物创建成功！(${version})`
  statusType.value = 'success'
  showCreator.value = false

  // 触发事件给父组件
  emit('avatar-created', {
    url: data.url,
    data: avatarData.value,
    version,
  })

  console.log(`虚拟人物创建完成 (${version}):`, data)
}

// 发送消息到iframe
const sendMessageToFrame = message => {
  if (creatorFrame.value?.contentWindow) {
    creatorFrame.value.contentWindow.postMessage(JSON.stringify(message), '*')
  }
}

// 解析消息
const parseMessage = event => {
  try {
    return JSON.parse(event.data)
  } catch {
    return null
  }
}

// 打开创建器
const openCreator = () => {
  isLoading.value = true
  showCreator.value = true
  statusMessage.value = '正在加载Avatar Creator...'
  statusType.value = 'loading'
}

// 关闭创建器
const closeCreator = () => {
  showCreator.value = false
  statusMessage.value = ''
  isLoading.value = false
}

// 注销用户
const logoutUser = () => {
  sendMessageToFrame({
    target: 'readyplayerme',
    type: 'query',
    eventName: 'v1.user.logout',
  })
}

// 刷新资产
const refreshAssets = () => {
  sendMessageToFrame({
    target: 'readyplayerme',
    type: 'query',
    eventName: 'v1.asset.unlocked',
  })
  statusMessage.value = '正在刷新资产...'
  statusType.value = 'loading'
}

// Frame加载完成
const handleFrameLoad = () => {
  console.log('Creator iframe已加载')
}

// 选择URL文本
const selectUrl = event => {
  event.target.select()
}

// 复制URL
const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(avatarData.value.url)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (clipboardError) {
    console.error('复制失败:', clipboardError)
    // 备用复制方法
    const textArea = document.createElement('textarea')
    textArea.value = avatarData.value.url
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// 预览虚拟人物
const previewAvatar = () => {
  showPreview.value = !showPreview.value
}

// 使用虚拟人物
const useAvatar = () => {
  emit('avatar-selected', avatarData.value.url)
  statusMessage.value = '虚拟人物已选择使用'
  statusType.value = 'success'
}

// 保存到历史
const saveToHistory = () => {
  if (
    avatarData.value &&
    !avatarHistory.value.find(item => item.avatarId === avatarData.value.avatarId)
  ) {
    avatarHistory.value.unshift({ ...avatarData.value })

    // 限制历史记录数量
    if (avatarHistory.value.length > 10) {
      avatarHistory.value = avatarHistory.value.slice(0, 10)
    }

    // 保存到localStorage
    localStorage.setItem('rpmAvatarHistory', JSON.stringify(avatarHistory.value))

    statusMessage.value = '已保存到历史记录'
    statusType.value = 'success'
  }
}

// 从历史加载
const loadFromHistory = avatar => {
  avatarData.value = { ...avatar }
  emit('avatar-selected', avatar.url)
  statusMessage.value = '已从历史记录加载虚拟人物'
  statusType.value = 'success'
}

// 从历史删除
const removeFromHistory = index => {
  avatarHistory.value.splice(index, 1)
  localStorage.setItem('rpmAvatarHistory', JSON.stringify(avatarHistory.value))
}

// 格式化日期
const formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 检测账户类型 - 使用API服务的方法
const detectAccountType = userId => {
  return readyPlayerMeAPI.detectAccountType(userId)
}

// 生命周期
onMounted(async () => {
  // 初始化URL
  updateFrameUrl()

  // 检查服务器健康状态
  try {
    await checkServerHealth()
  } catch (error) {
    console.warn('初始服务器健康检查失败:', error.message)
  }

  // 从localStorage加载用户信息
  const savedUserInfo = readyPlayerMeAPI.storage.getUserInfo()
  if (savedUserInfo) {
    userInfo.value = savedUserInfo
    emit('user-changed', userInfo.value)
    console.log('已加载保存的用户信息:', savedUserInfo.id)
  }

  // 从localStorage加载历史记录
  const saved = localStorage.getItem('rpmAvatarHistory')
  if (saved) {
    try {
      avatarHistory.value = JSON.parse(saved)
    } catch (storageError) {
      console.error('解析历史记录失败:', storageError)
    }
  }

  // 添加事件监听
  window.addEventListener('message', handleMessage)
  document.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
  document.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
.avatar-creator {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.creator-header {
  text-align: center;
  margin-bottom: 24px;
}

.creator-header h2 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.creator-header p {
  color: #666;
  font-size: 14px;
}

/* 配置区域样式 */
.config-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.config-section h3 {
  margin-bottom: 16px;
  color: #495057;
  font-size: 1.1em;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.config-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #495057;
}

.config-item small {
  color: #6c757d;
  font-size: 0.85em;
}

.config-item select {
  padding: 6px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
}

.control-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.open-creator-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.open-creator-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.open-creator-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 创建器控制按钮 */
.creator-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.close-creator-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.close-creator-btn:hover {
  background: #c0392b;
}

.logout-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-btn:hover:not(:disabled) {
  background: #5a6268;
}

.logout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.refresh-btn:hover {
  background: #138496;
}

/* 服务器状态按钮 */
.server-status {
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  transition: all 0.3s ease;
}

.server-status.connected {
  background: #28a745;
  color: white;
  cursor: default;
}

.server-status.disconnected {
  background: #dc3545;
  color: white;
}

.server-status.disconnected:hover {
  background: #c82333;
  transform: translateY(-1px);
}

/* 用户信息 */
.user-info {
  background: #e3f2fd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.user-info h4 {
  margin: 0 0 12px 0;
  color: #1976d2;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-basic {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #2196f3;
}

.user-basic p {
  margin: 4px 0;
  color: #1565c0;
}

.user-basic code {
  background: rgba(25, 118, 210, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.account-type {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
}

.account-type.guest {
  background: #fff3e0;
  color: #ef6c00;
}

.account-type.registered {
  background: #e8f5e8;
  color: #2e7d32;
}

.user-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
}

.user-status.status-success {
  background: #4caf50;
  color: white;
}

.user-status.status-info {
  background: #2196f3;
  color: white;
}

.user-status.status-default {
  background: #9e9e9e;
  color: white;
}

/* 账户建议区域 */
.account-suggestion {
  background: #fff8e1;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #ffc107;
}

.suggestion-content h5 {
  margin: 0 0 8px 0;
  color: #f57f17;
  font-size: 1em;
}

.suggestion-content p {
  margin: 0 0 8px 0;
  color: #ef6c00;
  font-size: 0.9em;
}

.suggestion-content ul {
  margin: 8px 0 16px 20px;
  color: #ef6c00;
  font-size: 0.85em;
}

.suggestion-content li {
  margin: 4px 0;
}

.upgrade-btn {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.upgrade-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

/* 账户优势区域 */
.account-benefits {
  background: #e8f5e8;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #4caf50;
}

.benefits-content h5 {
  margin: 0 0 8px 0;
  color: #2e7d32;
  font-size: 1em;
}

.benefits-content ul {
  margin: 8px 0 0 20px;
  color: #388e3c;
  font-size: 0.85em;
}

.benefits-content li {
  margin: 4px 0;
}

/* 用户引导区域 */
.user-guide {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
}

.user-guide h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 1.3em;
}

.guide-content p {
  margin: 0 0 20px 0;
  color: #5a6c7d;
  font-size: 1.05em;
}

.user-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.option-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.option-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.guest-option {
  border-color: #ff9800;
}

.guest-option:hover {
  border-color: #f57c00;
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.3);
}

.account-option {
  border-color: #4caf50;
}

.account-option:hover {
  border-color: #388e3c;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
}

.option-card h5 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 1.1em;
}

.option-card p {
  margin: 0 0 16px 0;
  color: #5a6c7d;
  font-size: 0.9em;
  line-height: 1.5;
}

.start-guest-btn {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1em;
  transition: all 0.3s ease;
  width: 100%;
}

.start-guest-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 152, 0, 0.4);
}

.start-account-btn {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1em;
  transition: all 0.3s ease;
  width: 100%;
}

.start-account-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.status-message {
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
}

.status-message.info {
  background: #e3f2fd;
  color: #1976d2;
}

.status-message.success {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-message.loading {
  background: #fff3e0;
  color: #f57c00;
}

.status-message.error {
  background: #ffebee;
  color: #d32f2f;
}

.avatar-result {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.avatar-result h3 {
  color: #28a745;
  margin-bottom: 16px;
  text-align: center;
}

/* 头像基本信息 */
.avatar-basic-info {
  margin-bottom: 20px;
}

.url-display label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
}

.url-container {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.url-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  background: white;
}

.url-input:focus {
  outline: none;
  border-color: #007bff;
}

.copy-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  min-width: 80px;
}

.copy-btn:hover {
  background: #0056b3;
}

.avatar-ids {
  margin-top: 12px;
}

.avatar-ids p {
  margin: 4px 0;
  font-size: 0.9em;
}

.avatar-ids code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85em;
}

/* 元数据信息 */
.avatar-metadata {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
}

.avatar-metadata h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 1em;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.metadata-item {
  font-size: 0.9em;
  color: #6c757d;
}

.metadata-item strong {
  color: #495057;
}

.preview-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.preview-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.preview-btn:hover {
  background: #138496;
}

.use-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.use-btn:hover {
  background: #218838;
}

/* 保存按钮 */
.save-btn {
  background: #6f42c1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-btn:hover {
  background: #5a379b;
}

.creator-frame {
  width: 100%;
  height: 600px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  margin: 20px 0;
  background: #f8f9fa;
}

.preview-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ecf0f1;
}

.preview-section h3 {
  text-align: center;
  color: #495057;
  margin-bottom: 20px;
}

.preview-wrapper {
  border: 2px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
}

/* 历史记录 */
.history-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ecf0f1;
}

.history-section h3 {
  margin-bottom: 16px;
  color: #495057;
}

.history-grid {
  display: grid;
  gap: 12px;
}

.history-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-info {
  flex: 1;
}

.history-date {
  margin: 0 0 4px 0;
  font-size: 0.85em;
  color: #6c757d;
}

.history-id {
  margin: 0;
  font-family: monospace;
  font-size: 0.8em;
  color: #495057;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.load-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
}

.load-btn:hover {
  background: #218838;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
}

.remove-btn:hover {
  background: #c82333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .avatar-creator {
    padding: 16px;
    margin: 10px;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }

  .creator-controls {
    flex-direction: column;
  }

  .url-container {
    flex-direction: column;
  }

  .preview-actions {
    flex-direction: column;
  }

  .metadata-grid {
    grid-template-columns: 1fr;
  }

  .history-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .history-actions {
    justify-content: center;
  }

  .creator-frame {
    height: 500px;
  }
}
</style>
