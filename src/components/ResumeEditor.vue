<!-- ResumeEditor.vue - 简历编辑器组件（可编辑区域） -->
<template>
  <div class="resume-editor">
    <!-- 基本信息 -->
    <div class="editor-card">
      <div class="card-header">
        <h2 class="card-title">基本信息</h2>
        <button class="btn-toggle" type="button" @click="toggleBasicInfo">
          {{ showBasicInfo ? '🔼 折叠' : '🔽 展开' }}
        </button>
      </div>

      <!-- 可折叠的基本信息区域 -->
      <div v-show="showBasicInfo" class="collapsible-content">
        <!-- 头像上传 -->
        <div class="form-group">
          <label for="avatar">个人头像</label>
          <div class="avatar-upload-wrapper">
            <div class="avatar-preview-container">
              <div v-if="resumeData.avatar" class="avatar-preview">
                <img :src="resumeData.avatar" alt="头像预览" class="avatar-image" />
                <button
                  type="button"
                  class="btn-remove-avatar"
                  title="删除头像"
                  @click="removeAvatar"
                >
                  ✕
                </button>
              </div>
              <div v-else class="avatar-placeholder">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>点击上传头像</span>
              </div>
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              style="display: none"
              @change="handleAvatarUpload"
            />
            <button type="button" class="btn-upload-avatar" @click="triggerAvatarUpload">
              {{ resumeData.avatar ? '更换头像' : '上传头像' }}
            </button>
          </div>
          <small class="form-hint">支持 JPG、PNG、WEBP 格式，建议尺寸 400x400 像素</small>
        </div>

        <div class="form-group">
          <label for="fullName">姓名 *</label>
          <input
            id="fullName"
            v-model="resumeData.fullName"
            type="text"
            placeholder="请输入您的姓名"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="title">职位 *</label>
          <JobSelector v-model="resumeData.title" />
        </div>

        <div class="form-group">
          <label for="targetJob">目标岗位</label>
          <JobSelector v-model="resumeData.targetJob" placeholder="例如：资深前端工程师" />
          <small class="form-hint">用于AI定制简历，可与当前职位不同</small>
        </div>

        <div class="form-group">
          <label for="email">邮箱 *</label>
          <input
            id="email"
            v-model="resumeData.email"
            type="email"
            placeholder="your.email@example.com"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="phone">电话</label>
          <input
            id="phone"
            v-model="resumeData.phone"
            type="tel"
            placeholder="+86 138 0000 0000"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="location">地址</label>
          <input
            id="location"
            v-model="resumeData.location"
            type="text"
            placeholder="例如：北京市朝阳区"
            class="form-input"
          />
        </div>
      </div>
    </div>

    <!-- 个人简介 -->
    <div class="editor-card">
      <div class="card-header">
        <h2 class="card-title">个人简介</h2>
        <button class="btn-toggle" type="button" @click="toggleSummary">
          {{ showSummary ? '🔼 折叠' : '🔽 展开' }}
        </button>
      </div>

      <div v-show="showSummary" class="collapsible-content">
        <div class="form-group">
          <label>简介</label>
          <RichTextEditor
            v-model="resumeData.summary"
            placeholder="简要介绍您的职业背景、技能特长和职业目标..."
            min-height="150px"
          />
        </div>
      </div>
    </div>

    <!-- 工作经历 -->
    <div class="editor-card">
      <div class="card-header">
        <h2 class="card-title">工作经历</h2>
        <button class="btn-toggle" type="button" @click="toggleExperience">
          {{ showExperience ? '🔼 折叠' : '🔽 展开' }}
        </button>
      </div>

      <div v-show="showExperience" class="collapsible-content">
        <div v-for="(exp, index) in resumeData.experience" :key="exp.id" class="list-item">
          <div class="item-header">
            <h3 class="item-number">经历 {{ index + 1 }}</h3>
            <button
              v-if="resumeData.experience.length > 1"
              class="btn-remove"
              type="button"
              @click="removeExperience(exp.id)"
            >
              删除
            </button>
          </div>

          <div class="form-group">
            <label>公司名称</label>
            <input v-model="exp.company" type="text" placeholder="公司名称" class="form-input" />
          </div>

          <div class="form-group">
            <label>职位</label>
            <input v-model="exp.position" type="text" placeholder="职位名称" class="form-input" />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label>开始日期</label>
              <input v-model="exp.startDate" type="text" placeholder="2020-01" class="form-input" />
            </div>
            <div class="form-group flex-1">
              <label>结束日期</label>
              <input
                v-model="exp.endDate"
                type="text"
                placeholder="2023-06 或 至今"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label>工作描述</label>
            <RichTextEditor
              v-model="exp.description"
              placeholder="描述您的主要职责和成就..."
              min-height="100px"
            />
          </div>
        </div>
        <button class="btn-add" type="button" @click="addExperience">+ 添加工作经历</button>
      </div>
    </div>

    <!-- 教育背景 -->
    <div class="editor-card">
      <div class="card-header">
        <h2 class="card-title">教育背景</h2>
        <button class="btn-toggle" type="button" @click="toggleEducation">
          {{ showEducation ? '🔼 折叠' : '🔽 展开' }}
        </button>
      </div>

      <div v-show="showEducation" class="collapsible-content">
        <div v-for="(edu, index) in resumeData.education" :key="edu.id" class="list-item">
          <div class="item-header">
            <h3 class="item-number">教育 {{ index + 1 }}</h3>
            <button
              v-if="resumeData.education.length > 1"
              class="btn-remove"
              type="button"
              @click="removeEducation(edu.id)"
            >
              删除
            </button>
          </div>

          <div class="form-group">
            <label>学校名称</label>
            <input v-model="edu.school" type="text" placeholder="学校名称" class="form-input" />
          </div>

          <div class="form-group">
            <label>专业</label>
            <input
              v-model="edu.degree"
              type="text"
              placeholder="例如：计算机科学与技术（本科）"
              class="form-input"
            />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label>开始日期</label>
              <input v-model="edu.startDate" type="text" placeholder="2016-09" class="form-input" />
            </div>
            <div class="form-group flex-1">
              <label>结束日期</label>
              <input v-model="edu.endDate" type="text" placeholder="2020-06" class="form-input" />
            </div>
          </div>
        </div>
        <button class="btn-add" type="button" @click="addEducation">+ 添加教育背景</button>
      </div>
    </div>

    <!-- 项目经验 -->
    <div class="editor-card">
      <div class="card-header">
        <h2 class="card-title">项目经验</h2>
        <button class="btn-toggle" type="button" @click="toggleProjects">
          {{ showProjects ? '🔼 折叠' : '🔽 展开' }}
        </button>
      </div>

      <div v-show="showProjects" class="collapsible-content">
        <div v-for="(proj, index) in resumeData.projects" :key="proj.id" class="list-item">
          <div class="item-header">
            <h3 class="item-number">项目 {{ index + 1 }}</h3>
            <button
              v-if="resumeData.projects.length > 1"
              class="btn-remove"
              type="button"
              @click="removeProject(proj.id)"
            >
              删除
            </button>
          </div>

          <div class="form-group">
            <label>项目名称</label>
            <input v-model="proj.name" type="text" placeholder="项目名称" class="form-input" />
          </div>

          <div class="form-group">
            <label>担任角色</label>
            <input
              v-model="proj.role"
              type="text"
              placeholder="例如：前端负责人"
              class="form-input"
            />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label>开始日期</label>
              <input
                v-model="proj.startDate"
                type="text"
                placeholder="2022-01"
                class="form-input"
              />
            </div>
            <div class="form-group flex-1">
              <label>结束日期</label>
              <input v-model="proj.endDate" type="text" placeholder="2023-06" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label>项目描述</label>
            <RichTextEditor
              v-model="proj.description"
              placeholder="描述项目背景、主要职责和成果..."
              min-height="100px"
            />
          </div>

          <div class="form-group">
            <label>技术栈</label>
            <input
              v-model="proj.technologiesStr"
              type="text"
              placeholder="Vue3, TypeScript, Node.js (用逗号分隔)"
              class="form-input"
              @input="updateProjectTechnologies(proj, $event)"
            />
            <small class="form-hint">多个技术用逗号分隔</small>
          </div>

          <div class="form-group">
            <label>项目链接</label>
            <input
              v-model="proj.url"
              type="url"
              placeholder="https://example.com"
              class="form-input"
            />
          </div>
        </div>
        <button class="btn-add" type="button" @click="addProject">+ 添加项目经验</button>
      </div>
    </div>

    <!-- 技能 -->
    <div class="editor-card">
      <div class="card-header">
        <h2 class="card-title">技能</h2>
        <button class="btn-toggle" type="button" @click="toggleSkills">
          {{ showSkills ? '🔼 折叠' : '🔽 展开' }}
        </button>
      </div>

      <div v-show="showSkills" class="collapsible-content">
        <div class="form-group">
          <label for="skills">技能列表</label>
          <textarea
            id="skills"
            v-model="skillsText"
            rows="4"
            placeholder="每行一个技能，例如：&#10;Vue.js&#10;JavaScript/TypeScript&#10;Node.js"
            class="form-textarea"
            @input="updateSkills"
          ></textarea>
          <small class="form-hint">每行输入一个技能</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useResumeStore } from '@/stores/resumeStore'
