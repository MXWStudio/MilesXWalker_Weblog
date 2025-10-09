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
                    :disabled="fetchingInfo"
                    @click="handleFetchFromCurrentSite"
                  >
                    <span v-if="fetchingInfo" class="loading-spinner"></span>
                    {{ fetchingInfo ? '获取中...' : '📥 从本站获取信息' }}
                  </button>
                  <button
                    v-if="hasData"
                    class="btn-refresh"
                    type="button"
                    :disabled="fetchingInfo"
                    title="刷新并重新获取最新信息"
                    @click="handleRefreshData"
                  >
                    <span v-if="fetchingInfo" class="loading-spinner"></span>
                    {{ fetchingInfo ? '刷新中...' : '🔄 刷新' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 岗位优化 -->
            <div class="ai-section">
              <h3 class="section-label">🎯 第二步：选择目标岗位</h3>
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

      <!-- 主体内容 -->
      <div class="generator-content">
        <!-- 左侧：可编辑区 -->
        <div class="editor-section">
          <ResumeEditor />
        </div>

        <!-- 右侧：预览区 -->
        <div class="preview-section">
          <ResumePreview />
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

// 快捷岗位选项
const quickJobOptions = ['前端开发', 'UI设计师', '产品经理', '数据分析师', '摄影师', '视频剪辑']

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
 * AI 优化简历
 * 当前为非 AI 版本：根据岗位设置目标岗位字段，提供优化建议
 * 未来接入真实 AI 时：可以调用 AI API 重写简历内容
 */
const handleAIOptimize = async () => {
  if (!jobInput.value.trim()) {
    alert('请先输入目标岗位')
    return
  }

  aiOptimizing.value = true
  aiOptimizationResult.value = ''

  try {
    // 模拟 AI 处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 设置目标岗位到简历数据
    resumeStore.setTargetJob(jobInput.value)

    // 提供优化建议（非 AI 版本）
    const suggestions = [
      `已将目标岗位设置为："${jobInput.value}"`,
      '建议：在个人简介中突出与该岗位相关的经验',
      '建议：调整技能顺序，将相关技能置于前列',
      '建议：在工作经历中强调与岗位匹配的项目成果',
    ]

    aiOptimizationResult.value = suggestions.join('\n')

    // 3秒后自动隐藏结果
    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 8000)

    // 未来接入真实 AI 时的接口示例：
    // const aiResponse = await fetch('/api/ai/optimize-resume', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     resumeData: resumeStore.resumeData,
    //     targetJob: jobInput.value,
    //   }),
    // })
    // const optimizedData = await aiResponse.json()
    // resumeStore.importJSON(optimizedData)
  } catch (error) {
    console.error('AI 优化失败:', error)
    alert('优化失败: ' + error.message)
  } finally {
    aiOptimizing.value = false
  }
}

/**
 * 快速选择岗位
 */
const selectQuickJob = job => {
  jobInput.value = job
  handleAIOptimize()
}

/**
 * 从本站获取个人信息
 * 直接从当前网站抓取基本信息并自动填充
 */
const handleFetchFromCurrentSite = async () => {
  fetchingInfo.value = true
  aiOptimizationResult.value = ''

  try {
    // 从本站获取信息（使用当前域名）
    const currentSiteURL = window.location.origin

    // 使用现有的博客抓取功能
    const personalData = await fetchAndParseBlog(currentSiteURL)

    // 填充基本信息到 Store
    if (personalData.fullName) resumeStore.resumeData.fullName = personalData.fullName
    if (personalData.title) resumeStore.resumeData.title = personalData.title
    if (personalData.email) resumeStore.resumeData.email = personalData.email
    if (personalData.phone) resumeStore.resumeData.phone = personalData.phone
    if (personalData.location) resumeStore.resumeData.location = personalData.location
    if (personalData.website) resumeStore.resumeData.website = personalData.website
    if (personalData.summary) resumeStore.resumeData.summary = personalData.summary

    // 如果有工作经历、教育、技能、项目等，也一并导入
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

    // 显示成功提示
    aiOptimizationResult.value = `✅ 成功从本站获取个人信息！
已自动填充：${personalData.fullName || '您的信息'}
接下来请选择目标岗位进行 AI 优化`

    // 8秒后自动隐藏
    setTimeout(() => {
      aiOptimizationResult.value = ''
    }, 8000)

    alert('个人信息获取成功！已自动填充所有内容。')
  } catch (error) {
    console.error('从本站获取信息失败:', error)
    alert(
      '获取失败: ' +
        error.message +
        '\n\n提示：请确保网站包含有效的个人信息数据（如 Markdown frontmatter）。'
    )
  } finally {
    fetchingInfo.value = false
  }
}

/**
 * 刷新并重新获取信息
 * 清空现有数据并重新从本站获取
 */
const handleRefreshData = async () => {
  if (
    confirm(
      '刷新将清空现有简历数据并重新从本站获取。\n\n是否继续？\n\n提示：建议先导出备份当前数据。'
    )
  ) {
    // 清空现有数据
    resumeStore.resetResume()

    // 重新获取
    await handleFetchFromCurrentSite()
  }
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
}

@media (min-width: 1024px) {
  .generator-content {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
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

/* 响应式 */
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
