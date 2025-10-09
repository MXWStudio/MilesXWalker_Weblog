# 简历 Store 功能测试指南

## 快速测试步骤

### 测试 1：从博客数据生成简历

在浏览器控制台执行以下代码：

```javascript
// 1. 导入 store
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()

// 2. 准备测试数据
const testBlogData = {
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
    skills: ['Vue3', 'Lightroom', 'Figma', 'Three.js'],
  },
}

// 3. 执行生成
await resumeStore.generateFromBlog(testBlogData)

// 4. 查看结果
console.log('生成结果:', resumeStore.resumeData)
console.log('加载状态:', resumeStore.loading)
console.log('错误信息:', resumeStore.error)
console.log('完成度:', resumeStore.completionPercentage + '%')
```

**预期结果：**

- `loading` 变为 `false`
- `error` 为 `null`
- `resumeData` 包含博客数据转换后的简历信息
- `projects` 数组包含 3 个项目

---

### 测试 2：Markdown 文件导入

#### 步骤 1：创建测试 Markdown 文件

创建一个名为 `test-resume.md` 的文件，内容如下：

```markdown
---
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
```

#### 步骤 2：在组件中测试

创建一个测试组件 `TestResumeImport.vue`：

```vue
<script setup>
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  console.log('开始导入文件:', file.name)

  await resumeStore.generateFromMarkdownFile(file, {
    overwriteBasicInfo: true,
    appendExperience: false,
    appendEducation: false,
    overwriteSkills: true,
  })

  if (resumeStore.error) {
    console.error('导入失败:', resumeStore.error)
    alert('导入失败: ' + resumeStore.error)
  } else {
    console.log('导入成功!', resumeStore.resumeData)
    alert('导入成功！')
  }
}
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl mb-4">测试 Markdown 导入</h2>

    <input type="file" accept=".md,.markdown" @change="handleFileUpload" class="mb-4" />

    <div v-if="resumeStore.loading" class="text-blue-500">正在导入...</div>

    <div v-if="resumeStore.error" class="text-red-500 p-4 bg-red-100 rounded">
      错误: {{ resumeStore.error }}
    </div>

    <div v-if="resumeStore.resumeData.fullName" class="mt-6">
      <h3 class="text-xl mb-2">导入结果预览：</h3>
      <div class="bg-gray-100 p-4 rounded">
        <p><strong>姓名:</strong> {{ resumeStore.resumeData.fullName }}</p>
        <p><strong>职位:</strong> {{ resumeStore.resumeData.title }}</p>
        <p><strong>邮箱:</strong> {{ resumeStore.resumeData.email }}</p>
        <p><strong>完成度:</strong> {{ resumeStore.completionPercentage }}%</p>
      </div>
    </div>
  </div>
</template>
```

**预期结果：**

- 文件上传后，数据成功导入
- 简历数据包含所有 frontmatter 中的信息
- 工作经历、教育背景、技能都被正确解析

---

### 测试 3：CRUD 操作

在浏览器控制台测试：

```javascript
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()

// 测试添加工作经历
console.log('添加前的工作经历数量:', resumeStore.resumeData.experience.length)
resumeStore.addExperience()
console.log('添加后的工作经历数量:', resumeStore.resumeData.experience.length)

// 测试添加技能
resumeStore.addSkill('Python')
resumeStore.addSkill('Docker')
console.log('技能列表:', resumeStore.skillsList)

// 测试删除技能
resumeStore.removeSkill('Python')
console.log('删除后的技能列表:', resumeStore.skillsList)

// 测试设置目标岗位
resumeStore.setTargetJob('前端工程师')
console.log('目标岗位:', resumeStore.resumeData.targetJob)

// 测试添加项目
resumeStore.addProject()
console.log('项目数量:', resumeStore.resumeData.projects.length)
```

**预期结果：**

- 所有添加操作成功
- 数据立即反映在 `resumeData` 中
- `lastSaved` 时间自动更新

---

### 测试 4：数据导出和导入

```javascript
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()

// 1. 先填充一些测试数据
resumeStore.resumeData.fullName = 'Test User'
resumeStore.resumeData.title = 'Software Engineer'
resumeStore.resumeData.email = 'test@example.com'

// 2. 导出 JSON（会下载文件）
resumeStore.exportJSON()

// 3. 准备导入的 JSON 数据
const testJson = {
  fullName: 'Imported User',
  title: 'Senior Developer',
  email: 'imported@example.com',
  phone: '+86 123 4567 8900',
  summary: 'This is an imported resume',
  skills: ['Vue', 'React', 'Node.js'],
}

// 4. 导入 JSON
const success = resumeStore.importJSON(testJson)
console.log('导入成功:', success)
console.log('导入后的数据:', resumeStore.resumeData)
```

