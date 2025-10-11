<!-- ResumeGenerator.vue - 简历生成器主组件 -->
<template>
  <div class="resume-generator-container">
    <div class="resume-generator-wrapper">
      <!-- 头部 -->
      <header class="generator-header">
        <h1 class="header-title">📄 专业简历生成器</h1>
        <p class="header-subtitle">创建一份专业的个人简历 · 自动保存草稿 · 一键导出PDF</p>

        <!-- 统计信息 -->
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-label">完成度</span>
            <div class="stat-progress">
              <div class="stat-progress-bar" :style="{ width: completionPercentage + '%' }"></div>
            </div>
            <span class="stat-value">{{ completionPercentage }}%</span>
          </div>
          <div v-if="lastSaved" class="stat-item">
            <span class="stat-label">上次保存</span>
            <span class="stat-value">{{ formatTime(lastSaved) }}</span>
          </div>
        </div>

        <!-- 导入功能 -->
        <div class="header-actions">
          <button class="btn-import" type="button" @click="showImportDialog = true">
            📥 导入简历
          </button>
          <button class="btn-export-json" type="button" @click="handleExportJSON">
            💾 导出 JSON
          </button>
        </div>
      </header>

      <!-- AI 岗位定制功能区 -->
      <div class="ai-optimization-section">
        <div class="ai-card">
          <div class="ai-header">
            <h2 class="ai-title">🤖 智能简历生成</h2>
            <p class="ai-subtitle">
              从个人网站抓取基本信息 · 根据目标岗位智能优化内容 · 一键生成专业简历
            </p>
          </div>

          <div class="ai-content">
            <!-- 从本站获取信息 -->
            <div class="ai-section">
              <h3 class="section-label">📍 第一步：导入个人信息</h3>
              <div class="ai-action-group">
                <p class="info-text">从本站自动获取您的个人信息、作品集和项目经验</p>
                <div class="btn-group">
                  <button
                    class="btn-ai-fetch"
                    type="button"
                    :disabled="scanning"
                    @click="handleIntelligentScan"
                  >
                    <span v-if="scanning" class="loading-spinner"></span>
                    {{ scanning ? '智能扫描中...' : '🔍 智能扫描网站' }}
                  </button>
                  <button
                    v-if="hasData"
                    class="btn-refresh"
                    type="button"
                    :disabled="scanning"
                    title="刷新并重新获取最新信息"
                    @click="handleRefreshData"
                  >
                    <span v-if="scanning" class="loading-spinner"></span>
                    {{ scanning ? '刷新中...' : '🔄 刷新' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 岗位优化 -->
            <div class="ai-section">
              <h3 class="section-label">🎯 第二步：选择目标岗位并优化</h3>

              <!-- 优化模式选择 -->
              <div class="optimization-mode-selector">
                <label class="mode-label">优化模式：</label>
                <div class="mode-buttons">
                  <button
                    :class="['mode-btn', { active: optimizationMode === 'quick' }]"
                    type="button"
                    @click="optimizationMode = 'quick'"
                  >
                    ⚡ 快速优化
                    <span class="mode-desc">仅优化简介和技能</span>
                  </button>
                  <button
                    :class="['mode-btn', { active: optimizationMode === 'deep' }]"
                    type="button"
                    @click="optimizationMode = 'deep'"
                  >
                    🔍 深度优化
                    <span class="mode-desc">全面优化所有内容</span>
                  </button>
                </div>
              </div>

              <!-- 选项1: 手动输入岗位 -->
              <div class="ai-input-group">
                <input
                  v-model="jobInput"
                  type="text"
                  placeholder="请输入目标岗位，例如：前端开发工程师 / 摄影师 / UI设计师 / 数据分析师"
                  class="ai-input"
                  @keyup.enter="handleAIOptimize"
                />
                <button
                  class="btn-ai-optimize"
                  type="button"
                  :disabled="!jobInput.trim() || aiOptimizing"
                  @click="handleAIOptimize"
                >
                  <span v-if="aiOptimizing" class="loading-spinner"></span>
                  {{ aiOptimizing ? 'AI 优化中...' : '🚀 AI 优化简历' }}
                </button>
              </div>

              <!-- 选项2: 上传招聘岗位截图 -->
              <div class="image-upload-section">
                <div class="divider">
                  <span class="divider-text">或</span>
                </div>
                <p class="info-text">📸 上传招聘岗位截图，AI 自动识别并生成匹配简历</p>
                <input
                  ref="jobImageInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleJobImageUpload"
                />
                <button
                  class="btn-upload-image"
                  type="button"
                  :disabled="uploadingJobImage"
                  @click="triggerJobImageUpload"
                >
                  <span v-if="uploadingJobImage" class="loading-spinner"></span>
                  {{ uploadingJobImage ? '识别中...' : '📷 上传岗位截图' }}
                </button>
                <p class="upload-hint">支持 JPG、PNG 格式，建议上传清晰的招聘信息截图</p>
              </div>
            </div>

            <!-- 快捷岗位选择 -->
            <div class="quick-jobs">
              <span class="quick-jobs-label">快速选择：</span>
              <button
                v-for="job in quickJobOptions"
                :key="job"
                class="quick-job-btn"
                type="button"
                @click="selectQuickJob(job)"
              >
                {{ job }}
              </button>
            </div>

            <!-- AI 优化提示 -->
            <div v-if="aiOptimizationResult" class="ai-result">
              <div class="result-header">
                <span class="result-icon">✨</span>
                <span class="result-title">AI 优化完成</span>
              </div>
              <p class="result-message">{{ aiOptimizationResult }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 岗位匹配分析结果 -->
      <JobMatchAnalysis
        v-if="showMatchAnalysis && matchAnalysis"
        :match-data="matchAnalysis"
        @apply-optimizations="applyMatchOptimizations"
        @download-report="handleDownloadMatchReport"
      />

      <!-- 主体内容 -->
      <div class="generator-content">
        <!-- 左侧：可编辑区（可折叠） -->
        <div :class="['editor-section', { collapsed: !showEditor }]">
          <div class="editor-toggle-bar">
            <button class="btn-toggle-editor" @click="showEditor = !showEditor">
              {{ showEditor ? '👈 收起编辑器' : '✏️ 展开编辑器修正' }}
            </button>
          </div>
          <transition name="slide-fade">
            <div v-show="showEditor" class="editor-content">
              <ResumeEditor />
            </div>
          </transition>
        </div>

        <!-- 右侧：预览区 -->
        <div class="preview-section">
          <ResumePreview />
        </div>
      </div>
    </div>

    <!-- AI优化结果预览对话框 -->
    <div v-if="showOptimizationPreview" class="modal-overlay" @click="cancelOptimization">
      <div class="modal-content optimization-preview-modal" @click.stop>
        <div class="modal-header">
          <h3>✨ AI 优化结果预览</h3>
          <button class="modal-close" @click="cancelOptimization">✕</button>
        </div>

        <div class="modal-body">
          <div v-if="optimizationResult" class="optimization-content">
            <!-- 匹配度分析 -->
            <div v-if="optimizationResult.matchAnalysis" class="match-section">
              <h4 class="section-title">📊 岗位匹配分析</h4>
              <div class="match-score-card">
                <div class="score-display">
                  <span class="score-number"
                    >{{ optimizationResult.matchAnalysis.matchScore }}%</span
                  >
                  <span class="score-label">匹配度</span>
                </div>
                <div class="match-details">
                  <div
                    v-if="optimizationResult.matchAnalysis.strengths?.length"
                    class="detail-section"
                  >
                    <strong>💪 优势：</strong>
                    <ul>
                      <li
                        v-for="(item, index) in optimizationResult.matchAnalysis.strengths"
                        :key="index"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="optimizationResult.matchAnalysis.gaps?.length" class="detail-section">
                    <strong>⚠️ 需要提升：</strong>
                    <ul>
                      <li
                        v-for="(item, index) in optimizationResult.matchAnalysis.gaps"
                        :key="index"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 优化内容对比 -->
            <div class="optimization-comparison">
              <h4 class="section-title">📝 优化内容</h4>

              <!-- 个人简介 -->
              <div class="comparison-item">
                <label class="comparison-label">个人简介</label>
                <div class="comparison-boxes">
                  <div class="box before">
                    <span class="box-title">优化前</span>
                    <p>{{ resumeStore.resumeData.summary || '未填写' }}</p>
                  </div>
                  <div class="arrow">→</div>
                  <div class="box after">
                    <span class="box-title">优化后</span>
                    <p>{{ optimizationResult.summary }}</p>
                  </div>
                </div>
              </div>

              <!-- 技能列表 -->
              <div class="comparison-item">
                <label class="comparison-label">技能列表</label>
                <div class="comparison-boxes">
                  <div class="box before">
                    <span class="box-title">优化前</span>
                    <div class="skills-list">
                      <span
                        v-for="skill in resumeStore.resumeData.skills"
                        :key="skill"
                        class="skill-tag"
                      >
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                  <div class="arrow">→</div>
                  <div class="box after">
                    <span class="box-title">优化后</span>
                    <div class="skills-list">
                      <span
                        v-for="skill in optimizationResult.skills"
                        :key="skill"
                        class="skill-tag highlighted"
                      >
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 深度优化：工作经历和项目 -->
              <div v-if="optimizationMode === 'deep'">
                <div v-if="optimizationResult.experience?.length" class="comparison-item">
                  <label class="comparison-label">工作经历优化</label>
                  <p class="optimization-note">
                    已优化 {{ optimizationResult.experience.length }} 段工作经历
                  </p>
                </div>
                <div v-if="optimizationResult.projects?.length" class="comparison-item">
                  <label class="comparison-label">项目经验优化</label>
                  <p class="optimization-note">
                    已优化 {{ optimizationResult.projects.length }} 个项目
                  </p>
                </div>
              </div>
            </div>

            <!-- 优化建议 -->
            <div v-if="optimizationResult.recommendations?.length" class="recommendations-section">
              <h4 class="section-title">💡 优化建议</h4>
              <ul class="recommendations-list">
                <li v-for="(rec, index) in optimizationResult.recommendations" :key="index">
                  {{ rec }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="modal-actions">
            <button class="btn-cancel" @click="cancelOptimization">取消</button>
            <button class="btn-apply" @click="applyOptimizationResult">✅ 应用优化</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 导入对话框 -->
    <div v-if="showImportDialog" class="modal-overlay" @click="showImportDialog = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>导入简历数据</h3>
          <button class="modal-close" @click="showImportDialog = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="import-tabs">
            <button
              :class="['tab-btn', { active: importTab === 'file' }]"
              @click="importTab = 'file'"
            >
              从文件导入
            </button>
            <button
              :class="['tab-btn', { active: importTab === 'url' }]"
              @click="importTab = 'url'"
            >
              从 URL 导入
            </button>
            <button
              :class="['tab-btn', { active: importTab === 'json' }]"
              @click="importTab = 'json'"
            >
              JSON 数据
            </button>
          </div>

          <!-- 从文件导入 -->
          <div v-if="importTab === 'file'" class="import-panel">
            <p class="import-hint">上传 Markdown (.md) 格式的简历文件</p>
            <input
              ref="fileInput"
              type="file"
              accept=".md,.markdown"
              class="file-input"
              @change="handleFileImport"
            />
          </div>

          <!-- 从 URL 导入 -->
          <div v-if="importTab === 'url'" class="import-panel">
            <p class="import-hint">输入博客文章或 Markdown 文件的 URL</p>
            <input
              v-model="importURL"
              type="url"
              placeholder="https://example.com/resume.md"
              class="url-input"
            />
            <button class="btn-primary" @click="handleURLImport">导入</button>
          </div>

          <!-- JSON 数据导入 -->
          <div v-if="importTab === 'json'" class="import-panel">
            <p class="import-hint">粘贴之前导出的 JSON 数据</p>
            <textarea
              v-model="importJSON"
              placeholder="粘贴 JSON 数据..."
              rows="10"
              class="json-textarea"
            ></textarea>
            <button class="btn-primary" @click="handleJSONImport">导入</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useResumeStore } from '@/stores/resumeStore'
import ResumeEditor from '@/components/ResumeEditor.vue'
import ResumePreview from '@/components/ResumePreview.vue'
import { parseLocalMarkdownFile, fetchAndParseBlog, mergeResumeData } from '@/utils/blogParser'
import { generateSmartResume } from '@/composables/useAI'
import { extractTextFromImage } from '@/utils/ocrParser'
import { analyzeJobText } from '@/ai/useJobAnalyzer'
import { generateAIResume } from '@/ai/useAIResumeGenerator'
import { intelligentScan } from '@/ai/useWebsiteScanner'
import { analyzeJobMatch } from '@/ai/useJobMatcher'
import { optimizeResume, quickOptimize, deepOptimize } from '@/ai/useResumeOptimizer'
import JobMatchAnalysis from '@/components/JobMatchAnalysis.vue'

// 使用简历 Store
const resumeStore = useResumeStore()
const { completionPercentage, lastSaved } = storeToRefs(resumeStore)
const { exportJSON, importJSON: importJSONToStore } = resumeStore

// 导入对话框状态
const showImportDialog = ref(false)
const importTab = ref('file')
const importURL = ref('')
const importJSON = ref('')
const fileInput = ref(null)

// AI 岗位定制状态
const jobInput = ref('')
const aiOptimizing = ref(false)
const aiOptimizationResult = ref('')

// 从本站获取信息状态
const fetchingInfo = ref(false)
const hasData = computed(() => {
  return resumeStore.resumeData.fullName || resumeStore.resumeData.email
})

// 岗位图片上传状态
const uploadingJobImage = ref(false)
const jobImageInput = ref(null)

// 快捷岗位选项
const quickJobOptions = ['前端开发', 'UI设计师', '产品经理', '数据分析师', '摄影师', '视频剪辑']

// 智能扫描状态
const scanning = ref(false)
const scannedProfile = ref(null)

// 岗位匹配分析结果
const matchAnalysis = ref(null)
const showMatchAnalysis = ref(false)

// 左侧编辑器显示状态
const showEditor = ref(false)

// 优化模式选择
const optimizationMode = ref('quick') // 'quick' | 'deep'
const showOptimizationPreview = ref(false)
const optimizationResult = ref(null)

/**
 * 格式化时间显示
 */
const formatTime = timestamp => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return date.toLocaleDateString('zh-CN')
}

/**
 * 导出 JSON
 */
const handleExportJSON = () => {
  exportJSON()
}

/**
 * 从文件导入
 */
const handleFileImport = async event => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const resumeData = await parseLocalMarkdownFile(file)

    // 询问是否覆盖现有数据
    if (confirm('是否要覆盖现有简历数据？点击"取消"将追加数据。')) {
      importJSONToStore(resumeData)
    } else {
      const merged = mergeResumeData(resumeStore.resumeData, resumeData, {
        appendExperience: true,
        appendEducation: true,
      })
      importJSONToStore(merged)
    }

    showImportDialog.value = false
    alert('导入成功！')
  } catch (error) {
    console.error('文件导入失败:', error)
    alert('导入失败: ' + error.message)
  }
}

