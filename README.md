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
- **工具库**: VueUse, Lucide Vue
- **部署平台**: Vercel

## 项目结构

```
src/
├── components/     # 可复用组件
├── views/         # 页面组件  
├── router/        # 路由配置
├── stores/        # Pinia状态管理
├── utils/         # 工具函数
├── lib/          # 库文件
├── assets/       # 静态资源
└── main.js       # 应用入口
```

## 🚀 快速开始

### 📋 常用命令速查
- 📖 **[查看完整命令列表 →](./COMMANDS.md)**
- 📤 **[Git & Vercel 速查卡 →](./Git-Vercel速查.txt)**
- 🚀 **[Vercel自动部署说明 →](./Vercel自动部署说明.md)**
- ⚡ **最常用命令**：
  ```bash
  # 代码相关
  npm run format     # 格式化代码
  npm run fix-all    # 一键修复所有问题
  npm run check-all  # 检查所有问题
  npm run dev        # 启动开发服务器
  
  # Git推送（推送后Vercel自动部署，2-5分钟完成）
  git add . && git commit -m "更新" && git push origin main
  
  # 手动部署（如果想立即部署）
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

## Vercel 部署指南

### 快速部署

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

# 功能开关
VITE_ENABLE_PWA=true
VITE_ENABLE_MOCK=false
```

### 部署优化特性

我们的Vercel配置包含以下优化：

- ✅ **框架自动检测**: Vite框架自动优化
- ✅ **静态资源缓存**: 1年缓存策略
- ✅ **安全头配置**: XSS防护、内容类型保护
- ✅ **多区域部署**: 香港、旧金山、弗吉尼亚
- ✅ **SPA路由支持**: 单页应用路由重写

## 开发规范

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

## 性能优化

- **代码分割**: Vendor chunks分离
- **懒加载**: 路由级别代码分割
- **资源优化**: 静态资源CDN加速
- **缓存策略**: 浏览器缓存优化

## 浏览器支持

- Chrome >= 87
- Firefox >= 78  
- Safari >= 14
- Edge >= 88

## 许可证

MIT License

## 联系方式

如有问题请提交Issue或联系项目维护者。

---

*本项目遵循Vue.js最佳实践，为初学者提供友好的开发体验。*
