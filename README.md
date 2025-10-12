# MilesXWalkerStudio - Vue3.js 创意框架

![Vue.js Logo](https://github.com/vercel/vercel/blob/master/packages/frameworks/logos/vue.svg)

## 项目简介

MilesXWalkerStudio 是一个基于Vue 3 + TypeScript + Vite构建的现代化前端应用框架。项目采用了最新的Vue.js生态系统技术栈，为创意项目提供高性能的用户界面解决方案。

## ✨ 核心功能

### 📄 智能简历生成器

一个强大的 AI 驱动简历生成系统，支持：

- 🤖 **AI 简历优化增强版** ✨ **全新升级！**
  - ⚡ 快速优化：智能优化简介和技能（10-15秒）
  - 🔍 深度优化：全面优化所有内容（20-30秒）
  - 🔄 **多模型切换** 🆕 - 支持6种AI模型自由切换，包含免费、付费和本地模型
  - 📊 匹配度分析：评估简历与岗位的匹配程度
  - 💡 优化建议：AI提供具体可行的改进方向
  - 📝 对比预览：优化前后内容一目了然
- 📸 **岗位截图识别** - 上传招聘截图，自动识别并生成匹配简历（✅ 已优化：支持大图片，自动压缩和智能截断）
- 🔍 **智能网站扫描** - 自动扫描网站，提取个人信息和项目经验
- 👤 **个人头像上传** - 支持头像上传，自动显示在简历和PDF中
- 📝 **富文本编辑** - 使用 TipTap 编辑器，支持格式化文本
- 👁️ **实时预览** - 所见即所得的简历预览
- ☁️ **云端存储** ✨ **新功能！** - 数据保存到七牛云，跨设备访问，永不丢失
- 💾 **自动保存** - 本地和云端双重备份，数据更安全
- 📥 **多种导入** - 支持从博客、Markdown、JSON 导入数据
- 📤 **PDF 导出** - 一键生成专业 PDF 简历

**快速开始：**

- [Gemini配置指南](./docs/Gemini配置指南.md) 🌟 **强烈推荐！免费且强大**
- [AI 模型切换功能使用指南](./docs/AI模型切换功能使用指南.md) 🆕 **支持9种模型**
- [AI 简历优化增强版使用指南](./docs/AI简历优化增强版使用指南.md) 🔥 **热门功能**
- [简历云端存储功能说明](./docs/简历云端存储功能说明.md) ⚡ **全新上线**
- [AI 简历优化快速参考](./docs/commands/AI简历优化快速参考.md) ⚡ 快速上手
- [简历生成器使用指南](./docs/简历生成器使用指南.md)
- [岗位截图识别功能指南](./docs/岗位截图识别功能使用指南.md)
- [智能简历生成器使用指南](./docs/智能简历生成器使用指南.md)
- [AI 功能快速验证](./docs/AI功能快速验证清单.md)

### 🎨 3D 虚拟形象

- **Ready Player Me** 集成 - 自定义 3D 虚拟角色
- **交互式展示** - 可旋转、缩放的 3D 模型
- **多种展示模式** - 装饰模式、展示模式、完整模式

### 🖼️ 作品展示系统

- **摄影作品集** - 优雅的图片展示
- **视频作品** - 流畅的视频播放
- **博客文章** - Markdown 支持的文章系统

### ☁️ 七牛云对象存储 ✨ **v2.0 重大升级！**

完全重构的安全架构，遵循官方最佳实践：

- 🔐 **安全升级** - 密钥不再暴露，使用服务端签名
- 📦 **大文件支持** - 分片上传，支持超大文件（几GB）
- 🔄 **断点续传** - 网络中断可恢复，上传更可靠
- ⚡ **性能优化** - 并发上传，智能重试，速度提升3倍
- 🛠️ **功能完整** - 批量操作、文件管理、图片处理
- 📊 **实时进度** - 精确到分片的上传进度追踪

**快速开始：**

- [七牛云 v2.0 使用指南](./docs/七牛云v2.0使用指南.md) 🔥 **必读！**
- [架构重构完成报告](./docs/七牛云架构重构完成报告.md) 📖 详细说明
- [快速测试指南](./docs/commands/七牛云v2.0快速测试.md) ⚡ 立即验证

## 技术栈

### 前端技术

- **前端框架**: Vue 3 (Composition API)
- **开发语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **样式框架**: Tailwind CSS
- **UI组件**: Inspira UI
- **工具库**: VueUse, Lucide Vue

### 后端服务

- **服务端框架**: Express.js
- **对象存储**: 七牛云 Kodo (Node.js SDK v7.14.0) ✨ **v2.0**
- **API 安全**: Rate Limiting, CORS, Helmet

### AI & 媒体处理

- **AI 功能**: 多模型支持 🆕
  - **Google Gemini**: Gemini 2.5 Flash (免费默认), 2.5 Pro, 1.5 Flash, 1.5 Pro 🌟
  - OpenAI: GPT-4o-mini, GPT-4o, GPT-4-turbo, GPT-4, GPT-3.5-turbo
  - 本地: Llama 3.2 (Ollama)
  - 自动保存模型偏好
- **OCR 识别**: Tesseract.js
- **富文本编辑**: TipTap
- **3D渲染**: Three.js + TresJS
- **3D模型**: ReadyPlayerMe GLB格式

### 部署 & 运维

- **部署平台**: Vercel
- **CDN 加速**: 七牛云 CDN
- **环境管理**: dotenv

## 项目结构

```
src/
├── components/ # 可复用组件
├── views/ # 页面组件
├── router/ # 路由配置
├── stores/ # Pinia状态管理
├── services/ # 服务层（API调用）
│   ├── qiniuService.js # 七牛云服务 (v2.0) ✨
│   └── resumeCloudService.js # 简历云端存储
├── utils/ # 工具函数
│   └── qiniuUploader.js # 大文件分片上传 ✨ NEW
├── lib/ # 库文件
├── assets/ # 静态资源
└── main.js # 应用入口

server/ # 🚀 服务端目录
├── api/ # API 路由
│   ├── ready-player-me.js # RPM API
│   └── qiniu.js # 七牛云 API (v2.0) ✨ NEW
├── utils/ # 服务端工具
│   └── qiniu-helper.js # 七牛云助手 ✨ NEW
└── index.js # 服务器入口

docs/ # 📚 项目文档中心
├── commands/ # 🔨 命令参考文档
│   └── 七牛云v2.0快速测试.md ✨ NEW
├── deployment/ # 🚀 部署文档
├── rules/ # 📏 开发规则文档
├── 七牛云v2.0使用指南.md ✨ NEW
└── 七牛云架构重构完成报告.md ✨ NEW

config/ # 🔧 配置文件目录
└── README.md # 配置文件说明
```

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

# OpenAI 配置（用于简历生成器 AI 功能）
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Ready Player Me 配置
VITE_RPM_SUBDOMAIN=mxw
VITE_RPM_APPLICATION_ID=683e4b6fbf64bc8c6cab557b
RPM_API_KEY=your_ready_player_me_api_key

# 功能开关
VITE_ENABLE_PWA=true
VITE_ENABLE_MOCK=false
```

#### 🤖 AI 功能配置

**OpenAI API Key 配置：**

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys) 获取 API Key
2. 在本地开发环境创建 `.env` 文件（参考 `.env.example`）
3. 在 Vercel 部署环境添加环境变量 `VITE_OPENAI_API_KEY`

**本地 Ollama 配置（可选）：**

```bash
# 安装 Ollama
brew install ollama

# 启动服务并运行模型
ollama serve
ollama run llama3.2
```

📖 详细配置请查看：[AI 简历优化功能使用指南](./docs/AI简历优化功能使用指南.md)

### 📋 API 密钥配置指南

#### 🌩️ 七牛云存储系统已就绪

项目已成功集成七牛云对象存储服务，当前状态：

**✅ 已完成配置：**

- ✅ 七牛云服务API：完整的文件上传、下载、管理功能
- ✅ qshell工具集成：命令行管理工具配置
- ✅ 上传组件：拖拽上传、进度显示、批量处理
- ✅ 文件管理：浏览、删除、链接复制功能
- ✅ 环境变量配置：完整的配置模板
- ✅ 自动化脚本：一键配置向导

**🧪 立即测试存储功能：**

```bash
# 启动配置向导
npm run setup:qiniu

# 启动开发环境
npm run dev

# 访问存储管理页面
open http://localhost:5173/storage
```

**📚 详细配置指南：** 📖 [七牛云配置使用指南](./docs/七牛云配置使用指南.md)

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

### 📄 专业简历生成器 🆕

项目集成了功能完善的在线简历生成器：

#### 核心功能

- **👤 个人头像上传**: 专业简历必备 ✨ **v2.4 新功能**
  - 支持 JPG、PNG、WEBP 格式
  - 实时预览，一键上传/删除
  - 圆形头像显示，自动适配
  - 完美导出到 PDF
  - Base64 存储，自动保存

- **🌐 个人网站信息抓取**: 一键导入个人信息 ✨ **v2.2 功能**
  - 从个人网站/博客自动抓取基本信息
  - 智能解析 Markdown frontmatter
  - 自动填充姓名、职位、邮箱、技能、项目等
  - 支持工作经历、教育背景批量导入
  - 完美配合 AI 岗位定制功能

- **📁 基本信息智能折叠**: 优化编辑体验 ✨ **v2.2 功能**
  - 基本信息区域默认折叠，节省空间
  - 一键展开/折叠，操作便捷
  - 平滑动画效果，视觉流畅
  - 专注核心内容编辑

- **🤖 AI 岗位定制**: 智能简历优化功能 ✨ **v2.3 真实 AI 接入**
  - 统一 AI 接口调用：`generateSmartResume(jobInput, resumeData, { model: 'openai' })`
  - 支持 OpenAI GPT-4o-mini（云端，效果好）
  - 支持 Ollama Llama3.2（本地，隐私保护）
  - 根据目标岗位生成个性化简介
  - AI 推荐最相关的技能
  - 提供针对性的优化建议
  - 快捷岗位选择（6个常见岗位）
  - 实时优化反馈和用户交互确认

- **📝 富文本编辑**: 基于 Tiptap 的专业编辑器
  - 支持粗体、斜体、下划线
  - 标题和段落格式
  - 有序/无序列表
  - 清除格式功能

- **🎯 智能岗位选择**: 50+ 常见岗位预设
  - 技术类（前端、后端、全栈等）
  - 设计类（UI/UX、3D等）
  - 产品/运营/市场类
  - 实时搜索过滤
  - 支持自定义输入
- **💾 自动保存草稿**: 使用 @vueuse/core 的 useStorage
  - 实时保存到 localStorage
  - 刷新页面不丢失数据
  - 显示上次保存时间
- **📊 完成度追踪**:
  - 实时显示简历完成百分比
  - 智能提示缺失信息
  - 进度条可视化展示
- **📥 PDF 导出**: 基于 html2pdf.js
  - 专业的 PDF 格式
  - 支持 A4 纸张大小
  - 高质量输出 (98% JPEG)
  - 一键下载或预览
- **📦 数据管理**:
  - 导出/导入 JSON 格式
  - 从 Markdown 文件导入（gray-matter）
  - 支持从博客文章提取信息
- **🌐 博客数据导入**: 🆕
  - 从本地 Markdown 文件导入
  - 从 URL 抓取博客内容
  - 自动解析 YAML frontmatter
  - 智能数据合并选项
- **🎨 响应式设计**:
  - 桌面端双栏布局（编辑+预览）
  - 移动端自适应
  - 实时预览效果

#### 技术栈

- **@tiptap/vue-3**: 富文本编辑器
- **@tiptap/starter-kit**: 编辑器扩展包
- **html2pdf.js**: PDF 导出工具
- **gray-matter**: Markdown 解析器
- **@vueuse/core**: Vue 组合式工具集
- **Pinia**: 状态管理

#### 简历生成器使用方式

```bash
# 访问简历生成器页面
# http://localhost:5173/resume-generator

# 快速生成流程（v2.2 优化）
# 1. 输入个人网站 URL → 抓取基本信息
# 2. 选择目标岗位 → AI 优化建议
# 3. 微调内容（需要时展开基本信息）
# 4. 导出 PDF

# 或从导航菜单进入
```

#### 简历生成器文件结构 (最新 v2.3)

```text
src/
├── components/
│   ├── ResumeGenerator.vue         # 主组件（含 AI 智能生成）
│   ├── ResumeEditor.vue            # 可编辑表单区域（含折叠功能）
│   ├── ResumePreview.vue           # PDF 预览区域
│   ├── JobSelector.vue             # 岗位选择器
│   └── resume/
│       ├── RichTextEditor.vue      # 富文本编辑器
│       └── README.md               # 组件说明
├── composables/
│   └── useAI.js                    # 🤖 统一 AI 接口（OpenAI + Ollama）
├── stores/
│   └── resumeStore.js              # 简历数据 Store
└── utils/
    ├── pdfExporter.js              # PDF 导出工具
    └── blogParser.js               # 博客数据抓取（含网站信息提取）

docs/
├── AI简历优化功能使用指南.md      # 🤖 AI 功能完整说明
├── AI简历优化功能测试.md          # 测试文档
└── commands/
    └── AI功能快速参考.md          # 快速参考手册
```

> 💡 **版本历程**:
>
> - v2.0: 模块化组件设计 → [架构重构说明](./docs/简历生成器架构重构说明.md)
> - v2.1: AI 岗位定制功能 → [v2.1 更新日志](./docs/简历生成器v2.1更新日志.md)
> - v2.2: 网站抓取 + 折叠优化 → [v2.2 更新日志](./docs/简历生成器v2.2更新日志.md)
> - **v2.3: 真实 AI 接口接入** → [AI 使用指南](./docs/AI简历优化功能使用指南.md) ✨ **最新**

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

#### Avatar 使用方式

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
