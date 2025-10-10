# AI 模块使用示例

> 在 ResumeGenerator.vue 中使用新的 AI 模块

## 📝 完整示例

### 方案 1：无缝迁移（推荐）

**优点：** 无需修改现有代码，只需更换导入语句

```vue
<script setup>
import { ref } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'

// 🔄 只需更改这一行
// 旧版：import { generateSmartResume } from '@/composables/useAI'
// 新版：
import { generateSmartResume } from '@/ai/useAIResumeGenerator'

const resumeStore = useResumeStore()
const jobInput = ref('')
const aiOptimizing = ref(false)
const aiOptimizationResult = ref('')

/**
 * AI 优化简历
 */
const handleAIOptimize = async () => {
  if (!jobInput.value.trim()) {
    alert('请先输入目标岗位')
    return
  }

  aiOptimizing.value = true
  aiOptimizationResult.value = ''

  try {
    console.log('🚀 开始 AI 简历优化...')

    // ✅ 调用方式完全相同，无需修改
    const aiResult = await generateSmartResume(jobInput.value, resumeStore.resumeData, {
      model: 'openai', // 或 'ollama'
    })

    console.log('✅ AI 生成结果:', aiResult)

    // 处理简介
    if (aiResult.summary) {
      if (!resumeStore.resumeData.summary || confirm('AI 已生成新的个人简介，是否替换当前简介？')) {
        resumeStore.resumeData.summary = aiResult.summary
        console.log('✨ 已更新简介')
      }
    }

    // 处理技能推荐
    if (aiResult.highlightedSkills && aiResult.highlightedSkills.length > 0) {
      const newSkills = aiResult.highlightedSkills.filter(
        skill => !resumeStore.resumeData.skills.includes(skill)
      )
      if (newSkills.length > 0) {
        if (confirm(`AI 推荐添加以下技能：\n${newSkills.join(', ')}\n\n是否添加到简历？`)) {
          newSkills.forEach(skill => resumeStore.addSkill(skill))
          console.log('✨ 已添加新技能:', newSkills)
        }
      }
    }

    // 显示优化建议
    const suggestions = [
      `✅ AI 优化完成！目标岗位："${jobInput.value}"`,
      aiResult.summary ? '✨ 已生成个性化简介' : '',
      aiResult.highlightedSkills?.length > 0
        ? `💡 推荐技能：${aiResult.highlightedSkills.join(', ')}`
        : '',
      '',
      '📋 优化建议：',
      ...(aiResult.recommendations || []),
    ].filter(Boolean)

    aiOptimizationResult.value = suggestions.join('\n')

    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 10000)
  } catch (error) {
    console.error('❌ AI 优化失败:', error)
    alert('优化失败：' + error.message)
  } finally {
    aiOptimizing.value = false
  }
}
</script>
```

---

### 方案 2：使用完整接口（高级功能）

**优点：** 可以使用更多配置选项和完整的返回数据

