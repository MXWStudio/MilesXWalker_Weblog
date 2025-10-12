# AI模型切换功能使用指南

## 功能概述

MilesXWalker简历生成器现在支持多种AI模型，你可以根据需求和预算自由切换：

- **免费模型**：适合测试和轻度使用
- **付费模型**：更高性能和速率限制
- **本地模型**：完全免费，隐私保护

## 📋 可用模型列表

### 免费模型

#### Gemini 2.0 Flash (推荐) ⭐⭐⭐

- **成本**：免费
- **速度**：极快
- **质量**：优秀
- **限制**：15 RPM（每分钟请求数）
- **上下文**：1M tokens
- **适用场景**：所有场景，强烈推荐！

#### GPT-4o Mini

- **成本**：极低（$0.00015/1K输入）
- **速度**：快速
- **质量**：良好
- **限制**：100,000 TPM（每分钟tokens）
- **适用场景**：日常使用、快速测试、预算有限

### Google Gemini 系列（推荐）

#### Gemini 1.5 Flash

- **成本**：极低（$0.000075/1K输入）
- **速度**：极快
- **质量**：优秀
- **限制**：4,000,000 TPM
- **上下文**：1M tokens
- **适用场景**：高性价比，批量处理

#### Gemini 1.5 Pro

- **成本**：低（$0.00125/1K输入）
- **速度**：快速
- **质量**：卓越
- **限制**：4,000,000 TPM
- **上下文**：2M tokens（超长上下文）
- **适用场景**：复杂任务，长文档处理

### 付费模型 (OpenAI)

#### GPT-4o

- **成本**：中等（$0.0025/1K输入）
- **速度**：快速
- **质量**：优秀
- **限制**：800,000 TPM
- **适用场景**：重要简历、高频使用

#### GPT-3.5 Turbo

- **成本**：低（$0.0005/1K输入）
- **速度**：极快
- **质量**：良好
- **限制**：1,000,000 TPM
- **适用场景**：性价比之选、批量处理

#### GPT-4 Turbo

- **成本**：较高（$0.01/1K输入）
- **速度**：较快
- **质量**：卓越
- **限制**：600,000 TPM
- **适用场景**：复杂简历优化、高质量要求

#### GPT-4

- **成本**：高（$0.03/1K输入）
- **速度**：较慢
- **质量**：最佳
- **限制**：300,000 TPM
- **适用场景**：最高质量要求

### 本地模型

#### Llama 3.2

- **成本**：免费
- **速度**：取决于硬件
- **质量**：良好
- **限制**：无限制
- **适用场景**：隐私保护、无网络环境
- **要求**：需要安装Ollama并下载模型

## 🚀 使用方法

### 1. 在简历生成器中切换模型

1. 打开简历生成器页面
2. 找到"🎯 第二步：选择目标岗位并优化"区域
3. 在"优化模式"下方，找到"AI 模型"选择器
4. 点击模型选择按钮，会显示当前模型（默认：GPT-4o Mini 免费）
5. 在下拉菜单中选择你想使用的模型
6. 系统会自动保存你的选择

### 2. 模型选择建议

#### 🌟 强烈推荐（首选）

→ 使用 **Gemini 2.0 Flash**（默认）

- ✅ 完全免费
- ✅ 质量优秀（接近GPT-4）
- ✅ 速度极快
- ✅ 1M tokens 超长上下文
- ✅ 无需信用卡

#### 如果你遇到了 Gemini 速率限制

→ 切换到 **Gemini 1.5 Flash** 或 **Gemini 1.5 Pro**

- 更高的速率限制（1000 RPM）
- 成本仅为 OpenAI 的 1/5
- 质量更好

#### 如果你已有 OpenAI 账户

→ 使用 **GPT-4o Mini** 或 **GPT-3.5 Turbo**

- OpenAI 的稳定服务
- 熟悉的API
- 良好的JSON支持

#### 如果你追求最高质量

→ 使用 **Gemini 1.5 Pro** 或 **GPT-4**

- 最佳的优化效果
- 更准确的匹配分析
- 超长上下文支持

#### 如果你关注隐私

→ 使用 **Llama 3.2**（本地）

- 完全免费
- 数据不上传云端
- 需要本地运行Ollama

## 📊 模型对比