/**
 * 从 URL 导入
 */
const handleURLImport = async () => {
  if (!importURL.value) {
    alert('请输入 URL')
    return
  }

  try {
    const resumeData = await fetchAndParseBlog(importURL.value)

    if (confirm('是否要覆盖现有简历数据？点击"取消"将追加数据。')) {
      importJSONToStore(resumeData)
    } else {
      const merged = mergeResumeData(resumeStore.resumeData, resumeData, {
        appendExperience: true,
        appendEducation: true,
      })
      importJSONToStore(merged)
    }

    showImportDialog.value = false
    importURL.value = ''
    alert('导入成功！')
  } catch (error) {
    console.error('URL 导入失败:', error)
    alert('导入失败: ' + error.message)
  }
}

/**
 * JSON 导入
 */
const handleJSONImport = () => {
  if (!importJSON.value) {
    alert('请粘贴 JSON 数据')
    return
  }

  try {
    const result = importJSONToStore(importJSON.value)
    if (result) {
      showImportDialog.value = false
      importJSON.value = ''
      alert('导入成功！')
    } else {
      alert('导入失败，请检查 JSON 格式')
    }
  } catch (error) {
    console.error('JSON 导入失败:', error)
    alert('导入失败: ' + error.message)
  }
}

/**
 * AI 优化简历（增强版）
 * 支持快速优化和深度优化两种模式
 */
