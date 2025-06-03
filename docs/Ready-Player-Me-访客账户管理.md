# 🎯 Ready Player Me 访客账户管理系统

## 📋 概述

根据Ready Player Me官方最佳实践，我们实现了完整的访客账户创建和账户关联系统。该系统允许用户无需注册即可创建虚拟形象，并在需要时将访客账户迁移到正式账户。

## 🏗️ 系统架构

### 前后端分离架构

```
前端 (Vue 3)              服务器端 (Express)           Ready Player Me API
   ├─ AvatarCreator       ├─ 访客账户创建             ├─ POST /v1/users
   ├─ readyPlayerMeAPI    ├─ 授权令牌获取             ├─ GET /v1/auth/token
   └─ 本地存储管理         └─ 账户迁移处理             └─ API密钥安全管理
```

## ⚙️ 环境配置

### 1. 获取Ready Player Me配置

1. **注册应用程序**：

   - 访问 [Ready Player Me Studio](https://studio.readyplayer.me)
   - 创建或选择您的应用程序
   - 获取 Application ID

2. **获取API密钥**：

   - 在Studio左侧导航面板获取API Key
   - **重要**：API Key仅在服务器端使用

3. **配置子域名**：
   - 设置您的Ready Player Me子域名
   - 例如：`yourapp.readyplayer.me`

### 2. 环境变量配置

创建 `.env` 文件并添加以下配置：

```bash
# Ready Player Me 配置
VITE_RPM_SUBDOMAIN=your_subdomain
VITE_RPM_APPLICATION_ID=your_application_id

# 服务器端配置（保密）
RPM_API_KEY=your_api_key_here
RPM_API_BASE_URL=https://api.readyplayer.me/v1

# API配置
VITE_API_BASE_URL=http://localhost:3000/api
PORT=3000
```

## 🚀 快速开始

### 1. 启动服务器

```bash
# 安装依赖
npm install

# 启动开发服务器（同时启动前后端）
npm run start:dev

# 或分别启动
npm run server:dev  # 后端服务器
npm run dev         # 前端开发服务器
```

### 2. 访问测试页面

打开浏览器访问：**http://localhost:5175/avatar-test**

## 🎯 功能特性

### ✨ 访客账户创建

#### 自动创建流程

1. 用户点击"快速开始（访客模式）"
2. 系统调用服务器API创建访客账户
3. 返回用户ID并保存到本地存储
4. 获取授权令牌并打开创建器

#### 技术实现

```javascript
// 客户端调用
const guestAccount = await readyPlayerMeAPI.createGuestAccount()

// 服务器端API
POST /api/rpm/guest-account
{
  "data": {
    "applicationId": "your_app_id"
  }
}
```

### 🔐 授权令牌管理

#### 短期令牌系统

- **有效期**：15秒（符合RPM官方规范）
- **自动刷新**：需要时重新获取
- **安全存储**：带过期时间的本地存储

#### 实现示例

```javascript
// 获取授权令牌
const tokenInfo = await readyPlayerMeAPI.getAuthToken(userId, subdomain)

// 构建带令牌的iframe URL
const iframeUrl = readyPlayerMeAPI.buildIframeUrl(subdomain, token, options)
```

### 🔄 账户迁移

#### 自动迁移检测

当访客用户通过Ready Player Me登录时：

1. 系统检测到用户ID变化
2. 自动触发账户迁移流程
3. 保留虚拟形象和资产数据
4. 更新本地存储信息

#### 迁移事件处理

```javascript
// 监听用户授权事件
if (json.eventName === 'v1.user.authorized') {
  const oldUserId = userInfo.value.id
  const newUserId = json.data.id

  if (oldUserId !== newUserId && userInfo.value.accountType === 'guest') {
    await handleAccountMigration(oldUserId, newUserId)
  }
}
```

## 📊 用户类型管理

### 🎯 访客账户 (Guest Account)

- **特征**：用户ID包含特殊格式
- **创建方式**：通过API自动创建
- **存储位置**：本地浏览器存储
- **功能限制**：基础虚拟形象创建

### 👑 正式账户 (Registered Account)

- **特征**：Ready Player Me注册用户
- **登录方式**：通过iframe认证
- **存储位置**：Ready Player Me云端
- **功能完整**：完整的虚拟形象生态系统

### 🔍 账户类型检测

```javascript
const detectAccountType = userId => {
  if (userId?.includes('guest_') || userId?.length < 10) {
    return 'guest'
  } else if (userId?.length > 10) {
    return 'registered'
  }
  return 'unknown'
}
```

## 🛠️ API接口文档

### 服务器端API

#### 1. 创建访客账户

```http
POST /api/rpm/guest-account
Content-Type: application/json

Response:
{
  "success": true,
  "data": {
    "userId": "63ff75dbb63b7b5808ab07e0",
    "accountType": "guest",
    "applicationIds": ["your_app_id"],
    "createdAt": "2023-03-01T15:57:15.517Z"
  }
}
```

#### 2. 获取授权令牌

```http
GET /api/rpm/auth-token?userId=xxx&subdomain=xxx

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 15,
    "userId": "63ff75dbb63b7b5808ab07e0",
    "subdomain": "demo"
  }
}
```

#### 3. 账户迁移

```http
POST /api/rpm/migrate-account
Content-Type: application/json

{
  "guestUserId": "old_user_id",
  "newUserId": "new_user_id"
}

Response:
{
  "success": true,
  "data": {
    "oldUserId": "old_user_id",
    "newUserId": "new_user_id",
    "accountType": "registered",
    "migratedAt": "2023-03-01T16:00:00.000Z"
  }
}
```

#### 4. 用户状态检查

```http
GET /api/rpm/user-status/:userId

Response:
{
  "success": true,
  "data": {
    "userId": "63ff75dbb63b7b5808ab07e0",
    "accountType": "guest",
    "status": "active",
    "checkedAt": "2023-03-01T16:00:00.000Z"
  }
}
```

#### 5. 健康检查

```http
GET /api/rpm/health

Response:
{
  "success": true,
  "service": "Ready Player Me API",
  "status": "healthy",
  "config": {
    "hasApiKey": true,
    "hasApplicationId": true,
    "apiBaseUrl": "https://api.readyplayer.me/v1"
  }
}
```

### 客户端API

#### readyPlayerMeAPI 服务类

```javascript
import readyPlayerMeAPI from '@/services/readyPlayerMeApi.js'

// 创建访客账户
const guestAccount = await readyPlayerMeAPI.createGuestAccount()

// 获取授权令牌
const token = await readyPlayerMeAPI.getAuthToken(userId, subdomain)

// 构建iframe URL
const iframeUrl = readyPlayerMeAPI.buildIframeUrl(subdomain, token, options)

// 账户迁移
const migration = await readyPlayerMeAPI.migrateAccount(oldUserId, newUserId)

// 本地存储管理
readyPlayerMeAPI.storage.saveUserInfo(userInfo)
const userInfo = readyPlayerMeAPI.storage.getUserInfo()
```

## 🎨 用户界面

### 智能引导系统

#### 首次访问

```vue
<div class="user-guide">
  <div class="user-options">
    <!-- 访客模式 -->
    <div class="option-card guest-option">
      <h5>🎯 快速开始（访客模式）</h5>
      <p>无需注册，立即开始创建虚拟形象</p>
      <button @click="startAsGuest">快速开始</button>
    </div>

    <!-- 账户模式 -->
    <div class="option-card account-option">
      <h5>👑 使用Ready Player Me账户</h5>
      <p>登录享受跨设备同步和更多功能</p>
      <button @click="openWithAccount">登录/注册</button>
    </div>
  </div>
</div>
```

#### 状态指示器

- **🟢 服务器已连接** - API服务正常
- **🔴 服务器未连接** - API服务异常
- **用户类型徽章** - 显示访客/正式账户
- **实时状态** - 登录、授权、迁移状态

### 升级建议系统

对访客用户显示账户升级建议：

```vue
<div class="account-suggestion">
  <h5>💡 建议</h5>
  <p>您当前使用访客账户。创建Ready Player Me账户可以：</p>
  <ul>
    <li>在所有设备间同步虚拟形象</li>
    <li>永久保存已解锁的资产</li>
    <li>访问更多自定义选项</li>
  </ul>
  <button @click="suggestAccountUpgrade">创建正式账户</button>
</div>
```

## 🔧 故障排除

### 常见问题

#### ❓ 访客账户创建失败

**可能原因**：

- API密钥未配置或无效
- Application ID未设置
- 服务器未启动

**解决方案**：

1. 检查 `.env` 文件配置
2. 验证Ready Player Me Studio设置
3. 查看服务器控制台日志

#### ❓ 授权令牌获取失败

**可能原因**：

- 用户ID无效
- 子域名配置错误
- 令牌已过期

**解决方案**：

1. 验证用户ID格式
2. 检查子域名配置
3. 重新获取令牌

#### ❓ 账户迁移不工作

**可能原因**：

- 事件监听器未正确设置
- 用户ID检测逻辑错误
- API调用失败

**解决方案**：

1. 检查postMessage事件处理
2. 验证用户ID变化检测
3. 查看迁移API日志

### 调试技巧

#### 服务器端调试

```bash
# 查看服务器日志
npm run server:dev

# 测试API健康状态
curl http://localhost:3000/api/rpm/health
```

#### 客户端调试

```javascript
// 启用详细日志
localStorage.setItem('rpm_debug', 'true')

// 检查用户信息
console.log(readyPlayerMeAPI.storage.getUserInfo())

// 检查令牌信息
console.log(readyPlayerMeAPI.storage.getValidTokenInfo())
```

## 📈 性能优化

### 令牌管理优化

- **预获取策略**：在需要前提前获取令牌
- **缓存机制**：本地缓存有效令牌
- **自动清理**：过期令牌自动清理

### 本地存储优化

- **数据压缩**：优化存储数据结构
- **定期清理**：清理过期数据
- **容量管理**：限制存储数据量

### 网络请求优化

- **请求限流**：防止API滥用
- **错误重试**：自动重试失败请求
- **超时处理**：合理的超时设置

## 🚀 部署指南

### 生产环境配置

#### 环境变量

```bash
# 生产环境配置
NODE_ENV=production
VITE_APP_ENV=production
VITE_API_BASE_URL=https://your-domain.com/api

# Ready Player Me 生产配置
VITE_RPM_SUBDOMAIN=your_production_subdomain
RPM_API_KEY=your_production_api_key
```

#### CORS配置

```javascript
// 生产环境CORS设置
const corsOptions = {
  origin: ['https://your-domain.com', 'https://your-subdomain.readyplayer.me'],
  credentials: true,
}
```

### Vercel部署

#### 服务器端部署

```json
// vercel.json
{
  "functions": {
    "server/index.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    }
  ]
}
```

## 📚 相关文档

- [Ready Player Me官方文档](https://docs.readyplayer.me/)
- [访客账户API文档](https://docs.readyplayer.me/user-management/guest-accounts)
- [账户关联文档](https://docs.readyplayer.me/user-management/account-linking)
- [Avatar3D使用指南](./Avatar3D使用指南.md)
- [用户管理功能升级说明](./用户管理功能升级说明.md)

## 🤝 技术支持

如遇问题请：

1. 查看服务器端日志
2. 检查浏览器控制台错误
3. 验证Ready Player Me Studio配置
4. 测试API健康状态
5. 提交Issue附带详细错误信息

---

**🎉 享受完整的Ready Player Me用户管理体验！**

_让用户从访客到正式用户的升级变得流畅自然。_
