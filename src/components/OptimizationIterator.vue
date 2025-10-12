<!--
  OptimizationIterator.vue
  多轮迭代优化组件
  
  功能：
  - 显示AI优化结果
  - 支持用户编辑优化后的内容
  - 用户可以写问题反馈
  - AI分析问题并二次优化
  - 支持多轮迭代
  - 最后应用到简历
  
  @author AI进化论-花生
  @date 2025-01-19
-->
<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <!-- 头部 -->
      <div class="modal-header">
        <h3>✨ AI 优化迭代器 (第{{ iterationCount }}轮)</h3>
        <button class="modal-close" @click="handleClose">✕</button>
      </div>

      <!-- 主体内容 -->
      <div class="modal-body">
        <!-- 左侧：编辑区 -->
        <div class="edit-section">
          <div class="section-header">
            <h4>📝 优化结果</h4>
            <span class="hint">可直接编辑修改</span>
          </div>

          <div class="edit-content">
            <!-- 个人简介 -->
            <div class="edit-field">
              <label>个人简介</label>
              <textarea
                v-model="editedData.summary"
                rows="4"
                placeholder="优化后的个人简介..."
                class="edit-textarea"
              ></textarea>
            </div>

            <!-- 技能列表 -->
            <div class="edit-field">
              <label>技能列表</label>
              <div class="skills-edit">
                <div
                  v-for="(skill, index) in editedData.skills"
                  :key="index"
                  class="skill-item"
                >
                  <input
                    v-model="editedData.skills[index]"
                    type="text"
                    class="skill-input"
                    placeholder="技能..."
                  />
                  <button
                    class="btn-remove"
                    @click="removeSkill(index)"
                    title="删除"
                  >
                    ✕
                  </button>
                </div>
                <button class="btn-add-skill" @click="addSkill">+ 添加技能</button>
              </div>
            </div>

            <!-- 问题反馈区 -->
            <div class="feedback-section">
              <label>💬 问题反馈（告诉AI哪里需要改进）</label>
              <textarea
                v-model="userFeedback"
                rows="3"
                placeholder="例如：技能部分写的太夸张了，我其实只是自学阶段..."
                class="feedback-textarea"
              ></textarea>
              <button
                class="btn-reoptimize"
                :disabled="!userFeedback.trim() || reoptimizing"
                @click="handleReoptimize"
              >
                {{ reoptimizing ? '🤔 AI思考中...' : '🔄 重新优化' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：分析区 -->
        <div class="analysis-section">
          <div class="section-header">
            <h4>📊 匹配分析</h4>
          </div>

          <div class="analysis-content">
            <!-- 匹配度 -->
            <div v-if="currentResult.matchAnalysis" class="match-score-card">
              <div class="score-display">
                <span class="score-number">{{ currentResult.matchAnalysis.matchScore }}%</span>
                <span class="score-label">匹配度</span>
              </div>
            </div>

            <!-- 优势 -->
            <div
              v-if="currentResult.matchAnalysis?.strengths?.length > 0"
              class="analysis-block"
            >
              <h5>💪 优势</h5>
              <ul>
                <li
                  v-for="(strength, index) in currentResult.matchAnalysis.strengths"
                  :key="index"
                >
                  {{ strength }}
                </li>
              </ul>
            </div>

            <!-- 差距 -->
            <div
              v-if="currentResult.matchAnalysis?.gaps?.length > 0"
              class="analysis-block"
            >
              <h5>⚠️ 差距</h5>
              <ul>
                <li v-for="(gap, index) in currentResult.matchAnalysis.gaps" :key="index">
                  {{ gap }}
                </li>
              </ul>
            </div>

            <!-- 建议 -->
            <div v-if="currentResult.recommendations?.length > 0" class="analysis-block">
              <h5>💡 优化建议</h5>
              <ul>
                <li
                  v-for="(rec, index) in currentResult.recommendations"
                  :key="index"
                >
                  {{ rec }}
                </li>
              </ul>
            </div>

            <!-- 需要补充的信息 -->
            <div
              v-if="currentResult.needsMoreInfo?.length > 0"
              class="analysis-block warning"
            >
              <h5>📌 需要补充的信息</h5>
              <ul>
                <li
                  v-for="(info, index) in currentResult.needsMoreInfo"
                  :key="index"
                >
                  {{ info }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 优化历史 -->
          <div v-if="historyLog.length > 0" class="history-section">
            <h5>📜 优化历史</h5>
            <div class="history-log">
              <div
                v-for="(log, index) in historyLog"
                :key="index"
                class="history-item"
              >
                <div class="history-header">
                  <span class="history-round">第{{ log.round }}轮</span>
                  <span class="history-time">{{ log.time }}</span>
                </div>
                <div v-if="log.feedback" class="history-feedback">
                  反馈：{{ log.feedback }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="modal-footer">
        <button class="btn-cancel" @click="handleClose">取消</button>
        <button class="btn-apply" @click="handleApply">✅ 应用到简历</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { analyzeUserFeedback, reoptimizeWithFeedback } from '@/ai/useFeedbackAnalyzer'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  initialResult: {
    type: Object,
    required: true,
  },
  jobRequirement: {
    type: String,
    required: true,
  },
  originalResumeData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'apply'])

// 当前优化结果
const currentResult = ref({ ...props.initialResult })

// 可编辑的数据
const editedData = ref({
  summary: '',
  skills: [],
})

// 用户反馈
const userFeedback = ref('')

// 重新优化中
const reoptimizing = ref(false)

// 迭代计数
const iterationCount = ref(1)

// 历史记录
const historyLog = ref([])

// 初始化编辑数据
watch(
  () => props.initialResult,
  newResult => {
    if (newResult) {
      currentResult.value = { ...newResult }
      editedData.value = {
        summary: newResult.summary || '',
        skills: newResult.skills ? [...newResult.skills] : [],
      }
    }
  },
  { immediate: true }
)

// 添加技能
const addSkill = () => {
  editedData.value.skills.push('')
}

// 删除技能
const removeSkill = index => {
  editedData.value.skills.splice(index, 1)
}

/**
 * 重新优化
 */
const handleReoptimize = async () => {
  if (!userFeedback.value.trim()) return

  reoptimizing.value = true

  try {
    console.log('🔄 开始重新优化...')
    console.log('用户反馈:', userFeedback.value)
    console.log('当前编辑数据:', editedData.value)

    // 记录本轮到历史
    historyLog.value.push({
      round: iterationCount.value,
      feedback: userFeedback.value,
      time: new Date().toLocaleTimeString(),
      data: { ...editedData.value },
    })

    // 调用AI重新优化
    const result = await reoptimizeWithFeedback({
      jobRequirement: props.jobRequirement,
      currentData: editedData.value,
      userFeedback: userFeedback.value,
      originalResumeData: props.originalResumeData,
      previousResult: currentResult.value,
    })

    console.log('✅ 重新优化完成:', result)

    // 更新结果
    currentResult.value = result
    editedData.value = {
      summary: result.summary || '',
      skills: result.skills ? [...result.skills] : [],
    }

    // 清空反馈
    userFeedback.value = ''

    // 增加迭代计数
    iterationCount.value++

    alert('✨ 重新优化完成！请查看右侧的新分析结果')
  } catch (error) {
    console.error('❌ 重新优化失败:', error)
    alert(`重新优化失败：${error.message}`)
  } finally {
    reoptimizing.value = false
  }
}

/**
 * 应用到简历
 */
const handleApply = () => {
  // 合并编辑后的数据和原始结果
  const finalResult = {
    ...currentResult.value,
    summary: editedData.value.summary,
    skills: editedData.value.skills.filter(s => s.trim()),
  }

  emit('apply', finalResult)
}

/**
 * 关闭
 */
const handleClose = () => {
  emit('close')
}

/**
 * 点击遮罩层关闭
 */
const handleOverlayClick = () => {
  if (confirm('确定要放弃本次优化吗？')) {
    handleClose()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25em;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5em;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.edit-section,
.analysis-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.section-header h4 {
  margin: 0;
  font-size: 1.1em;
  color: #1f2937;
}

.hint {
  font-size: 0.85em;
  color: #6b7280;
}

.edit-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-field label {
  font-size: 0.9em;
  font-weight: 600;
  color: #374151;
}

.edit-textarea,
.feedback-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95em;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.edit-textarea:focus,
.feedback-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.skills-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.skill-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9em;
}

.skill-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-remove {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-remove:hover {
  background: #dc2626;
}

.btn-add-skill {
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-skill:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
  color: #374151;
}

.feedback-section {
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.feedback-section label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9em;
  font-weight: 600;
  color: #374151;
}

.btn-reoptimize {
  margin-top: 12px;
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-reoptimize:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn-reoptimize:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.match-score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-number {
  font-size: 2.5em;
  font-weight: 700;
}

.score-label {
  font-size: 0.9em;
  opacity: 0.9;
}

.analysis-block {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.analysis-block.warning {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.analysis-block h5 {
  margin: 0 0 12px 0;
  font-size: 0.95em;
  color: #374151;
}

.analysis-block ul {
  margin: 0;
  padding-left: 20px;
}

.analysis-block li {
  margin-bottom: 6px;
  font-size: 0.9em;
  color: #4b5563;
  line-height: 1.5;
}

.history-section {
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.history-section h5 {
  margin: 0 0 12px 0;
  font-size: 0.95em;
  color: #374151;
}

.history-log {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.history-round {
  font-size: 0.85em;
  font-weight: 600;
  color: #667eea;
}

.history-time {
  font-size: 0.75em;
  color: #9ca3af;
}

.history-feedback {
  font-size: 0.85em;
  color: #6b7280;
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-apply {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-apply {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
}

.btn-apply:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 968px) {
  .modal-body {
    grid-template-columns: 1fr;
  }
}
</style>

