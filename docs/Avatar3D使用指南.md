# 🎭 3D虚拟形象系统使用指南

## 📖 概述

本项目集成了Ready Player Me的3D虚拟人物系统，支持创建、加载和展示个性化3D虚拟形象。

## 🚀 快速开始

### 1. 访问测试页面

打开浏览器访问：**http://localhost:5173/avatar-test**

### 2. 选择使用模式

#### 🎨 创建模式 (推荐)

- 点击"**创建新虚拟人物**"
- 使用Ready Player Me创建器自定义你的虚拟形象
- 支持外观、服装、配饰等完全自定义
- 创建完成后自动获得专属GLB模型URL

#### 🔧 测试模式

- 点击"**测试现有URL**"
- 输入已有的Ready Player Me模型URL
- 用于测试和调试现有虚拟人物

## 🎯 功能特性

### ✨ 虚拟人物创建器 (升级版)

- **📱 响应式设计** - 适配所有设备
- **🎨 完全自定义** - 外观、发型、服装、配饰
- **📸 实时预览** - 所见即所得的编辑体验
- **💾 自动保存** - 创建完成后自动保存URL
- **⚙️ 高级配置** - 支持体型选择、缓存控制等
- **👤 智能用户管理** - 自动识别账户类型和状态管理
- **🎯 用户引导系统** - 为新用户提供清晰的使用路径
- **📊 详细信息** - v2版本支持更多元数据
- **📚 历史记录** - 本地保存创建历史，一键重用
- **🔄 资产刷新** - 实时刷新解锁的新资产
- **💡 账户升级建议** - 智能推荐账户升级选项

### 🎮 3D展示系统

- **🔄 交互控制** - 鼠标拖拽旋转、缩放
- **🎨 多种模式**：
  - `decorative` - 装饰模式：适合侧边栏
  - `simple` - 简化模式：基础展示
  - `full` - 完整模式：完整交互功能
- **🌊 流畅动画** - 基于Three.js的高性能渲染
- **📱 响应式** - 自动适配不同屏幕尺寸

### 🔧 调试工具

- **📊 实时状态监控** - 加载进度和错误提示
- **🛠️ 浏览器兼容性检测** - WebGL支持检查
- **📝 详细日志** - 完整的调试信息记录
- **⚙️ 参数调节** - 实时调整展示参数

### 🆕 新增高级功能

#### 🔧 配置选项

- **清除缓存模式** - 每次重新启动创建器，获取最新资产
- **体型选择** - 允许用户选择半身或全身虚拟人物
- **预设体型** - 直接设置为半身像或全身像模式

#### 👤 用户管理

- **用户状态显示** - 实时显示当前登录用户信息
- **用户注销** - 一键注销当前用户
- **用户授权状态** - 显示用户权限和状态

#### 📋 增强信息

- **v2版本支持** - 获取性别、体型、年龄组、族裔等详细信息
- **完整ID信息** - 显示头像ID和用户ID
- **创建时间记录** - 记录每个虚拟人物的创建时间

#### 📚 历史记录系统

- **本地存储** - 自动保存到浏览器本地存储
- **快速重用** - 一键加载历史创建的虚拟人物
- **历史管理** - 删除不需要的历史记录
- **自动限制** - 最多保存10个历史记录

## 🎨 在项目中使用

### 基础使用

```vue
<template>
  <Avatar3D model-url="你的虚拟人物URL" mode="decorative" height="280px" />
</template>

<script setup>
import Avatar3D from '@/components/Avatar3D.vue'
</script>
```

### 高级配置

```vue
<template>
  <Avatar3D
    :model-url="avatarUrl"
    mode="full"
    height="500px"
    :show-controls="true"
    :show-ground="true"
    :initial-scale="1.2"
    :initial-position="[0, -0.5, 0]"
    @loaded="handleLoaded"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue'
import Avatar3D from '@/components/Avatar3D.vue'

const avatarUrl = ref('https://models.readyplayer.me/你的模型ID.glb')

const handleLoaded = data => {
  console.log('虚拟人物加载成功', data)
}

const handleError = error => {
  console.error('加载失败', error)
}
</script>
```

### 集成创建器 (完整版)

