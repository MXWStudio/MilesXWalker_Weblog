/**
 * useAI.js
 * 智能简历生成助手
 * 支持 OpenAI GPT-4o / Ollama Llama3
 */

/**
 * 生成智能简历建议
 * @param {string} jobInput - 目标岗位
 * @param {Object} resumeData - 简历数据
 * @param {Object} options - 配置选项
 * @param {string} options.model - AI 模型：'openai' 或 'ollama'
 * @returns {Promise<Object>} AI 生成的简历建议
 */
export async function generateSmartResume(jobInput, resumeData, options = {}) {
  const { model = 'openai' } = options

  if (!jobInput || !resumeData) {
    throw new Error('缺少必要参数：jobInput 或 resumeData')
  }

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
    console.log(`🤖 使用 ${model} 模型生成简历...`)

    let result
    if (model === 'openai') {
      result = await callOpenAI(prompt)
    } else if (model === 'ollama') {
      result = await callOllama(prompt)
    } else {
      throw new Error('不支持的模型类型: ' + model)
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
 */
async function callOpenAI(prompt) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('未配置 VITE_OPENAI_API_KEY')
  }

  console.log('📡 正在调用 OpenAI API...')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
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
    throw new Error(`OpenAI API 调用失败: ${errorMessage}`)
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
 * 🔹 调用本地 Ollama 模型（如 Llama3 / Mistral）
 */
async function callOllama(prompt) {
  console.log('📡 正在调用 Ollama API...')

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2', // 也可换成 'mistral'
      prompt,
      stream: false, // 禁用流式响应以获取完整结果
    }),
  })

  if (!res.ok) {
    throw new Error('Ollama 服务未启动或模型错误。请确保 Ollama 正在运行并已安装模型。')
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
