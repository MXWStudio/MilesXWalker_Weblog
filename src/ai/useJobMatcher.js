/**
 * useJobMatcher.js
 * 智能岗位匹配分析器
 *
 * 功能：
 * - 分析用户能力与岗位要求的匹配度
 * - 显示符合要求的技能
 * - 显示缺失的技能
 * - 提供针对性的改进建议
 *
 * @author AI进化论-花生
 * @date 2025-01-10
 */

/**
 * 使用AI分析岗位要求和用户匹配度
 * @param {string} jobTitle - 目标岗位名称
 * @param {Object} userProfile - 用户能力画像
 * @returns {Promise<Object>} 匹配分析结果
 */
export async function analyzeJobMatch(jobTitle, userProfile) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('未配置 VITE_OPENAI_API_KEY')
  }

  console.log(`🎯 正在分析岗位匹配度: ${jobTitle}`)

  try {
    const prompt = `你是一位专业的职业匹配分析专家和HR顾问。

## 任务
分析用户与目标岗位的匹配程度，提供详细的匹配报告。

## 目标岗位
${jobTitle}

## 用户能力画像
${JSON.stringify(
  {
    skills: userProfile.skills,
    expertise: userProfile.expertise,
    projects: userProfile.projects.map(p => ({
      name: p.name,
      role: p.role,
      technologies: p.technologies,
    })),
    strengths: userProfile.strengths,
  },
  null,
  2
)}

## 分析要求

请提供以下内容：

1. **匹配度评分** (0-100分)
2. **符合要求的技能**：列出用户已具备且岗位需要的技能
3. **优势分析**：用户相比其他候选人的独特优势
4. **缺失的技能**：岗位要求但用户尚未具备的关键技能
5. **技能差距等级**：将缺失技能按重要性分为"必须掌握"、"建议掌握"、"加分项"
6. **学习路径**：针对缺失技能，提供具体的学习建议和时间规划
7. **岗位建议**：该如何完善简历以提高竞争力

## 输出格式

必须返回标准的 JSON 格式：
\`\`\`json
{
  "matchScore": 85,
  "matchLevel": "high",
  "matchingSkills": [
    {
      "skill": "技能名称",
      "proficiency": "用户的熟练度",
      "jobRequirement": "岗位要求的熟练度",
      "status": "符合|超出"
    }
  ],
  "advantages": [
    {
      "title": "优势标题",
      "description": "详细说明"
    }
  ],
  "missingSkills": [
    {
      "skill": "缺失技能",
      "importance": "critical|important|nice-to-have",
      "category": "技术技能|软技能|行业知识",
      "learningTime": "预计学习时间",
      "resources": ["学习资源1", "学习资源2"]
    }
  ],
  "learningPath": {
    "immediate": ["立即学习的技能"],
    "shortTerm": ["1-3个月学习的技能"],
    "longTerm": ["3-6个月学习的技能"]
  },
  "resumeOptimization": [
    {
      "section": "简历部分（如经验、技能等）",
      "suggestion": "具体建议",
      "priority": "high|medium|low"
    }
  ],
  "overallAssessment": "整体评价（200字以内）"
}
\`\`\`

注意：
- matchLevel: "high" (80-100分), "medium" (60-79分), "low" (0-59分)
- importance: "critical" (必须), "important" (重要), "nice-to-have" (加分项)
- 只返回 JSON 数据，不要包含任何额外的解释`

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
            content:
              '你是一位资深的HR和职业匹配专家，擅长分析候选人与岗位的匹配度，并提供专业的职业发展建议。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`AI分析失败: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const matchAnalysis = JSON.parse(data.choices[0].message.content)

    console.log('✅ 岗位匹配分析完成')
    console.log(`📊 匹配度: ${matchAnalysis.matchScore}分 (${matchAnalysis.matchLevel})`)
    console.log(`✅ 符合技能: ${matchAnalysis.matchingSkills?.length || 0} 个`)
    console.log(`❌ 缺失技能: ${matchAnalysis.missingSkills?.length || 0} 个`)

    return matchAnalysis
  } catch (error) {
    console.error('❌ 岗位匹配分析失败:', error)
    throw error
  }
}

