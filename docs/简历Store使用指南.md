# 简历 Store 使用指南

## 概述

`resumeStore.js` 是一个功能完整的 Pinia Store，用于管理简历数据。它支持多种数据来源，包括本地博客数据、Markdown 文件和 API。

## 核心功能

### 1. 自动保存

所有简历数据会自动保存到浏览器的 localStorage 中，用户刷新页面后数据不会丢失。

### 2. 多种数据源

- **本地博客数据**：从博客文章中提取作品和技能信息
- **Markdown 文件**：从标准格式的 Markdown 简历文件导入
- **API 接口**：从远程 API 获取简历数据
- **JSON 导入导出**：支持完整的简历数据备份和恢复

### 3. 完整的 CRUD 操作

提供工作经历、教育背景、项目经验、技能等所有模块的增删改查功能。

---

## 使用方法

### 基础使用

```vue
<script setup>
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

// 访问简历数据
console.log(resumeStore.resumeData)

// 检查完成度
console.log(resumeStore.completionPercentage) // 0-100
console.log(resumeStore.isComplete) // true/false
</script>
```

### 方法一：从本地博客数据生成简历

这个方法适合从你的博客文章中提取作品信息，自动生成简历的项目经验部分。

```vue
<script setup>
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

async function generateFromMyBlog() {
  await resumeStore.generateFromBlog({
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
    ],
    profile: {
      name: 'Miles Walker',
      hobbies: ['摄影', '编程', '设计', '徒步'],
      skills: ['Vue3', 'Lightroom', 'Figma', 'Three.js'],
    },
  })

  // 检查是否有错误
  if (resumeStore.error) {
    console.error('生成失败:', resumeStore.error)
  } else {
    console.log('生成成功！')
  }
}
</script>

<template>
  <button @click="generateFromMyBlog" :disabled="resumeStore.loading">
    {{ resumeStore.loading ? '生成中...' : '从博客生成简历' }}
  </button>

  <div v-if="resumeStore.error" class="error">
    {{ resumeStore.error }}
  </div>
</template>
```

### 方法二：从 Markdown 文件导入简历

用户可以上传一个按照特定格式编写的 Markdown 文件，快速导入完整的简历数据。

```vue
<script setup>
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

async function handleFileUpload(event) {
  const file = event.target.files[0]

  if (!file) return

  // 导入选项
  const options = {
    overwriteBasicInfo: true, // 是否覆盖基本信息
    appendExperience: false, // 是否追加工作经历（false=替换）
    appendEducation: false, // 是否追加教育背景
    overwriteSkills: true, // 是否覆盖技能列表
  }

  await resumeStore.generateFromMarkdownFile(file, options)

  if (!resumeStore.error) {
    alert('导入成功！')
  }
}
</script>

<template>
  <input type="file" accept=".md,.markdown" @change="handleFileUpload" />

  <p v-if="resumeStore.loading">正在导入...</p>
  <p v-if="resumeStore.error" class="text-red-500">
    {{ resumeStore.error }}
  </p>
</template>
```

#### Markdown 简历格式示例

```markdown
---
name: 张三
title: 前端工程师
email: zhangsan@example.com
phone: +86 138 0000 0000
location: 北京市朝阳区
website: https://zhangsan.dev

experience:
  - company: 某科技公司
    position: 高级前端工程师
    startDate: 2020-01
    endDate: 至今
    description: 负责核心产品前端架构设计

education:
  - school: 清华大学
    degree: 本科
    field: 计算机科学与技术
    startDate: 2014-09
    endDate: 2018-06

skills:
  - Vue.js
  - React
  - TypeScript
---

# 个人简介

这里是个人简介内容...
```

### 方法三：从 API 获取简历数据

适合从你自己的后端 API 或者 Supabase 等服务获取简历数据。

```vue
<script setup>
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

async function fetchFromAPI() {
  await resumeStore.generateFromAPI('https://api.example.com/resume')

  if (!resumeStore.error) {
    console.log('从 API 加载成功！')
  }
}
</script>

<template>
  <button @click="fetchFromAPI">从 API 加载简历</button>
</template>
```