const handleAIOptimize = async () => {
  if (!jobInput.value.trim()) {
    alert('请先输入目标岗位')
    return
  }

  // 检查是否有基本信息
  if (!resumeStore.resumeData.fullName && !resumeStore.resumeData.email) {
    const shouldScan = confirm('检测到尚未填写个人信息。\n\n是否先进行智能扫描，自动获取你的信息？')
    if (shouldScan) {
      await handleIntelligentScan()
    } else {
      alert('请先填写基本信息或从本站获取个人信息后再使用 AI 优化功能')
      return
    }
  }

  aiOptimizing.value = true
  aiOptimizationResult.value = ''
  showMatchAnalysis.value = false

  try {
    console.log('🚀 开始 AI 简历优化...')
    console.log('目标岗位:', jobInput.value)
    console.log('优化模式:', optimizationMode.value)
    console.log('当前简历数据:', resumeStore.resumeData)

    // 设置目标岗位
    resumeStore.setTargetJob(jobInput.value)

    let result

    if (optimizationMode.value === 'deep') {
      // 深度优化：优化所有部分（简介、技能、工作经历、项目）
      console.log('🔍 使用深度优化模式...')
      result = await deepOptimize({ position: jobInput.value }, resumeStore.resumeData, {
        model: 'openai',
        lang: 'zh',
      })
    } else {
      // 快速优化：只优化简介和技能
      console.log('⚡ 使用快速优化模式...')
      result = await quickOptimize(jobInput.value, resumeStore.resumeData, {
        model: 'openai',
        lang: 'zh',
      })
    }

    console.log('✅ AI 优化完成:', result)

    // 保存优化结果并显示预览
    optimizationResult.value = result
    showOptimizationPreview.value = true

    // 执行岗位匹配分析
    try {
      console.log('🎯 开始岗位匹配分析...')
      const userProfile = scannedProfile.value || {
        skills: resumeStore.resumeData.skills,
        expertise: [],
        projects: resumeStore.resumeData.projects,
        strengths: [],
      }

      const matchResult = await analyzeJobMatch(jobInput.value, userProfile)
      matchAnalysis.value = matchResult
      showMatchAnalysis.value = true

      console.log('✅ 岗位匹配分析完成:', matchResult)
    } catch (matchError) {
      console.warn('⚠️ 岗位匹配分析失败:', matchError)
    }
  } catch (error) {
    console.error('❌ AI 优化失败:', error)

    let errorMessage = 'AI 优化失败'

    if (error.message.includes('VITE_OPENAI_API_KEY')) {
      errorMessage =
        '未配置 OpenAI API Key\n\n请在项目根目录创建 .env 文件并添加：\nVITE_OPENAI_API_KEY=your_api_key'
    } else if (error.message.includes('Ollama')) {
      errorMessage = 'Ollama 服务未启动\n\n请确保本地 Ollama 服务正在运行'
    } else {
      errorMessage = `优化失败：${error.message}\n\n提示：请检查网络连接和 API 配置`
    }

    alert(errorMessage)

    aiOptimizationResult.value = `❌ ${errorMessage.split('\n')[0]}`
    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 5000)
  } finally {
    aiOptimizing.value = false
  }
}

