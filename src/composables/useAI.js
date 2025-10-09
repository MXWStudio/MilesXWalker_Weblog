/**
 * useAI.js
 * 智能简历生成助手
 * 支持 OpenAI GPT-4o / Ollama Llama3
 */

export async function generateSmartResume(jobInput, resumeData, options = {}) {
    const { model = 'openai' } = options
  
    if (!jobInput || !resumeData) {
      throw new Error('缺少必要参数：jobInput 或 resumeData')
    }
  
    // 公共 prompt（无论哪个模型都可通用）
    const prompt = `
  你是一名智能简历生成助手。用户正在申请岗位：“${jobInput}”。
  
  请阅读以下个人信息，并输出一份JSON结果，包含：
  {
    "summary": "针对岗位的个性化简介",
    "highlightedSkills": ["列出最相关技能"],
    "recommendations": ["针对该岗位的改进建议"]
  }
  
  个人信息：
  ${JSON.stringify(resumeData, null, 2)}
  `
  
    try {
      if (model === 'openai') {
        return await callOpenAI(prompt)
      } else if (model === 'ollama') {
        return await callOllama(prompt)
      } else {
        throw new Error('不支持的模型类型: ' + model)
      }
    } catch (error) {
      console.error('AI 生成失败:', error)
      throw error
    }
  }
  
  /**
   * 🔹 调用 OpenAI GPT-4o / GPT-4o-mini
   */
  async function callOpenAI(prompt) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) throw new Error('未配置 VITE_OPENAI_API_KEY')
  
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: '你是一个职业简历生成AI助手。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    })
  
    const data = await res.json()
    return JSON.parse(data.choices[0].message.content)
  }
  
  /**
   * 🔹 调用本地 Ollama 模型（如 Llama3 / Mistral）
   */
  async function callOllama(prompt) {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2', // 也可换成 'mistral'
        prompt
      })
    })
  
    if (!res.ok) throw new Error('Ollama 服务未启动或模型错误')
  
    const data = await res.json()
    // Ollama 返回的是逐行流式数据，这里取第一段文本
    const text = data.response || data.output || ''
    // 简单解析JSON（如果不是标准JSON则返回纯文本）
    try {
      return JSON.parse(text)
    } catch {
      return { summary: text.trim(), highlightedSkills: [], recommendations: [] }
    }
  }