### 方法四：JSON 导入导出

```vue
<script setup>
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

// 导出为 JSON 文件
function exportResume() {
  resumeStore.exportJSON()
  // 会自动下载一个 JSON 文件
}

// 从 JSON 导入
function importResume(event) {
  const file = event.target.files[0]

  const reader = new FileReader()
  reader.onload = e => {
    const success = resumeStore.importJSON(e.target.result)
    if (success) {
      alert('导入成功！')
    } else {
      alert('导入失败，请检查文件格式')
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <button @click="exportResume">导出简历</button>
  <input type="file" accept=".json" @change="importResume" />
</template>
```

---

## CRUD 操作示例

### 添加工作经历

```vue
<script setup>
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

function addNewJob() {
  resumeStore.addExperience()
  // 会在 experience 数组中添加一个空白项
}
</script>
```

### 删除工作经历

```vue
<script setup>
const resumeStore = useResumeStore()

function deleteJob(experienceId) {
  resumeStore.removeExperience(experienceId)
}
</script>

<template>
  <div v-for="exp in resumeStore.resumeData.experience" :key="exp.id">
    <h3>{{ exp.company }}</h3>
    <button @click="deleteJob(exp.id)">删除</button>
  </div>
</template>
```

### 添加/删除技能

```vue
<script setup>
const resumeStore = useResumeStore()
const newSkill = ref('')

function addSkill() {
  if (newSkill.value.trim()) {
    resumeStore.addSkill(newSkill.value.trim())
    newSkill.value = ''
  }
}

function removeSkill(skill) {
  resumeStore.removeSkill(skill)
}
</script>

<template>
  <!-- 技能输入 -->
  <input v-model="newSkill" @keyup.enter="addSkill" />
  <button @click="addSkill">添加技能</button>

  <!-- 技能列表 -->
  <div v-for="skill in resumeStore.skillsList" :key="skill">
    {{ skill }}
    <button @click="removeSkill(skill)">×</button>
  </div>
</template>
```

### 设置目标岗位

```vue
<script setup>
const resumeStore = useResumeStore()

function setJob(job) {
  resumeStore.setTargetJob(job)
}
</script>

<template>
  <select @change="e => setJob(e.target.value)">
    <option value="前端工程师">前端工程师</option>
    <option value="全栈工程师">全栈工程师</option>
    <option value="UI设计师">UI设计师</option>
  </select>
</template>
```

---

## 状态监听

### 监听加载状态

```vue
<script setup>
import { watch } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

watch(
  () => resumeStore.loading,
  isLoading => {
    if (isLoading) {
      console.log('正在加载...')
    } else {
      console.log('加载完成')
    }
  }
)
</script>
```

### 监听错误

```vue
<script setup>
import { watch } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

watch(
  () => resumeStore.error,
  error => {
    if (error) {
      alert(`错误：${error}`)
      // 清除错误
      setTimeout(() => {
        resumeStore.clearError()
      }, 3000)
    }
  }
)
</script>
```

### 监听数据变化

```vue
<script setup>
import { watch } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

watch(
  () => resumeStore.resumeData,
  newData => {
    console.log('简历数据已更新:', newData)
    console.log('最后保存时间:', resumeStore.lastSaved)
  },
  { deep: true }
)
</script>
```

---

## 完整示例：简历编辑器组件

