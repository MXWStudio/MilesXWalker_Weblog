import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { fetchBlogResumeData, parseLocalMarkdownFile, mergeResumeData } from '@/utils/blogParser'

/**
 * 简历数据管理 Store
 * 使用 VueUse 的 useStorage 实现自动保存草稿到 localStorage
 *
 * 功能：
 * 1. 本地数据自动保存（localStorage）
 * 2. 从博客数据生成简历
 * 3. 从 Markdown 文件导入简历
 * 4. 支持 JSON 导入导出
 * 5. 完整的简历数据 CRUD 操作
 */
export const useResumeStore = defineStore('resume', () => {
  // 使用 useStorage 自动保存到 localStorage
  const resumeData = useStorage(
    'resume-draft',
    {
      // 基本信息
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      avatar: '', // 头像 (Base64 编码的图片数据)

      // 目标岗位 (用于AI定制简历)
      targetJob: '',

      // 个人简介 (支持富文本)
      summary: '',

      // 工作经历
      experience: [
        {
          id: Date.now(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '', // 支持富文本
          current: false,
        },
      ],

      // 教育背景
      education: [
        {
          id: Date.now() + 1,
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: '',
        },
      ],

      // 技能列表
      skills: [],

      // 项目经验
      projects: [
        {
          id: Date.now() + 2,
          name: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          technologies: [],
          url: '',
        },
      ],

      // 证书和资质
      certifications: [],

      // 语言能力
      languages: [],

      // 自定义部分
      customSections: [],
    },
    localStorage,
    {
      mergeDefaults: true, // 合并默认值
    }
  )

  // 最后保存时间
  const lastSaved = useStorage('resume-last-saved', null, localStorage)

  // 模板选择
  const selectedTemplate = useStorage('resume-template', 'modern', localStorage)

  // 主题颜色
  const themeColor = useStorage('resume-theme-color', '#667eea', localStorage)

  // 加载状态（用于博客数据导入）
  const loading = ref(false)

  // 错误信息
  const error = ref(null)

  // 计算属性：检查简历是否完整
  const isComplete = computed(() => {
    return (
      resumeData.value.fullName &&
      resumeData.value.title &&
      resumeData.value.email &&
      resumeData.value.summary
    )
  })

  // 计算属性：简历完成度百分比
  const completionPercentage = computed(() => {
    const fields = [
      resumeData.value.fullName,
      resumeData.value.title,
      resumeData.value.email,
      resumeData.value.phone,
      resumeData.value.summary,
      resumeData.value.experience[0]?.company,
      resumeData.value.education[0]?.school,
      resumeData.value.skills.length > 0,
    ]

    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  })

  // 技能列表 (处理字符串和数组两种格式)
  const skillsList = computed(() => {
    if (Array.isArray(resumeData.value.skills)) {
      return resumeData.value.skills
    }
    if (typeof resumeData.value.skills === 'string') {
      return resumeData.value.skills
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    }
    return []
  })

  /**
   * 添加工作经历
   */
  function addExperience() {
    resumeData.value.experience.push({
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    })
  }

  /**
   * 删除工作经历
   */
  function removeExperience(id) {
    const index = resumeData.value.experience.findIndex(exp => exp.id === id)
    if (index > -1 && resumeData.value.experience.length > 1) {
      resumeData.value.experience.splice(index, 1)
    }
  }

  /**
   * 添加教育背景
   */
  function addEducation() {
    resumeData.value.education.push({
      id: Date.now(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    })
  }

  /**
   * 删除教育背景
   */
  function removeEducation(id) {
    const index = resumeData.value.education.findIndex(edu => edu.id === id)
    if (index > -1 && resumeData.value.education.length > 1) {
      resumeData.value.education.splice(index, 1)
    }
  }

  /**
   * 添加项目经验
   */
  function addProject() {
    resumeData.value.projects.push({
      id: Date.now(),
      name: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: [],
      url: '',
    })
  }

  /**
   * 删除项目经验
   */
  function removeProject(id) {
    const index = resumeData.value.projects.findIndex(proj => proj.id === id)
    if (index > -1) {
      resumeData.value.projects.splice(index, 1)
    }
  }

  /**
   * 添加技能
   */
  function addSkill(skill) {
    if (!Array.isArray(resumeData.value.skills)) {
      resumeData.value.skills = []
    }
    if (skill && !resumeData.value.skills.includes(skill)) {
      resumeData.value.skills.push(skill)
    }
  }

  /**
   * 删除技能
   */
  function removeSkill(skill) {
    if (Array.isArray(resumeData.value.skills)) {
      const index = resumeData.value.skills.indexOf(skill)
      if (index > -1) {
        resumeData.value.skills.splice(index, 1)
      }
    }
  }

  /**
   * 设置目标岗位
   */
  function setTargetJob(job) {
    resumeData.value.targetJob = job
  }

  /**
   * 批量应用AI优化结果
   * @param {Object} optimizedData - AI返回的优化数据
   */
  function applyOptimization(optimizedData) {
    console.log('📝 应用AI优化结果...')

    // 更新个人简介
    if (optimizedData.summary) {
      resumeData.value.summary = optimizedData.summary
      console.log('✅ 已更新个人简介')
    }

    // 更新技能列表
    if (optimizedData.skills && Array.isArray(optimizedData.skills)) {
      resumeData.value.skills = optimizedData.skills
      console.log('✅ 已更新技能列表')
    }

    // 更新工作经历
    if (optimizedData.experience && Array.isArray(optimizedData.experience)) {
      resumeData.value.experience = optimizedData.experience
      console.log('✅ 已更新工作经历')
    }

    // 更新项目经验
    if (optimizedData.projects && Array.isArray(optimizedData.projects)) {
      resumeData.value.projects = optimizedData.projects
      console.log('✅ 已更新项目经验')
    }

    // 更新教育背景
    if (optimizedData.education && Array.isArray(optimizedData.education)) {
      resumeData.value.education = optimizedData.education
      console.log('✅ 已更新教育背景')
    }

    updateSaveTime()
    console.log('✨ AI优化已全部应用')
  }

  /**
   * 部分应用AI优化结果
   * 用户可以选择应用哪些部分
   */
  function applyOptimizationPartial(optimizedData, options = {}) {
    const {
      applySummary = true,
      applySkills = true,
      applyExperience = true,
      applyProjects = true,
      applyEducation = false,
    } = options

    console.log('📝 部分应用AI优化结果...', options)

    if (applySummary && optimizedData.summary) {
      resumeData.value.summary = optimizedData.summary
    }

    if (applySkills && optimizedData.skills) {
      resumeData.value.skills = optimizedData.skills
    }

    if (applyExperience && optimizedData.experience) {
      resumeData.value.experience = optimizedData.experience
    }

    if (applyProjects && optimizedData.projects) {
      resumeData.value.projects = optimizedData.projects
    }

    if (applyEducation && optimizedData.education) {
      resumeData.value.education = optimizedData.education
    }

    updateSaveTime()
  }

  /**
   * 重置所有数据
   */
  function resetResume() {
    if (confirm('确定要清空所有简历数据吗？此操作不可撤销。')) {
      resumeData.value = {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        avatar: '',
        targetJob: '',
        summary: '',
        experience: [
          {
            id: Date.now(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            current: false,
          },
        ],
        education: [
          {
            id: Date.now() + 1,
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            gpa: '',
            description: '',
          },
        ],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        customSections: [],
      }
      lastSaved.value = null
    }
  }

  /**
   * 导出简历数据为 JSON
   */
  function exportJSON() {
    const data = JSON.stringify(resumeData.value, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-${resumeData.value.fullName || 'draft'}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 从 JSON 导入简历数据
   */
  function importJSON(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
      resumeData.value = { ...resumeData.value, ...data }
      lastSaved.value = new Date().toISOString()
      return true
    } catch (error) {
      console.error('导入失败:', error)
      return false
    }
  }

  /**
   * 从 Markdown frontmatter 导入数据
   * 使用 gray-matter 解析博客文章
   */
  function importFromMarkdown(markdownContent) {
    try {
      // 动态导入 gray-matter
      import('gray-matter').then(({ default: matter }) => {
        const { data, content } = matter(markdownContent)

        // 从 frontmatter 提取数据
        if (data.name) resumeData.value.fullName = data.name
        if (data.title) resumeData.value.title = data.title
        if (data.email) resumeData.value.email = data.email
        if (data.phone) resumeData.value.phone = data.phone
        if (data.location) resumeData.value.location = data.location
        if (data.website) resumeData.value.website = data.website

        // 如果有内容，可以作为个人简介
        if (content && data.useContentAsSummary) {
          resumeData.value.summary = content
        }

        lastSaved.value = new Date().toISOString()
      })
    } catch (error) {
      console.error('从 Markdown 导入失败:', error)
    }
  }

  /**
   * 更新保存时间
   */
  function updateSaveTime() {
    lastSaved.value = new Date().toISOString()
  }

  /**
   * 从本地博客数据生成简历
   * @param {Object} options - 博客数据配置
   * @param {Array} options.blogPosts - 博客文章数组
   * @param {Object} options.profile - 个人资料
   * @returns {Promise<void>}
   */
  async function generateFromBlog(options = {}) {
    loading.value = true
    error.value = null
    try {
      const blogData = await fetchBlogResumeData({
        source: 'local',
        ...options,
      })

      // 将博客数据映射到简历数据格式
      resumeData.value.fullName = blogData.name || resumeData.value.fullName
      resumeData.value.skills = blogData.skills || resumeData.value.skills

      // 如果有作品数据，转换为项目经验
      if (blogData.works && blogData.works.length > 0) {
        resumeData.value.projects = blogData.works.map((work, index) => ({
          id: Date.now() + index,
          name: work.title || '',
          role: '创作者',
          startDate: work.date || '',
          endDate: work.date || '',
          description: work.excerpt || '',
          technologies: work.tags || [],
          url: '',
        }))
      }

      updateSaveTime()
    } catch (err) {
      console.error('从博客生成简历失败:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * 从 Markdown 文件生成简历
   * @param {File} file - Markdown 文件对象
   * @param {Object} options - 导入选项
   * @returns {Promise<void>}
   */
  async function generateFromMarkdownFile(file, options = {}) {
    loading.value = true
    error.value = null
    try {
      const importedData = await parseLocalMarkdownFile(file)

      // 合并数据
      const merged = mergeResumeData(resumeData.value, importedData, {
        overwriteBasicInfo: options.overwriteBasicInfo ?? true,
        appendExperience: options.appendExperience ?? false,
        appendEducation: options.appendEducation ?? false,
        overwriteSkills: options.overwriteSkills ?? true,
      })

      resumeData.value = merged
      updateSaveTime()
    } catch (err) {
      console.error('从 Markdown 生成简历失败:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * 从 API 生成简历
   * @param {String} apiUrl - API 地址
   * @returns {Promise<void>}
   */
  async function generateFromAPI(apiUrl) {
    loading.value = true
    error.value = null
    try {
      const apiData = await fetchBlogResumeData({
        source: 'api',
        apiUrl,
      })

      // 映射 API 数据到简历格式
      resumeData.value.fullName = apiData.name || resumeData.value.fullName
      resumeData.value.skills = apiData.skills || resumeData.value.skills

      if (apiData.works && apiData.works.length > 0) {
        resumeData.value.projects = apiData.works.map((work, index) => ({
          id: Date.now() + index,
          name: work.title || '',
          role: '创作者',
          startDate: work.date || '',
          endDate: work.date || '',
          description: work.excerpt || '',
          technologies: work.tags || [],
          url: '',
        }))
      }

      updateSaveTime()
    } catch (err) {
      console.error('从 API 生成简历失败:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * 清除错误信息
   */
  function clearError() {
    error.value = null
  }

  // 监听数据变化，自动更新保存时间
  watch(
    resumeData,
    () => {
      updateSaveTime()
    },
    { deep: true }
  )

  return {
    // 状态
    resumeData,
    lastSaved,
    selectedTemplate,
    themeColor,
    loading,
    error,

    // 计算属性
    isComplete,
    completionPercentage,
    skillsList,

    // 基础 CRUD 方法
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addProject,
    removeProject,
    addSkill,
    removeSkill,
    setTargetJob,
    resetResume,
    updateSaveTime,

    // AI优化方法
    applyOptimization,
    applyOptimizationPartial,

    // 导入导出方法
    exportJSON,
    importJSON,
    importFromMarkdown,

    // 博客数据生成方法
    generateFromBlog,
    generateFromMarkdownFile,
    generateFromAPI,
    clearError,
  }
})