/**
 * 应用AI优化结果
 */
const applyOptimizationResult = () => {
  if (!optimizationResult.value) return

  console.log('📝 应用AI优化结果...')

  // 使用Store的批量更新方法
  resumeStore.applyOptimization(optimizationResult.value)

  // 显示成功提示
  const mode = optimizationMode.value === 'deep' ? '深度' : '快速'
  alert(
    `✅ ${mode}优化已成功应用！\n\n已更新：\n• 个人简介\n• 技能列表${optimizationMode.value === 'deep' ? '\n• 工作经历\n• 项目经验' : ''}`
  )

  // 关闭预览对话框
  showOptimizationPreview.value = false
  optimizationResult.value = null

  // 显示成功消息
  const matchScore = optimizationResult.value?.matchAnalysis?.matchScore || 0
  aiOptimizationResult.value = `✨ AI优化已应用！\n匹配度：${matchScore}%\n\n查看右侧预览效果 →`

  setTimeout(() => {
    aiOptimizationResult.value = ''
  }, 5000)
}

/**
 * 取消应用优化
 */
const cancelOptimization = () => {
  showOptimizationPreview.value = false
  optimizationResult.value = null
}

/**
 * 快速选择岗位
 */
const selectQuickJob = job => {
  jobInput.value = job
  handleAIOptimize()
}