| 模型             | 成本 | 速度       | 质量 | 限制 | 推荐场景        |
| ---------------- | ---- | ---------- | ---- | ---- | --------------- |
| Gemini 2.0 Flash | 免费 | 极快       | 优秀 | 低   | 首选推荐 ⭐⭐⭐ |
| Gemini 1.5 Flash | 极低 | 极快       | 优秀 | 高   | 高性价比 ⭐⭐   |
| Gemini 1.5 Pro   | 低   | 快速       | 卓越 | 高   | 高质量 ⭐⭐     |
| GPT-4o Mini      | 极低 | 快速       | 良好 | 低   | OpenAI用户 ⭐   |
| GPT-3.5 Turbo    | 低   | 极快       | 良好 | 高   | OpenAI备选      |
| GPT-4o           | 中等 | 快速       | 优秀 | 很高 | OpenAI高级      |
| GPT-4 Turbo      | 较高 | 较快       | 卓越 | 高   | 复杂任务        |
| GPT-4            | 高   | 较慢       | 最佳 | 中   | 最高质量        |
| Llama 3.2        | 免费 | 取决于硬件 | 良好 | 无   | 隐私保护        |

## ⚠️ 常见问题

### 1. 遇到"Rate limit reached"错误怎么办？

**原因**：API 配额已用完

**解决方案（按优先级）**：

1. **切换到 Gemini** ✨ 强烈推荐！
   - 完全免费，质量优秀
   - 访问 [Gemini配置指南](./Gemini配置指南.md) 快速设置
2. **等待重置**
   - OpenAI：约需14小时
   - Gemini：1分钟（免费版每分钟15次）
3. **升级账户**
   - OpenAI：https://platform.openai.com/account/billing
   - Gemini：https://console.cloud.google.com/
4. **使用本地模型**
   - Llama 3.2：完全免费，无限制

### 2. 如何获取和配置 Gemini API？

详细步骤请查看：[Gemini配置指南](./Gemini配置指南.md)

**快速步骤**：

1. 访问 https://aistudio.google.com/
2. 点击 "Get API key"
3. 创建并复制 API 密钥
4. 在项目根目录的 `.env` 文件中添加：
   ```
   VITE_GEMINI_API_KEY=你的API密钥
   ```
5. 重启开发服务器

### 3. 如何安装和使用Llama 3.2本地模型？

**步骤**：

```bash
# 1. 安装Ollama
# 访问 https://ollama.ai 下载安装

# 2. 下载Llama 3.2模型
ollama pull llama3.2

# 3. 启动Ollama服务
ollama serve

# 4. 在简历生成器中选择Llama 3.2模型
```

### 4. 如何查看 API 配额？

**Gemini**：https://aistudio.google.com/app/apikey  
**OpenAI**：https://platform.openai.com/account/rate-limits

### 5. 不同模型的优化效果差异大吗？

- **Gemini 2.0 Flash**：质量优秀，速度极快，免费！⭐⭐⭐
- **Gemini 1.5 Pro**：最高质量，超长上下文，性价比高
- **GPT-4o Mini**：对于一般简历优化完全够用
- **GPT-4o/GPT-4 Turbo**：在复杂场景下会有更细腻的优化
- **GPT-4**：提供最高质量，但速度较慢且成本较高
- **Llama 3.2**：质量不错，但可能需要多次迭代

**强烈建议**：优先使用 Gemini 2.0 Flash（免费且强大）！

## 💡 最佳实践

### 1. 成本优化策略（2025最新）

```
🌟 首选方案（强烈推荐）
Gemini 2.0 Flash → 免费且强大
↓
遇到限制？
Gemini 1.5 Flash → 超低成本
↓
追求极致？
Gemini 1.5 Pro → 高质量低成本
↓
需要OpenAI？
GPT-4o Mini → OpenAI入门
↓
复杂任务？
GPT-4o / GPT-4 Turbo → OpenAI高级
```

**建议**：95%的场景用 Gemini 2.0 Flash 就够了！

### 2. 速率限制管理

如果经常遇到速率限制：

1. **升级到付费账户**
2. **添加请求间隔**：不要连续多次点击优化
3. **使用本地模型**：作为备选方案
4. **合并优化需求**：一次性提供完整信息

### 3. 模型选择决策树（2025更新）

```
有 Gemini API？
  ├─ 是 → Gemini 2.0 Flash ✅✅✅ 【强烈推荐】
  └─ 否 ↓

需要最高质量？
  ├─ 是 → Gemini 1.5 Pro 或 GPT-4
  └─ 否 ↓

追求性价比？
  ├─ 是 → Gemini 1.5 Flash（仅GPT的1/5成本）
  └─ 否 ↓

只有OpenAI账户？
  ├─ 是 → GPT-4o Mini 或 GPT-3.5 Turbo
  └─ 否 ↓

关注隐私？
  └─ 是 → Llama 3.2（本地）
```

**新手建议**：先配置 Gemini（5分钟），体验免费的强大AI！