/**
 * 生成岗位匹配可视化数据
 * @param {Object} matchAnalysis - 匹配分析结果
 * @returns {Object} 可视化数据
 */
export function generateVisualization(matchAnalysis) {
  return {
    // 匹配度仪表盘数据
    scoreGauge: {
      score: matchAnalysis.matchScore,
      level: matchAnalysis.matchLevel,
      color:
        matchAnalysis.matchLevel === 'high'
          ? '#48bb78'
          : matchAnalysis.matchLevel === 'medium'
            ? '#ed8936'
            : '#f56565',
    },

    // 技能分布
    skillsDistribution: {
      matching: matchAnalysis.matchingSkills?.length || 0,
      missing: matchAnalysis.missingSkills?.length || 0,
      total:
        (matchAnalysis.matchingSkills?.length || 0) + (matchAnalysis.missingSkills?.length || 0),
    },

    // 缺失技能按重要性分类
    missingByImportance: {
      critical: matchAnalysis.missingSkills?.filter(s => s.importance === 'critical').length || 0,
      important: matchAnalysis.missingSkills?.filter(s => s.importance === 'important').length || 0,
      niceToHave:
        matchAnalysis.missingSkills?.filter(s => s.importance === 'nice-to-have').length || 0,
    },
  }
}

/**
 * 生成学习计划时间线
 * @param {Object} learningPath - 学习路径
 * @returns {Array} 时间线数据
 */
export function generateLearningTimeline(learningPath) {
  const timeline = []

  if (learningPath.immediate && learningPath.immediate.length > 0) {
    timeline.push({
      phase: '立即行动',
      period: '本周开始',
      skills: learningPath.immediate,
      priority: 'high',
      icon: '🚀',
    })
  }

  if (learningPath.shortTerm && learningPath.shortTerm.length > 0) {
    timeline.push({
      phase: '短期目标',
      period: '1-3个月',
      skills: learningPath.shortTerm,
      priority: 'medium',
      icon: '📚',
    })
  }

  if (learningPath.longTerm && learningPath.longTerm.length > 0) {
    timeline.push({
      phase: '长期规划',
      period: '3-6个月',
      skills: learningPath.longTerm,
      priority: 'low',
      icon: '🎯',
    })
  }

  return timeline
}

/**
 * 格式化匹配报告为Markdown
 * @param {Object} matchAnalysis - 匹配分析结果
 * @returns {string} Markdown格式的报告
 */
