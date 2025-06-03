# 环境变量配置示例

复制此配置到项目根目录的 `.env` 文件中：

```bash
# 应用基础配置
VITE_APP_TITLE=MilesXWalkerStudio
VITE_APP_VERSION=0.1.0
VITE_APP_DESCRIPTION=Vue3 + 3D虚拟形象博客系统
VITE_APP_ENV=development

# API配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_API_VERSION=v1

# Ready Player Me 配置
VITE_RPM_SUBDOMAIN=demo
VITE_RPM_APPLICATION_ID=your_application_id_here

# 服务器端配置（不要在VITE_前缀中暴露）
RPM_API_KEY=your_api_key_here
RPM_API_BASE_URL=https://api.readyplayer.me/v1

# 认证配置
VITE_AUTH_TOKEN_KEY=rpm_auth_token
VITE_AUTH_REFRESH_TOKEN_KEY=rpm_refresh_token
VITE_AUTH_TOKEN_EXPIRES=7200

# 功能开关
VITE_ENABLE_PWA=true
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false

# 服务配置
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# 服务器端口
PORT=3000
```

## Ready Player Me 配置说明

### 获取配置参数

1. **Application ID**:

   - 访问 [Ready Player Me Studio](https://studio.readyplayer.me)
   - 选择您的应用程序
   - 在应用程序页面顶部找到 Application ID

2. **API Key**:

   - 在 Studio 左侧导航面板中获取
   - 或直接访问 API Keys 页面
   - **重要**: API Key 只能在服务器端使用，不要暴露给客户端

3. **Subdomain**:
   - 您的 Ready Player Me 子域名
   - 例如：demo.readyplayer.me 中的 "demo"

### 安全注意事项

- ✅ `VITE_RPM_SUBDOMAIN` - 可以在客户端使用
- ✅ `VITE_RPM_APPLICATION_ID` - 可以在客户端使用
- ❌ `RPM_API_KEY` - 仅服务器端使用，不要添加 `VITE_` 前缀
- ❌ `RPM_API_BASE_URL` - 仅服务器端使用
