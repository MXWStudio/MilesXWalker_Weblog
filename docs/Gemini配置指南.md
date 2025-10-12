# Google Gemini API 配置指南

## 📋 概述

Google Gemini 是 Google 最新的 AI 模型系列，提供强大的性能和慷慨的免费额度。MilesXWalker 现已支持 Gemini API，并将其设置为默认模型。

## ✨ Gemini 优势

### 🆓 免费额度

- **每分钟15次请求**（免费版）
- **100万 tokens 上下文窗口**
- **完全免费使用**（在免费配额内）

### ⚡ 性能卓越

- **速度极快** - Gemini 2.0 Flash 专为快速响应优化
- **质量优秀** - 接近 GPT-4 的质量
- **多语言支持** - 中文优化良好

### 💰 成本效益

相比OpenAI：

- Gemini 2.0 Flash: **免费**
- Gemini 1.5 Flash: $0.000075/1K tokens（仅为GPT-4o-mini的一半）
- Gemini 1.5 Pro: $0.00125/1K tokens（比GPT-4便宜）

## 🚀 获取 API 密钥

### 步骤1: 访问 Google AI Studio

访问：https://aistudio.google.com/

### 步骤2: 登录 Google 账户

使用你的 Google 账户登录

### 步骤3: 获取 API 密钥

1. 点击左侧菜单的 **"Get API key"**
2. 点击 **"Create API key"**
3. 选择或创建一个 Google Cloud 项目
4. 复制生成的 API 密钥

**⚠️ 重要**：妥善保管你的 API 密钥，不要分享给他人！

## 🔧 配置环境变量

### 方法1: 创建 .env 文件（推荐）

在项目根目录创建或编辑 `.env` 文件：

```bash
# Google Gemini API 密钥
VITE_GEMINI_API_KEY=你的API密钥

# 保留原有的 OpenAI 配置（可选）
VITE_OPENAI_API_KEY=你的OpenAI密钥
```

**示例**：

```bash
VITE_GEMINI_API_KEY=AIzaSyA_ZcZ_kb2dWjxdyKKkSUk7ONEXSpmGfIE
```

### 方法2: 系统环境变量

**Windows PowerShell**:

```powershell
$env:VITE_GEMINI_API_KEY="你的API密钥"
```

**Mac/Linux**:

```bash
export VITE_GEMINI_API_KEY="你的API密钥"
```

## ✅ 验证配置

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 打开简历生成器

访问：http://localhost:8083/

### 3. 检查默认模型

- 在"AI 模型"选择器中
- 应该看到默认选中：**Gemini 2.0 Flash 免费**

### 4. 测试 AI 优化

1. 输入岗位：`前端开发工程师`
2. 点击 **"🚀 AI 优化简历"**
3. 查看浏览器控制台，应该显示：
   ```
   📡 正在调用 Google Gemini API (Gemini 2.0 Flash)...
   ✅ 简历优化完成
   ```

## 🎯 可用的 Gemini 模型

### 1. Gemini 2.5 Flash ⭐ (默认推荐)

```javascript
{
  id: 'gemini-2.5-flash',
  tier: 'free',
  features: {
    speed: '极快',
    quality: '卓越',
    cost: '免费额度',
    contextWindow: '1M tokens'
  }
}
```

**适用场景**：

- 日常简历优化
- 快速测试
- 个人使用
- 追求最新技术

### 2. Gemini 1.5 Flash

```javascript
{
  id: 'gemini-1.5-flash',
  tier: 'paid',
  pricing: {
    input: 0.000075,  // $0.000075/1K
    output: 0.0003
  }
}
```

**适用场景**：

- 高频使用
- 性价比之选
- 批量处理

### 3. Gemini 2.5 Pro

```javascript
{
  id: 'gemini-2.5-pro',
  tier: 'paid',
  pricing: {
    input: 0.00125,  // $0.00125/1K
    output: 0.005
  },
  features: {
    speed: '快速',
    quality: '最佳',
    contextWindow: '2M tokens'  // 超长上下文
  }
}
```

**适用场景**：

- 复杂简历
- 长文档处理
- 最高质量要求
- 追求最新技术

### 4. Gemini 1.5 Pro (经典版本)

```javascript
{
  id: 'gemini-1.5-pro',
  tier: 'paid',
  pricing: {
    input: 0.00125,  // $0.00125/1K
    output: 0.005
  },
  features: {
    contextWindow: '2M tokens'  // 超长上下文
  }
}
```