```vue
<script setup>
import { ref, computed } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

// 文件上传处理
const handleMarkdownUpload = async event => {
  const file = event.target.files[0]
  if (file) {
    await resumeStore.generateFromMarkdownFile(file)
  }
}

// 从示例博客数据生成
const generateDemo = async () => {
  await resumeStore.generateFromBlog({
    blogPosts: [
      {
        title: '新疆风光摄影',
        excerpt: '记录自然美景',
        date: '2025-02-10',
        category: '摄影',
      },
    ],
    profile: {
      name: 'Miles Walker',
      skills: ['Vue3', 'Photography', 'Design'],
    },
  })
}

// 重置简历
const reset = () => {
  resumeStore.resetResume()
}

// 导出
const exportData = () => {
  resumeStore.exportJSON()
}

// 完成度颜色
const progressColor = computed(() => {
  const percentage = resumeStore.completionPercentage
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 50) return 'text-yellow-600'
  return 'text-red-600'
})
</script>

<template>
  <div class="resume-editor p-6">
    <!-- 顶部工具栏 -->
    <div class="toolbar flex gap-4 mb-6">
      <button
        @click="generateDemo"
        :disabled="resumeStore.loading"
        class="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {{ resumeStore.loading ? '生成中...' : '生成示例简历' }}
      </button>

      <label class="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
        导入 Markdown
        <input type="file" accept=".md" @change="handleMarkdownUpload" class="hidden" />
      </label>

      <button @click="exportData" class="px-4 py-2 bg-purple-500 text-white rounded">
        导出 JSON
      </button>

      <button @click="reset" class="px-4 py-2 bg-red-500 text-white rounded">重置</button>
    </div>

    <!-- 完成度显示 -->
    <div class="completion mb-6">
      <div class="flex items-center justify-between">
        <span>简历完成度:</span>
        <span :class="progressColor" class="text-2xl font-bold">
          {{ resumeStore.completionPercentage }}%
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          class="bg-blue-500 h-2 rounded-full transition-all"
          :style="{ width: `${resumeStore.completionPercentage}%` }"
        />
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="resumeStore.error" class="error bg-red-100 text-red-700 p-4 rounded mb-6">
      {{ resumeStore.error }}
      <button @click="resumeStore.clearError" class="ml-4 underline">关闭</button>
    </div>

    <!-- 基本信息表单 -->
    <div class="basic-info space-y-4">
      <h2 class="text-2xl font-bold mb-4">基本信息</h2>

      <input
        v-model="resumeStore.resumeData.fullName"
        placeholder="姓名"
        class="w-full p-2 border rounded"
      />

      <input
        v-model="resumeStore.resumeData.title"
        placeholder="职位"
        class="w-full p-2 border rounded"
      />

      <input
        v-model="resumeStore.resumeData.email"
        type="email"
        placeholder="邮箱"
        class="w-full p-2 border rounded"
      />

      <input
        v-model="resumeStore.resumeData.phone"
        placeholder="电话"
        class="w-full p-2 border rounded"
      />
    </div>

    <!-- 工作经历 -->
    <div class="experience mt-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">工作经历</h2>
        <button @click="resumeStore.addExperience" class="px-3 py-1 bg-blue-500 text-white rounded">
          + 添加
        </button>
      </div>

      <div
        v-for="exp in resumeStore.resumeData.experience"
        :key="exp.id"
        class="border p-4 rounded mb-4"
      >
        <input
          v-model="exp.company"
          placeholder="公司名称"
          class="w-full p-2 border rounded mb-2"
        />
        <input v-model="exp.position" placeholder="职位" class="w-full p-2 border rounded mb-2" />
        <textarea
          v-model="exp.description"
          placeholder="工作描述"
          class="w-full p-2 border rounded mb-2"
          rows="3"
        />
        <button @click="resumeStore.removeExperience(exp.id)" class="text-red-500 text-sm">
          删除
        </button>
      </div>
    </div>

    <!-- 最后保存时间 -->
    <div class="text-sm text-gray-500 mt-6">
      最后保存: {{ resumeStore.lastSaved || '从未保存' }}
    </div>
  </div>
</template>
```

---

## API 参考

### 状态 (State)

| 属性               | 类型             | 说明                   |
| ------------------ | ---------------- | ---------------------- |
| `resumeData`       | `Object`         | 简历数据对象           |
| `lastSaved`        | `String`         | 最后保存时间 (ISO格式) |
| `selectedTemplate` | `String`         | 选中的模板名称         |
| `themeColor`       | `String`         | 主题颜色 (HEX)         |
| `loading`          | `Boolean`        | 加载状态               |
| `error`            | `String \| null` | 错误信息               |

### 计算属性 (Getters)

| 属性                   | 类型      | 说明                    |
| ---------------------- | --------- | ----------------------- |
| `isComplete`           | `Boolean` | 简历是否完整            |
| `completionPercentage` | `Number`  | 完成度百分比 (0-100)    |
| `skillsList`           | `Array`   | 技能列表 (处理后的数组) |