/**
 * 智能扫描整个网站
 * 使用新的智能扫描器，更全面地提取信息
 */
const handleIntelligentScan = async () => {
  scanning.value = true
  aiOptimizationResult.value = '🔍 正在扫描网站所有页面...'

  try {
    console.log('🚀 启动智能扫描...')

    // 使用智能扫描器
    const profile = await intelligentScan()
    scannedProfile.value = profile

    console.log('✅ 扫描完成:', profile)

    // 自动填充基本信息
    if (profile.personalInfo) {
      const info = profile.personalInfo
      if (info.fullName) resumeStore.resumeData.fullName = info.fullName
      if (info.email) resumeStore.resumeData.email = info.email
      if (info.phone) resumeStore.resumeData.phone = info.phone
      if (info.location) resumeStore.resumeData.location = info.location
      if (info.website) resumeStore.resumeData.website = info.website
      if (info.summary) resumeStore.resumeData.summary = info.summary
    }

    // 填充技能
    if (profile.skills && profile.skills.length > 0) {
      resumeStore.resumeData.skills = [
        ...new Set([...resumeStore.resumeData.skills, ...profile.skills]),
      ]
    }

    // 填充项目经验
    if (profile.projects && profile.projects.length > 0) {
      resumeStore.resumeData.projects = profile.projects
    }

    // 显示成功信息
    let message = `✅ 智能扫描完成！\n\n`
    message += `📊 扫描结果:\n`
    message += `   • 提取了 ${profile.skills.length} 项技能\n`
    message += `   • 识别了 ${profile.projects.length} 个项目\n`
    message += `   • 分析了 ${profile.expertise.length} 个专业领域\n`

    if (profile.aiAnalysis) {
      message += `\n🤖 AI深度分析:\n`
      message += `   • 核心竞争力: ${profile.aiAnalysis.coreCompetencies?.slice(0, 3).join(', ')}\n`
      message += `   • 推荐职业: ${profile.aiAnalysis.careerPaths?.slice(0, 3).join(', ')}\n`
    }

    message += `\n💡 接下来请输入目标岗位，AI将为你生成定制化简历！`

    aiOptimizationResult.value = message

    // 10秒后自动隐藏
    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 12000)

    alert('✅ 智能扫描完成！已自动填充所有信息。')
  } catch (error) {
    console.error('❌ 智能扫描失败:', error)
    aiOptimizationResult.value = `❌ 扫描失败: ${error.message}`
    alert('扫描失败: ' + error.message)

    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 5000)
  } finally {
    scanning.value = false
  }
}

/**
 * 从本站获取个人信息（旧方法，保留作为备用）
 * 直接从当前网站抓取基本信息并自动填充
 */
const handleFetchFromCurrentSite = async () => {
  // 使用新的智能扫描方法
  await handleIntelligentScan()
  return

  /* 旧代码保留 - 已废弃，使用新的 handleIntelligentScan 代替
  fetchingInfo.value = true
  aiOptimizationResult.value = ''

  try {
    const currentSiteURL = window.location.origin
    const personalData = await fetchAndParseBlog(currentSiteURL)

    if (personalData.fullName) resumeStore.resumeData.fullName = personalData.fullName
    if (personalData.title) resumeStore.resumeData.title = personalData.title
    if (personalData.email) resumeStore.resumeData.email = personalData.email
    if (personalData.phone) resumeStore.resumeData.phone = personalData.phone
    if (personalData.location) resumeStore.resumeData.location = personalData.location
    if (personalData.website) resumeStore.resumeData.website = personalData.website
    if (personalData.summary) resumeStore.resumeData.summary = personalData.summary

    if (personalData.experience && personalData.experience.length > 0) {
      resumeStore.resumeData.experience = personalData.experience
    }
    if (personalData.education && personalData.education.length > 0) {
      resumeStore.resumeData.education = personalData.education
    }
    if (personalData.skills && personalData.skills.length > 0) {
      resumeStore.resumeData.skills = personalData.skills
    }
    if (personalData.projects && personalData.projects.length > 0) {
      resumeStore.resumeData.projects = personalData.projects
    }

    alert('个人信息获取成功！已自动填充所有内容。')
  } catch (error) {
    console.error('从本站获取信息失败:', error)
    alert('获取失败: ' + error.message)
  } finally {
    fetchingInfo.value = false
  }
  */
}

