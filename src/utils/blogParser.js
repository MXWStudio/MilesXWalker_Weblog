/**
 * 博客数据解析工具
 * 用于从博客文章中抓取和提取简历相关数据
 */

import matter from 'gray-matter'

/**
 * 从 Markdown 文件解析简历数据
 * @param {String} markdownContent - Markdown 文件内容
 * @returns {Object} 解析后的简历数据
 */
export function parseMarkdownResume(markdownContent) {
  try {
    const { data: frontmatter, content } = matter(markdownContent)

    const resumeData = {
      // 基本信息
      fullName: frontmatter.name || frontmatter.author || '',
      title: frontmatter.title || frontmatter.position || '',
      email: frontmatter.email || '',
      phone: frontmatter.phone || '',
      location: frontmatter.location || frontmatter.address || '',
      website: frontmatter.website || frontmatter.blog || '',

      // 如果指定使用内容作为简介
      summary: frontmatter.useContentAsSummary ? content.trim() : frontmatter.summary || '',

      // 工作经历
      experience: parseExperience(frontmatter.experience || []),

      // 教育背景
      education: parseEducation(frontmatter.education || []),

      // 技能
      skills: parseSkills(frontmatter.skills || []),

      // 项目
      projects: parseProjects(frontmatter.projects || []),
    }

    return resumeData
  } catch (error) {
    console.error('解析 Markdown 简历失败:', error)
    throw new Error('Markdown 格式错误或内容无效')
  }
}

/**
 * 解析工作经历
 */
function parseExperience(experienceData) {
  if (!Array.isArray(experienceData)) return []

  return experienceData.map((exp, index) => ({
    id: Date.now() + index,
    company: exp.company || '',
    position: exp.position || exp.role || '',
    startDate: exp.startDate || exp.from || '',
    endDate: exp.endDate || exp.to || '',
    description: exp.description || exp.desc || '',
    current: exp.current || false,
  }))
}

/**
 * 解析教育背景
 */
function parseEducation(educationData) {
  if (!Array.isArray(educationData)) return []

  return educationData.map((edu, index) => ({
    id: Date.now() + index + 100,
    school: edu.school || edu.university || '',
    degree: edu.degree || '',
    field: edu.field || edu.major || '',
    startDate: edu.startDate || edu.from || '',
    endDate: edu.endDate || edu.to || '',
    gpa: edu.gpa || '',
    description: edu.description || '',
  }))
}

/**
 * 解析技能列表
 */
function parseSkills(skillsData) {
  if (Array.isArray(skillsData)) {
    return skillsData
  }
  if (typeof skillsData === 'string') {
    return skillsData
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }
  return []
}

/**
 * 解析项目经验
 */
function parseProjects(projectsData) {
  if (!Array.isArray(projectsData)) return []

  return projectsData.map((proj, index) => ({
    id: Date.now() + index + 200,
    name: proj.name || proj.title || '',
    role: proj.role || proj.position || '',
    startDate: proj.startDate || proj.from || '',
    endDate: proj.endDate || proj.to || '',
    description: proj.description || proj.desc || '',
    technologies: proj.technologies || proj.tech || [],
    url: proj.url || proj.link || '',
  }))
}

/**
 * 从 URL 获取博客内容并解析
 * @param {String} url - 博客文章 URL
 * @returns {Promise<Object>} 解析后的简历数据
 */
