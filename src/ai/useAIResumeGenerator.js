/**
 * useAIResumeGenerator.js
 * AI 简历生成核心模块
 * 
 * 功能：
 * - 构建用户级 Prompt
 * - 调用 AI API 生成简历
 * - 支持多模型切换（OpenAI / Ollama）
 * - 统一的错误处理
 * 
 * @author AI进化论-花生
 * @date 2025-01-09
 */

import { resumeSystemPrompt, getSystemPrompt } from './systemPrompts/resumeSystemPrompt.js'

/**
 * 构建用户级 Prompt（命令指令）
 * 
 * @param {string} jobTitle - 目标岗位（如 "摄影师"、"前端开发工程师"）
 * @param {Object} resumeData - 用户的原始简历数据
 * @param {Object} options - 配置选项
 * @param {string} options.lang - 语言 ('zh' | 'en')
 * @param {boolean} options.detailed - 是否生成详细版本
 * @returns {string} 用户 Prompt
 */
export function buildUserPrompt(jobTitle, resumeData, options = {}) {
  const { lang = 'zh', detailed = true } = options

  // 基础 Prompt
  let prompt = `
# 用户指令

**目标岗位**：${jobTitle}
**输出语言**：${lang === 'zh' ? '中文（简体）' : 'English'}

## 原始简历数据

${JSON.stringify(resumeData, null, 2)}

---

## 优化要求

请根据以上岗位和数据，生成优化后的简历内容。
`

  // 详细模式：添加更多指导
  if (detailed) {
    prompt += `
### 重点优化方向

1. **个人简介（summary）**
   - 针对 "${jobTitle}" 岗位定制
   - 突出最相关的经验和优势
   - 长度控制在 150-200 字
   - 语气自然、专业、有温度

2. **核心技能（highlightedSkills）**
   - 提取与 "${jobTitle}" 最相关的 3-5 个技能
   - 优先级从高到低排序
   - 删除不相关的技能

3. **优化建议（recommendations）**
   - 提供 3-5 条具体可行的改进建议
   - 针对目标岗位的特定要求
   - 帮助用户提升简历竞争力

### 输出格式

必须返回合法的 JSON 格式，包含以下字段：
- \`summary\` (string): 个人简介
- \`highlightedSkills\` (array): 核心技能列表
- \`recommendations\` (array): 优化建议列表

**重要**：只返回 JSON 数据，不要包含任何额外的说明文字。
`
  } else {
    // 简洁模式
    prompt += `
请输出 JSON 格式，包含：summary、highlightedSkills、recommendations

只返回 JSON，不要其他内容。
`
  }

  return prompt
}

/**
 * AI 简历生成（通用接口）
 * 
 * 支持多种 AI 模型：
 * - OpenAI (gpt-4o-mini, gpt-4o)
 * - Ollama (llama3.2, mistral)
 * 
 * @param {string} jobTitle - 目标岗位
 * @param {Object} resumeData - 简历数据
 * @param {Object} options - 配置选项
 * @param {string} options.model - AI 模型 ('openai' | 'ollama')
 * @param {string} options.lang - 语言 ('zh' | 'en')
 * @param {string} options.promptMode - Prompt 模式 ('full' | 'simple')
 * @returns {Promise<Object>} 优化后的简历数据
 */
export async function generateAIResume(jobTitle, resumeData, options = {}) {
  const {
    model = 'openai',
    lang = 'zh',
    promptMode = 'full',
    detailed = true,
  } = options

  console.log('🤖 开始生成 AI 简历...')
  console.log('目标岗位:', jobTitle)
  console.log('使用模型:', model)
  console.log('语言:', lang)

  try {
    // 构建 Prompt
    const systemPrompt = getSystemPrompt(lang, promptMode)
    const userPrompt = buildUserPrompt(jobTitle, resumeData, { lang, detailed })

    console.log('📝 System Prompt 长度:', systemPrompt.length, '字符')
    console.log('📝 User Prompt 长度:', userPrompt.length, '字符')

    // 调用对应的 AI 模型
    let result
    if (model === 'openai') {
      result = await callOpenAI(systemPrompt, userPrompt)
    } else if (model === 'ollama') {
      result = await callOllama(systemPrompt, userPrompt)
    } else {
      throw new Error(`不支持的模型类型: ${model}`)
    }

    console.log('✅ AI 简历生成成功')
    console.log('生成结果:', result)

    // 验证返回结果
    validateResult(result)

    return result
  } catch (error) {
    console.error('❌ AI 简历生成失败:', error)
    throw error
  }
}