export function formatMatchReport(matchAnalysis) {
  let report = `# 岗位匹配分析报告\n\n`

  // 匹配度总览
  report += `## 📊 匹配度评分\n\n`
  report += `**${matchAnalysis.matchScore} 分** (${matchAnalysis.matchLevel === 'high' ? '高度匹配' : matchAnalysis.matchLevel === 'medium' ? '中度匹配' : '匹配度较低'})\n\n`

  // 整体评价
  report += `### 整体评价\n\n`
  report += `${matchAnalysis.overallAssessment}\n\n`

  // 符合的技能
  if (matchAnalysis.matchingSkills && matchAnalysis.matchingSkills.length > 0) {
    report += `## ✅ 符合要求的技能 (${matchAnalysis.matchingSkills.length}个)\n\n`
    matchAnalysis.matchingSkills.forEach(skill => {
      const statusIcon = skill.status === '超出' ? '⭐' : '✓'
      report += `${statusIcon} **${skill.skill}**\n`
      report += `   - 你的水平: ${skill.proficiency}\n`
      report += `   - 岗位要求: ${skill.jobRequirement}\n\n`
    })
  }

  // 优势分析
  if (matchAnalysis.advantages && matchAnalysis.advantages.length > 0) {
    report += `## 💪 你的优势\n\n`
    matchAnalysis.advantages.forEach((adv, index) => {
      report += `${index + 1}. **${adv.title}**\n`
      report += `   ${adv.description}\n\n`
    })
  }

  // 缺失的技能
  if (matchAnalysis.missingSkills && matchAnalysis.missingSkills.length > 0) {
    report += `## ❌ 待提升的技能 (${matchAnalysis.missingSkills.length}个)\n\n`

    // 按重要性分类
    const critical = matchAnalysis.missingSkills.filter(s => s.importance === 'critical')
    const important = matchAnalysis.missingSkills.filter(s => s.importance === 'important')
    const niceToHave = matchAnalysis.missingSkills.filter(s => s.importance === 'nice-to-have')

    if (critical.length > 0) {
      report += `### 🚨 必须掌握\n\n`
      critical.forEach(skill => {
        report += `- **${skill.skill}** (${skill.category})\n`
        report += `  - 预计学习时间: ${skill.learningTime}\n`
        if (skill.resources && skill.resources.length > 0) {
          report += `  - 推荐资源: ${skill.resources.join(', ')}\n`
        }
        report += `\n`
      })
    }

    if (important.length > 0) {
      report += `### ⚠️ 建议掌握\n\n`
      important.forEach(skill => {
        report += `- **${skill.skill}** (${skill.category})\n`
        report += `  - 预计学习时间: ${skill.learningTime}\n`
        report += `\n`
      })
    }

    if (niceToHave.length > 0) {
      report += `### ⭐ 加分项\n\n`
      niceToHave.forEach(skill => {
        report += `- ${skill.skill}\n`
      })
      report += `\n`
    }
  }

  // 学习路径
  if (matchAnalysis.learningPath) {
    report += `## 📚 学习路径建议\n\n`

    if (matchAnalysis.learningPath.immediate && matchAnalysis.learningPath.immediate.length > 0) {
      report += `### 🚀 立即行动 (本周开始)\n`
      matchAnalysis.learningPath.immediate.forEach(skill => {
        report += `- ${skill}\n`
      })
      report += `\n`
    }

    if (matchAnalysis.learningPath.shortTerm && matchAnalysis.learningPath.shortTerm.length > 0) {
      report += `### 📅 短期目标 (1-3个月)\n`
      matchAnalysis.learningPath.shortTerm.forEach(skill => {
        report += `- ${skill}\n`
      })
      report += `\n`
    }

    if (matchAnalysis.learningPath.longTerm && matchAnalysis.learningPath.longTerm.length > 0) {
      report += `### 🎯 长期规划 (3-6个月)\n`
      matchAnalysis.learningPath.longTerm.forEach(skill => {
        report += `- ${skill}\n`
      })
      report += `\n`
    }
  }

  // 简历优化建议
  if (matchAnalysis.resumeOptimization && matchAnalysis.resumeOptimization.length > 0) {
    report += `## 📝 简历优化建议\n\n`
    matchAnalysis.resumeOptimization.forEach((opt, index) => {
      const priorityIcon = opt.priority === 'high' ? '🔴' : opt.priority === 'medium' ? '🟡' : '🟢'
      report += `${index + 1}. ${priorityIcon} **${opt.section}**\n`
      report += `   ${opt.suggestion}\n\n`
    })
  }

  report += `---\n\n`
  report += `*分析时间: ${new Date().toLocaleString('zh-CN')}*\n`

  return report
}

/**
 * 导出匹配报告为PDF（准备数据）
 * @param {Object} matchAnalysis - 匹配分析结果
 * @returns {Object} PDF数据结构
 */
export function preparePDFData(matchAnalysis) {
  return {
    title: '岗位匹配分析报告',
    sections: [
      {
        title: '匹配度评分',
        type: 'score',
        data: {
          score: matchAnalysis.matchScore,
          level: matchAnalysis.matchLevel,
          assessment: matchAnalysis.overallAssessment,
        },
      },
      {
        title: '符合要求的技能',
        type: 'skills-matching',
        data: matchAnalysis.matchingSkills,
      },
      {
        title: '你的优势',
        type: 'advantages',
        data: matchAnalysis.advantages,
      },
      {
        title: '待提升的技能',
        type: 'skills-missing',
        data: matchAnalysis.missingSkills,
      },
      {
        title: '学习路径',
        type: 'learning-path',
        data: matchAnalysis.learningPath,
      },
      {
        title: '简历优化建议',
        type: 'resume-tips',
        data: matchAnalysis.resumeOptimization,
      },
    ],
    generatedAt: new Date().toISOString(),
  }
}

export default {
  analyzeJobMatch,
  generateVisualization,
  generateLearningTimeline,
  formatMatchReport,
  preparePDFData,
}
