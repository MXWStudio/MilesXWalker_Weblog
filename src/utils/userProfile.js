/**
 * userProfile.js
 * 用户真实信息配置
 *
 * 用于AI简历优化时提供真实的用户背景信息
 * 避免AI夸大或捏造不存在的经历
 *
 * @author AI进化论-花生
 * @date 2025-01-19
 */

/**
 * 用户真实背景信息
 * 请根据实际情况填写，AI将基于这些信息进行优化
 */
export const userProfile = {
  // 基本信息
  basic: {
    name: '孟祥伟',
    location: '四川成都',
    email: 'mengxw.edit@gmail.com',
    phone: '+86 18652791015',
  },

  // 职业定位
  career: {
    primary: '视觉设计师', // 主要职业
    secondary: '自学编程开发者', // 次要技能
    experience: {
      design: '应届毕业生', // 设计经验
      photography: '摄影爱好', // 摄影作为爱好
      programming: '自学阶段', // 编程经验
    },
  },

  // 真实技能（只写会使用的）
  skills: {
    // 设计相关
    design: {
      software: ['Adobe Photoshop', 'Adobe Illustrator'],
      specialties: ['视觉传达设计', '广告设计', '平面设计'],
      experience: '应届毕业生（有实习经验）',
    },

    // 视频剪辑
    videoEditing: {
      software: ['Premiere Pro', 'DaVinci Resolve（达芬奇）', 'After Effects'],
      level: '熟练使用',
    },

    // 摄影相关（爱好，自学）
    photography: {
      equipment: [
        'Sony A7R II', // 全画幅微单相机
      ],
      specialties: ['风景摄影', '自然光线捕捉', '山川湖海拍摄', '色彩管理'],
      level: 'self-taught', // 自学，没有系统学过
      note: '个人爱好，自学摄影，有大量作品集',
    },

    // 编程相关
    programming: {
      languages: [
        'JavaScript',
        'Swift', // 正在学习开发iOS应用
      ],
      frameworks: [
        'Vue.js', // 自学中，已完成个人网站项目
        'SwiftUI', // 正在用于开发Trails App
      ],
      tools: [
        'Git',
        'GitHub',
        'Xcode', // 用于iOS开发
        'Vite',
      ],
      level: 'self-taught', // 自学阶段
      note: '自学编程，有实际项目经验',
    },
  },

  // 兴趣爱好
  interests: ['摄影', '视觉设计', '视频剪辑', '编程开发', '阅读', '旅行', '咖啡', '健身'],

  // 教育背景
  education: {
    degree: '大专',
    major: '视觉传达设计',
    school: '四川国际标榜职业学院',
    status: '应届毕业生',
    graduationYear: 2025,
  },

  // 语言能力
  languages: {
    chinese: 'native', // 母语
    english: 'basic', // 基础水平
  },

  // 工作经历提示
  workExperience: [
    {
      type: '实习经历',
      position: '广告设计实习生',
      description: '毕业实习，从事广告设计相关工作',
      duration: '实习期',
      status: '刚刚完成',
      skills: ['平面设计', '广告创意', 'Adobe系列软件应用'],
    },
  ],

  // 项目经验提示
  projects: [
    {
      type: 'Vue.js网站项目',
      name: 'MilesXWalker个人作品集网站',
      description: '个人作品集和摄影展示网站',
      technologies: ['Vue.js', 'JavaScript', 'Tailwind CSS', 'Vite'],
      role: '独立开发（自学项目）',
      status: '已完成并部署',
      achievements: [
        '使用Vue3 Composition API构建',
        '集成AI简历生成功能',
        '响应式设计，展示摄影作品',
        '部署到Vercel，实现自动化部署',
      ],
    },
    {
      type: 'iOS应用开发',
      name: 'Trails App',
      description: '个人开发的iOS应用（记录和分享旅行轨迹）',
      technologies: ['Swift', 'SwiftUI', 'Xcode'],
      role: '独立开发',
      status: '开发中',
      note: '最初尝试用Vue开发，后因预览、功能实现等原因转为原生iOS开发',
      achievements: [
        '自学Swift和SwiftUI',
        '使用Xcode进行原生iOS开发',
        '从Web开发转向移动端开发的实践',
      ],
      blogPost: '在个人博客中有详细开发记录',
    },
  ],

  // 个人特点（用于个人简介）
  characteristics: [
    '视觉传达设计专业毕业，有广告设计实习经验',
    '自学摄影，使用Sony A7R II记录自然之美',
    '对技术充满好奇，自学编程开发',
    '跨界学习者：从设计到编程，从Web到移动端',
    '注重细节和用户体验',
    '持续学习，勇于尝试新技术',
  ],

  // 职业目标
  careerGoals: {
    shortTerm: ['积累设计和开发经验', '深入学习前端开发和移动端开发', '完成Trails App的开发和上线'],
    longTerm: ['成为全栈设计师/开发者', '将设计思维与技术实现相结合', '创造兼具美感和功能的产品'],
  },

  // 优化偏好
  preferences: {
    tone: 'professional-friendly', // professional | professional-friendly | casual
    emphasis: 'design-tech', // 设计与技术结合
    style: 'honest', // honest | ambitious | modest - 保持真实，不夸大
  },
}

