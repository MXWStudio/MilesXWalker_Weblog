# AI 功能快速参考

## 🚀 一键测试

```bash
# 1. 配置 API Key
echo "VITE_OPENAI_API_KEY=sk-your-key-here" > .env

# 2. 重启服务
npm run dev

# 3. 打开浏览器
# http://localhost:5173
# 导航到简历生成器页面
```

## 📋 代码快速调用示例

### 基本用法

```javascript
import { generateSmartResume } from '@/composables/useAI'
import { useResumeStore } from '@/stores/resumeStore'

const store = useResumeStore()
const jobInput = ref('摄影师')

// AI 优化简历
const aiResult = await generateSmartResume(jobInput.value, store.resumeData, {
  model: 'openai', // 或 'ollama'
})

console.log('AI生成结果：', aiResult)
```

### 完整流程示例

```javascript
// 1. 先从本站获取信息
await handleFetchFromCurrentSite()

// 2. 等待数据加载完成后使用 AI 优化
const jobInput = '前端开发工程师'
const aiData = await generateSmartResume(jobInput, store.resumeData, {
  model: 'openai',
})

// 3. 处理 AI 返回结果
if (aiData.summary) {
  store.resumeData.summary = aiData.summary
}

if (aiData.highlightedSkills.length > 0) {
  aiData.highlightedSkills.forEach(skill => {
    store.addSkill(skill)
  })
}

console.log('优化建议:', aiData.recommendations)
```

## 🔧 API 接口

### `generateSmartResume(jobInput, resumeData, options)`

**参数：**

- `jobInput` (string) - 目标岗位，如 "前端开发工程师"
- `resumeData` (object) - 简历数据对象
- `options` (object) - 配置选项
  - `model` (string) - AI 模型：'openai' 或 'ollama'

**返回：**

```javascript
{
  summary: string,           // 个性化简介
  highlightedSkills: Array,  // 推荐技能列表
  recommendations: Array     // 优化建议列表
}
```

## 💡 输出示例

### 摄影师岗位

```json
{
  "summary": "拥有丰富摄影与视觉创作经验的创作者，擅长光线叙事与自然主题表达。",
  "highlightedSkills": ["摄影构图", "色彩后期", "独立创作", "项目管理"],
  "recommendations": ["可在简历中增加代表作品的链接", "强调旅行拍摄与品牌视觉设计能力"]
}
```

### 前端开发岗位

```json
{
  "summary": "精通 Vue.js 和现代前端技术栈，具有丰富的项目开发经验。",
  "highlightedSkills": ["Vue 3", "TypeScript", "Tailwind CSS", "组件设计"],
  "recommendations": [
    "突出大型项目经验和团队协作能力",
    "添加开源贡献和技术博客链接",
    "强调性能优化和用户体验设计经验"
  ]
}
```

## 🔍 控制台输出

```javascript
// 开始
🚀 开始 AI 简历优化...
目标岗位: 摄影师
当前简历数据: { ... }

// 调用 API
🤖 使用 openai 模型生成简历...
📡 正在调用 OpenAI API...

// 成功
✅ AI 简历生成成功
✅ AI 生成结果: { ... }
📝 AI 生成的简介: ...
💡 AI 推荐的技能: [...]
📋 AI 优化建议: [...]
✨ 已更新简介
✨ 已添加新技能: [...]
```

## ⚠️ 错误处理

```javascript
try {
  const aiResult = await generateSmartResume(jobInput, resumeData, { model: 'openai' })
  // 处理结果
} catch (error) {
  if (error.message.includes('VITE_OPENAI_API_KEY')) {
    console.error('未配置 API Key')
  } else if (error.message.includes('Ollama')) {
    console.error('Ollama 服务未启动')
  } else {
    console.error('AI 优化失败:', error.message)
  }
}
```

## 🎯 快速测试步骤

1. ✅ **导入信息** → 点击 "📥 从本站获取信息"
2. ✅ **选择岗位** → 输入或快速选择岗位
3. ✅ **AI 优化** → 点击 "🚀 AI 优化简历"
4. ✅ **查看结果** → 确认简介、技能、建议

## 🔑 配置检查清单

- [ ] `.env` 文件存在于项目根目录
- [ ] `VITE_OPENAI_API_KEY` 已配置
- [ ] 开发服务器已重启
- [ ] 浏览器控制台已打开（查看日志）

## 📦 模型切换

### OpenAI（默认）

```javascript
{
  model: 'openai'
} // 使用 gpt-4o-mini
```

### Ollama（本地）

```javascript
{
  model: 'ollama'
} // 使用 llama3.2
```

## 🎨 UI 状态

| 状态   | 按钮文本         | 按钮状态        |
| ------ | ---------------- | --------------- |
| 待机   | "🚀 AI 优化简历" | 可点击          |
| 处理中 | "AI 优化中..."   | 禁用 + 加载动画 |
| 完成   | "🚀 AI 优化简历" | 可点击          |

## 🔗 相关文档

- [详细使用指南](../AI简历优化功能使用指南.md)
- [完整测试清单](../AI简历优化功能测试.md)
- [简历生成器快速参考](./简历生成器快速参考.md)

---

快速创建时间：2025-01-09