/**
 * 调用 OpenAI API
 * 
 * @param {string} systemPrompt - 系统 Prompt
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} AI 生成结果
 */
async function callOpenAI(systemPrompt, userPrompt) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('未配置 VITE_OPENAI_API_KEY')
  }

  console.log('📡 正在调用 OpenAI API...')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
    throw new Error(`OpenAI API 调用失败: ${errorMessage}`)
  }

  const data = await response.json()

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('OpenAI 返回的数据格式无效')
  }

  const content = data.choices[0].message.content

  try {
    return JSON.parse(content)
  } catch (error) {
    console.error('JSON 解析失败，原始内容:', content)
    throw new Error('无法解析 AI 返回的 JSON 数据')
  }
}

/**
 * 调用 Ollama 本地模型
 * 
 * @param {string} systemPrompt - 系统 Prompt
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} AI 生成结果
 */
async function callOllama(systemPrompt, userPrompt) {
  console.log('📡 正在调用 Ollama API...')

  const combinedPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: combinedPrompt,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error('Ollama 服务未启动或模型错误。请确保 Ollama 正在运行并已安装模型。')
  }

  const data = await response.json()
  const text = data.response || data.output || ''

  if (!text) {
    throw new Error('Ollama 返回的内容为空')
  }

  // 尝试解析 JSON
  try {
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleanText)
  } catch (error) {
    console.warn('Ollama 返回的不是标准 JSON，尝试智能解析...', text)
    return {
      summary: text.trim(),
      highlightedSkills: [],
      recommendations: ['请手动调整简历内容以适配目标岗位'],
    }
  }
}

/**
 * 验证 AI 返回结果的格式
 * 
 * @param {Object} result - AI 返回结果
 * @throws {Error} 如果格式不符合要求
 */
function validateResult(result) {
  if (!result || typeof result !== 'object') {
    throw new Error('AI 返回的结果格式无效：不是对象')
  }

  // 必需字段检查
  const requiredFields = ['summary', 'highlightedSkills', 'recommendations']
  const missingFields = requiredFields.filter(field => !(field in result))

  if (missingFields.length > 0) {
    console.warn(`⚠️ 缺少字段: ${missingFields.join(', ')}，将使用默认值`)
  }

  // 类型检查
  if (result.summary && typeof result.summary !== 'string') {
    throw new Error('summary 字段必须是字符串')
  }

  if (result.highlightedSkills && !Array.isArray(result.highlightedSkills)) {
    throw new Error('highlightedSkills 字段必须是数组')
  }

  if (result.recommendations && !Array.isArray(result.recommendations)) {
    throw new Error('recommendations 字段必须是数组')
  }
}

/**
 * 快速生成简历（简化接口）
 * 仅返回核心字段，兼容现有 useAI.js
 * 
 * @param {string} jobTitle - 目标岗位
 * @param {Object} resumeData - 简历数据
 * @param {Object} options - 配置选项
 * @returns {Promise<Object>} { summary, highlightedSkills, recommendations }
 */
export async function generateSmartResume(jobTitle, resumeData, options = {}) {
  const result = await generateAIResume(jobTitle, resumeData, options)

  // 确保返回格式一致
  return {
    summary: result.summary || '',
    highlightedSkills: result.highlightedSkills || [],
    recommendations: result.recommendations || [],
  }
}

/**
 * 导出默认函数（向后兼容）
 */
export default generateAIResume