/**
 * 刷新并重新获取信息
 * 清空现有数据并重新扫描网站
 */
const handleRefreshData = async () => {
  if (
    confirm(
      '刷新将清空现有简历数据并重新智能扫描网站。\n\n是否继续？\n\n提示：建议先导出备份当前数据。'
    )
  ) {
    // 清空现有数据
    resumeStore.resetResume()

    // 清空扫描缓存
    scannedProfile.value = null
    matchAnalysis.value = null
    showMatchAnalysis.value = false

    // 重新智能扫描
    await handleIntelligentScan()
  }
}

/**
 * 处理招聘岗位图片上传
 * 自动识别岗位信息并生成匹配的简历
 */
const handleJobImageUpload = async event => {
  const file = event.target.files[0]
  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件（JPG、PNG 等格式）')
    return
  }

  // 检查是否有基本信息
  if (!resumeStore.resumeData.fullName && !resumeStore.resumeData.email) {
    alert('请先填写基本信息或从本站获取个人信息后再使用此功能')
    return
  }

  uploadingJobImage.value = true
  aiOptimizationResult.value = '📷 正在识别图片中的岗位信息...'

  try {
    console.log('🖼️ 开始处理岗位图片上传...')
    console.log('文件名:', file.name)
    console.log('文件大小:', (file.size / 1024).toFixed(2), 'KB')

    // 步骤 1: 从图片中提取文本 (OCR)
    aiOptimizationResult.value = '📷 正在识别图片文字...'
    const jobText = await extractTextFromImage(file)
    console.log('✅ OCR 识别完成')
    console.log('识别的文本:', jobText)

    if (!jobText || jobText.trim().length < 10) {
      throw new Error('无法从图片中识别出有效的文字内容，请确保图片清晰且包含招聘信息')
    }

    // 步骤 2: 分析岗位文本
    aiOptimizationResult.value = '🤖 AI 正在分析岗位信息...'
    const jobData = await analyzeJobText(jobText)
    console.log('✅ 岗位分析完成')
    console.log('岗位数据:', jobData)

    if (!jobData || !jobData.position) {
      throw new Error('无法从文本中提取岗位信息，请尝试使用更清晰的招聘图片')
    }

    // 步骤 3: 自动生成岗位匹配简历
    aiOptimizationResult.value = `🚀 正在为 "${jobData.position}" 岗位生成匹配简历...`
    const aiResume = await generateAIResume(jobData.position, resumeStore.resumeData, {
      model: 'openai', // 使用 OpenAI 模型
      lang: 'zh',
      detailed: true,
    })

    console.log('✅ AI 简历生成完成')
    console.log('生成的简历:', aiResume)

    // 步骤 4: 将生成的简历应用到 Store
    if (aiResume.summary) {
      if (!resumeStore.resumeData.summary || confirm('是否用 AI 生成的简介替换当前简介？')) {
        resumeStore.resumeData.summary = aiResume.summary
      }
    }

    if (aiResume.highlightedSkills && aiResume.highlightedSkills.length > 0) {
      const newSkills = aiResume.highlightedSkills.filter(
        skill => !resumeStore.resumeData.skills.includes(skill)
      )
      if (newSkills.length > 0) {
        newSkills.forEach(skill => resumeStore.addSkill(skill))
      }
    }

    // 设置目标岗位
    resumeStore.setTargetJob(jobData.position)
    jobInput.value = jobData.position

    // 显示成功结果
    const resultMessages = [
      `✅ 已为岗位 "${jobData.position}" 生成匹配简历！`,
      jobData.company ? `🏢 公司：${jobData.company}` : '',
      jobData.keywords?.length > 0 ? `🔑 关键词：${jobData.keywords.join(', ')}` : '',
      '',
      '✨ 简历已自动优化：',
      aiResume.summary ? '• 已生成定制化个人简介' : '',
      aiResume.highlightedSkills?.length > 0
        ? `• 已添加推荐技能：${aiResume.highlightedSkills.join(', ')}`
        : '',
      '',
      '📋 优化建议：',
      ...(aiResume.recommendations || []),
    ].filter(Boolean)

    aiOptimizationResult.value = resultMessages.join('\n')

    // 弹窗提示成功
    alert(
      `✅ 岗位识别成功！\n\n岗位：${jobData.position}\n${jobData.company ? `公司：${jobData.company}\n` : ''}\n简历已自动优化完成！`
    )

    // 10秒后自动隐藏结果
    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 15000)
  } catch (error) {
    console.error('❌ 岗位图片处理失败:', error)

    // 友好的错误提示
    let errorMessage = '处理失败：' + error.message

    if (error.message.includes('VITE_OPENAI_API_KEY')) {
      errorMessage =
        '❌ 未配置 OpenAI API Key\n\n请在项目根目录创建 .env 文件并添加：\nVITE_OPENAI_API_KEY=your_api_key'
    } else if (error.message.includes('识别') || error.message.includes('OCR')) {
      errorMessage = `❌ 图片识别失败\n\n${error.message}\n\n提示：\n• 请确保图片清晰\n• 文字内容完整可见\n• 尝试使用更高分辨率的图片`
    } else if (error.message.includes('分析') || error.message.includes('提取')) {
      errorMessage = `❌ 岗位分析失败\n\n${error.message}\n\n提示：\n• 确保图片包含完整的招聘信息\n• 岗位名称清晰可见`
    }

    alert(errorMessage)

    aiOptimizationResult.value = `❌ ${error.message}`
    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 8000)
  } finally {
    uploadingJobImage.value = false
    // 清空文件选择，允许重新上传同一文件
    if (jobImageInput.value) {
      jobImageInput.value.value = ''
    }
  }
}