**预期结果：**

- `exportJSON()` 下载了一个 JSON 文件
- `importJSON()` 成功导入数据
- 导入后的数据覆盖了原有数据

---

### 测试 5：完成度计算

```javascript
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()

// 1. 重置简历（需要确认）
// resumeStore.resetResume()

// 2. 逐步填充数据，观察完成度变化
console.log('初始完成度:', resumeStore.completionPercentage)

resumeStore.resumeData.fullName = 'Miles Walker'
console.log('填写姓名后:', resumeStore.completionPercentage)

resumeStore.resumeData.title = 'Full Stack Developer'
console.log('填写职位后:', resumeStore.completionPercentage)

resumeStore.resumeData.email = 'miles@example.com'
console.log('填写邮箱后:', resumeStore.completionPercentage)

resumeStore.resumeData.phone = '+86 138 0000 0000'
console.log('填写电话后:', resumeStore.completionPercentage)

resumeStore.resumeData.summary = 'This is my professional summary.'
console.log('填写简介后:', resumeStore.completionPercentage)

// 检查是否完整
console.log('简历是否完整:', resumeStore.isComplete)
```

**预期结果：**

- 每填写一项，完成度增加约 12.5%
- 当填写完所有必填项后，`isComplete` 变为 `true`

---

### 测试 6：错误处理

```javascript
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()

// 1. 测试无效的 JSON 导入
const success = resumeStore.importJSON('invalid json string{{{')
console.log('导入失败的 JSON:', success) // 应该返回 false

// 2. 测试 API 失败
await resumeStore.generateFromAPI('https://invalid-url-that-does-not-exist.com/api')
console.log('API 错误:', resumeStore.error) // 应该有错误信息

// 3. 清除错误
resumeStore.clearError()
console.log('清除后的错误:', resumeStore.error) // 应该为 null
```

**预期结果：**

- 无效操作返回 `false` 或设置 `error`
- 错误信息被正确记录
- `clearError()` 可以清除错误

---

### 测试 7：数据持久化

```javascript
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()

// 1. 填充数据
resumeStore.resumeData.fullName = 'Persistence Test'
resumeStore.resumeData.title = 'Test Engineer'

console.log('填充的数据:', resumeStore.resumeData.fullName)

// 2. 刷新页面（手动操作）
// 在浏览器中按 F5 刷新

// 3. 刷新后检查（在控制台重新执行）
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()
console.log('刷新后的数据:', resumeStore.resumeData.fullName)
// 应该仍然是 'Persistence Test'
```

**预期结果：**

- 数据在页面刷新后仍然存在
- localStorage 中有 `resume-draft` 键
- 自动保存时间被记录

---

## 完整的集成测试组件

创建 `TestResumeStore.vue` 用于完整测试：

