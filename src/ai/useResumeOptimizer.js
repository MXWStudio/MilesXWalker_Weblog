/**
 * useResumeOptimizer.js
 * 增强版AI简历优化器
 *
 * 功能：
 * - 根据岗位要求全面优化简历
 * - 优化个人简介、技能、工作经历、项目经验
 * - 提供详细的优化建议和匹配度分析
 * - 支持多轮迭代优化
 * - 基于用户真实背景，避免夸大虚构
 * - 支持多种AI模型切换
 *
 * @author AI进化论-花生
 * @date 2025-01-10
 * @updated 2025-10-12
 */

import { exportProfileForAI } from '@/utils/userProfile'
import { getModelConfig, getSavedModel } from './aiConfig'

/**
 * 全面优化简历
 * 根据岗位要求优化简历的所有部分
 *
 * @param {string|Object} jobRequirement - 岗位要求（可以是文本或结构化数据）
 * @param {Object} resumeData - 当前简历数据
 * @param {Object} options - 配置选项
 * @param {string} options.model - AI模型ID (如 'gpt-4o-mini', 'gpt-4o', 'llama3.2')
 * @param {string} options.lang - 语言 ('zh' | 'en')
 * @param {boolean} options.optimizeExperience - 是否优化工作经历
 * @param {boolean} options.optimizeProjects - 是否优化项目经验
 * @param {boolean} options.optimizeEducation - 是否优化教育背景
 * @returns {Promise<Object>} 优化后的简历数据
 */