```vue
<template>
  <AvatarCreator
    subdomain="你的子域名"
    @avatar-created="handleAvatarCreated"
    @avatar-selected="handleAvatarSelected"
    @user-changed="handleUserChanged"
  />
</template>

<script setup>
import AvatarCreator from '@/components/AvatarCreator.vue'

const handleAvatarCreated = data => {
  console.log('新虚拟人物创建：', data)
  console.log('版本：', data.version) // v1 或 v2
  console.log('URL：', data.url)

  // v2版本包含更多信息
  if (data.version === 'v2' && data.data.metadata) {
    console.log('性别：', data.data.metadata.gender)
    console.log('体型：', data.data.metadata.bodyType)
    console.log('年龄组：', data.data.metadata.age)
  }

  // 保存到数据库或本地存储
  saveToDatabase(data)
}

const handleAvatarSelected = url => {
  console.log('选择使用虚拟人物：', url)
  // 更新当前使用的虚拟人物
  currentAvatar.value = url
}

const handleUserChanged = userInfo => {
  if (userInfo) {
    console.log('用户已登录：', userInfo.id, userInfo.status)
  } else {
    console.log('用户已注销')
  }
  currentUser.value = userInfo
}
</script>
```

## 📋 组件参数

### Avatar3D 组件

| 参数              | 类型    | 默认值              | 说明                                   |
| ----------------- | ------- | ------------------- | -------------------------------------- |
| `modelUrl`        | String  | Ready Player Me URL | 虚拟人物模型URL                        |
| `mode`            | String  | `'full'`            | 显示模式：`full`/`decorative`/`simple` |
| `height`          | String  | `'600px'`           | 容器高度                               |
| `showControls`    | Boolean | `true`              | 是否显示轨道控制器                     |
| `showGround`      | Boolean | `false`             | 是否显示地面网格                       |
| `initialScale`    | Number  | `1.0`               | 初始缩放比例                           |
| `initialPosition` | Array   | `[0, 0, 0]`         | 初始位置 [x, y, z]                     |

### AvatarCreator 组件 (升级版)

| 参数        | 类型   | 默认值   | 说明                  |
| ----------- | ------ | -------- | --------------------- |
| `subdomain` | String | `'demo'` | Ready Player Me子域名 |

| 事件              | 参数                   | 说明                      |
| ----------------- | ---------------------- | ------------------------- |
| `avatar-created`  | `{url, data, version}` | 虚拟人物创建完成 (增强版) |
| `avatar-selected` | `url`                  | 选择使用虚拟人物          |
| `user-changed`    | `userInfo`             | 用户状态变化 (新增)       |

#### Avatar Created 事件数据结构

```javascript
// v1版本数据
{
  url: "https://models.readyplayer.me/xxx.glb",
  data: {
    avatarId: "avatar_123",
    userId: "user_456",
    url: "https://models.readyplayer.me/xxx.glb",
    version: "v1",
    createdAt: "2024-03-15T10:30:00.000Z"
  },
  version: "v1"
}

// v2版本数据 (包含更多元数据)
{
  url: "https://models.readyplayer.me/xxx.glb",
  data: {
    avatarId: "avatar_123",
    userId: "user_456",
    url: "https://models.readyplayer.me/xxx.glb",
    metadata: {
      gender: "male",
      bodyType: "fullbody",
      age: "adult",
      ethnicity: "asian"
    },
    version: "v2",
    createdAt: "2024-03-15T10:30:00.000Z"
  },
  version: "v2"
}
```

## 🔧 配置选项详解

### URL参数配置

创建器支持以下URL参数：

| 参数             | 值                    | 说明                   |
| ---------------- | --------------------- | ---------------------- |
| `frameApi`       | `true`                | 启用事件API (必需)     |
| `clearCache`     | `true`                | 禁用缓存，每次重新启动 |
| `selectBodyType` | `true`                | 允许用户选择体型       |
| `bodyType`       | `halfbody`/`fullbody` | 预设体型               |

### 配置示例

```javascript
// 构建完整配置URL
const params = new URLSearchParams()
params.append('frameApi', 'true')
params.append('clearCache', 'true')
params.append('selectBodyType', 'true')

const frameUrl = `https://demo.readyplayer.me/avatar?${params.toString()}`
```

## 🎮 高级功能使用

### 用户管理功能

```vue
<template>
  <div v-if="userInfo" class="user-panel">
    <h4>当前用户: {{ userInfo.id }}</h4>
    <p>状态: {{ userInfo.status }}</p>
    <button @click="logoutUser">注销</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userInfo = ref(null)