import RichTextEditor from '@/components/resume/RichTextEditor.vue'
import JobSelector from '@/components/JobSelector.vue'

// 使用简历 Store
const resumeStore = useResumeStore()
const { resumeData } = storeToRefs(resumeStore)

// Store 方法
const {
  addExperience,
  removeExperience,
  addEducation,
  removeEducation,
  addProject,
  removeProject,
} = resumeStore

// 技能文本(用于 textarea 显示)
const skillsText = ref('')

// 所有区域的折叠状态（默认全部折叠）
const showBasicInfo = ref(false)
const showSummary = ref(false)
const showExperience = ref(false)
const showEducation = ref(false)
const showProjects = ref(false)
const showSkills = ref(false)

// 头像上传相关
const avatarInput = ref(null)

/**
 * 切换各区域展开/折叠
 */
const toggleBasicInfo = () => {
  showBasicInfo.value = !showBasicInfo.value
}

const toggleSummary = () => {
  showSummary.value = !showSummary.value
}

const toggleExperience = () => {
  showExperience.value = !showExperience.value
}

const toggleEducation = () => {
  showEducation.value = !showEducation.value
}

const toggleProjects = () => {
  showProjects.value = !showProjects.value
}

const toggleSkills = () => {
  showSkills.value = !showSkills.value
}