```vue
<script setup>
import { ref, computed } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'
import { BLOG_RESUME_EXAMPLE } from '@/utils/blogParser'

const resumeStore = useResumeStore()
const testResult = ref('')

// 测试1: 从博客生成
async function testBlogGeneration() {
  testResult.value = '正在测试...'
  await resumeStore.generateFromBlog(BLOG_RESUME_EXAMPLE.local)

  if (resumeStore.error) {
    testResult.value = '❌ 失败: ' + resumeStore.error
  } else {
    testResult.value = '✅ 成功生成，项目数量: ' + resumeStore.resumeData.projects.length
  }
}

// 测试2: CRUD 操作
function testCRUD() {
  const initialCount = resumeStore.resumeData.experience.length
  resumeStore.addExperience()
  const afterAdd = resumeStore.resumeData.experience.length

  testResult.value = afterAdd > initialCount ? '✅ CRUD 测试成功' : '❌ CRUD 测试失败'
}

// 测试3: 完成度计算
function testCompletion() {
  resumeStore.resumeData.fullName = 'Test User'
  resumeStore.resumeData.title = 'Engineer'
  resumeStore.resumeData.email = 'test@test.com'

  const percentage = resumeStore.completionPercentage
  testResult.value = `✅ 完成度计算正常: ${percentage}%`
}

// 测试4: JSON 导入导出
function testJSON() {
  const testData = {
    fullName: 'JSON Test',
    title: 'Tester',
    email: 'json@test.com',
  }

  const success = resumeStore.importJSON(testData)
  testResult.value = success ? '✅ JSON 导入导出测试成功' : '❌ JSON 导入导出测试失败'
}

// 测试5: 清空数据
function testReset() {
  resumeStore.resetResume()
  testResult.value = '✅ 数据已重置'
}

// 状态监控
const statusText = computed(() => {
  if (resumeStore.loading) return '⏳ 加载中...'
  if (resumeStore.error) return '❌ 错误: ' + resumeStore.error
  return '✅ 就绪'
})
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">简历 Store 功能测试</h1>

    <!-- 状态显示 -->
    <div class="mb-6 p-4 bg-gray-100 rounded">
      <div class="grid grid-cols-2 gap-4">
        <div><strong>状态:</strong> {{ statusText }}</div>
        <div><strong>完成度:</strong> {{ resumeStore.completionPercentage }}%</div>
        <div><strong>姓名:</strong> {{ resumeStore.resumeData.fullName || '未填写' }}</div>
        <div>
          <strong>最后保存:</strong>
          {{
            resumeStore.lastSaved ? new Date(resumeStore.lastSaved).toLocaleString() : '从未保存'
          }}
        </div>
      </div>
    </div>

    <!-- 测试按钮 -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">测试功能</h2>

      <button
        @click="testBlogGeneration"
        class="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        测试 1: 从博客数据生成简历
      </button>

      <button
        @click="testCRUD"
        class="w-full px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600"
      >
        测试 2: CRUD 操作
      </button>

      <button
        @click="testCompletion"
        class="w-full px-4 py-3 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        测试 3: 完成度计算
      </button>

      <button
        @click="testJSON"
        class="w-full px-4 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        测试 4: JSON 导入导出
      </button>

      <button
        @click="resumeStore.exportJSON"
        class="w-full px-4 py-3 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        测试 5: 导出 JSON 文件
      </button>

      <button
        @click="testReset"
        class="w-full px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
      >
        测试 6: 重置所有数据
      </button>
    </div>

    <!-- 测试结果 -->
    <div v-if="testResult" class="mt-6 p-4 bg-blue-50 rounded">
      <strong>测试结果:</strong> {{ testResult }}
    </div>

    <!-- 数据预览 -->
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4">数据预览</h2>
      <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-auto max-h-96"
        >{{ JSON.stringify(resumeStore.resumeData, null, 2) }}
      </pre>
    </div>
  </div>
</template>
```

---

## 测试检查清单

- [ ] 从博客数据生成简历成功
- [ ] Markdown 文件导入成功
- [ ] CRUD 操作正常（添加、删除工作经历、技能等）
- [ ] 完成度计算准确
- [ ] JSON 导入导出功能正常
- [ ] 数据持久化（刷新页面后数据仍存在）
- [ ] 错误处理正确（无效数据、API 失败等）
- [ ] 加载状态正确显示
- [ ] 自动保存时间更新
- [ ] 重置功能正常（有确认提示）

---

## 常见问题排查

### 问题 1: 数据没有保存

**检查：**

```javascript
// 查看 localStorage
console.log(localStorage.getItem('resume-draft'))
```

**解决：**

- 确认浏览器没有禁用 localStorage
- 检查是否在隐私模式下运行

### 问题 2: 导入 Markdown 失败

**检查：**

- Markdown 文件格式是否正确
- frontmatter 是否用 `---` 包裹
- YAML 语法是否正确

### 问题 3: 完成度不更新

**检查：**

```javascript
// 查看计算属性依赖的字段
const fields = [
  resumeStore.resumeData.fullName,
  resumeStore.resumeData.title,
  resumeStore.resumeData.email,
  resumeStore.resumeData.phone,
  // ...
]
console.log('字段值:', fields)
```

---

## 性能测试

```javascript
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()

// 测试大量数据性能
console.time('添加100个技能')
for (let i = 0; i < 100; i++) {
  resumeStore.addSkill(`Skill ${i}`)
}
console.timeEnd('添加100个技能')

// 测试深度监听性能
console.time('批量更新数据')
for (let i = 0; i < 50; i++) {
  resumeStore.addExperience()
}
console.timeEnd('批量更新数据')
```

---

## 下一步

完成测试后，可以：

1. 集成到实际的简历编辑器组件中
2. 添加更多的数据验证
3. 实现撤销/重做功能
4. 添加数据导入导出的更多格式（PDF、Word 等）
5. 对接后端 API 实现云端同步

**参考文档：**

- `/docs/简历Store使用指南.md` - 完整使用指南
- `/src/stores/README.md` - Store 开发规范