### 方法 (Actions)

#### 博客数据生成

- `generateFromBlog(options)` - 从本地博客数据生成简历
- `generateFromMarkdownFile(file, options)` - 从 Markdown 文件生成
- `generateFromAPI(apiUrl)` - 从 API 获取简历数据

#### CRUD 操作

- `addExperience()` - 添加工作经历
- `removeExperience(id)` - 删除工作经历
- `addEducation()` - 添加教育背景
- `removeEducation(id)` - 删除教育背景
- `addProject()` - 添加项目经验
- `removeProject(id)` - 删除项目经验
- `addSkill(skill)` - 添加技能
- `removeSkill(skill)` - 删除技能
- `setTargetJob(job)` - 设置目标岗位

#### 数据管理

- `resetResume()` - 重置所有数据
- `exportJSON()` - 导出为 JSON 文件
- `importJSON(jsonData)` - 从 JSON 导入
- `importFromMarkdown(markdownContent)` - 从 Markdown 导入
- `clearError()` - 清除错误信息
- `updateSaveTime()` - 更新保存时间

---

## 最佳实践

### 1. 错误处理

始终检查 `error` 状态，并在操作完成后清除错误：

```vue
<script setup>
const resumeStore = useResumeStore()

async function loadData() {
  await resumeStore.generateFromBlog(options)

  if (resumeStore.error) {
    // 显示错误提示
    alert(resumeStore.error)
    // 3秒后自动清除
    setTimeout(() => resumeStore.clearError(), 3000)
  }
}
</script>
```

### 2. 加载状态反馈

在进行异步操作时，利用 `loading` 状态提供用户反馈：

```vue
<button :disabled="resumeStore.loading">
  <span v-if="resumeStore.loading">加载中...</span>
  <span v-else>导入简历</span>
</button>
```

### 3. 数据备份

定期导出 JSON 备份，防止数据丢失：

```vue
<script setup>
import { onMounted } from 'vue'
const resumeStore = useResumeStore()

onMounted(() => {
  // 每隔一段时间自动导出备份
  setInterval(
    () => {
      if (resumeStore.isComplete) {
        resumeStore.exportJSON()
      }
    },
    1000 * 60 * 30
  ) // 30分钟
})
</script>
```

### 4. 数据合并策略

导入数据时，根据场景选择合适的合并策略：

```javascript
// 完全替换
await resumeStore.generateFromMarkdownFile(file, {
  overwriteBasicInfo: true,
  appendExperience: false,
  appendEducation: false,
  overwriteSkills: true,
})

// 追加模式（保留现有数据）
await resumeStore.generateFromMarkdownFile(file, {
  overwriteBasicInfo: false,
  appendExperience: true, // 追加工作经历
  appendEducation: true, // 追加教育背景
  overwriteSkills: false,
})
```

---

## 常见问题

### Q: 数据保存在哪里？

A: 所有数据自动保存在浏览器的 localStorage 中。清除浏览器缓存会导致数据丢失，建议定期导出 JSON 备份。

### Q: 如何清空所有数据？

A: 调用 `resumeStore.resetResume()`，会弹出确认对话框。

### Q: Markdown 文件格式有什么要求？

A: 必须包含 YAML frontmatter（用 `---` 包裹），参考上面的示例格式。

### Q: 可以同时从多个数据源导入吗？

A: 可以。使用合适的合并选项，可以先从博客生成，再从 Markdown 追加数据。

### Q: 如何监听数据自动保存？

A: Store 已经自动监听数据变化并更新 `lastSaved` 时间戳，你可以直接显示这个时间。

---

## 技术栈

- **Pinia** - 状态管理
- **VueUse** - `useStorage` 自动持久化
- **gray-matter** - Markdown frontmatter 解析
- **Vue 3 Composition API** - 响应式状态管理

---

## 参考资料

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [VueUse 文档](https://vueuse.org/)
- [gray-matter 使用说明](https://github.com/jonschlinkert/gray-matter)