const handleUserChanged = user => {
  userInfo.value = user
}

const logoutUser = () => {
  // 通过 AvatarCreator 的方法注销用户
  avatarCreatorRef.value.logoutUser()
}
</script>
```

### 历史记录管理

```vue
<template>
  <div class="history-manager">
    <h3>创建历史</h3>
    <div v-for="avatar in avatarHistory" :key="avatar.avatarId">
      <p>{{ avatar.createdAt }} - {{ avatar.avatarId }}</p>
      <button @click="useAvatar(avatar.url)">使用</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const avatarHistory = ref([])

onMounted(() => {
  // 从localStorage加载历史
  const saved = localStorage.getItem('rpmAvatarHistory')
  if (saved) {
    avatarHistory.value = JSON.parse(saved)
  }
})
</script>
```

### 高级事件处理

```javascript
// 监听所有Ready Player Me事件
const handleMessage = event => {
  const json = JSON.parse(event.data)

  if (json?.source !== 'readyplayerme') return

  switch (json.eventName) {
    case 'v1.frame.ready':
      console.log('创建器已就绪')
      break

    case 'v2.avatar.exported':
      console.log('v2版本头像创建完成，包含详细信息：', json.data.metadata)
      break

    case 'v1.user.set':
      console.log('用户已登录：', json.data.id)
      break

    case 'v1.user.logout':
      console.log('用户已注销')
      break

    case 'v1.user.authorized':
      console.log('用户已获得授权')
      break
  }
}
```

## 🌍 在博客中展示

虚拟人物已自动集成到博客页面侧边栏：

1. 访问 **http://localhost:5173/blog**
2. 查看右侧边栏的"我的虚拟形象"
3. 点击"**✨ 创建你的虚拟形象**"链接
4. 使用增强版创建器创建虚拟人物
5. 查看详细的虚拟人物信息和元数据
6. 自动保存到历史记录，方便重复使用

## 🔧 故障排除

### 常见问题

**❓ 模型一直在加载**

1. 检查网络连接，确保能访问Ready Player Me CDN
2. 在测试页面查看详细错误信息
3. 检查浏览器控制台的JavaScript错误
4. 尝试启用"清除缓存模式"

**❓ 3D场景显示空白**

1. 确认浏览器支持WebGL
2. 检查显卡驱动是否最新
3. 尝试在无痕/隐私模式下测试

**❓ 创建器无法打开**

1. 检查是否被浏览器广告拦截器阻止
2. 确认网络能访问readyplayer.me域名
3. 清除浏览器缓存后重试
4. 检查frameApi参数是否正确添加

**❓ 无法获取v2版本数据**

1. 确认Ready Player Me账户支持v2 API
2. 检查子域名配置是否正确
3. 查看控制台是否有相关错误信息

### 调试技巧

**📊 查看加载状态**

```javascript
// 在浏览器控制台查看
console.log('Avatar3D 组件状态', this.$refs.avatar3d)
```

**🔍 检查v2数据**

```javascript
// 在 @avatar-created 事件中
const handleAvatarCreated = data => {
  console.log('版本：', data.version)
  if (data.version === 'v2') {
    console.log('元数据：', data.data.metadata)
    console.log('性别：', data.data.metadata.gender)
    console.log('体型：', data.data.metadata.bodyType)
  }
}
```

**🔍 检查模型数据**

```javascript
// 在 @loaded 事件中
const handleLoaded = gltf => {
  console.log('模型节点数：', gltf.scene.children.length)
  console.log('模型尺寸：', gltf.scene.scale)
  console.log('动画数量：', gltf.animations?.length || 0)
}
```

**🌐 验证配置URL**

```javascript
// 检查构建的URL是否正确
console.log('Frame URL:', currentFrameUrl)
// 应该包含 frameApi=true 和其他配置参数
```

**🌐 验证模型URL**

- 确保URL以 `https://models.readyplayer.me/` 开头
- URL以 `.glb` 结尾
- 在浏览器中直接访问URL应该下载GLB文件

## 🎯 性能优化建议

### 💡 最佳实践

1. **🖼️ 预加载关键模型**

   ```javascript
   // 预先加载用户的默认虚拟人物
   useGLTF.preload('https://models.readyplayer.me/your-model.glb')
   ```

