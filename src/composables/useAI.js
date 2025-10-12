/**
 * useAI.js
 * 智能简历生成助手
 * 支持 OpenAI GPT-4o / Ollama Llama3
 *
 * @updated 2025-10-12 - 添加多模型切换支持
 */

import { getModelConfig, getSavedModel } from '@/ai/aiConfig'

/**
 * 生成智能简历建议
 * @param {string} jobInput - 目标岗位
 * @param {Object} resumeData - 简历数据
 * @param {Object} options - 配置选项
 * @param {string} options.model - AI 模型ID (如 'gpt-4o-mini', 'gpt-4o', 'llama3.2')
 * @returns {Promise<Object>} AI 生成的简历建议
 */
export async function generateSmartResume(jobInput, resumeData, options = {}) {
  const { model = getSavedModel() } = options

  if (!jobInput || !resumeData) {
    throw new Error('缺少必要参数：jobInput 或 resumeData')
  }

  // 获取模型配置
  const modelConfig = getModelConfig(model)

  // 公共 prompt（无论哪个模型都可通用）
  const prompt = `
你是一名智能简历生成助手。用户正在申请岗位："${jobInput}"。

请阅读以下个人信息，并输出一份JSON结果，包含：
{
  "summary": "针对岗位的个性化简介，突出相关经验和优势",
  "highlightedSkills": ["列出3-5个最相关的技能"],
  "recommendations": ["提供3-5条针对该岗位的改进建议"]
}

个人信息：
${JSON.stringify(resumeData, null, 2)}
`

  try {
    console.log(`🤖 使用 ${modelConfig.name} 模型生成简历...`)

    let result
    if (modelConfig.provider === 'openai') {
      result = await callOpenAI(prompt, model)
    } else if (modelConfig.provider === 'gemini') {
      result = await callGemini(prompt, model)
    } else if (modelConfig.provider === 'ollama') {
      result = await callOllama(prompt, model)
    } else {
      throw new Error('不支持的AI提供商: ' + modelConfig.provider)
    }

    // 验证返回结果的结构
    if (!result || typeof result !== 'object') {
      throw new Error('AI 返回的结果格式无效')
    }

    // 确保必要的字段存在
    const validatedResult = {
      summary: result.summary || '',
      highlightedSkills: Array.isArray(result.highlightedSkills) ? result.highlightedSkills : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    }

    console.log('✅ AI 简历生成成功')
    return validatedResult
  } catch (error) {
    console.error('❌ AI 生成失败:', error)
    throw error
  }
}

/**
 * 🔹 调用 OpenAI GPT-4o / GPT-4o-mini
 * @param {string} prompt - 提示词
 * @param {string} modelId - 模型ID
 */
async function callOpenAI(prompt, modelId = 'gpt-4o-mini') {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('未配置 VITE_OPENAI_API_KEY')
  }

  const modelConfig = getModelConfig(modelId)
  console.log(`📡 正在调用 OpenAI API (${modelConfig.name})...`)

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的职业简历生成AI助手。请始终以JSON格式返回结果，包含summary、highlightedSkills和recommendations三个字段。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const errorMessage = errorData.error?.message || `HTTP ${res.status}: ${res.statusText}`

    // 提供更友好的错误信息
    let friendlyMessage = `OpenAI API 调用失败: ${errorMessage}`

    if (errorMessage.includes('Rate limit')) {
      friendlyMessage +=
        '\n\n💡 建议：\n1. 等待一段时间后重试\n2. 切换到付费模型（更高速率限制）\n3. 使用本地模型（无限制）'
    }

    throw new Error(friendlyMessage)
  }

  const data = await res.json()

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
 * 🔹 调用 Google Gemini
 * @param {string} prompt - 提示词
 * @param {string} modelId - 模型ID
 */
async function callGemini(prompt, modelId = 'gemini-2.0-flash') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      '未配置 VITE_GEMINI_API_KEY\n\n请在 .env 文件中添加：\nVITE_GEMINI_API_KEY=your_api_key'
    )
  }

  const modelConfig = getModelConfig(modelId)
  console.log(`📡 正在调用 Google Gemini API (${modelConfig.name})...`)

  const enhancedPrompt = `${prompt}\n\n你是一个专业的职业简历生成AI助手。请以JSON格式返回结果，包含summary、highlightedSkills和recommendations三个字段。`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    }
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const errorMessage = errorData.error?.message || `HTTP ${res.status}: ${res.statusText}`

    // 提供更友好的错误信息
    let friendlyMessage = `Gemini API 调用失败: ${errorMessage}`

    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      friendlyMessage += '\n\n💡 建议：\n1. 等待一段时间后重试\n2. 检查 API 配额\n3. 切换到其他模型'
    }

    throw new Error(friendlyMessage)
  }

  const data = await res.json()

  // Gemini API 返回格式
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Gemini 返回的数据格式无效')
  }

  const text = data.candidates[0].content.parts[0].text

  try {
    // 尝试提取JSON
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(cleanText)
  } catch (error) {
    console.warn('Gemini 返回的不是标准 JSON，尝试智能解析...', text)
    // 如果不是标准 JSON，返回简化的结果
    return {
      summary: text.trim(),
      highlightedSkills: [],
      recommendations: ['请手动调整简历内容以适配目标岗位'],
    }
  }
}

/**
 * 🔹 调用本地 Ollama 模型（如 Llama3 / Mistral）
 * @param {string} prompt - 提示词
 * @param {string} modelId - 模型ID
 */
async function callOllama(prompt, modelId = 'llama3.2') {
  const modelConfig = getModelConfig(modelId)
  console.log(`📡 正在调用 Ollama API (${modelConfig.name})...`)

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelId,
      prompt,
      stream: false, // 禁用流式响应以获取完整结果
    }),
  })

  if (!res.ok) {
    throw new Error(
      `Ollama 服务未启动或模型 ${modelId} 不可用\n\n` +
        `请确保：\n` +
        `1. Ollama 已安装并运行\n` +
        `2. 已下载模型：ollama pull ${modelId}`
    )
  }

  const data = await res.json()
  const text = data.response || data.output || ''

  if (!text) {
    throw new Error('Ollama 返回的内容为空')
  }

  // 尝试解析 JSON
  try {
    // 移除可能的代码块标记
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(cleanText)
  } catch (error) {
    console.warn('Ollama 返回的不是标准 JSON，尝试智能解析...', text)
    // 如果不是标准 JSON，返回简化的结果
    return {
      summary: text.trim(),
      highlightedSkills: [],
      recommendations: ['请手动调整简历内容以适配目标岗位'],
    }
  }
}