/**
 * 获取用户简介建议
 * 基于真实信息生成简介提示
 */
export function getUserSummaryGuidance() {
  const { career, interests, characteristics, education } = userProfile

  return `
真实背景：
- 教育背景：${education.degree}，${education.school}，${education.major}专业
- 毕业状态：${education.status}
- 主要身份：${career.primary}
- 技术兴趣：${career.secondary}
- 个人特点：${characteristics.join('；')}
- 兴趣爱好：${interests.join('、')}

⚠️ 重要提醒：
- 这是应届毕业生，刚完成实习，没有正式工作经验
- 编程是自学的，目前处于学习阶段，不要写"精通"或"资深"
- 摄影也是自学的，没有系统学过，但有专业设备（Sony A7R II）和大量作品
- 有设计专业背景和实习经验，这是优势
- 跨界学习（设计+摄影+编程）是特色，但要诚实体现水平

注意：这是用户的真实背景，请基于这些信息进行优化，不要夸大或虚构。
`
}

/**
 * 获取技能优化指导
 */
export function getSkillsGuidance() {
  const { skills } = userProfile

  const designSkills = [...(skills.design?.software || []), ...(skills.design?.specialties || [])]

  const videoSkills = skills.videoEditing?.software || []

  const photographySkills = [
    ...(skills.photography?.equipment || []),
    ...(skills.photography?.specialties || []),
  ]

  const programmingSkills = [
    ...skills.programming.languages,
    ...skills.programming.frameworks,
    ...skills.programming.tools,
  ]

  return `
用户真实掌握的技能：

设计技能：${designSkills.join('、')}
- 水平：${skills.design?.experience || ''}
- 专业背景，有实习经验

视频剪辑：${videoSkills.join('、')}
- 水平：${skills.videoEditing?.level || ''}

摄影技能：${photographySkills.join('、')}
- 水平：${skills.photography?.level === 'self-taught' ? '自学' : skills.photography?.level || ''}
- 设备：${skills.photography?.equipment?.join('、') || ''}
- 说明：${skills.photography?.note || ''}
- 这是个人爱好，自学摄影，有大量作品集

编程技能：${programmingSkills.join('、')}
- 水平：${skills.programming.level === 'self-taught' ? '自学阶段' : skills.programming.level}
- 说明：${skills.programming.note || ''}

⚠️ 重要：
1. 设计技能是专业背景，可以作为核心竞争力
2. 视频剪辑技能熟练，可以突出
3. 摄影是爱好（自学），有丰富作品集和专业设备（Sony A7R II），可以作为加分项
4. 编程也是自学，有实际项目但不要夸大为"精通"，用"熟悉"或"掌握"
5. 只列出以上技能，不要添加用户没有使用过的工具或技术
`
}

/**
 * 获取项目经验指导
 */
export function getProjectsGuidance() {
  const { projects } = userProfile

  if (!projects || projects.length === 0) {
    return '用户暂无项目经验记录，请基于用户填写的简历内容进行优化，不要虚构项目。'
  }

  return `
用户真实的项目经验：
${projects
  .map(
    (p, i) => `
${i + 1}. ${p.description}
   类型：${p.type}
   使用技术：${p.technologies.join('、')}
   角色：${p.role}
   成果：${p.achievements.join('；')}
`
  )
  .join('\n')}

请基于这些真实项目进行描述优化，不要夸大技术难度或虚构不存在的功能。
`
}

/**
 * 检查配置完整度
 * 提示用户哪些信息需要补充
 */
export function checkProfileCompleteness() {
  const warnings = []

  // 检查摄影技能
  if (
    (!userProfile.skills.photography.equipment ||
      userProfile.skills.photography.equipment.length === 0) &&
    (!userProfile.skills.photography.software ||
      userProfile.skills.photography.software.length === 0)
  ) {
    warnings.push('摄影设备和软件信息未填写')
  }

  // 检查教育背景
  if (!userProfile.education.degree) {
    warnings.push('教育背景未填写')
  }

  // 检查工作经历
  if (!userProfile.workExperience || userProfile.workExperience.length === 0) {
    warnings.push('工作经历未填写')
  }

  return {
    isComplete: warnings.length === 0,
    warnings,
    completeness: Math.round(((5 - warnings.length) / 5) * 100), // 简单计算完整度
  }
}

/**
 * 导出配置给AI使用
 */
export function exportProfileForAI() {
  return {
    profile: userProfile,
    summaryGuidance: getUserSummaryGuidance(),
    skillsGuidance: getSkillsGuidance(),
    projectsGuidance: getProjectsGuidance(),
    completeness: checkProfileCompleteness(),
  }
}

export default userProfile