/**
 * 初始化技能文本
 */
onMounted(() => {
  // 将技能数组或字符串转换为文本
  if (Array.isArray(resumeData.value.skills)) {
    skillsText.value = resumeData.value.skills.join('\n')
  } else if (typeof resumeData.value.skills === 'string') {
    skillsText.value = resumeData.value.skills
  }

  // 初始化项目技术栈显示
  resumeData.value.projects.forEach(proj => {
    if (Array.isArray(proj.technologies)) {
      proj.technologiesStr = proj.technologies.join(', ')
    }
  })
})

/**
 * 更新技能列表
 */
const updateSkills = event => {
  const text = event.target.value
  skillsText.value = text

  // 将文本转换为数组保存到 store
  const skillsArray = text
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  resumeData.value.skills = skillsArray
}

/**
 * 更新项目技术栈
 */
const updateProjectTechnologies = (proj, event) => {
  const text = event.target.value
  proj.technologiesStr = text

  // 将逗号分隔的字符串转换为数组
  proj.technologies = text
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
}

/**
 * 触发头像上传
 */
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

/**
 * 处理头像上传
 */
const handleAvatarUpload = event => {
  const file = event.target.files[0]
  if (!file) return

  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('请上传 JPG、PNG 或 WEBP 格式的图片')
    return
  }

  // 检查文件大小 (限制为 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('图片大小不能超过 5MB')
    return
  }

  // 读取文件并转换为 Base64
  const reader = new FileReader()
  reader.onload = e => {
    const base64Image = e.target.result
    resumeData.value.avatar = base64Image
  }
  reader.onerror = () => {
    alert('图片读取失败，请重试')
  }
  reader.readAsDataURL(file)

  // 清空输入，允许重新上传同一文件
  event.target.value = ''
}

/**
 * 删除头像
 */
const removeAvatar = () => {
  if (confirm('确定要删除头像吗？')) {
    resumeData.value.avatar = ''
  }
}

// 监听项目变化,同步技术栈显示
watch(
  () => resumeData.value.projects,
  newProjects => {
    newProjects.forEach(proj => {
      if (Array.isArray(proj.technologies) && !proj.technologiesStr) {
        proj.technologiesStr = proj.technologies.join(', ')
      }
    })
  },
  { deep: true }
)
</script>

<style scoped>
.resume-editor {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 编辑卡片 */
.editor-card {
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.card-title {
  font-size: 1.5em;
  color: #2d3748;
  margin: 0;
}

/* 折叠/展开按钮 */
.btn-toggle {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-toggle:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 可折叠内容区域 */
.collapsible-content {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单元素 */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95em;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.95em;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.85em;
  color: #718096;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.flex-1 {
  flex: 1;
}

/* 列表项目 */
.list-item {
  padding: 20px;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 15px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.item-number {
  font-size: 1.1em;
  color: #2d3748;
}

/* 按钮 */
.btn-remove {
  padding: 6px 14px;
  background: #fc8181;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #f56565;
  transform: translateY(-1px);
}

.btn-add {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-add:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* 头像上传 */
.avatar-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.avatar-preview-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e0;
  transition: all 0.3s ease;
}

.avatar-preview-container:hover {
  border-color: #667eea;
  background: #edf2f7;
}

.avatar-preview {
  position: relative;
  width: 150px;
  height: 150px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-remove-avatar {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  background: #fc8181;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-remove-avatar:hover {
  background: #f56565;
  transform: scale(1.1);
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 150px;
  height: 150px;
  color: #a0aec0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-placeholder:hover {
  color: #667eea;
  transform: scale(1.05);
}

.avatar-placeholder span {
  font-size: 0.9em;
  font-weight: 500;
  text-align: center;
}

.btn-upload-avatar {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  transition: all 0.3s ease;
  align-self: center;
}

.btn-upload-avatar:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 响应式 */
@media (max-width: 640px) {
  .editor-card {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .avatar-preview,
  .avatar-placeholder {
    width: 120px;
    height: 120px;
  }
}
</style>
