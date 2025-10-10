# AI 简历生成模块

> 基于系统级 Prompt 的智能简历生成系统

## 📁 目录结构

```
src/ai/
├── README.md                        ← 本文件
├── useAIResumeGenerator.js          ← 核心模块（AI 调用逻辑）
└── systemPrompts/
    └── resumeSystemPrompt.js        ← 系统 Prompt 模板
```

## 🎯 设计理念

### 为什么需要系统级 Prompt？

传统的 AI 调用方式通常将 Prompt 直接写在业务代码中，这会导致：
- ❌ Prompt 难以维护和优化
- ❌ 业务逻辑与 AI 指令耦合
- ❌ 缺乏统一的风格和规范
- ❌ 难以支持多语言和多场景

**我们的解决方案：**
- ✅ **系统 Prompt**：定义 AI 的身份、目标和行为规范（灵魂）
- ✅ **用户 Prompt**：提供具体的任务指令和数据（命令）
- ✅ **分离关注点**：业务代码只负责调用，不关心 Prompt 细节
- ✅ **易于扩展**：支持多语言、多模式、多模型

## 🚀 快速开始

### 基础用法

```javascript
import { generateSmartResume } from '@/ai/useAIResumeGenerator'

// 调用 AI 生成简历
const result = await generateSmartResume('摄影师', resumeData, {
  model: 'openai', // 或 'ollama'
  lang: 'zh'       // 或 'en'
})

console.log(result)
// {
//   summary: "个性化简介...",
//   highlightedSkills: ["技能1", "技能2", ...],
//   recommendations: ["建议1", "建议2", ...]
// }
```

### 完整用法

```javascript
import { generateAIResume } from '@/ai/useAIResumeGenerator'

const result = await generateAIResume('前端开发工程师', resumeData, {
  model: 'openai',      // AI 模型：'openai' | 'ollama'
  lang: 'zh',           // 语言：'zh' | 'en'
  promptMode: 'full',   // Prompt 模式：'full' | 'simple'
  detailed: true        // 是否生成详细版本
})

// 返回完整的简历数据
console.log(result)
```

## 📝 API 文档

### `generateSmartResume(jobTitle, resumeData, options)`

快速生成简历（简化接口，兼容旧版 useAI.js）

**参数：**
- `jobTitle` (string) - 目标岗位，如 "摄影师"、"前端开发工程师"
- `resumeData` (object) - 用户的简历数据
- `options` (object) - 可选配置
  - `model` (string) - AI 模型：'openai' | 'ollama'，默认 'openai'
  - `lang` (string) - 语言：'zh' | 'en'，默认 'zh'

**返回：**
```javascript
{
  summary: string,           // 个人简介
  highlightedSkills: Array,  // 核心技能列表
  recommendations: Array     // 优化建议列表
}
```

---

### `generateAIResume(jobTitle, resumeData, options)`

完整的 AI 简历生成（支持更多配置）

**参数：**
- `jobTitle` (string) - 目标岗位
- `resumeData` (object) - 简历数据
- `options` (object) - 配置选项
  - `model` (string) - AI 模型，默认 'openai'
  - `lang` (string) - 语言，默认 'zh'
  - `promptMode` (string) - Prompt 模式：'full' | 'simple'，默认 'full'
  - `detailed` (boolean) - 是否生成详细版本，默认 true

**返回：**
```javascript
{
  summary: string,
  highlightedSkills: Array,
  experience: Array,       // 工作经历（如果有）
  projects: Array,         // 项目经验（如果有）
  education: Array,        // 教育背景（如果有）
  awards: Array,           // 获奖荣誉（如果有）
  recommendations: Array
}
```

---

### `buildUserPrompt(jobTitle, resumeData, options)`

构建用户 Prompt（高级用法）

**参数：**
- `jobTitle` (string) - 目标岗位
- `resumeData` (object) - 简历数据
- `options` (object) - 配置选项
  - `lang` (string) - 语言
  - `detailed` (boolean) - 是否生成详细 Prompt

**返回：**
- (string) 构建好的用户 Prompt 文本

---

### `getSystemPrompt(lang, mode)`

获取系统 Prompt（高级用法）

**参数：**
- `lang` (string) - 语言：'zh' | 'en'
- `mode` (string) - 模式：'full' | 'simple'

**返回：**
- (string) 对应的系统 Prompt 文本

## 🎨 在组件中使用

### 方式 1：直接替换（推荐）

在 `ResumeGenerator.vue` 中：

```javascript
// 旧版导入
// import { generateSmartResume } from '@/composables/useAI'

// 新版导入（兼容旧接口）
import { generateSmartResume } from '@/ai/useAIResumeGenerator'

// 使用方式完全相同，无需修改其他代码
const handleAIOptimize = async () => {
  const result = await generateSmartResume(jobInput.value, resumeStore.resumeData, {
    model: 'openai'
  })
  // ... 处理结果
}
```

### 方式 2：使用完整接口

```javascript
import { generateAIResume } from '@/ai/useAIResumeGenerator'

const handleAIOptimize = async () => {
  const result = await generateAIResume(jobInput.value, resumeStore.resumeData, {
    model: 'openai',
    lang: 'zh',
    promptMode: 'full',
    detailed: true
  })
  
  // 处理更丰富的返回数据
  if (result.summary) {
    resumeStore.resumeData.summary = result.summary
  }
  
  if (result.experience && result.experience.length > 0) {
    resumeStore.resumeData.experience = result.experience
  }
  
  // ... 其他处理
}
```

## 🔧 配置说明

