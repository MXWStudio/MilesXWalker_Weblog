/**
 * useFeedbackAnalyzer.js
 * 用户反馈分析器
 * 
 * 功能：
 * - 分析用户对AI优化结果的反馈
 * - 理解用户的修改意图
 * - 基于反馈重新优化简历
 * 
 * @author AI进化论-花生
 * @date 2025-01-19
 */

import { exportProfileForAI } from '@/utils/userProfile'

/**
 * 分析用户反馈
 * 理解用户对优化结果的不满意之处
 * 
 * @param {string} feedback - 用户反馈内容
 * @param {Object} currentData - 当前优化后的数据
 * @param {Object} previousResult - 之前的优化结果
 * @returns {Promise<Object>} 分析结果
 */
export async function analyzeUserFeedback(feedback, currentData, previousResult) {
  console.log('🔍 分析用户反馈...')
  console.log('反馈内容:', feedback)

  const systemPrompt = `你是一位专业的简历优化助手。
  
现在用户对你之前的优化结果提出了反馈意见。
你的任务是仔细理解用户的反馈，提取关键问题点。

分析要点：
1. 用户认为哪些内容不符合实际？
2. 用户认为哪些表达过于夸张？
3. 用户想要保留哪些原有内容？
4. 用户的真实意图是什么？

返回JSON格式：
{
  "issues": ["问题1", "问题2"],
  "userIntent": "用户的真实意图",
  "suggestions": ["针对性改进建议"]
}
`

  const userPrompt = `
用户反馈：
${feedback}

当前优化后的数据：
个人简介：${currentData.summary}
技能列表：${currentData.skills.join(', ')}

请分析用户的反馈，理解问题所在。
`

  try {
    const result = await callOpenAI(systemPrompt, userPrompt)
    console.log('✅ 反馈分析完成:', result)
    return result
  } catch (error) {
    console.error('❌ 反馈分析失败:', error)
    throw error
  }
}

/**
 * 基于用户反馈重新优化
 * 
 * @param {Object} params - 参数对象
 * @param {string} params.jobRequirement - 岗位要求
 * @param {Object} params.currentData - 当前数据
 * @param {string} params.userFeedback - 用户反馈
 * @param {Object} params.originalResumeData - 原始简历数据
 * @param {Object} params.previousResult - 之前的优化结果
 * @returns {Promise<Object>} 重新优化的结果
 */
export async function reoptimizeWithFeedback({
  jobRequirement,
  currentData,
  userFeedback,
  originalResumeData,
  previousResult,
}) {
  console.log('🔄 基于反馈重新优化...')

  // 获取用户真实背景
  const userProfileData = exportProfileForAI()

  // 先分析用户反馈
  let feedbackAnalysis
  try {
    feedbackAnalysis = await analyzeUserFeedback(userFeedback, currentData, previousResult)
  } catch (error) {
    console.warn('反馈分析失败，继续进行重新优化')
    feedbackAnalysis = { issues: [userFeedback], userIntent: userFeedback }
  }

  const systemPrompt = buildReoptimizeSystemPrompt()
  const userPrompt = buildReoptimizeUserPrompt({
    jobRequirement,
    currentData,
    userFeedback,
    feedbackAnalysis,
    originalResumeData,
    previousResult,
    userProfileData,
  })

  try {
    const result = await callOpenAI(systemPrompt, userPrompt)
    console.log('✅ 重新优化完成:', result)
    return result
  } catch (error) {
    console.error('❌ 重新优化失败:', error)
    throw error
  }
}

/**
 * 构建重新优化的系统提示词
 */
function buildReoptimizeSystemPrompt() {
  return `你是一位专业的简历优化助手。

用户对你之前的优化结果提出了反馈意见。现在你需要基于用户的反馈重新优化。

**核心原则（比第一次更严格）**：

1. **倾听用户**：用户的反馈是最重要的，严格按照用户的要求修改
2. **真实性第一**：如果用户说"太夸张了"，那就更保守、更真实
3. **尊重原意**：如果用户想保留某些内容，必须保留
4. **不要重复错误**：避免再次犯用户指出的问题

用户反馈常见类型：
- "太夸张了" → 降低表达程度，使用更朴实的语言
- "我其实只是..." → 按照用户的真实水平来写
- "这个我不会" → 删除或降低该技能的描述
- "保留原来的..." → 保持用户想要的部分

输出格式：
返回JSON格式：
{
  "summary": "重新优化后的个人简介",
  "skills": ["重新优化后的技能列表"],
  "matchAnalysis": {
    "matchScore": 80,
    "strengths": ["真实优势"],
    "gaps": ["诚实的差距"],
    "improvements": ["改进建议"]
  },
  "recommendations": ["基于用户反馈的新建议"],
  "needsMoreInfo": ["如果还需要用户补充的信息"],
  "changesSummary": "本轮修改的总结说明"
}

**重要**：这是第二轮（或更多轮）优化，要充分考虑用户的反馈。
`
}

/**
 * 构建重新优化的用户提示词
 */
function buildReoptimizeUserPrompt({
  jobRequirement,
  currentData,
  userFeedback,
  feedbackAnalysis,
  originalResumeData,
  previousResult,
  userProfileData,
}) {
  return `
# 岗位要求
${jobRequirement}

---

# 用户真实背景信息
${userProfileData.summaryGuidance}
${userProfileData.skillsGuidance}
${userProfileData.projectsGuidance}

---

# 上一轮优化结果（用户不满意的版本）

个人简介：
${currentData.summary}

技能列表：
${currentData.skills.join(', ')}

---

# 用户反馈（重要！）

${userFeedback}

## 反馈分析：
${feedbackAnalysis.issues ? `问题点：${feedbackAnalysis.issues.join('；')}` : ''}
${feedbackAnalysis.userIntent ? `用户意图：${feedbackAnalysis.userIntent}` : ''}

---

# 原始简历数据（用户最初填写的）

个人简介：
${originalResumeData.summary || '未填写'}

技能列表：
${Array.isArray(originalResumeData.skills) ? originalResumeData.skills.join(', ') : originalResumeData.skills || '未填写'}

---

# 重新优化任务

请基于用户的反馈重新优化简历。

**关键要求**：
1. 认真理解用户的反馈，不要再犯同样的错误
2. 如果用户说"太夸张"，就降低表达程度
3. 如果用户说"我只是自学"，就诚实地体现这一点
4. 保持真实性，不要为了提高匹配度而虚构信息
5. 在changesSummary中说明本轮做了哪些调整

请返回JSON格式的优化结果。
`
}

/**
 * 调用OpenAI API
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
    return JSON.parse(content)
  } catch (error) {
    console.error('JSON 解析失败，原始内容:', content)
    throw new Error('无法解析 AI 返回的 JSON 数据')
  }
}

export default { analyzeUserFeedback, reoptimizeWithFeedback }