export async function optimizeResume(jobRequirement, resumeData, options = {}) {
  const {
    model = getSavedModel(),
    lang = 'zh',
    optimizeExperience = true,
    optimizeProjects = true,
    optimizeEducation = false,
  } = options

  // 获取模型配置
  const modelConfig = getModelConfig(model)

  console.log('🚀 开始全面优化简历...')
  console.log('使用模型:', modelConfig.name)
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

    // 根据provider调用不同的AI服务
    let result
    if (modelConfig.provider === 'openai') {
      result = await callOpenAI(systemPrompt, userPrompt, model)
    } else if (modelConfig.provider === 'gemini') {
      result = await callGemini(systemPrompt, userPrompt, model)
    } else if (modelConfig.provider === 'ollama') {
      result = await callOllama(systemPrompt, userPrompt, model)
    } else {
      throw new Error(`不支持的AI提供商: ${modelConfig.provider}`)
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

⚠️ **最重要的原则：**
你将收到用户的真实背景信息。你必须严格基于这些真实信息进行优化。
**绝对禁止**：
- ❌ 虚构不存在的工作经历
- ❌ 夸大技能水平（比如把"自学"说成"精通"）
- ❌ 添加用户从未使用过的工具或技术
- ❌ 编造具体的项目数据或成果
- ❌ 给用户加上不符合实际的头衔或职位

**允许做的优化**：
- ✅ 用更专业的方式表达现有经验
- ✅ 突出与岗位相关的真实技能和经历
- ✅ 调整内容顺序和重点，提升匹配度
- ✅ 补充合理的技能关键词（但必须是用户可能掌握的）
- ✅ 改善语言表达，使其更简洁有力

核心原则：
1. **真实性第一**：所有优化必须基于用户真实背景，诚实是最重要的
2. **相关性**：突出与目标岗位最相关的经验和技能
3. **专业性**：使用行业专业术语和规范表达
4. **ATS友好**：使用岗位要求中的关键词，提高简历系统通过率
5. **谨慎量化**：只在有真实数据基础时添加量化表达

优化策略：

### 个人简介优化
- 基于用户的真实身份和经验进行描述
- 如果是"自学"或"转行"，诚实地体现这一点
- 突出真实的个人特点和优势
- 控制在150-200字
- 语气真诚，不浮夸

### 技能优化
- **只列出用户真实掌握的技能**
- 如果用户提供的技能信息不足，在recommendations中建议补充
- 删除明显不相关的技能
- 按与岗位的相关性排序
- 对于"自学"阶段的技能，可以写"熟悉"而不是"精通"

### 工作经历优化
- 如果用户没有相关工作经历，不要虚构
- 优化现有经历的表达方式，但不改变事实
- 可以将兴趣项目或自学经历放在"项目经验"中
- 不要添加不存在的职责或成果

### 项目经验优化  
- 基于用户真实完成的项目进行优化
- 突出真实使用的技术栈
- 描述真实的角色和贡献
- 如果没有具体数据，不要编造，可以用定性描述

### 技能差距诚实沟通
- 如果用户技能与岗位要求有明显差距，在matchAnalysis中诚实指出
- 在recommendations中建议实际可行的提升方向
- 不要通过虚构来"弥补"差距

输出格式：
必须返回合法的JSON格式，包含以下结构：
{
  "summary": "优化后的个人简介（基于真实背景）",
  "skills": ["优化后的技能列表（只包含用户真实掌握的）"],
  "experience": [
    {
      "id": "原工作经历的id",
      "optimizedDescription": "优化后的工作描述（不改变事实，只优化表达）"
    }
  ],
  "projects": [
    {
      "id": "原项目的id",
      "optimizedDescription": "优化后的项目描述（基于真实项目）"
    }
  ],
  "recommendations": ["具体的优化建议，包括需要补充的信息"],
  "matchAnalysis": {
    "matchScore": 85,
    "strengths": ["用户的真实优势"],
    "gaps": ["诚实指出的技能或经验差距"],
    "improvements": ["实际可行的改进建议"]
  },
  "needsMoreInfo": ["如果某些信息不足以优化，列出需要用户补充的内容"]
}

**重要**：
1. 只返回JSON数据，不要包含任何额外的解释文字
2. 宁可保守，也不要夸大
3. 用户会进行多轮修改和优化，第一次不必追求完美`
}

/**
 * 构建用户提示词
 */
function buildOptimizerUserPrompt(jobRequirement, resumeData, options = {}) {
  const { optimizeExperience, optimizeProjects, optimizeEducation, lang = 'zh' } = options

  // 获取用户真实背景信息
  const userProfileData = exportProfileForAI()

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

# 用户真实背景信息（重要参考）

${userProfileData.summaryGuidance}

${userProfileData.skillsGuidance}

${userProfileData.projectsGuidance}

配置完整度：${userProfileData.completeness.completeness}%
${userProfileData.completeness.warnings.length > 0 ? `\n⚠️ 缺失信息：${userProfileData.completeness.warnings.join('、')}` : ''}

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
 * @param {string} systemPrompt - 系统提示词
 * @param {string} userPrompt - 用户提示词
 * @param {string} modelId - 模型ID
 */
async function callOpenAI(systemPrompt, userPrompt, modelId = 'gpt-4o-mini') {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('未配置 VITE_OPENAI_API_KEY')
  }

  const modelConfig = getModelConfig(modelId)
  console.log(`📡 正在调用 OpenAI API (${modelConfig.name})...`)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
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

    // 提供更友好的错误信息
    let friendlyMessage = `OpenAI API 调用失败: ${errorMessage}`

    if (errorMessage.includes('Rate limit')) {
      friendlyMessage +=
        '\n\n💡 建议：\n1. 等待一段时间后重试\n2. 切换到付费模型（更高速率限制）\n3. 使用本地模型（无限制）'
    }

    throw new Error(friendlyMessage)
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
 * 调用Google Gemini API
 * @param {string} systemPrompt - 系统提示词
 * @param {string} userPrompt - 用户提示词
 * @param {string} modelId - 模型ID
 */
async function callGemini(systemPrompt, userPrompt, modelId = 'gemini-2.0-flash') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      '未配置 VITE_GEMINI_API_KEY\n\n请在 .env 文件中添加：\nVITE_GEMINI_API_KEY=your_api_key'
    )
  }

  const modelConfig = getModelConfig(modelId)
  console.log(`📡 正在调用 Google Gemini API (${modelConfig.name})...`)

  // 合并系统提示词和用户提示词
  const combinedPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}\n\n请返回JSON格式的结果。`

  const response = await fetch(
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
                text: combinedPrompt,
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage =
      errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`

    // 提供更友好的错误信息
    let friendlyMessage = `Gemini API 调用失败: ${errorMessage}`

    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      friendlyMessage += '\n\n💡 建议：\n1. 等待一段时间后重试\n2. 检查 API 配额\n3. 切换到其他模型'
    }

    throw new Error(friendlyMessage)
  }

  const data = await response.json()

  // Gemini API 返回格式：{ candidates: [{ content: { parts: [{ text: "..." }] } }] }
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Gemini 返回的数据格式无效')
  }

  const text = data.candidates[0].content.parts[0].text

  try {
    // 尝试提取JSON（可能包含在代码块中）
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(cleanText)
  } catch (error) {
    console.error('JSON 解析失败，原始内容:', text)
    throw new Error('无法解析 Gemini 返回的 JSON 数据')
  }
}

/**
 * 调用Ollama本地模型
 * @param {string} systemPrompt - 系统提示词
 * @param {string} userPrompt - 用户提示词
 * @param {string} modelId - 模型ID
 */
async function callOllama(systemPrompt, userPrompt, modelId = 'llama3.2') {
  const modelConfig = getModelConfig(modelId)
  console.log(`📡 正在调用 Ollama API (${modelConfig.name})...`)

  const combinedPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelId,
      prompt: combinedPrompt,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Ollama 服务未启动或模型 ${modelId} 不可用\n\n` +
        `请确保：\n` +
        `1. Ollama 已安装并运行\n` +
        `2. 已下载模型：ollama pull ${modelId}`
    )
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