### OpenAI 模型

在项目根目录创建 `.env` 文件：

```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Ollama 本地模型

1. 安装 Ollama
2. 下载模型：
   ```bash
   ollama pull llama3.2
   ```
3. 确保服务运行在 `http://localhost:11434`
4. 使用时指定 model: 'ollama'

## 📚 系统 Prompt 说明

系统 Prompt 定义了 AI 的：

1. **身份定位**
   - 个人品牌助理 AI
   - 服务于 Miles Walker（摄影师兼创作者）

2. **核心目标**
   - 提取和整理个人资料
   - 结构化输出简历内容
   - 岗位定制化优化
   - 保证内容真实性

3. **风格指导**
   - 📸 摄影类：强调光影叙事、情绪表达
   - 🎨 设计类：突出视觉语言、用户体验
   - 💻 技术类：展现技术栈、问题解决能力
   - 📊 管理类：体现组织协调、团队协作

4. **输出规范**
   - 严格的 JSON 格式
   - 必需字段验证
   - 语言本地化支持

## 🎯 自定义 Prompt

### 修改系统 Prompt

编辑 `src/ai/systemPrompts/resumeSystemPrompt.js`：

```javascript
export const resumeSystemPrompt = `
你是...（自定义身份）

任务：...（自定义任务）

风格：...（自定义风格）
`
```

### 添加新的 Prompt 模板

```javascript
export const customPrompt = `
...你的自定义 Prompt...
`

export const resumeSystemPrompts = {
  zh: resumeSystemPrompt,
  en: resumeSystemPromptEN,
  custom: customPrompt,  // 新增
}
```

## 🧪 调试和测试

### 查看 Prompt

```javascript
import { buildUserPrompt, getSystemPrompt } from '@/ai/useAIResumeGenerator'

const systemPrompt = getSystemPrompt('zh', 'full')
const userPrompt = buildUserPrompt('摄影师', resumeData)

console.log('System Prompt:', systemPrompt)
console.log('User Prompt:', userPrompt)
```

### 测试不同配置

```javascript
// 简洁模式
const result1 = await generateAIResume(jobTitle, resumeData, {
  promptMode: 'simple'
})

// 英文版本
const result2 = await generateAIResume(jobTitle, resumeData, {
  lang: 'en'
})

// Ollama 本地
const result3 = await generateAIResume(jobTitle, resumeData, {
  model: 'ollama'
})
```

## 💡 最佳实践

### 1. 选择合适的模式

- **Full Mode（完整模式）**：适合需要详细优化的场景
- **Simple Mode（简洁模式）**：适合快速生成或 token 限制场景

### 2. 处理错误

```javascript
try {
  const result = await generateSmartResume(jobTitle, resumeData, options)
  // 处理成功结果
} catch (error) {
  if (error.message.includes('API Key')) {
    // 处理 API Key 错误
  } else if (error.message.includes('Ollama')) {
    // 处理 Ollama 错误
  } else {
    // 处理其他错误
  }
}
```

### 3. 优化性能

```javascript
// 避免频繁调用，使用防抖
import { debounce } from 'lodash'

const debouncedGenerate = debounce(async () => {
  await generateSmartResume(...)
}, 1000)
```

### 4. 缓存结果

```javascript
const cache = new Map()

async function getCachedResult(jobTitle, resumeData) {
  const key = `${jobTitle}-${JSON.stringify(resumeData)}`
  
  if (cache.has(key)) {
    return cache.get(key)
  }
  
  const result = await generateSmartResume(jobTitle, resumeData)
  cache.set(key, result)
  return result
}
```

## 🔄 迁移指南

### 从旧版 useAI.js 迁移

**步骤 1：** 更新导入语句

```javascript
// 旧版
// import { generateSmartResume } from '@/composables/useAI'

// 新版
import { generateSmartResume } from '@/ai/useAIResumeGenerator'
```

**步骤 2：** 无需修改其他代码

新版 `generateSmartResume` 完全兼容旧版接口，参数和返回值一致。

**步骤 3：**（可选）使用新功能

```javascript
// 使用新的配置选项
const result = await generateSmartResume(jobTitle, resumeData, {
  model: 'openai',
  lang: 'zh',           // 新增：语言选项
  promptMode: 'full'    // 新增：Prompt 模式
})
```

## 🐛 常见问题

### Q1: 为什么需要单独的 Prompt 文件？

**A:** 分离 Prompt 可以：
- 更容易维护和优化 AI 指令
- 支持多语言和多场景
- 便于团队协作和版本控制
- 提高代码可读性

### Q2: 如何切换 AI 模型？

**A:** 通过 `model` 参数：

```javascript
// OpenAI
await generateSmartResume(jobTitle, data, { model: 'openai' })

// Ollama
await generateSmartResume(jobTitle, data, { model: 'ollama' })
```

### Q3: 如何添加新的岗位类型？

**A:** 编辑 `resumeSystemPrompt.js`，在"风格指导"部分添加：

```javascript
#### 🎬 **新岗位类型**（岗位描述）
- **强调**：关键能力
- **关键词**：相关术语
- **风格**：表达方式
- **示例简介**：_"示例文本"_
```

## 📖 相关文档

- [AI 简历优化功能使用指南](../../docs/AI简历优化功能使用指南.md)
- [简历生成器 v2.3 更新日志](../../docs/简历生成器v2.3更新日志.md)
- [AI 功能快速参考](../../docs/commands/AI功能快速参考.md)

---

**最后更新：** 2025-01-09  
**维护者：** AI进化论-花生

