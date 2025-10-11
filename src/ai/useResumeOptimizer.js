/**
 * useResumeOptimizer.js
 * 增强版AI简历优化器
 *
 * 功能：
 * - 根据岗位要求全面优化简历
 * - 优化个人简介、技能、工作经历、项目经验
 * - 提供详细的优化建议和匹配度分析
 *
 * @author AI进化论-花生
 * @date 2025-01-10
 */

/**
 * 全面优化简历
 * 根据岗位要求优化简历的所有部分
 *
 * @param {string|Object} jobRequirement - 岗位要求（可以是文本或结构化数据）
 * @param {Object} resumeData - 当前简历数据
 * @param {Object} options - 配置选项
 * @param {string} options.model - AI模型 ('openai' | 'ollama')
 * @param {string} options.lang - 语言 ('zh' | 'en')
 * @param {boolean} options.optimizeExperience - 是否优化工作经历
 * @param {boolean} options.optimizeProjects - 是否优化项目经验
 * @param {boolean} options.optimizeEducation - 是否优化教育背景
 * @returns {Promise<Object>} 优化后的简历数据
 */
export async function optimizeResume(jobRequirement, resumeData, options = {}) {
  const {
    model = 'openai',
    lang = 'zh',
    optimizeExperience = true,
    optimizeProjects = true,
    optimizeEducation = false,
  } = options

  console.log('🚀 开始全面优化简历...')
  console.log('岗位要求:', jobRequirement)
  console.log('优化选项:', { optimizeExperience, optimizeProjects, optimizeEducation })

  try {
    // 构建优化提示词
    const systemPrompt = buildOptimizerSystemPrompt(lang)
    const userPrompt = buildOptimizerUserPrompt(jobRequirement, resumeData, {
      optimizeExperience,
      optimizeProjects,
      optimizeEducation,
      lang,
    })

    // 调用AI
    let result
    if (model === 'openai') {
      result = await callOpenAI(systemPrompt, userPrompt)
    } else if (model === 'ollama') {
      result = await callOllama(systemPrompt, userPrompt)
    } else {
      throw new Error(`不支持的模型: ${model}`)
    }

    console.log('✅ 简历优化完成')
    console.log('优化结果:', result)

    // 验证和处理结果
    return processOptimizationResult(result, resumeData)
  } catch (error) {
    console.error('❌ 简历优化失败:', error)
    throw error
  }
}

/**
 * 构建优化器的系统提示词
 */