export async function fetchAndParseBlog(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`)
    }

    const markdown = await response.text()
    return parseMarkdownResume(markdown)
  } catch (error) {
    console.error('获取博客内容失败:', error)
    throw new Error('无法获取博客内容，请检查 URL 是否正确')
  }
}

/**
 * 从本地文件读取并解析简历
 * @param {File} file - Markdown 文件对象
 * @returns {Promise<Object>} 解析后的简历数据
 */
export async function parseLocalMarkdownFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = event => {
      try {
        const markdown = event.target.result
        const resumeData = parseMarkdownResume(markdown)
        resolve(resumeData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsText(file)
  })
}

/**
 * 示例 Markdown 简历模板
 */
export const RESUME_MARKDOWN_TEMPLATE = `---
name: 张三
title: 前端工程师
email: zhangsan@example.com
phone: +86 138 0000 0000
location: 北京市朝阳区
website: https://zhangsan.dev
summary: 拥有5年前端开发经验，精通 Vue.js 和 React

experience:
  - company: 某科技公司
    position: 高级前端工程师
    startDate: 2020-01
    endDate: 至今
    description: |
      • 负责核心产品前端架构设计
      • 性能优化提升 40%
      • 带领团队完成 10+ 项目
  
  - company: 另一家公司
    position: 前端工程师
    startDate: 2018-06
    endDate: 2019-12
    description: 负责公司官网和后台系统开发

education:
  - school: 清华大学
    degree: 计算机科学与技术（本科）
    startDate: 2014-09
    endDate: 2018-06
    gpa: 3.8

skills:
  - Vue.js
  - React
  - TypeScript
  - Node.js
  - Git

projects:
  - name: 电商平台前端
    role: 前端负责人
    startDate: 2021-01
    endDate: 2021-12
    description: 负责电商平台的前端架构设计和开发
    technologies:
      - Vue 3
      - Vite
      - Pinia
    url: https://example.com
---

# 关于我

这是我的个人简介内容...
`

/**
 * 验证简历数据的完整性
 * @param {Object} resumeData - 简历数据
 * @returns {Object} 验证结果 { valid: boolean, missing: array }
 */
export function validateResumeData(resumeData) {
  const requiredFields = ['fullName', 'title', 'email']
  const missing = []

  requiredFields.forEach(field => {
    if (!resumeData[field] || resumeData[field].trim() === '') {
      missing.push(field)
    }
  })

  return {
    valid: missing.length === 0,
    missing,
    missingLabels: missing.map(field => {
      const labels = {
        fullName: '姓名',
        title: '职位',
        email: '邮箱',
      }
      return labels[field] || field
    }),
  }
}

/**
 * 合并简历数据（用于部分导入）
 * @param {Object} current - 当前简历数据
 * @param {Object} imported - 导入的简历数据
 * @param {Object} options - 合并选项
 * @returns {Object} 合并后的简历数据
 */
export function mergeResumeData(current, imported, options = {}) {
  const {
    overwriteBasicInfo = true,
    appendExperience = false,
    appendEducation = false,
    overwriteSkills = true,
  } = options

  const merged = { ...current }

  // 基本信息
  if (overwriteBasicInfo) {
    ;['fullName', 'title', 'email', 'phone', 'location', 'website', 'summary'].forEach(field => {
      if (imported[field]) {
        merged[field] = imported[field]
      }
    })
  }

  // 工作经历
  if (imported.experience && imported.experience.length > 0) {
    merged.experience = appendExperience
      ? [...current.experience, ...imported.experience]
      : imported.experience
  }

  // 教育背景
  if (imported.education && imported.education.length > 0) {
    merged.education = appendEducation
      ? [...current.education, ...imported.education]
      : imported.education
  }

  // 技能
  if (imported.skills && imported.skills.length > 0) {
    merged.skills = overwriteSkills ? imported.skills : [...current.skills, ...imported.skills]
  }

  return merged
}

/**
 * 从博客内容中抓取个人简历数据
 * 支持从本地 Markdown 文件或 API 获取博客数据
 *
 * @param {Object} options - 配置选项
 * @param {String} options.source - 数据源: 'api' | 'local' | 'markdown'
 * @param {String} options.apiUrl - API地址(当source为'api'时使用)
 * @param {File} options.file - 本地Markdown文件(当source为'markdown'时使用)
 * @param {Array} options.blogPosts - 博客文章数组(当source为'local'时使用)
 * @param {Object} options.profile - 个人资料配置
 * @returns {Promise<Object>} 提取后的简历数据
 *
 * @example
 * // 从API获取
 * const data = await fetchBlogResumeData({
 *   source: 'api',
 *   apiUrl: 'https://api.example.com/blog'
 * })
 *
 * // 从本地数据获取
 * const data = await fetchBlogResumeData({
 *   source: 'local',
 *   blogPosts: [...],
 *   profile: { name: 'Miles Walker', hobbies: [...] }
 * })
 */
export async function fetchBlogResumeData(options = {}) {
  const { source = 'local', apiUrl, file, blogPosts, profile } = options

  try {
    let data

    switch (source) {
      case 'api':
        data = await fetchFromAPI(apiUrl)
        break

      case 'markdown':
        data = await fetchFromMarkdownFile(file)
        break

      case 'local':
      default:
        data = fetchFromLocalData(blogPosts, profile)
        break
    }

    return data
  } catch (error) {
    console.error('抓取博客简历数据失败:', error)
    throw new Error('无法获取博客数据: ' + error.message)
  }
}

/**
 * 从API获取博客数据
 * @private
 */
async function fetchFromAPI(apiUrl) {
  if (!apiUrl) {
    throw new Error('未提供API地址')
  }

  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error(`HTTP错误! 状态: ${response.status}`)
  }

  const data = await response.json()
  return parseBlogData(data)
}

/**
 * 从Markdown文件获取博客数据
 * @private
 */
async function fetchFromMarkdownFile(file) {
  if (!file) {
    throw new Error('未提供Markdown文件')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = event => {
      try {
        const markdown = event.target.result
        const { data: frontmatter } = matter(markdown)
        const parsedData = parseBlogData(frontmatter)
        resolve(parsedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsText(file)
  })
}

/**
 * 从本地数据提取博客简历数据
 * @private
 */
function fetchFromLocalData(blogPosts = [], profile = {}) {
  // 默认个人信息
  const defaultProfile = {
    name: 'Miles Walker',
    hobbies: ['摄影', '编程', '设计', '3D建模', '徒步'],
    skills: ['Vue3', 'Lightroom', 'Figma', 'Ableton', 'Three.js', 'TypeScript'],
  }

  const personalInfo = { ...defaultProfile, ...profile }

  // 从博客文章中提取作品信息
  const works = blogPosts.map(post => {
    // 从分类和标题中提取标签
    const tags = extractTags(post)

    return {
      title: post.title || '',
      tags: tags,
      date: post.date || '',
      category: post.category || '',
      excerpt: post.excerpt || '',
    }
  })

  // 按日期降序排序(最新在前)
  works.sort((a, b) => new Date(b.date) - new Date(a.date))

  return {
    name: personalInfo.name,
    hobbies: personalInfo.hobbies,
    works: works,
    skills: personalInfo.skills,
  }
}

/**
 * 从博客文章中提取标签
 * @private
 */
function extractTags(post) {
  const tags = []

  // 添加分类作为标签
  if (post.category) {
    tags.push(post.category)
  }

  // 从标题中识别技术栈
  const techKeywords = {
    Vue3: ['Vue3', 'Vue', 'vue3'],
    TypeScript: ['TypeScript', 'TS'],
    '3D建模': ['3D', '建模', 'Three.js', 'Blender'],
    摄影: ['摄影', '照片', '风光', '街拍', '后期'],
    开发: ['开发', 'App', '应用', '系统'],
    Web3D: ['Web3D', '虚拟人物'],
    设计: ['设计', 'UI', 'UX', 'Figma'],
  }

  for (const [tag, keywords] of Object.entries(techKeywords)) {
    if (keywords.some(keyword => post.title.includes(keyword) || post.excerpt?.includes(keyword))) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  // 如果没有标签,使用默认标签
  if (tags.length === 0) {
    tags.push('其他')
  }

  return tags
}

/**
 * 解析博客数据为标准格式
 * @private
 */
function parseBlogData(data) {
  return {
    name: data.name || data.author || 'Miles Walker',
    hobbies: data.hobbies || ['摄影', '编程', '设计'],
    works: data.works || data.projects || [],
    skills: parseSkills(data.skills || []),
  }
}

/**
 * 示例使用方法和测试数据
 */
export const BLOG_RESUME_EXAMPLE = {
  // 从本地博客数据抓取
  local: {
    source: 'local',
    blogPosts: [
      {
        title: '新疆风光摄影记录',
        excerpt: '记录新疆独特的自然风光和人文景观',
        date: '2025-02-10',
        category: '摄影作品',
      },
      {
        title: 'TrailLog App 开发日志',
        excerpt: '从 FullTrack 到 Trail Log：打造纯粹的徒步工具',
        date: '2025-06-01',
        category: '技术分享',
      },
      {
        title: '我的3D建模学习之路',
        excerpt: '从零基础到创作作品集的完整历程',
        date: '2024-12-15',
        category: '3D建模',
      },
    ],
    profile: {
      name: 'Miles Walker',
      hobbies: ['摄影', '编程', '设计', '徒步'],
      skills: ['Vue3', 'Lightroom', 'Figma', 'Ableton', 'Three.js'],
    },
  },

  // 从Markdown文件抓取的示例格式
  markdown: `---
name: Miles Walker
author: Miles Walker
hobbies:
  - 摄影
  - 编程
  - 3D建模
  - 徒步
skills:
  - Vue3
  - TypeScript
  - Lightroom
  - Figma
  - Three.js
  - Ableton
works:
  - title: 新疆风光摄影记录
    tags: [风景, 旅行, 胶片]
    date: 2025-02-10
  - title: TrailLog App 开发日志
    tags: [Vue3, 独立开发]
    date: 2025-06-01
---

# 关于我

这是个人简介...
`,
}