```vue
<script setup>
import { ref } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'
import { generateAIResume } from '@/ai/useAIResumeGenerator'

const resumeStore = useResumeStore()
const jobInput = ref('')
const aiOptimizing = ref(false)
const aiOptimizationResult = ref('')
const language = ref('zh') // 语言选择
const promptMode = ref('full') // Prompt 模式

/**
 * AI 优化简历（完整版）
 */
const handleAIOptimize = async () => {
  if (!jobInput.value.trim()) {
    alert('请先输入目标岗位')
    return
  }

  aiOptimizing.value = true
  aiOptimizationResult.value = ''

  try {
    console.log('🚀 开始 AI 简历优化...')

    // ✅ 使用完整接口，支持更多配置
    const aiResult = await generateAIResume(jobInput.value, resumeStore.resumeData, {
      model: 'openai',           // AI 模型
      lang: language.value,      // 语言选择
      promptMode: promptMode.value, // Prompt 模式
      detailed: true,            // 详细模式
    })

    console.log('✅ AI 生成结果:', aiResult)

    // 处理简介
    if (aiResult.summary) {
      resumeStore.resumeData.summary = aiResult.summary
    }

    // 处理技能
    if (aiResult.highlightedSkills) {
      const newSkills = aiResult.highlightedSkills.filter(
        skill => !resumeStore.resumeData.skills.includes(skill)
      )
      newSkills.forEach(skill => resumeStore.addSkill(skill))
    }

    // 🆕 处理工作经历（如果返回）
    if (aiResult.experience && aiResult.experience.length > 0) {
      resumeStore.resumeData.experience = aiResult.experience
      console.log('✨ 已更新工作经历')
    }

    // 🆕 处理项目经验（如果返回）
    if (aiResult.projects && aiResult.projects.length > 0) {
      resumeStore.resumeData.projects = aiResult.projects
      console.log('✨ 已更新项目经验')
    }

    // 🆕 处理教育背景（如果返回）
    if (aiResult.education && aiResult.education.length > 0) {
      resumeStore.resumeData.education = aiResult.education
      console.log('✨ 已更新教育背景')
    }

    // 显示结果
    const suggestions = [
      `✅ AI 优化完成！目标岗位："${jobInput.value}"`,
      aiResult.summary ? '✨ 已生成个性化简介' : '',
      aiResult.highlightedSkills?.length > 0 ? '💡 已优化核心技能' : '',
      aiResult.experience?.length > 0 ? '📋 已优化工作经历' : '',
      aiResult.projects?.length > 0 ? '🚀 已优化项目经验' : '',
      '',
      '📋 优化建议：',
      ...(aiResult.recommendations || []),
    ].filter(Boolean)

    aiOptimizationResult.value = suggestions.join('\n')

    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 10000)
  } catch (error) {
    console.error('❌ AI 优化失败:', error)
    alert('优化失败：' + error.message)
  } finally {
    aiOptimizing.value = false
  }
}
</script>

<template>
  <div class="ai-optimization-section">
    <!-- 语言选择 -->
    <div class="language-selector">
      <label>语言：</label>
      <select v-model="language">
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>

    <!-- Prompt 模式选择 -->
    <div class="prompt-mode-selector">
      <label>模式：</label>
      <select v-model="promptMode">
        <option value="full">完整模式</option>
        <option value="simple">简洁模式</option>
      </select>
    </div>

    <!-- 岗位输入 -->
    <div class="ai-input-group">
      <input
        v-model="jobInput"
        type="text"
        placeholder="请输入目标岗位"
        class="ai-input"
        @keyup.enter="handleAIOptimize"
      />
      <button
        class="btn-ai-optimize"
        type="button"
        :disabled="!jobInput.trim() || aiOptimizing"
        @click="handleAIOptimize"
      >
        {{ aiOptimizing ? 'AI 优化中...' : '🚀 AI 优化简历' }}
      </button>
    </div>

    <!-- 结果显示 -->
    <div v-if="aiOptimizationResult" class="ai-result">
      <p class="result-message">{{ aiOptimizationResult }}</p>
    </div>
  </div>
</template>
```

---

### 方案 3：自定义 Prompt（专家模式）

**优点：** 完全控制 AI 的行为和输出

```vue
<script setup>
import { ref } from 'vue'
import { buildUserPrompt, getSystemPrompt } from '@/ai/useAIResumeGenerator'

/**
 * 自定义 AI 调用
 */
const customAICall = async () => {
  // 1. 获取系统 Prompt
  const systemPrompt = getSystemPrompt('zh', 'full')
  console.log('System Prompt:', systemPrompt)

  // 2. 构建用户 Prompt
  const userPrompt = buildUserPrompt(jobInput.value, resumeStore.resumeData, {
    lang: 'zh',
    detailed: true,
  })
  console.log('User Prompt:', userPrompt)

  // 3. 自定义 API 调用
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8, // 🎨 自定义温度
      max_tokens: 2000, // 🎨 自定义 token 限制
      response_format: { type: 'json_object' },
    }),
  })

  const data = await response.json()
  const result = JSON.parse(data.choices[0].message.content)

  console.log('AI 生成结果:', result)
  return result
}
</script>
```

---

## 🎯 实际应用场景

### 场景 1：基础岗位优化

```javascript
// 摄影师简历优化
const result = await generateSmartResume('摄影师', resumeData, {
  model: 'openai',
})

// 输出：
// {
//   summary: "拥有丰富摄影与视觉创作经验的创作者...",
//   highlightedSkills: ["摄影构图", "色彩后期", "光线掌控"],
//   recommendations: ["添加作品集链接", "强调旅行摄影经验"]
// }
```

