export async function analyzeJobText(jobText) {
    const response = await fetch('/api/ai/analyze-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
  你是一位简历岗位分析专家，任务是从文字中提取岗位核心信息。
  输出格式为 JSON，不要包含额外文字。
  `
          },
          {
            role: 'user',
            content: `
  请分析以下招聘信息，提取以下字段：
  {
    "company": "",
    "position": "",
    "requirements": [],
    "responsibilities": [],
    "keywords": []
  }
  
  招聘信息：
  ${jobText}
  `
          }
        ]
      })
    })
    const result = await response.json()
    return result
  }