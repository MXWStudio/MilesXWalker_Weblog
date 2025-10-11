<!-- JobMatchAnalysis.vue - 岗位匹配分析展示组件 -->
<template>
  <div v-if="matchData" class="match-analysis-container">
    <!-- 匹配度总览 -->
    <div class="match-score-section">
      <div class="score-circle" :class="`score-${matchData.matchLevel}`">
        <div class="score-value">{{ matchData.matchScore }}</div>
        <div class="score-label">匹配度</div>
      </div>
      <div class="score-details">
        <h2 class="match-title">
          {{
            matchData.matchLevel === 'high'
              ? '🎉 高度匹配'
              : matchData.matchLevel === 'medium'
                ? '👍 中度匹配'
                : '💪 还需努力'
          }}
        </h2>
        <p class="match-assessment">{{ matchData.overallAssessment }}</p>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div class="tabs-container">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.icon }} {{ tab.label }}
        <span v-if="tab.count" class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 标签页内容 -->
    <div class="tab-content">
      <!-- 符合的技能 -->
      <div v-if="activeTab === 'matching'" class="content-panel">
        <h3 class="panel-title">✅ 你已具备的技能</h3>
        <div
          v-if="matchData.matchingSkills && matchData.matchingSkills.length > 0"
          class="skills-grid"
        >
          <div
            v-for="(skill, index) in matchData.matchingSkills"
            :key="index"
            class="skill-card matching-skill"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.skill }}</span>
              <span v-if="skill.status === '超出'" class="skill-badge">⭐ 超出要求</span>
            </div>
            <div class="skill-details">
              <div class="skill-row">
                <span class="label">你的水平:</span>
                <span class="value">{{ skill.proficiency }}</span>
              </div>
              <div class="skill-row">
                <span class="label">岗位要求:</span>
                <span class="value">{{ skill.jobRequirement }}</span>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">暂无匹配技能数据</p>

        <!-- 优势分析 -->
        <div
          v-if="matchData.advantages && matchData.advantages.length > 0"
          class="advantages-section"
        >
          <h3 class="panel-title">💪 你的竞争优势</h3>
          <div class="advantages-list">
            <div v-for="(adv, index) in matchData.advantages" :key="index" class="advantage-item">
              <div class="advantage-number">{{ index + 1 }}</div>
              <div class="advantage-content">
                <h4>{{ adv.title }}</h4>
                <p>{{ adv.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 缺失的技能 -->
      <div v-if="activeTab === 'missing'" class="content-panel">
        <h3 class="panel-title">📚 待提升的技能</h3>
        <div v-if="matchData.missingSkills && matchData.missingSkills.length > 0">
          <!-- 必须掌握 -->
          <div v-if="getMissingByImportance('critical').length > 0" class="missing-group critical">
            <h4 class="group-title">🚨 必须掌握</h4>
            <div class="skills-grid">
              <div
                v-for="(skill, index) in getMissingByImportance('critical')"
                :key="index"
                class="skill-card missing-skill critical-skill"
              >
                <div class="skill-header">
                  <span class="skill-name">{{ skill.skill }}</span>
                  <span class="skill-category">{{ skill.category }}</span>
                </div>
                <div class="skill-meta">
                  <span class="learning-time">⏱️ {{ skill.learningTime }}</span>
                </div>
                <div v-if="skill.resources && skill.resources.length > 0" class="skill-resources">
                  <p class="resources-label">推荐资源:</p>
                  <ul>
                    <li v-for="(resource, rIndex) in skill.resources" :key="rIndex">
                      {{ resource }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 建议掌握 -->
          <div
            v-if="getMissingByImportance('important').length > 0"
            class="missing-group important"
          >
            <h4 class="group-title">⚠️ 建议掌握</h4>
            <div class="skills-grid">
              <div
                v-for="(skill, index) in getMissingByImportance('important')"
                :key="index"
                class="skill-card missing-skill important-skill"
              >
                <div class="skill-header">
                  <span class="skill-name">{{ skill.skill }}</span>
                  <span class="skill-category">{{ skill.category }}</span>
                </div>
                <div class="skill-meta">
                  <span class="learning-time">⏱️ {{ skill.learningTime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 加分项 -->
          <div
            v-if="getMissingByImportance('nice-to-have').length > 0"
            class="missing-group nice-to-have"
          >
            <h4 class="group-title">⭐ 加分项</h4>
            <div class="skill-tags">
              <span
                v-for="(skill, index) in getMissingByImportance('nice-to-have')"
                :key="index"
                class="skill-tag"
              >
                {{ skill.skill }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">太棒了！你已经具备了所有必要技能 🎉</p>
      </div>

      <!-- 学习路径 -->
      <div v-if="activeTab === 'learning'" class="content-panel">
        <h3 class="panel-title">🎯 学习路径规划</h3>
        <div v-if="matchData.learningPath" class="learning-timeline">
          <div
            v-if="matchData.learningPath.immediate && matchData.learningPath.immediate.length > 0"
            class="timeline-item immediate"
          >
            <div class="timeline-icon">🚀</div>
            <div class="timeline-content">
              <h4>立即行动 <span class="period">(本周开始)</span></h4>
              <ul class="timeline-skills">
                <li v-for="(skill, index) in matchData.learningPath.immediate" :key="index">
                  {{ skill }}
                </li>
              </ul>
            </div>
          </div>

          <div
            v-if="matchData.learningPath.shortTerm && matchData.learningPath.shortTerm.length > 0"
            class="timeline-item short-term"
          >
            <div class="timeline-icon">📚</div>
            <div class="timeline-content">
              <h4>短期目标 <span class="period">(1-3个月)</span></h4>
              <ul class="timeline-skills">
                <li v-for="(skill, index) in matchData.learningPath.shortTerm" :key="index">
                  {{ skill }}
                </li>
              </ul>
            </div>
          </div>

          <div
            v-if="matchData.learningPath.longTerm && matchData.learningPath.longTerm.length > 0"
            class="timeline-item long-term"
          >
            <div class="timeline-icon">🎯</div>
            <div class="timeline-content">
              <h4>长期规划 <span class="period">(3-6个月)</span></h4>
              <ul class="timeline-skills">
                <li v-for="(skill, index) in matchData.learningPath.longTerm" :key="index">
                  {{ skill }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">暂无学习路径数据</p>
      </div>

      <!-- 简历优化 -->
      <div v-if="activeTab === 'tips'" class="content-panel">
        <h3 class="panel-title">📝 简历优化建议</h3>
        <div
          v-if="matchData.resumeOptimization && matchData.resumeOptimization.length > 0"
          class="tips-list"
        >
          <div
            v-for="(tip, index) in matchData.resumeOptimization"
            :key="index"
            :class="['tip-item', `priority-${tip.priority}`]"
          >
            <div class="tip-priority">
              <span v-if="tip.priority === 'high'" class="priority-badge high">🔴 高优先级</span>
              <span v-else-if="tip.priority === 'medium'" class="priority-badge medium"
                >🟡 中优先级</span
              >
              <span v-else class="priority-badge low">🟢 低优先级</span>
            </div>
            <div class="tip-content">
              <h4>{{ tip.section }}</h4>
              <p>{{ tip.suggestion }}</p>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">暂无优化建议</p>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions-bar">
      <button class="btn-action btn-download" @click="downloadReport">📥 下载完整报告</button>
      <button class="btn-action btn-apply" @click="optimizeResume">✨ 应用优化建议</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatMatchReport } from '@/ai/useJobMatcher'

// Props
const props = defineProps({
  matchData: {
    type: Object,
    required: true,
  },
})

// Emit
const emit = defineEmits(['apply-optimizations', 'download-report'])

// 当前激活的标签页
const activeTab = ref('matching')

// 标签页配置
const tabs = computed(() => [
  {
    id: 'matching',
    label: '符合技能',
    icon: '✅',
    count: props.matchData?.matchingSkills?.length || 0,
  },
  {
    id: 'missing',
    label: '待提升',
    icon: '📚',
    count: props.matchData?.missingSkills?.length || 0,
  },
  {
    id: 'learning',
    label: '学习路径',
    icon: '🎯',
  },
  {
    id: 'tips',
    label: '简历优化',
    icon: '📝',
  },
])

/**
 * 按重要性筛选缺失技能
 */
const getMissingByImportance = importance => {
  if (!props.matchData?.missingSkills) return []
  return props.matchData.missingSkills.filter(skill => skill.importance === importance)
}

/**
 * 下载报告
 */
const downloadReport = () => {
  if (!props.matchData) return

  const markdown = formatMatchReport(props.matchData)
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `岗位匹配分析报告_${new Date().toLocaleDateString()}.md`
  a.click()
  URL.revokeObjectURL(url)

  emit('download-report')
}

/**
 * 应用优化建议
 */
const optimizeResume = () => {
  emit('apply-optimizations', props.matchData)
}
</script>

<style scoped>
.match-analysis-container {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 30px;
}

/* 匹配度总览 */
.match-score-section {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  margin-bottom: 30px;
}

.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  position: relative;
}

.score-circle::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.score-circle.score-high::before {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.score-circle.score-medium::before {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
}

.score-circle.score-low::before {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
}

.score-value {
  font-size: 3em;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-circle.score-high .score-value {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-label {
  font-size: 0.9em;
  color: #718096;
  margin-top: 4px;
}

.score-details {
  flex: 1;
}

.match-title {
  font-size: 2em;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.match-assessment {
  font-size: 1.05em;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

/* 标签页 */
.tabs-container {
  display: flex;
  gap: 12px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 24px;
  overflow-x: auto;
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #718096;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-badge {
  background: #667eea;
  color: white;
  font-size: 0.8em;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 700;
}

/* 内容面板 */
.content-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-title {
  font-size: 1.4em;
  color: #2d3748;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

/* 技能网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.skill-card {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.matching-skill {
  border-left: 4px solid #48bb78;
}

.missing-skill.critical-skill {
  border-left: 4px solid #f56565;
  background: #fff5f5;
}

.missing-skill.important-skill {
  border-left: 4px solid #ed8936;
  background: #fffaf0;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.skill-name {
  font-size: 1.1em;
  font-weight: 600;
  color: #2d3748;
}

.skill-badge {
  background: #ffd700;
  color: #744210;
  font-size: 0.75em;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.skill-category {
  background: #e2e8f0;
  color: #4a5568;
  font-size: 0.8em;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.skill-details,
.skill-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
}

.skill-row .label {
  color: #718096;
}

.skill-row .value {
  color: #2d3748;
  font-weight: 600;
}

.learning-time {
  color: #718096;
  font-size: 0.85em;
}

.skill-resources {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.resources-label {
  font-size: 0.85em;
  color: #718096;
  margin: 0 0 6px 0;
}

.skill-resources ul {
  margin: 0;
  padding-left: 20px;
}

.skill-resources li {
  font-size: 0.9em;
  color: #4a5568;
  margin-bottom: 4px;
}

/* 缺失技能分组 */
.missing-group {
  margin-bottom: 32px;
}

.group-title {
  font-size: 1.2em;
  color: #2d3748;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 技能标签 */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 500;
}

/* 优势列表 */
.advantages-section {
  margin-top: 32px;
}

.advantages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.advantage-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f0fff4;
  border-left: 4px solid #48bb78;
  border-radius: 8px;
}

.advantage-number {
  width: 36px;
  height: 36px;
  background: #48bb78;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1em;
  flex-shrink: 0;
}

.advantage-content h4 {
  font-size: 1.1em;
  color: #2d3748;
  margin: 0 0 6px 0;
}

.advantage-content p {
  font-size: 0.95em;
  color: #4a5568;
  margin: 0;
  line-height: 1.5;
}

/* 学习时间线 */
.learning-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.timeline-item.immediate {
  background: #fff5f5;
  border-left-color: #f56565;
}

.timeline-item.short-term {
  background: #fffaf0;
  border-left-color: #ed8936;
}

.timeline-item.long-term {
  background: #f0f9ff;
  border-left-color: #4299e1;
}

.timeline-icon {
  font-size: 2em;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
}

.timeline-content h4 {
  font-size: 1.2em;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.period {
  font-size: 0.8em;
  color: #718096;
  font-weight: 400;
}

.timeline-skills {
  margin: 0;
  padding-left: 20px;
}

.timeline-skills li {
  font-size: 0.95em;
  color: #4a5568;
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 优化建议列表 */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #718096;
}

.tip-item.priority-high {
  background: #fff5f5;
  border-left-color: #f56565;
}

.tip-item.priority-medium {
  background: #fffaf0;
  border-left-color: #ed8936;
}

.tip-item.priority-low {
  background: #f0fff4;
  border-left-color: #48bb78;
}

.tip-priority {
  margin-bottom: 8px;
}

.priority-badge {
  font-size: 0.8em;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
}

.priority-badge.high {
  background: #fed7d7;
  color: #c53030;
}

.priority-badge.medium {
  background: #feebc8;
  color: #c05621;
}

.priority-badge.low {
  background: #c6f6d5;
  color: #276749;
}

.tip-content h4 {
  font-size: 1.05em;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.tip-content p {
  font-size: 0.95em;
  color: #4a5568;
  margin: 0;
  line-height: 1.6;
}

/* 空状态 */
.empty-state {
  text-align: center;
  color: #718096;
  font-size: 1em;
  padding: 40px 20px;
  background: #f7fafc;
  border-radius: 12px;
}

/* 操作按钮 */
.actions-bar {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
  justify-content: center;
}

.btn-action {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-download {
  background: #4299e1;
  color: white;
}

.btn-download:hover {
  background: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
}

.btn-apply {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-apply:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 响应式 */
@media (max-width: 768px) {
  .match-analysis-container {
    padding: 20px;
  }

  .match-score-section {
    flex-direction: column;
    text-align: center;
  }

  .match-title {
    font-size: 1.5em;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .actions-bar {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
  }
}
</style>