function buildOptimizerSystemPrompt(lang = 'zh') {
  if (lang === 'en') {
    return `You are a professional resume optimization AI assistant.

Your task is to analyze job requirements and optimize resumes to maximize match rate.

Core Principles:
1. **Accuracy**: Never fabricate information, only optimize existing content
2. **Relevance**: Highlight experiences and skills most relevant to the target position
3. **Professionalism**: Use professional language appropriate for the industry
4. **ATS-Friendly**: Use keywords from job requirements to improve ATS pass rate
5. **Quantification**: Add quantifiable metrics where possible

Output Format:
Must return valid JSON with the following structure:
{
  "summary": "Optimized personal summary",
  "skills": ["Optimized skill list"],
  "experience": [
    {
      "id": "original_id",
      "optimizedDescription": "Optimized work description with quantifiable achievements"
    }
  ],
  "projects": [
    {
      "id": "original_id", 
      "optimizedDescription": "Optimized project description highlighting relevant technologies"
    }
  ],
  "recommendations": ["Specific improvement suggestions"],
  "matchAnalysis": {
    "matchScore": 85,
    "strengths": ["Your advantages"],
    "gaps": ["Skills or experience gaps"],
    "improvements": ["Priority improvements"]
  }
}

Important: Return only JSON data, no additional text.`
  }

  return `你是一位专业的简历优化AI助手。

你的任务是分析岗位要求，优化简历内容，使其最大程度地匹配目标岗位。

核心原则：
1. **真实性**：绝不捏造信息，只优化现有内容的表达方式
2. **相关性**：突出与目标岗位最相关的经验和技能
3. **专业性**：使用行业专业术语和规范表达
4. **ATS友好**：使用岗位要求中的关键词，提高简历系统通过率
5. **量化表达**：尽可能添加可量化的成果数据

优化策略：

### 个人简介优化
- 第一句突出最相关的身份和经验年限
- 列举2-3个核心优势，与岗位要求直接对应
- 展现职业目标与岗位的契合度
- 控制在150-200字

### 技能优化
- 优先展示岗位要求中提到的技能
- 删除不相关或过时的技能
- 按重要性排序
- 使用行业标准术语

### 工作经历优化
- 使用"动词+成果+数据"的STAR结构
- 突出与目标岗位相关的职责和成就
- 添加量化数据（提升X%、管理X人、完成X项目）
- 使用岗位要求中的关键词

### 项目经验优化  
- 突出使用的相关技术栈
- 描述你的角色和具体贡献
- 量化项目成果（用户量、性能提升等）
- 体现解决问题的能力

输出格式：
必须返回合法的JSON格式，包含以下结构：
{
  "summary": "优化后的个人简介",
  "skills": ["优化后的技能列表"],
  "experience": [
    {
      "id": "原工作经历的id",
      "optimizedDescription": "优化后的工作描述，突出成果和数据"
    }
  ],
  "projects": [
    {
      "id": "原项目的id",
      "optimizedDescription": "优化后的项目描述，突出技术和成果"
    }
  ],
  "recommendations": ["具体的优化建议"],
  "matchAnalysis": {
    "matchScore": 85,
    "strengths": ["你的优势点"],
    "gaps": ["技能或经验差距"],
    "improvements": ["需要优先改进的方面"]
  }
}

**重要**：只返回JSON数据，不要包含任何额外的解释文字。`
}

/**
 * 构建用户提示词
 */
