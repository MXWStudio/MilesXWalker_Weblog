<!-- ResumePreview.vue - 简历预览组件（PDF 预览区） -->
<template>
  <div class="resume-preview-wrapper">
    <div class="preview-sticky">
      <!-- 预览工具栏 -->
      <div class="preview-toolbar">
        <h2 class="preview-title">预览</h2>
        <div class="preview-actions">
          <button class="btn-preview" type="button" title="在新窗口预览" @click="handlePreview">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            预览
          </button>
          <button
            class="btn-download"
            type="button"
            :disabled="isExporting"
            @click="handleDownload"
          >
            <svg
              v-if="!isExporting"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span v-if="isExporting">导出中...</span>
            <span v-else>下载 PDF</span>
          </button>
        </div>
      </div>

      <!-- 简历预览内容 -->
      <div id="resume-preview" ref="previewRef" class="resume-preview">
        <!-- 简历头部 -->
        <div class="resume-header">
          <div class="header-content">
            <!-- 头像 -->
            <div v-if="resumeData.avatar" class="resume-avatar">
              <img :src="resumeData.avatar" alt="个人头像" class="avatar-image" />
            </div>
            <!-- 个人信息 -->
            <div class="header-info">
              <h1 class="resume-name">{{ resumeData.fullName || '您的姓名' }}</h1>
              <p class="resume-title">{{ resumeData.title || '职位' }}</p>
              <div class="resume-contact">
                <span v-if="resumeData.email">📧 {{ resumeData.email }}</span>
                <span v-if="resumeData.phone">📞 {{ resumeData.phone }}</span>
                <span v-if="resumeData.location">📍 {{ resumeData.location }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 个人简介 -->
        <div v-if="resumeData.summary" class="resume-section">
          <h2 class="resume-section-title">个人简介</h2>
          <div class="resume-summary" v-html="resumeData.summary"></div>
        </div>

        <!-- 工作经历 -->
        <div
          v-if="resumeData.experience.length && resumeData.experience[0].company"
          class="resume-section"
        >
          <h2 class="resume-section-title">工作经历</h2>
          <div v-for="exp in resumeData.experience" :key="exp.id" class="resume-experience-item">
            <div v-if="exp.company" class="resume-exp-header">
              <div>
                <h3 class="resume-company">{{ exp.company }}</h3>
                <p class="resume-position">{{ exp.position }}</p>
              </div>
              <p class="resume-date">
                {{ exp.startDate }}{{ exp.endDate ? ' - ' + exp.endDate : '' }}
              </p>
            </div>
            <div v-if="exp.description" class="resume-description" v-html="exp.description"></div>
          </div>
        </div>

        <!-- 项目经验 -->
        <div
          v-if="resumeData.projects && resumeData.projects.length && resumeData.projects[0].name"
          class="resume-section"
        >
          <h2 class="resume-section-title">项目经验</h2>
          <div v-for="proj in resumeData.projects" :key="proj.id" class="resume-project-item">
            <div v-if="proj.name" class="resume-proj-header">
              <div>
                <h3 class="resume-project-name">
                  {{ proj.name }}
                  <span v-if="proj.role" class="resume-project-role"> - {{ proj.role }}</span>
                </h3>
                <p v-if="proj.technologies" class="resume-project-tech">
                  技术栈：{{
                    Array.isArray(proj.technologies)
                      ? proj.technologies.join(', ')
                      : proj.technologies
                  }}
                </p>
              </div>
              <p class="resume-date">
                {{ proj.startDate }}{{ proj.endDate ? ' - ' + proj.endDate : '' }}
              </p>
            </div>
            <div v-if="proj.description" class="resume-description" v-html="proj.description"></div>
            <div v-if="proj.url" class="resume-project-url">
              🔗 项目链接：<a :href="proj.url" target="_blank" rel="noopener">{{ proj.url }}</a>
            </div>
          </div>
        </div>

        <!-- 教育背景 -->
        <div
          v-if="resumeData.education.length && resumeData.education[0].school"
          class="resume-section"
        >
          <h2 class="resume-section-title">教育背景</h2>
          <div v-for="edu in resumeData.education" :key="edu.id" class="resume-education-item">
            <div v-if="edu.school" class="resume-edu-header">
              <div>
                <h3 class="resume-school">{{ edu.school }}</h3>
                <p class="resume-degree">{{ edu.degree }}</p>
              </div>
              <p class="resume-date">
                {{ edu.startDate }}{{ edu.endDate ? ' - ' + edu.endDate : '' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 技能 -->
        <div v-if="resumeData.skills && skillsList.length > 0" class="resume-section">
          <h2 class="resume-section-title">技能</h2>
          <div class="resume-skills">
            <span v-for="(skill, index) in skillsList" :key="index" class="resume-skill-tag">
              {{ skill }}
            </span>
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
import { exportResumePDF, previewPDF } from '@/utils/pdfExporter'

// 使用简历 Store
const resumeStore = useResumeStore()
const { resumeData, skillsList } = storeToRefs(resumeStore)

// 预览元素引用
const previewRef = ref(null)

// 导出状态
const isExporting = ref(false)

/**
 * 预览 PDF
 */
const handlePreview = async () => {
  if (!previewRef.value) {
    alert('无法找到预览元素')
    return
  }

  try {
    await previewPDF(previewRef.value)
  } catch (error) {
    console.error('PDF 预览错误:', error)
    alert('PDF 预览失败，请重试')
  }
}

/**
 * 下载 PDF
 */
const handleDownload = async () => {
  if (!previewRef.value) {
    alert('无法找到预览元素')
    return
  }

  if (!resumeData.value.fullName) {
    alert('请至少填写您的姓名后再导出')
    return
  }

  isExporting.value = true

  try {
    const fileName = `${resumeData.value.fullName}-简历`
    const result = await exportResumePDF(previewRef.value, fileName)

    if (!result.success) {
      throw new Error('PDF 导出失败')
    }
  } catch (error) {
    console.error('PDF 导出错误:', error)
    alert('PDF 导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
.resume-preview-wrapper {
  position: relative;
}

.preview-sticky {
  position: sticky;
  top: 20px;
}

/* 预览工具栏 */
.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.preview-title {
  font-size: 1.5em;
  color: #2d3748;
  font-weight: 700;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.btn-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-preview:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-download {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-download:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.btn-download:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 简历预览 */
.resume-preview {
  background: white;
  padding: 50px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  min-height: 500px;
}

.resume-header {
  border-bottom: 2px solid #2d3748;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.resume-avatar {
  flex-shrink: 0;
}

.resume-avatar .avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header-info {
  flex: 1;
}

.resume-name {
  font-size: 2.5em;
  color: #1a202c;
  margin-bottom: 8px;
  font-weight: 700;
}

.resume-title {
  font-size: 1.3em;
  color: #4a5568;
  margin-bottom: 12px;
}

.resume-contact {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.95em;
  color: #718096;
}

.resume-section {
  margin-bottom: 30px;
}

.resume-section-title {
  font-size: 1.4em;
  color: #2d3748;
  margin-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
  font-weight: 700;
}

.resume-summary {
  color: #4a5568;
  line-height: 1.7;
}

.resume-experience-item,
.resume-education-item,
.resume-project-item {
  margin-bottom: 20px;
}

.resume-exp-header,
.resume-edu-header,
.resume-proj-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 15px;
}

.resume-company,
.resume-school,
.resume-project-name {
  font-size: 1.15em;
  color: #2d3748;
  margin-bottom: 4px;
  font-weight: 600;
}

.resume-position,
.resume-degree {
  color: #4a5568;
  font-size: 0.95em;
}

.resume-project-role {
  color: #667eea;
  font-size: 0.9em;
  font-weight: 500;
}

.resume-project-tech {
  color: #718096;
  font-size: 0.85em;
  margin-top: 4px;
}

.resume-project-url {
  color: #718096;
  font-size: 0.85em;
  margin-top: 8px;
}

.resume-project-url a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.resume-project-url a:hover {
  color: #5a67d8;
  text-decoration: underline;
}

.resume-date {
  color: #718096;
  font-size: 0.9em;
  white-space: nowrap;
}

.resume-description {
  color: #4a5568;
  line-height: 1.6;
  margin-top: 8px;
}

.resume-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.resume-skill-tag {
  background: #edf2f7;
  color: #2d3748;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 500;
}

/* 富文本内容样式 */
:deep(.resume-summary p),
:deep(.resume-description p) {
  margin-bottom: 0.5em;
}

:deep(.resume-summary p:last-child),
:deep(.resume-description p:last-child) {
  margin-bottom: 0;
}

:deep(.resume-summary ul),
:deep(.resume-description ul),
:deep(.resume-summary ol),
:deep(.resume-description ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

:deep(.resume-summary li),
:deep(.resume-description li) {
  margin-bottom: 0.25em;
}

:deep(.resume-summary strong),
:deep(.resume-description strong) {
  font-weight: 700;
  color: #1a202c;
}

/* 响应式 */
@media (max-width: 640px) {
  .resume-preview {
    padding: 30px 20px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .resume-avatar .avatar-image {
    width: 100px;
    height: 100px;
  }

  .resume-contact {
    justify-content: center;
  }

  .resume-name {
    font-size: 1.8em;
  }

  .resume-exp-header,
  .resume-edu-header {
    flex-direction: column;
    gap: 5px;
  }

  .resume-date {
    white-space: normal;
  }
}
</style>