**适用场景**：

- 复杂简历
- 长文档处理
- 高质量要求

## 📊 与 OpenAI 对比

| 特性         | Gemini 2.5 Flash | GPT-4o Mini | GPT-4o     |
| ------------ | ---------------- | ----------- | ---------- |
| **成本**     | 免费             | $0.00015/1K | $0.0025/1K |
| **速度**     | 极快             | 快速        | 快速       |
| **质量**     | 卓越             | 良好        | 优秀       |
| **免费额度** | 15 RPM           | 100K TPM    | 需付费     |
| **上下文**   | 1M tokens        | 128K        | 128K       |
| **版本**     | 最新 2.5         | 稳定版      | 稳定版     |

**结论**：Gemini 2.5 Flash 是最佳的最新免费选择！

## ⚠️ 常见问题

### 1. 如何检查 API 密钥是否配置成功？

打开浏览器控制台，输入：

```javascript
console.log(import.meta.env.VITE_GEMINI_API_KEY)
```

应该显示你的 API 密钥（或 undefined 表示未配置）

### 2. 遇到 "未配置 VITE_GEMINI_API_KEY" 错误

**解决方案**：

1. 确认 `.env` 文件在项目根目录
2. 确认变量名正确：`VITE_GEMINI_API_KEY`（注意 VITE\_ 前缀）
3. 重启开发服务器：`npm run dev`

### 3. 遇到 "API key not valid" 错误

**原因**：

- API 密钥输入错误
- API 密钥已失效
- API 密钥权限不足

**解决方案**：

1. 重新复制 API 密钥（注意不要有空格）
2. 访问 Google AI Studio 重新生成密钥
3. 确认 API 已启用

### 4. 遇到 "quota exceeded" 错误

**原因**：超出免费配额（15次/分钟）

**解决方案**：

1. **等待1分钟**后重试
2. **升级到付费版**：访问 Google Cloud Console
3. **切换到其他模型**：如 Gemini 1.5 Flash (更高配额)

### 5. Gemini 返回的结果质量不好？

**建议**：

- 使用 **Gemini 1.5 Pro**（更高质量）
- 提供更详细的岗位信息
- 使用多轮迭代优化

## 🔐 安全最佳实践

### ✅ DO（推荐）

1. **使用环境变量**

   ```bash
   # .env 文件
   VITE_GEMINI_API_KEY=你的密钥
   ```

2. **添加到 .gitignore**

   ```
   .env
   .env.local
   ```

3. **不同环境使用不同密钥**
   - 开发环境：测试密钥
   - 生产环境：生产密钥

### ❌ DON'T（禁止）

1. **❌ 直接写在代码中**

   ```javascript
   // 错误示例！
   const apiKey = 'AIzaSyA_ZcZ_kb2dWjxdyKKkSUk7ONEXSpmGfIE'
   ```

2. **❌ 提交到 Git**
   - 永远不要把 `.env` 文件提交到代码仓库

3. **❌ 公开分享**
   - 不要在论坛、聊天记录中分享 API 密钥

## 💡 使用技巧

### 1. 设置为默认模型

已自动设置！Gemini 2.5 Flash 现在是默认模型。

### 2. 手动切换模型

在简历生成器中：

1. 找到"AI 模型"选择器
2. 点击选择你想要的 Gemini 模型
3. 系统会自动保存你的选择

### 3. 混合使用多个模型

```javascript
// 日常使用
默认：Gemini 2.5 Flash（免费）

// 重要简历
切换到：Gemini 2.5 Pro（最高质量）

// 备用选择
OpenAI GPT-4o（如果 Gemini 不可用）
```

## 📖 API 文档

- [Google Gemini API 官方文档](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [定价说明](https://ai.google.dev/pricing)

## 🎉 快速开始

### 最简配置（仅需3步）

1. **获取密钥**
   - 访问：https://aistudio.google.com/
   - 点击 "Get API key"

2. **配置环境**

   ```bash
   echo "VITE_GEMINI_API_KEY=你的密钥" > .env
   ```

3. **启动使用**
   ```bash
   npm run dev
   ```

就这么简单！🎊

## 🔗 相关链接

- [AI模型切换功能使用指南](./AI模型切换功能使用指南.md)
- [简历生成器使用指南](./简历生成器使用指南.md)
- [AI简历优化功能总结](./AI简历优化功能总结.md)

---

**作者**: AI进化论-花生  
**日期**: 2025-10-12  
**版本**: 1.0