function buildOptimizerUserPrompt(jobRequirement, resumeData, options = {}) {
  const { optimizeExperience, optimizeProjects, optimizeEducation, lang = 'zh' } = options

  // 解析岗位要求
  let jobReqText = ''
  if (typeof jobRequirement === 'string') {
    jobReqText = jobRequirement
  } else if (typeof jobRequirement === 'object') {
    jobReqText = `
岗位名称：${jobRequirement.position || ''}
公司：${jobRequirement.company || ''}
岗位要求：
${Array.isArray(jobRequirement.requirements) ? jobRequirement.requirements.join('\n') : ''}
工作职责：
${Array.isArray(jobRequirement.responsibilities) ? jobRequirement.responsibilities.join('\n') : ''}
关键词：${Array.isArray(jobRequirement.keywords) ? jobRequirement.keywords.join(', ') : ''}
`
  }

  const prompt = `
# 岗位要求

${jobReqText}

---

# 当前简历数据

## 基本信息
姓名：${resumeData.fullName || '未填写'}
职位：${resumeData.title || '未填写'}
邮箱：${resumeData.email || '未填写'}
电话：${resumeData.phone || '未填写'}

## 个人简介
${resumeData.summary || '未填写'}

## 技能列表
${Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : resumeData.skills || '未填写'}

${
  optimizeExperience && resumeData.experience && resumeData.experience.length > 0
    ? `## 工作经历
${resumeData.experience
  .map(
    (exp, index) => `
### 经历 ${index + 1} (ID: ${exp.id})
公司：${exp.company || '未填写'}
职位：${exp.position || '未填写'}
时间：${exp.startDate || ''} - ${exp.current ? '至今' : exp.endDate || ''}
描述：${exp.description || '未填写'}
`
  )
  .join('\n')}`
    : ''
}

${
  optimizeProjects && resumeData.projects && resumeData.projects.length > 0
    ? `## 项目经验
${resumeData.projects
  .map(
    (proj, index) => `
### 项目 ${index + 1} (ID: ${proj.id})
项目名称：${proj.name || '未填写'}
角色：${proj.role || '未填写'}
时间：${proj.startDate || ''} - ${proj.endDate || ''}
技术栈：${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}
描述：${proj.description || '未填写'}
`
  )
  .join('\n')}`
    : ''
}

${
  optimizeEducation && resumeData.education && resumeData.education.length > 0
    ? `## 教育背景
${resumeData.education
  .map(
    (edu, index) => `
### 教育 ${index + 1} (ID: ${edu.id})
学校：${edu.school || '未填写'}
学位：${edu.degree || '未填写'}
专业：${edu.field || '未填写'}
时间：${edu.startDate || ''} - ${edu.endDate || ''}
`
  )
  .join('\n')}`
    : ''
}

---

# 优化任务

请根据以上岗位要求和简历数据，进行全面优化：

1. **个人简介**：重写为更匹配岗位的版本
2. **技能列表**：重新排序并优化，突出相关技能
${optimizeExperience ? '3. **工作经历**：优化每段工作经历的描述（保留ID）' : ''}
${optimizeProjects ? '4. **项目经验**：优化每个项目的描述（保留ID）' : ''}
5. **匹配分析**：分析匹配度，指出优势和差距
6. **优化建议**：提供3-5条具体可行的改进建议

请返回JSON格式的优化结果。
`

  return prompt
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

/**
 * 调用Ollama本地模型
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
    throw new Error('Ollama 服务未启动或模型错误')
  }

  const data = await response.json()
  const text = data.response || data.output || ''

  if (!text) {
    throw new Error('Ollama 返回的内容为空')
  }

  try {
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(cleanText)
  } catch (error) {
    console.warn('Ollama 返回的不是标准 JSON')
    throw new Error('无法解析 Ollama 返回的数据，请尝试使用 OpenAI 模型')
  }
}

/**
 * 处理优化结果
 * 将AI返回的结果转换为可直接应用到简历的格式
 */
function processOptimizationResult(result, originalData) {
  if (!result || typeof result !== 'object') {
    throw new Error('AI 返回的结果格式无效')
  }

  // 确保必要字段存在
  const processed = {
    summary: result.summary || originalData.summary || '',
    skills: Array.isArray(result.skills) ? result.skills : originalData.skills || [],
    experience: originalData.experience || [],
    projects: originalData.projects || [],
    education: originalData.education || [],
    recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    matchAnalysis: result.matchAnalysis || {
      matchScore: 0,
      strengths: [],
      gaps: [],
      improvements: [],
    },
  }

  // 处理工作经历优化
  if (result.experience && Array.isArray(result.experience)) {
    processed.experience = originalData.experience.map(exp => {
      const optimized = result.experience.find(opt => opt.id === exp.id)
      if (optimized && optimized.optimizedDescription) {
        return {
          ...exp,
          description: optimized.optimizedDescription,
        }
      }
      return exp
    })
  }

  // 处理项目经验优化
  if (result.projects && Array.isArray(result.projects)) {
    processed.projects = originalData.projects.map(proj => {
      const optimized = result.projects.find(opt => opt.id === proj.id)
      if (optimized && optimized.optimizedDescription) {
        return {
          ...proj,
          description: optimized.optimizedDescription,
        }
      }
      return proj
    })
  }

  return processed
}

/**
 * 快速优化简历（简化接口）
 * 只优化基本信息和技能
 */
export async function quickOptimize(jobTitle, resumeData, options = {}) {
  return optimizeResume({ position: jobTitle }, resumeData, {
    ...options,
    optimizeExperience: false,
    optimizeProjects: false,
    optimizeEducation: false,
  })
}

/**
 * 深度优化简历
 * 优化所有部分
 */
export async function deepOptimize(jobRequirement, resumeData, options = {}) {
  return optimizeResume(jobRequirement, resumeData, {
    ...options,
    optimizeExperience: true,
    optimizeProjects: true,
    optimizeEducation: true,
  })
}

export default optimizeResume
