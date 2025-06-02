# Vercel 部署检查清单

## 部署前准备

### ✅ 代码检查
- [ ] 代码已推送到GitHub仓库主分支
- [ ] 所有依赖已正确安装 (`npm install`)
- [ ] 本地构建成功 (`npm run build`)
- [ ] 本地预览正常 (`npm run preview`)
- [ ] ESLint检查通过 (`npm run lint`)
- [ ] TypeScript类型检查通过 (`npm run type-check`)

### ✅ 配置文件检查
- [ ] `vercel.json` 配置文件存在且正确
- [ ] `package.json` 包含正确的构建脚本
- [ ] 环境变量已在Vercel控制台配置
- [ ] `.gitignore` 包含必要的忽略规则

## 部署步骤

### 方法一：通过Vercel控制台
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入GitHub仓库
4. 配置项目设置：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`
5. 添加环境变量
6. 点击 "Deploy"

### 方法二：通过Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel账户
vercel login

# 部署到生产环境
npm run vercel:deploy

# 或者使用vercel命令
vercel --prod
```

## 环境变量配置

在Vercel项目设置 → Environment Variables 中添加：

| 变量名 | 值 | 环境 |
|--------|----|----|
| `VITE_APP_TITLE` | MilesXWalkerStudio | All |
| `VITE_APP_VERSION` | 0.1.0 | All |
| `VITE_APP_ENV` | production | Production |
| `VITE_API_BASE_URL` | your-api-url | All |
| `VITE_ENABLE_PWA` | true | Production |

## 部署后验证

### ✅ 功能测试
- [ ] 网站能正常访问
- [ ] 所有页面路由工作正常
- [ ] API调用正常响应
- [ ] 静态资源正常加载
- [ ] 响应式设计在各设备上正常显示

### ✅ 性能检查
- [ ] Lighthouse性能评分 > 90
- [ ] 首屏加载时间 < 3秒
- [ ] 静态资源缓存正常
- [ ] CDN分发正常

### ✅ SEO和安全
- [ ] Meta标签正确设置
- [ ] 安全头配置生效
- [ ] HTTPS正常工作
- [ ] 网站地图生成正常

## 常见问题排查

### 构建失败
1. **检查Node.js版本**
   ```bash
   # 确保使用Node.js 16+
   node --version
   ```

2. **检查依赖安装**
   ```bash
   # 清除缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **检查构建命令**
   ```bash
   # 本地测试构建
   npm run build
   ```

### 路由404问题
- 确认 `vercel.json` 中的 rewrites 配置正确
- 检查Vue Router配置是否为history模式

### 环境变量不生效
- 确认变量名以 `VITE_` 开头
- 检查Vercel控制台中的环境变量配置
- 重新部署项目

### 静态资源加载失败
- 检查资源路径是否正确
- 确认 `public` 目录结构
- 验证CDN缓存设置

## 性能优化建议

### 代码分割
```javascript
// 路由懒加载
const Home = () => import('@/views/Home.vue')
const About = () => import('@/views/About.vue')
```

### 图片优化
- 使用WebP格式
- 实现图片懒加载
- 配置合适的图片大小

### 缓存策略
- 静态资源长期缓存
- API数据合理缓存
- 利用Vercel Edge缓存

## 监控和维护

### 部署监控
- 配置部署通知
- 监控构建时间
- 跟踪部署成功率

### 性能监控
- 集成Google Analytics
- 使用Vercel Analytics
- 监控Core Web Vitals

### 错误追踪
- 集成Sentry错误追踪
- 配置日志收集
- 监控API错误率

## 回滚策略

```bash
# 查看部署历史
vercel ls

# 回滚到特定版本
vercel rollback [deployment-url]

# 通过Git回滚
git revert HEAD
git push origin main
```

---

**部署支持**: 如遇问题请查看 [Vercel文档](https://vercel.com/docs) 或提交Issue 