/**
 * 触发图片选择
 */
const triggerJobImageUpload = () => {
  jobImageInput.value?.click()
}

/**
 * 应用匹配优化建议
 */
const applyMatchOptimizations = matchData => {
  console.log('📝 应用优化建议...')

  // 这里可以根据匹配分析的建议自动优化简历
  // 例如：调整技能顺序、突出相关经验等

  alert('✨ 优化建议已应用！\n\n请查看简历预览区域的变化。')
}

/**
 * 下载匹配报告
 */
const handleDownloadMatchReport = () => {
  console.log('📥 下载匹配报告')
  // 报告已在 JobMatchAnalysis 组件中下载
  alert('✅ 岗位匹配分析报告已下载！')
}
</script>

<style scoped>
.resume-generator-container {
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.resume-generator-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* 头部 */
.generator-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-title {
  font-size: 2.8em;
  color: #1a202c;
  margin-bottom: 10px;
  font-weight: 700;
}

.header-subtitle {
  font-size: 1.1em;
  color: #4a5568;
  margin-bottom: 20px;
}

/* 统计信息 */
.header-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.9em;
  color: #718096;
  font-weight: 500;
}

.stat-value {
  font-size: 0.95em;
  color: #2d3748;
  font-weight: 600;
}

.stat-progress {
  width: 100px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.stat-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 头部操作按钮 */
.header-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-import,
.btn-export-json {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-import {
  background: #4299e1;
  color: white;
}

.btn-import:hover {
  background: #3182ce;
  transform: translateY(-2px);
}

.btn-export-json {
  background: #48bb78;
  color: white;
}

.btn-export-json:hover {
  background: #38a169;
  transform: translateY(-2px);
}

/* 主体内容 */
.generator-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  position: relative;
}

@media (min-width: 1024px) {
  .generator-content {
    grid-template-columns: auto 1fr;
    gap: 20px;
  }
}

/* 左侧编辑区（可折叠） */
.editor-section {
  transition: all 0.3s ease;
}

.editor-section.collapsed {
  width: auto;
}

.editor-toggle-bar {
  position: sticky;
  top: 20px;
  z-index: 100;
  margin-bottom: 16px;
}

.btn-toggle-editor {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
  width: 100%;
}

.btn-toggle-editor:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.editor-section.collapsed .btn-toggle-editor {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 20px 12px;
  width: auto;
}

.editor-content {
  max-width: 600px;
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

@media (max-width: 1024px) {
  .editor-section.collapsed .btn-toggle-editor {
    writing-mode: horizontal-tb;
    text-orientation: mixed;
    padding: 12px 20px;
    width: 100%;
  }
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.3em;
  color: #2d3748;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5em;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f7fafc;
  color: #2d3748;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

/* 导入标签页 */
.import-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #f7fafc;
}

.tab-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* 导入面板 */
.import-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.import-hint {
  color: #718096;
  font-size: 0.9em;
}

.file-input,
.url-input,
.json-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.95em;
  font-family: inherit;
}

.json-textarea {
  resize: vertical;
  font-family: 'Courier New', monospace;
}

.btn-primary {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  transition: all 0.2s ease;
  align-self: flex-end;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

/* AI 岗位定制区域 */
.ai-optimization-section {
  margin-bottom: 40px;
}

.ai-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.ai-header {
  margin-bottom: 28px;
}

.ai-title {
  font-size: 1.8em;
  color: white;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.ai-subtitle {
  font-size: 1em;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
}

.ai-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* AI 功能区块 */
.ai-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-label {
  font-size: 1em;
  color: white;
  margin: 0 0 12px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* AI 操作区 */
.ai-action-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95em;
  margin: 0;
  line-height: 1.5;
}

.btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ai-input-group {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.ai-input {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.ai-input:focus {
  outline: none;
  border-color: white;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ai-input::placeholder {
  color: #a0aec0;
}

.btn-ai-optimize {
  padding: 14px 28px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 700;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-ai-optimize:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-ai-optimize:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 获取信息按钮 */
.btn-ai-fetch {
  padding: 14px 28px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 700;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-ai-fetch:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-ai-fetch:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 刷新按钮 */
.btn-refresh {
  padding: 14px 24px;
  background: #ed8936;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 700;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-refresh:hover:not(:disabled) {
  background: #dd6b20;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-refresh:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #667eea;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 快捷岗位选择 */
.quick-jobs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.quick-jobs-label {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.quick-job-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
}

.quick-job-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* 图片上传区域 */
.image-upload-section {
  margin-top: 20px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 10px 0;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 45%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.divider::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: 45%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.divider-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
  padding: 0 10px;
}

.btn-upload-image {
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 700;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-upload-image:hover:not(:disabled) {
  background: white;
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-upload-image:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.upload-hint {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85em;
  margin: 0;
  text-align: center;
  font-style: italic;
}

/* AI 优化结果 */
.ai-result {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.result-icon {
  font-size: 1.5em;
}

.result-title {
  font-size: 1.1em;
  font-weight: 700;
  color: #2d3748;
}

.result-message {
  color: #4a5568;
  line-height: 1.8;
  margin: 0;
  white-space: pre-line;
}

/* 优化模式选择器 */
.optimization-mode-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.mode-label {
  color: white;
  font-weight: 600;
  font-size: 0.95em;
}

.mode-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mode-btn {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.mode-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
}

.mode-desc {
  font-size: 0.8em;
  font-weight: 400;
  opacity: 0.9;
}

/* 优化预览对话框 */
.optimization-preview-modal {
  max-width: 900px;
  max-height: 85vh;
}

.optimization-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-size: 1.1em;
  color: #2d3748;
  margin: 0 0 12px 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 匹配度分析卡片 */
.match-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
}

.match-section .section-title {
  color: white;
}

.match-score-card {
  display: flex;
  gap: 24px;
  align-items: center;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  min-width: 120px;
}

.score-number {
  font-size: 2.5em;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 0.9em;
  opacity: 0.9;
  margin-top: 4px;
}

.match-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
}

.detail-section strong {
  display: block;
  margin-bottom: 8px;
}

.detail-section ul {
  margin: 0;
  padding-left: 20px;
  font-size: 0.9em;
}

.detail-section li {
  margin: 4px 0;
}

/* 优化对比 */
.optimization-comparison {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comparison-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comparison-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95em;
}

.comparison-boxes {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: stretch;
}

.box {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  min-height: 80px;
}

.box.after {
  background: #f0fff4;
  border-color: #9ae6b4;
}

.box-title {
  display: block;
  font-size: 0.8em;
  color: #718096;
  margin-bottom: 8px;
  font-weight: 600;
}

.box p {
  margin: 0;
  color: #2d3748;
  line-height: 1.6;
  font-size: 0.9em;
}

.arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1.5em;
  font-weight: 700;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  padding: 4px 12px;
  background: #e2e8f0;
  border-radius: 16px;
  font-size: 0.85em;
  color: #4a5568;
}

.skill-tag.highlighted {
  background: #48bb78;
  color: white;
}

.optimization-note {
  color: #4a5568;
  font-size: 0.9em;
  margin: 0;
  padding: 12px;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

/* 优化建议 */
.recommendations-section {
  background: #fffaf0;
  border: 1px solid #fbd38d;
  border-radius: 12px;
  padding: 16px;
}

.recommendations-section .section-title {
  color: #744210;
}

.recommendations-list {
  margin: 0;
  padding-left: 24px;
  color: #744210;
}

.recommendations-list li {
  margin: 8px 0;
  line-height: 1.6;
}

/* 对话框操作按钮 */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-apply {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-apply {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-apply:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 响应式 */
@media (max-width: 768px) {
  .comparison-boxes {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .arrow {
    transform: rotate(90deg);
  }

  .match-score-card {
    flex-direction: column;
  }

  .mode-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .resume-generator-container {
    padding: 20px 10px;
  }

  .header-title {
    font-size: 2em;
  }

  .ai-card {
    padding: 24px 20px;
  }

  .ai-title {
    font-size: 1.5em;
  }

  .ai-input-group {
    flex-direction: column;
  }

  .btn-ai-optimize {
    width: 100%;
    justify-content: center;
  }

  .quick-jobs {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-group {
    width: 100%;
  }

  .btn-ai-fetch,
  .btn-refresh {
    flex: 1;
    justify-content: center;
    min-width: 120px;
  }
}
</style>
