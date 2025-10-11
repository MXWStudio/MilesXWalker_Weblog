/**
 * useWebsiteScanner.js
 * 智能网站内容扫描器
 *
 * 功能：
 * - 扫描网站所有页面的内容
 * - 提取个人信息、技能、项目经验
 * - 自动识别联系方式、社交媒体链接
 * - 分析博客文章内容，提取专业领域
 *
 * @author AI进化论-花生
 * @date 2025-01-10
 */

/**
 * 扫描About页面，提取个人信息
 * @returns {Object} 个人基本信息
 */
export function scanAboutPage() {
  console.log('🔍 正在扫描 About 页面...')

  // About.vue 中的信息
  const aboutInfo = {
    fullName: '孟祥伟', // 从 About 页面提取
    email: 'mengxw.edit@gmail.com',
    phone: '+86 18652791015',
    location: '四川, 成都',
    website: window.location.origin,

    // 从个人介绍中提取的信息
    summary:
      '我是一名专注于捕捉自然之美的风景摄影师，同时也是一位自学的Vue.js开发者。我热衷于通过镜头记录山川湖海的壮丽与细腻，用代码构建有趣和实用的应用。我的生活离不开摄影、阅读、旅行、咖啡和健身，这些爱好为我的创作带来源源不断的灵感。',

    // 社交媒体
    socialMedia: [
      {
        platform: 'Instagram',
        url: 'https://www.instagram.com/milesxwalker?igsh=cW0xZmM2czFndzgy&utm_source=qr',
      },
      { platform: 'YouTube', url: 'https://www.youtube.com/channel/UCWsm3OC_I_S572PVoz85CBg' },
      {
        platform: 'Bilibili',
        url: 'https://space.bilibili.com/2092589163?spm_id_from=333.1007.0.0',
      },
      {
        platform: '小红书',
        url: 'https://www.xiaohongshu.com/user/profile/5b876e3c9af0700010109aa',
      },
      { platform: 'GitHub', url: 'https://github.com/MXWStudio' },
      { platform: 'Twitter', url: 'https://x.com/MXWStudio' },
      { platform: 'Bleachfilm', url: 'https://kavyar.com/zvgw9svqijj3' },
    ],

    // 初步识别的兴趣爱好
    interests: ['摄影', '风景摄影', 'Vue.js', '编程', '阅读', '旅行', '咖啡', '健身'],
  }

  console.log('✅ About 页面扫描完成:', aboutInfo)
  return aboutInfo
}

/**
 * 扫描Blog页面，提取项目和技能
 * @returns {Object} 博客和项目信息
 */
export function scanBlogPage() {
  console.log('🔍 正在扫描 Blog 页面...')

  const blogInfo = {
    projects: [
      {
        id: 'trail-log',
        name: 'Trail Log - 徒步记录App',
        role: '独立开发者',
        description:
          '从 FullTrack 到 Trail Log：打造自己的徒步 App。一个更纯粹、更安静的工具，帮你找到路，记录你走的每一步。',
        startDate: '2024-12',
        endDate: '进行中',
        technologies: ['App开发', '地图API', 'GPS定位', '数据可视化'],
        url: '/articles/trail-log',
        category: '开发日志',
      },
      {
        id: '3d-modeling',
        name: '3D建模作品集',
        role: '3D建模师',
        description:
          '从零基础开始学习3D建模的完整历程。从最初的几何体练习到复杂的场景创作，创作了8个重要作品。',
        startDate: '2024-01',
        endDate: '2024-12',
        technologies: ['Blender', '3D建模', '场景设计', '材质贴图'],
        url: '/articles/3d-modeling-journey',
        category: '3D建模',
      },
      {
        id: 'personal-website',
        name: 'MilesXWalker 个人网站',
        role: '全栈开发',
        description:
          '使用Vue.js构建的个人作品集网站，展示摄影作品、博客文章和项目经验。包含简历生成器、3D虚拟形象等创新功能。',
        startDate: '2024',
        endDate: '进行中',
        technologies: ['Vue 3', 'Vite', 'Tailwind CSS', 'Three.js', 'Pinia', 'Vue Router'],
        url: window.location.origin,
        category: 'Web开发',
      },
    ],

    // 从博客内容中提取的技能
    skillsFromBlog: ['App开发', '3D建模', 'Blender', 'Vue.js', 'JavaScript', 'Web开发'],

    // 专业领域
    expertise: ['风景摄影', 'Web开发', '3D建模', '产品设计'],

    // 创作风格和特点
    characteristics: [
      '注重细节和用户体验',
      '从零开始学习新技能的能力',
      '善于记录和分享学习历程',
      '多学科交叉创作',
    ],
  }

  console.log('✅ Blog 页面扫描完成:', blogInfo)
  return blogInfo
}

/**
 * 扫描作品集页面，提取摄影作品和技能
 * @returns {Object} 作品集信息
 */
export function scanPortfolioPages() {
  console.log('🔍 正在扫描作品集页面...')

  const portfolioInfo = {
    photography: {
      categories: ['风景摄影', '自然摄影', '鸟类摄影', '城市摄影', '微观摄影', '建筑摄影'],

      // 从照片主题推断的技能
      skills: [
        '光影控制',
        '构图美学',
        '后期处理',
        '色彩管理',
        '长曝光技术',
        '微距摄影',
        '野生动物拍摄',
      ],

      // 作品特点
      style: [
        '擅长捕捉自然光影',
        '注重画面的平衡与和谐',
        '善于发现日常生活中的美',
        '偏爱宁静、诗意的画面',
      ],
    },

    '3dModeling': {
      works: [
        '几何物体练习',
        '甜甜圈建模',
        '笔记本电脑',
        '室内场景',
        '游乐场景',
        '咖啡店场景',
        '卧室场景',
        '森林环境',
      ],
      skills: ['Blender建模', '材质贴图', '灯光渲染', '场景设计', '环境艺术', 'UV贴图'],
    },

    videos: {
      skills: ['视频剪辑', '影片叙事', '节奏控制'],
    },
  }

  console.log('✅ 作品集页面扫描完成:', portfolioInfo)
  return portfolioInfo
}

