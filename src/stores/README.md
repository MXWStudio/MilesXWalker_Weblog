# stores 目录说明

本目录用于存放所有 Pinia 状态管理相关的 store 文件。

## 设计原则

- 每个 store 建议单独一个 .js 或 .ts 文件，按功能分类
- 统一管理全局状态，便于组件间共享数据
- 使用 Vue 3 Composition API 风格编写
- 利用 VueUse 等工具库实现数据持久化

## 现有 Store

### 1. resumeStore.js - 简历数据管理

**功能特性：**

- ✅ 自动保存到 localStorage（使用 VueUse 的 useStorage）
- ✅ 从博客数据生成简历
- ✅ Markdown 文件导入
- ✅ API 数据获取
- ✅ JSON 导入导出
- ✅ 完整的 CRUD 操作（工作经历、教育背景、项目、技能等）
- ✅ 完成度计算和验证
- ✅ 模板和主题配置

**使用示例：**

```javascript
import { useResumeStore } from '@/stores/resumeStore'

const resumeStore = useResumeStore()

// 从博客生成简历
await resumeStore.generateFromBlog({
  blogPosts: [...],
  profile: { name: 'Miles Walker', skills: [...] }
})

// 检查完成度
console.log(resumeStore.completionPercentage) // 0-100

// 添加工作经历
resumeStore.addExperience()
```

**详细文档：** 参考 `/docs/简历Store使用指南.md`

### 2. user.js - 用户管理

用于管理用户登录状态、个人信息等。

---

## Store 开发规范

### 基本结构

使用 Composition API 风格：

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('myStore', () => {
  // 状态
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const isReady = computed(() => !!data.value && !loading.value)

  // 方法
  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      // 异步操作
      data.value = await api.getData()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    // 导出状态、计算属性和方法
    data,
    loading,
    error,
    isReady,
    fetchData,
  }
})
```

### 命名规范

- Store 文件名：小驼峰 `userStore.js`
- Store 名称：使用 `useXxxStore` 格式
- 状态变量：使用 `ref()` 或 `reactive()`
- 计算属性：使用 `computed()`
- 方法：使用普通函数

### 数据持久化

推荐使用 VueUse 的 `useStorage`：

```javascript
import { useStorage } from '@vueuse/core'

const data = useStorage('storage-key', defaultValue, localStorage)
```

### 错误处理

所有异步操作都应该有错误处理：

```javascript
const error = ref(null)

async function someAction() {
  error.value = null
  try {
    // 操作
  } catch (err) {
    console.error('操作失败:', err)
    error.value = err.message
  }
}
```

### 加载状态

为异步操作提供加载状态反馈：

```javascript
const loading = ref(false)

async function fetchData() {
  loading.value = true
  try {
    // 获取数据
  } finally {
    loading.value = false
  }
}
```

---

## 最佳实践

### 1. 模块化

将相关功能拆分到不同的 store 中：

- ✅ `resumeStore` - 简历数据
- ✅ `userStore` - 用户信息
- ❌ 不要把所有状态都放在一个 store 里

### 2. 避免直接修改

在组件中不要直接修改 store 的状态：

```javascript
// ❌ 不好
resumeStore.resumeData.fullName = '新名字'

// ✅ 好
resumeStore.resumeData.fullName = '新名字' // 对于简单赋值可以
// 或者提供专门的方法
resumeStore.updateBasicInfo({ fullName: '新名字' })
```

### 3. 使用计算属性

对于需要计算的状态，使用 computed：

```javascript
const completionPercentage = computed(() => {
  // 计算逻辑
  return percentage
})
```

### 4. TypeScript 支持

如果使用 TypeScript，定义类型：

```typescript
interface ResumeData {
  fullName: string
  title: string
  // ...
}

const resumeData = ref<ResumeData>({
  fullName: '',
  title: '',
})
```

---

## 调试技巧

### Pinia DevTools

在浏览器中使用 Vue DevTools 查看 Pinia 状态：

1. 打开 Vue DevTools
2. 切换到 Pinia 选项卡
3. 查看所有 store 的状态和历史记录

### 状态日志

在开发环境添加监听器：

```javascript
import { watch } from 'vue'

if (import.meta.env.DEV) {
  watch(
    () => resumeStore.resumeData,
    newValue => {
      console.log('简历数据已更新:', newValue)
    },
    { deep: true }
  )
}
```

---

## 参考资料

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [VueUse 文档](https://vueuse.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