2. **📱 响应式显示**

   ```css
   /* 移动端隐藏复杂3D内容 */
   @media (max-width: 768px) {
     .avatar-3d {
       display: none;
     }
   }
   ```

3. **⚡ 懒加载**

   ```vue
   <!-- 只在用户滚动到可视区域时加载 -->
   <Avatar3D v-if="isVisible" :model-url="avatarUrl" />
   ```

4. **🗂️ 历史记录管理**
   ```javascript
   // 定期清理历史记录
   const cleanOldHistory = () => {
     const history = JSON.parse(localStorage.getItem('rpmAvatarHistory') || '[]')
     const recent = history.slice(0, 5) // 只保留最近5个
     localStorage.setItem('rpmAvatarHistory', JSON.stringify(recent))
   }
   ```

### 📈 性能监控

访问测试页面查看：

- **🔧 技术信息** - WebGL支持情况
- **📝 调试日志** - 加载时间和错误信息
- **🎮 控制面板** - 实时调整渲染参数
- **👤 用户状态** - 当前登录用户信息
- **📊 版本信息** - v1/v2 API使用情况

## 🔗 相关链接

- [Ready Player Me 官方文档](https://docs.readyplayer.me/)
- [Ready Player Me v2 API文档](https://docs.readyplayer.me/api/avatars)
- [Three.js 官方文档](https://threejs.org/docs/)
- [TresJS Vue 3D库](https://tresjs.org/)
- [项目GitHub仓库](https://github.com/your-repo)

## 💬 技术支持

如遇问题请：

1. 查看测试页面的调试日志
2. 检查浏览器控制台错误信息
3. 查看用户状态和版本信息
4. 提交Issue附带错误截图和环境信息

---

**🎉 享受你的3D虚拟形象之旅！**

_创建独特的虚拟身份，获取详细的元数据信息，让你的博客更加生动有趣。_

## 👤 用户管理系统

根据Ready Player Me官方最佳实践，我们的系统支持两种用户类型，并提供智能的用户体验优化。

### 🔍 用户类型自动识别

系统会自动检测和显示用户的账户类型：

#### 🎯 访客账户 (Guest Account)

- **特征**：没有Ready Player Me正式账户的用户
- **优势**：无需注册，快速开始创建
- **限制**：虚拟形象和资产仅保存在本地浏览器
- **建议**：系统会智能推荐升级到正式账户

#### 👑 Ready Player Me账户 (Registered Account)

- **特征**：已在Ready Player Me注册的用户
- **优势**：跨设备同步、永久保存、更多功能
- **体验**：享受完整的Ready Player Me生态系统

### 🎯 智能用户引导

当用户首次使用时，系统提供两种启动方式：

#### 快速开始（访客模式）

```vue
<template>
  <button @click="startAsGuest" class="start-guest-btn">🎯 快速开始（访客模式）</button>
</template>
```

#### 使用Ready Player Me账户

```vue
<template>
  <button @click="openWithAccount" class="start-account-btn">👑 登录/注册Ready Player Me</button>
</template>
```

### 💡 账户升级建议系统

对于访客用户，系统会智能显示升级建议：

```vue
<template>
  <div v-if="userInfo.accountType === 'guest'" class="account-suggestion">
    <h5>💡 建议</h5>
    <p>您当前使用访客账户。创建Ready Player Me账户可以：</p>
    <ul>
      <li>在所有设备间同步虚拟形象</li>
      <li>永久保存已解锁的资产</li>
      <li>访问更多自定义选项</li>
    </ul>
    <button @click="suggestAccountUpgrade">创建正式账户</button>
  </div>
</template>
```

### 📊 用户状态管理

系统实时监控和显示用户状态：

```javascript
const handleUserChanged = userInfo => {
  if (userInfo) {
    console.log('用户类型:', userInfo.accountType)
    console.log('用户状态:', userInfo.status)
    console.log('用户ID:', userInfo.id)
  }
}
```

### 🔄 账户关联功能

支持Ready Player Me官方的账户关联最佳实践：

- **一次性登录**：用户只需登录一次
- **自动授权**：简化的授权流程
- **状态同步**：实时同步用户状态变化
- **跨设备兼容**：支持多设备间的无缝切换
