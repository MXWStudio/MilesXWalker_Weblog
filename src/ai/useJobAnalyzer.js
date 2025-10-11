/**
 * 分析招聘岗位文本，提取关键信息
 *
 * @param {string} jobText - 从OCR识别出的招聘信息文本
 * @returns {Promise<Object>} 岗位分析结果
 * @returns {string} result.company - 公司名称
 * @returns {string} result.position - 岗位名称
 * @returns {Array<string>} result.requirements - 岗位要求列表
 * @returns {Array<string>} result.responsibilities - 工作职责列表
 * @returns {Array<string>} result.keywords - 关键词列表
 */
/**
 * 智能截断文本，保留关键信息
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度（默认3000字符，约2000 tokens）
 * @returns {string} 截断后的文本
 */
function smartTruncateText(text, maxLength = 3000) {
  if (text.length <= maxLength) {
    return text
  }

  console.log(`⚠️ 文本过长(${text.length}字符)，将截取前${maxLength}字符`)

  // 截取前面的内容（招聘信息通常关键信息在前面）
  const truncated = text.substring(0, maxLength)

  // 尝试在最后一个句号或换行符处截断，避免截断句子
  const lastPeriod = truncated.lastIndexOf('。')
  const lastNewline = truncated.lastIndexOf('\n')
  const cutPoint = Math.max(lastPeriod, lastNewline)

  if (cutPoint > maxLength * 0.8) {
    // 如果在后80%找到了断点，就在那里截断
    return truncated.substring(0, cutPoint + 1)
  }

  return truncated + '...'
}

export async function analyzeJobText(jobText) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('未配置 VITE_OPENAI_API_KEY')
  }

  // 智能截断文本，避免超过令牌限制
  const processedText = smartTruncateText(jobText, 3000)

  console.log('📡 正在调用 OpenAI API 分析岗位...')
  console.log(`📝 处理文本长度: ${processedText.length} 字符`)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `你是一位专业的招聘岗位分析专家。你的任务是从招聘信息文本中提取关键信息。

必须返回标准的 JSON 格式，包含以下字段：
- company: 公司名称（字符串）
- position: 岗位名称（字符串）
- requirements: 岗位要求列表（数组）
- responsibilities: 工作职责列表（数组）
- keywords: 关键技能或关键词（数组）

注意：只返回 JSON 数据，不要包含任何额外的解释文字。`,
          },
          {
            role: 'user',
            content: `请分析以下招聘信息，提取关键字段：

招聘信息：
${processedText}

请返回 JSON 格式的分析结果。`,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(`OpenAI API 调用失败: ${errorMessage}`)
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('OpenAI 返回的数据格式无效')
    }

    const content = data.choices[0].message.content

    try {
      const result = JSON.parse(content)
      console.log('✅ 岗位分析成功:', result)

      // 验证必需字段
      if (!result.position) {
        throw new Error('无法从文本中提取岗位名称')
      }

      return result
    } catch (error) {
      console.error('JSON 解析失败，原始内容:', content)
      throw new Error('无法解析 AI 返回的岗位分析数据')
    }
  } catch (error) {
    console.error('❌ 岗位分析失败:', error)
    throw error
  }
}
