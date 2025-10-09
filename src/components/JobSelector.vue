<!-- JobSelector.vue - 岗位选择输入框组件 -->
<template>
  <div class="job-selector">
    <input
      id="title"
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      class="job-input"
      @input="handleInput"
      @focus="showSuggestions = true"
      @blur="handleBlur"
    />

    <!-- 岗位建议列表 -->
    <div v-if="showSuggestions && filteredJobs.length > 0" class="suggestions-dropdown">
      <button
        v-for="job in filteredJobs"
        :key="job"
        type="button"
        class="suggestion-item"
        @mousedown.prevent="selectJob(job)"
      >
        {{ job }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '例如：前端工程师',
  },
})

const emit = defineEmits(['update:modelValue'])

// 本地值
const localValue = ref(props.modelValue)

// 是否显示建议
const showSuggestions = ref(false)

// 常见岗位列表
const commonJobs = [
  // 技术类
  '前端工程师',
  '后端工程师',
  '全栈工程师',
  'Web 前端开发工程师',
  'iOS 开发工程师',
  'Android 开发工程师',
  'Java 开发工程师',
  'Python 开发工程师',
  'Node.js 开发工程师',
  '算法工程师',
  '数据工程师',
  '测试工程师',
  '运维工程师',
  'DevOps 工程师',
  '架构师',
  '技术经理',
  'CTO',

  // 设计类
  'UI 设计师',
  'UX 设计师',
  '交互设计师',
  '视觉设计师',
  '平面设计师',
  '3D 设计师',
  '动画设计师',

  // 产品类
  '产品经理',
  '产品运营',
  '产品总监',

  // 运营类
  '运营专员',
  '新媒体运营',
  '内容运营',
  '用户运营',
  '活动运营',
  '运营经理',

  // 市场类
  '市场营销',
  '品牌经理',
  '市场总监',

  // 管理类
  '项目经理',
  '团队主管',
  '部门经理',
  'CEO',
  'COO',
]

// 根据输入过滤岗位
const filteredJobs = computed(() => {
  if (!localValue.value) return commonJobs.slice(0, 10) // 默认显示前10个
  const searchTerm = localValue.value.toLowerCase()
  return commonJobs.filter(job => job.toLowerCase().includes(searchTerm)).slice(0, 8)
})

// 监听外部值变化
watch(
  () => props.modelValue,
  newVal => {
    localValue.value = newVal
  }
)

/**
 * 处理输入
 */
const handleInput = event => {
  localValue.value = event.target.value
  emit('update:modelValue', localValue.value)
  showSuggestions.value = true
}

/**
 * 选择岗位
 */
const selectJob = job => {
  localValue.value = job
  emit('update:modelValue', job)
  showSuggestions.value = false
}

/**
 * 处理失焦
 */
const handleBlur = () => {
  // 延迟关闭，让点击事件有时间触发
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<style scoped>
.job-selector {
  position: relative;
}

.job-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.95em;
  transition: all 0.2s ease;
  font-family: inherit;
}

.job-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 建议下拉列表 */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  max-height: 280px;
  overflow-y: auto;
  z-index: 100;
}

.suggestion-item {
  width: 100%;
  padding: 12px 15px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  font-size: 0.95em;
  color: #2d3748;
  transition: background 0.15s ease;
  border-bottom: 1px solid #f7fafc;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f7fafc;
  color: #667eea;
}

.suggestion-item:first-child {
  border-radius: 8px 8px 0 0;
}

.suggestion-item:last-child {
  border-radius: 0 0 8px 8px;
}

/* 滚动条样式 */
.suggestions-dropdown::-webkit-scrollbar {
  width: 6px;
}

.suggestions-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0 8px 8px 0;
}

.suggestions-dropdown::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.suggestions-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