## 🔧 技术细节

### 模型配置文件

所有模型配置在 `src/ai/aiConfig.js` 中定义：

```javascript
import { getModelConfig, getSavedModel, saveModelPreference } from '@/ai/aiConfig'

// 获取当前选择的模型
const model = getSavedModel()

// 获取模型详细配置
const config = getModelConfig(model)

// 保存模型选择
saveModelPreference('gpt-4o')
```

### 在代码中使用

```javascript
import { optimizeResume } from '@/ai/useResumeOptimizer'

// 使用指定模型优化简历
const result = await optimizeResume(jobRequirement, resumeData, {
  model: 'gpt-4o-mini', // 指定模型
  lang: 'zh',
})
```

### 错误处理

系统会自动检测速率限制错误并提供友好提示：

```javascript
if (error.message.includes('Rate limit')) {
  // 显示建议：
  // 1. 等待重试
  // 2. 切换付费模型
  // 3. 使用本地模型
}
```

## 📈 成本估算

### 典型简历优化（约2000 tokens输入，1000 tokens输出）

| 模型             | 单次成本 | 100次成本 | 备注          |
| ---------------- | -------- | --------- | ------------- |
| Gemini 2.0 Flash | $0       | $0        | 免费！⭐⭐⭐  |
| Gemini 1.5 Flash | $0.0005  | $0.05     | 最低成本 ⭐⭐ |
| Gemini 1.5 Pro   | $0.0075  | $0.75     | 高性价比 ⭐⭐ |
| GPT-4o Mini      | $0.0009  | $0.09     | OpenAI入门    |
| GPT-3.5 Turbo    | $0.0025  | $0.25     | OpenAI经济    |
| GPT-4o           | $0.015   | $1.50     | OpenAI平衡    |
| GPT-4 Turbo      | $0.05    | $5.00     | OpenAI高级    |
| GPT-4            | $0.12    | $12.00    | OpenAI旗舰    |
| Llama 3.2        | $0       | $0        | 本地免费      |

**最新结论**：Gemini 2.0 Flash 完全免费且质量优秀，应该是所有人的首选！

## 🎯 推荐配置（2025最新）

### 个人用户 ⭐ 强烈推荐

```
默认模型：Gemini 2.0 Flash（免费）
高质量：Gemini 1.5 Pro（低成本）
备用模型：Llama 3.2（本地）
```

**为什么**：完全免费，质量优秀，速度极快！

### 专业用户

```
日常优化：Gemini 2.0 Flash（免费）
重要简历：Gemini 1.5 Pro（$0.75/100次）
批量处理：Gemini 1.5 Flash（$0.05/100次）
```

**成本对比**：比 OpenAI 节省 80-90%！

### 企业用户

```
标准服务：Gemini 1.5 Flash（成本最低）
高端服务：Gemini 1.5 Pro（质量最佳）
备用选择：GPT-4o（如有OpenAI合同）
```

### OpenAI 用户（已有账户）

```
入门：GPT-4o Mini
进阶：GPT-3.5 Turbo
高级：GPT-4o
```

**建议**：即使有 OpenAI 账户，也建议配置 Gemini 作为主力！

## 🔗 相关链接

### Gemini (推荐)

- [Google AI Studio](https://aistudio.google.com/) - 获取API密钥
- [Gemini API 文档](https://ai.google.dev/docs)
- [Gemini 定价](https://ai.google.dev/pricing)
- [Gemini配置指南](./Gemini配置指南.md) 🆕

### OpenAI

- [OpenAI API文档](https://platform.openai.com/docs)
- [OpenAI定价](https://openai.com/pricing)

### 本地模型

- [Ollama官网](https://ollama.ai)

### 项目文档

- [简历优化功能说明](./AI简历优化功能总结.md)
- [简历生成器使用指南](./简历生成器使用指南.md)

## 📝 更新日志

### v2.1 (2025-10-12) 🆕

- ✅ 新增 Google Gemini 支持（3种模型）
- ✅ **Gemini 2.0 Flash 设为默认**（免费且强大）
- ✅ 创建详细的 Gemini 配置指南
- ✅ 更新成本对比和推荐配置
- ✅ 全面优化文档说明

### v2.0 (2025-10-12)

- ✅ 新增AI模型切换功能
- ✅ 支持5种OpenAI模型 + 1种本地模型
- ✅ 模型偏好自动保存
- ✅ 美观的模型选择UI
- ✅ 智能错误提示和模型推荐
- ✅ 成本估算和性能对比

---

**作者**: AI进化论-花生  
**日期**: 2025-10-12  
**版本**: 2.0