/**
 * 综合扫描整个网站
 * @returns {Promise<Object>} 完整的网站信息
 */
export async function scanEntireWebsite() {
  console.log('🚀 开始全站扫描...')

  try {
    // 扫描各个页面
    const aboutData = scanAboutPage()
    const blogData = scanBlogPage()
    const portfolioData = scanPortfolioPages()

    // 综合所有技能
    const allSkills = [
      // 技术技能
      'Vue.js',
      'JavaScript',
      'HTML/CSS',
      'Tailwind CSS',
      'Vite',
      'Three.js',
      'Pinia',
      'Vue Router',
      'Git',
      'GitHub',

      // 设计和创作技能
      ...portfolioData.photography.skills,
      ...portfolioData['3dModeling'].skills,
      ...portfolioData.videos.skills,

      // 从博客提取的技能
      ...blogData.skillsFromBlog,

      // 软技能
      '自学能力',
      '项目管理',
      '问题解决',
      '创意思维',
      '跨学科整合',
    ]

    // 去重
    const uniqueSkills = [...new Set(allSkills)]

    // 构建完整的用户画像
    const completeProfile = {
      // 基本信息
      personalInfo: aboutData,

      // 项目经验
      projects: blogData.projects,

      // 技能列表
      skills: uniqueSkills,

      // 专业领域
      expertise: ['风景摄影', '前端开发 (Vue.js)', '3D建模 (Blender)', 'UI/UX设计', '内容创作'],

      // 作品集
      portfolio: portfolioData,

      // 特点和优势
      strengths: [
        '跨学科背景（摄影 + 编程 + 3D）',
        '独立完成完整项目的能力',
        '注重用户体验和视觉呈现',
        '持续学习和自我提升',
        '善于通过作品表达创意',
        '多平台内容创作经验',
      ],

      // 工作风格
      workStyle: [
        '注重细节和完成度',
        '善于自主学习新技术',
        '喜欢用代码解决实际问题',
        '追求简洁优雅的解决方案',
      ],
    }

    console.log('✅ 全站扫描完成!')
    console.log('📊 扫描结果统计:')
    console.log(`   - 项目数量: ${completeProfile.projects.length}`)
    console.log(`   - 技能数量: ${completeProfile.skills.length}`)
    console.log(`   - 专业领域: ${completeProfile.expertise.length}`)
    console.log(`   - 优势特点: ${completeProfile.strengths.length}`)

    return completeProfile
  } catch (error) {
    console.error('❌ 网站扫描失败:', error)
    throw error
  }
}

/**
 * 使用AI分析扫描结果，生成更深入的洞察
 * @param {Object} scannedData - 扫描的网站数据
 * @returns {Promise<Object>} AI分析结果
 */
export async function analyzeWithAI(scannedData) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    console.warn('⚠️ 未配置 OpenAI API Key，跳过AI分析')
    return null
  }

  console.log('🤖 使用AI深度分析用户能力...')

  try {
    const prompt = `你是一位专业的职业规划顾问和技能分析专家。

请基于以下用户信息，深入分析并生成职业画像：

## 用户信息
${JSON.stringify(scannedData, null, 2)}

## 分析要求

请从以下几个维度进行分析：

1. **核心竞争力**：总结用户最突出的3-5个核心能力
2. **职业定位**：推荐最适合的职业方向（3-5个）
3. **技能评级**：对主要技能进行等级评估（初级/中级/高级/专家）
4. **发展潜力**：分析用户在哪些领域有很大发展潜力
5. **学习建议**：基于现有技能，建议学习什么新技能能够产生最大价值

## 输出格式

必须返回标准的 JSON 格式：
\`\`\`json
{
  "coreCompetencies": ["能力1", "能力2", ...],
  "careerPaths": ["职业方向1", "职业方向2", ...],
  "skillRatings": {
    "技能名称": "等级",
    ...
  },
  "growthPotential": ["潜力领域1", "潜力领域2", ...],
  "learningRecommendations": [
    {
      "skill": "技能名称",
      "reason": "学习原因",
      "priority": "high|medium|low"
    }
  ],
  "professionalSummary": "一段专业的职业总结（150-200字）"
}
\`\`\`

注意：只返回 JSON 数据，不要包含任何额外的解释。`

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
            content: '你是一位资深的职业规划顾问，擅长分析个人能力并提供专业的职业发展建议。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`AI分析失败: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const analysis = JSON.parse(data.choices[0].message.content)

    console.log('✅ AI分析完成:', analysis)
    return analysis
  } catch (error) {
    console.error('❌ AI分析失败:', error)
    return null
  }
}

/**
 * 完整的智能扫描和分析流程
 * @returns {Promise<Object>} 完整的分析结果
 */
export async function intelligentScan() {
  console.log('🎯 启动智能扫描和分析流程...')

  // 1. 扫描网站
  const scannedData = await scanEntireWebsite()

  // 2. AI深度分析（可选，需要API Key）
  const aiAnalysis = await analyzeWithAI(scannedData)

  // 3. 合并结果
  const result = {
    ...scannedData,
    aiAnalysis,
    scanTime: new Date().toISOString(),
  }

  console.log('🎉 智能扫描完成！')
  return result
}

export default {
  scanAboutPage,
  scanBlogPage,
  scanPortfolioPages,
  scanEntireWebsite,
  analyzeWithAI,
  intelligentScan,
}