### 场景 2：多语言简历

```javascript
// 生成英文版简历
const result = await generateAIResume('Frontend Developer', resumeData, {
  model: 'openai',
  lang: 'en',
})

// 输出英文简历内容
```

### 场景 3：快速模式（节省 Token）

```javascript
// 使用简洁模式，减少 token 消耗
const result = await generateAIResume('UI设计师', resumeData, {
  model: 'openai',
  promptMode: 'simple',
  detailed: false,
})
```

### 场景 4：本地模型（隐私优先）

```javascript
// 使用 Ollama 本地模型，数据不离开本地
const result = await generateSmartResume('前端开发', resumeData, {
  model: 'ollama',
})
```

---

## 🔧 配置示例

### OpenAI 配置

```env
# .env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### Ollama 配置

```bash
# 安装 Ollama
brew install ollama  # macOS
# 或访问 https://ollama.ai

# 下载模型
ollama pull llama3.2

# 启动服务
ollama serve
```

---

## 🐛 错误处理

### 完整的错误处理示例

```javascript
const handleAIOptimize = async () => {
  try {
    const result = await generateSmartResume(jobInput.value, resumeStore.resumeData, {
      model: 'openai',
    })
    
    // 处理成功结果
    processResult(result)
    
  } catch (error) {
    console.error('❌ AI 优化失败:', error)

    // 根据错误类型提供不同的提示
    let errorMessage = 'AI 优化失败'

    if (error.message.includes('VITE_OPENAI_API_KEY')) {
      errorMessage = `
未配置 OpenAI API Key

请在项目根目录创建 .env 文件并添加：
VITE_OPENAI_API_KEY=your_api_key

然后重启开发服务器。
      `.trim()
    } else if (error.message.includes('Ollama')) {
      errorMessage = `
Ollama 服务未启动或模型错误

请确保：
1. Ollama 已安装
2. 模型已下载：ollama pull llama3.2
3. 服务正在运行：http://localhost:11434
      `.trim()
    } else if (error.message.includes('网络')) {
      errorMessage = '网络连接失败，请检查网络设置'
    } else if (error.message.includes('JSON')) {
      errorMessage = 'AI 返回的数据格式错误，请重试'
    }

    // 显示错误提示
    alert(errorMessage)
    
    // 显示简短错误信息
    aiOptimizationResult.value = `❌ ${error.message}`
    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 5000)
  } finally {
    aiOptimizing.value = false
  }
}
```

---

## 💡 性能优化建议

### 1. 防抖处理

```javascript
import { debounce } from 'lodash-es'

const handleAIOptimize = debounce(async () => {
  // AI 调用逻辑
}, 1000) // 1秒内只触发一次
```

### 2. 结果缓存

```javascript
const resultCache = new Map()

const getCachedResult = async (jobTitle, resumeData) => {
  const cacheKey = `${jobTitle}-${JSON.stringify(resumeData)}`
  
  if (resultCache.has(cacheKey)) {
    console.log('📦 使用缓存结果')
    return resultCache.get(cacheKey)
  }
  
  const result = await generateSmartResume(jobTitle, resumeData)
  resultCache.set(cacheKey, result)
  return result
}
```

### 3. 加载状态优化

```javascript
const aiProgress = ref(0)

const handleAIOptimize = async () => {
  aiProgress.value = 0
  
  const progressInterval = setInterval(() => {
    if (aiProgress.value < 90) {
      aiProgress.value += 10
    }
  }, 500)
  
  try {
    const result = await generateSmartResume(...)
    aiProgress.value = 100
  } finally {
    clearInterval(progressInterval)
    setTimeout(() => {
      aiProgress.value = 0
    }, 1000)
  }
}
```

---

## 📚 相关文档

- [AI 模块 README](./README.md)
- [系统 Prompt 说明](./systemPrompts/resumeSystemPrompt.js)
- [AI 功能快速参考](../../docs/commands/AI功能快速参考.md)

---

**最后更新：** 2025-01-09  
**作者：** AI进化论-花生

