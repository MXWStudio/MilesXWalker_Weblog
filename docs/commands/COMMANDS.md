# 🚀 常用开发命令速查表

## 📋 代码检查和修复命令

### 🔍 检查命令（只检查，不修复）

```bash
# 检查代码质量问题
npm run lint:check

# 检查代码格式问题
npm run format:check

# 检查TypeScript类型问题
npm run type-check

# 一键检查所有问题（代码质量+格式+类型）
npm run check-all
```

### 🛠️ 修复命令（自动修复）

```bash
# 自动修复代码质量问题
npm run lint

# 自动格式化所有代码
npm run format

# 一键修复所有可修复的问题（代码质量+格式）
npm run fix-all
```

### 🎯 TypeScript专用命令

```bash
# TypeScript类型检查
npm run type-check

# TypeScript类型检查（监听模式，实时检查）
npm run type-check:watch
```

## 🔧 项目运行命令

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 📤 Git 推送命令

### 🚀 快速推送流程

```bash
# 1. 添加所有更改
git add .

# 2. 提交更改（请修改提交信息）
git commit -m "更新功能描述"

# 3. 推送到GitHub
git push origin main
```

### 📝 Git常用命令

```bash
# 查看文件状态
git status

# 查看更改内容
git diff

# 添加指定文件
git add 文件名

# 添加所有文件
git add .

# 提交更改
git commit -m "提交信息"

# 推送到远程仓库
git push origin main

# 拉取最新代码
git pull origin main

# 查看提交历史
git log --oneline
```

## 🚀 Vercel 部署命令

### ⚡ 快速部署流程

```bash
# 1. 推送代码到GitHub（Vercel会自动部署）
git push origin main

# 或者手动部署：
# 2. 部署到生产环境
npm run vercel:deploy
```

### 🔧 Vercel专用命令

```bash
# 本地开发环境（模拟Vercel环境）
npm run vercel:dev

# 构建项目（Vercel格式）
npm run vercel:build

# 部署到预览环境
npm run vercel:preview

# 部署到生产环境
npm run vercel:deploy
```

### 🌐 Vercel CLI命令

```bash
# 安装Vercel CLI（只需要安装一次）
npm i -g vercel

# 登录Vercel账户
vercel login

# 初始化项目
vercel

# 查看部署状态
vercel ls

# 查看部署日志
vercel logs

# 查看项目信息
vercel inspect
```

## 📊 推荐工作流程

### 🔥 快速修复流程

```bash
# 1. 一键修复所有能修复的问题
npm run fix-all

# 2. 检查剩余问题
npm run check-all
```

### 💡 日常开发流程

```bash
# 开发时：只检查不修复，了解代码状态
npm run lint:check

# 提交前：自动修复所有问题
npm run fix-all
```

### 🎨 单独使用流程

```bash
# 只想格式化代码
npm run format

# 只想检查类型
npm run type-check

# 只想修复ESLint问题
npm run lint
```

### 🚀 完整发布流程

```bash
# 1. 修复所有代码问题
npm run fix-all

# 2. 最终检查
npm run check-all

# 3. 提交并推送代码
git add .
git commit -m "更新内容描述"
git push origin main

# 4. 部署会自动触发，或手动部署
npm run vercel:deploy
```

## ⚡ 最常用的3个命令

### 1️⃣ 格式化代码（最常用）

```bash
npm run format
```

### 2️⃣ 一键修复所有问题

```bash
npm run fix-all
```

### 3️⃣ 检查所有问题

```bash
npm run check-all
```

## 🎯 最常用的Git命令

### 1️⃣ 快速推送（最常用）

```bash
git add . && git commit -m "更新" && git push origin main
```

### 2️⃣ 查看状态

```bash
git status
```

### 3️⃣ 拉取最新代码

```bash
git pull origin main
```

## 💡 小贴士

- 💾 **保存文件时会自动格式化**（如果安装了VSCode扩展）
- 🔄 **实时错误提示**（编辑器中会显示红色波浪线）
- ⚡ **最快修复方式**：直接运行 `npm run fix-all`
- 📱 **推荐安装的VSCode扩展**：Vue.volar, ESLint, Prettier
- 🚀 **自动部署**：推送到GitHub后Vercel会自动部署
- 📝 **提交信息**：建议使用有意义的提交信息

## 🆘 遇到问题时

### 代码问题

```bash
# 如果命令不工作，先检查依赖
npm install

# 如果还有问题，重新安装
rm -rf node_modules package-lock.json
npm install
```

### Git问题

```bash
# 如果推送失败，先拉取最新代码
git pull origin main

# 如果有冲突，解决后重新提交
git add .
git commit -m "解决冲突"
git push origin main
```

### Vercel问题

```bash
# 查看部署日志
vercel logs

# 重新部署
npm run vercel:deploy

# 检查Vercel状态
vercel ls
```

---

📝 **提示**: 可以把这个文件加入书签，随时查看命令！
