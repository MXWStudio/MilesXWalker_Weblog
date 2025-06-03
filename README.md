# MilesXWalkerStudio - Vue3.js 创意框架

![Vue.js Logo](https://github.com/vercel/vercel/blob/master/packages/frameworks/logos/vue.svg)

## 项目简介

MilesXWalkerStudio 是一个基于Vue 3 + TypeScript + Vite构建的现代化前端应用框架。项目采用了最新的Vue.js生态系统技术栈，为创意项目提供高性能的用户界面解决方案。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **开发语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **样式框架**: Tailwind CSS
- **UI组件**: Inspira UI
- **3D渲染**: Three.js + TresJS
- **3D模型**: ReadyPlayerMe GLB格式
- **支付系统**: Stripe API
- **工具库**: VueUse, Lucide Vue
- **部署平台**: Vercel

## 项目结构

src/
├── components/ # 可复用组件
├── views/ # 页面组件
├── router/ # 路由配置
├── stores/ # Pinia状态管理
├── utils/ # 工具函数
├── lib/ # 库文件
├── assets/ # 静态资源
└── main.js # 应用入口

docs/ # 📚 项目文档中心
├── commands/ # 🔨 命令参考文档
├── deployment/ # 🚀 部署文档
└── rules/ # 📏 开发规则文档

config/ # 🔧 配置文件目录
└── README.md # 配置文件说明

## 🚨 重要：文件分类规则

**⚠️ 添加任何新文件前，请务必先阅读：[📏文件分类规则.md](docs/rules/📏文件分类规则.md)**

这个规则确保项目结构始终保持：

- ✅ **专业性** - 每个文件都有明确的存放位置
- ✅ **有序性** - 文件按功能和类型科学分类
- ✅ **可维护性** - 新人能快速理解项目结构

违反分类规则的文件将被立即重新整理！

## 🚀 快速开始

### 📚 文档中心

- 🏠 **[文档总览 →](./docs/README.md)** - 查看所有文档的索引
- 📖 **[命令小抄 →](./docs/commands/小抄.txt)** - 4个必备命令，立即可用
- 📋 **[快速命令 →](./docs/commands/快速命令.txt)** - 常用命令速查
- 📤 **[Git & Vercel速查 →](./docs/commands/Git-Vercel速查.txt)** - 推送部署专用
- 📖 **[完整命令手册 →](./docs/commands/COMMANDS.md)** - 详细命令说明

### 📏 开发规则

- 🎯 **[核心规则 →](./docs/rules/.cursorrules)** - 主要开发理念
- 📝 **[代码规范 →](./docs/rules/.cursorrules.code)** - 代码质量标准
- 🧩 **[组件开发 →](./docs/rules/.cursorrules.component)** - 组件开发指南
- 📊 **[规则管理器 →](./docs/rules/.cursorrules.manager)** - 规则系统说明
- 🆕 **[文件分类规则 →](./docs/rules/📏文件分类规则.md)** - **新文件存放规范** ⭐

### ⚡ 最常用命令

```bash
# 🔨 代码相关
npm run format     # 格式化代码
npm run fix-all    # 一键修复所有问题
npm run check-all  # 检查所有问题
npm run dev        # 启动开发服务器

# 📤 Git推送（推送后Vercel自动部署，2-5分钟完成）
git add . && git commit -m "更新" && git push origin main

# 🚀 手动部署（如果想立即部署）
npm run vercel:deploy
```

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发环境启动

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 本地预览构建结果

```bash
npm run preview
```

## 🚀 Vercel 部署指南

### 📋 快速部署流程

1. **查看部署文档**: [部署检查清单 →](./docs/deployment/DEPLOYMENT.md)
2. **了解自动部署**: [Vercel自动部署说明 →](./docs/deployment/Vercel自动部署说明.md)

### 一键部署

1. **连接GitHub仓库**

   ```bash
   # 推送代码到GitHub
   git push origin main
   ```

2. **一键部署到Vercel**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 本地部署命令

```bash
# 安装Vercel CLI
npm i -g vercel

# 本地开发环境
npm run vercel:dev

# 构建预览
npm run vercel:build

# 部署到预览环境
npm run vercel:preview

# 部署到生产环境
npm run vercel:deploy
```

### 环境变量配置

在Vercel项目设置中添加以下环境变量：

```bash
# 应用配置
VITE_APP_TITLE=MilesXWalkerStudio
VITE_APP_VERSION=0.1.0
VITE_APP_ENV=production

# API配置
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_TIMEOUT=10000

# Ready Player Me 配置
VITE_RPM_SUBDOMAIN=mxw
VITE_RPM_APPLICATION_ID=683e4b6fbf64bc8c6cab557b
RPM_API_KEY=your_ready_player_me_api_key

# 支付系统配置 (Stripe) 🆕
# ========================================
# 🔑 服务器端密钥 - 已配置
STRIPE_SECRET_KEY=sk_live_vzhe1sDF1FqnsLZEF9hEMvqj0AEHd6F-vyF
# 前端可发布密钥 - 需要从Stripe控制台获取
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
VITE_PAYMENT_API_URL=https://your-domain.com/api/payment
VITE_WEBHOOK_ENDPOINT=/api/webhooks/stripe

# 功能开关
VITE_ENABLE_PWA=true
VITE_ENABLE_MOCK=false
VITE_ENABLE_PAYMENTS=true
```

### 📋 API 密钥配置指南

#### 🔐 ✅ Stripe 支付系统已就绪！

项目已成功配置 Stripe 支付系统，当前状态：

**✅ 已完成配置：**

- ✅ 测试环境可发布密钥：已配置并可用
- ✅ 服务器端密钥：已配置 (混合模式)
- ✅ 本地环境变量文件：`.env` 已创建
- ✅ 支付功能开关：已启用
- ✅ 前端支付组件：已创建完成
- ✅ 后端API服务：已创建完成
- ✅ 路由配置：支付页面已就绪

**🧪 立即测试支付功能：**

```bash
# 启动完整开发环境
npm run start

# 访问支付测试页面
open http://localhost:5173/payment
```

**📚 详细测试指南：** 📖 [支付功能测试指南](./config/payment-testing-guide.md)

**🔑 测试卡号：**

- 成功支付：`4242 4242 4242 4242`
- 被拒绝卡：`4000 0000 0000 0002`
- 过期日期：任意未来日期，CVC：任意3位数

**需要完成的配置（可选）：**

1. 🔑 **获取匹配的测试服务器密钥**：

   - 访问 [Stripe 控制台](https://dashboard.stripe.com/apikeys)
   - 切换到 **"查看测试数据"** 模式
   - 复制测试服务器端密钥 (以 `sk_test_` 开头)
   - 在 `.env` 文件中设置：`STRIPE_SECRET_KEY=sk_test_...`

2. 🚀 **生产环境配置**：
   - 获取生产环境密钥对 (pk*live*... 和 sk*live*...)
   - 在 Vercel 项目设置中配置环境变量

**详细配置说明：** 📖 [API 密钥配置指南](./config/api-keys-setup.md)

### 部署优化特性

我们的Vercel配置包含以下优化：

- ✅ **框架自动检测**: Vite框架自动优化
- ✅ **静态资源缓存**: 1年缓存策略
- ✅ **安全头配置**: XSS防护、内容类型保护
- ✅ **多区域部署**: 香港、旧金山、弗吉尼亚
- ✅ **SPA路由支持**: 单页应用路由重写

## 📏 开发规范

### 代码风格

- 使用ESLint + Prettier进行代码格式化
- 遵循Vue 3 Composition API最佳实践
- 使用TypeScript进行类型检查

### 组件开发

- 采用单文件组件(SFC)格式
- 使用setup语法糖简化代码
- 实现组件的可复用性和可维护性

### 状态管理

- 使用Pinia进行状态管理
- 合理组织store结构
- 实现响应式数据流

### 文件管理

- **严格遵循** [文件分类规则](./docs/rules/📏文件分类规则.md)
- 每个文件都有明确的存放位置
- 定期检查和整理项目结构

详细开发规范请查看 [开发规则文档](./docs/rules/)

## ⚡ 性能优化

- **代码分割**: Vendor chunks分离
- **懒加载**: 路由级别代码分割
- **资源优化**: 静态资源CDN加速
- **缓存策略**: 浏览器缓存优化

## 🌐 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 🔧 配置文件说明

项目配置文件经过优化整理，详情请查看 [配置文件说明](./config/README.md)

- **当前配置**: 项目根目录保留11个必要的配置文件
- **结构清晰**: 过时配置文件已清理，保持项目整洁
- **分类规范**: 遵循严格的文件分类规则

## 📜 许可证

MIT License

## 📞 联系方式

如有问题请提交Issue或联系项目维护者。

---

💡 **新手提示**:

1. 先看 [命令小抄](./docs/commands/小抄.txt) 了解4个最重要的命令
2. **必读** [文件分类规则](./docs/rules/📏文件分类规则.md) 学会规范存放文件
3. 查看 [文档中心](./docs/README.md) 获取完整指南

_本项目遵循Vue.js最佳实践，为初学者提供友好的开发体验。_

## 🌟 项目特性

### 🎭 3D虚拟头像系统

项目集成了先进的3D头像展示功能：

- **🎨 3D模型渲染**: 基于Three.js + TresJS实现高性能3D渲染
- **👤 虚拟人物**: 支持ReadyPlayerMe标准GLB模型格式
- **🎮 交互控制**: 鼠标拖拽旋转、缩放控制
- **📱 响应式设计**: 适配不同屏幕尺寸和设备
- **⚡ 异步加载**: 智能加载优化和错误处理
- **🎨 多种模式**:
  - `decorative` - 装饰模式：适合侧边栏展示
  - `full` - 完整模式：支持完整交互控制
  - `simple` - 简化模式：基础展示功能

#### 使用方式

```vue
<!-- 基础使用 -->
<Avatar3D />

<!-- 自定义配置 -->
<Avatar3D
  mode="decorative"
  height="280px"
  :show-controls="false"
  :show-ground="false"
  :initial-scale="0.8"
  :initial-position="[0, -0.8, 0]"
/>
```

#### 功能特点

- 🎯 **易于集成**: 单个组件即可实现3D头像功能
- 🚀 **性能优化**: 支持异步加载和错误恢复
- 🎨 **美观设计**: 渐变背景和加载动画
- 📐 **参数可配**: 支持多种展示模式和自定义配置
