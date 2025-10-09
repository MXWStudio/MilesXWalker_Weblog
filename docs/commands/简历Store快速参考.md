# 简历 Store 快速参考卡片

## 🚀 快速开始

```javascript
import { useResumeStore } from '@/stores/resumeStore'
const resumeStore = useResumeStore()
```

---

## 📥 数据导入（4种方式）

### 1. 从博客数据生成

```javascript
await resumeStore.generateFromBlog({
  blogPosts: [{ title: '作品1', date: '2025-01-01', category: '摄影' }],
  profile: { name: 'Miles Walker', skills: ['Vue3'] },
})
```

### 2. 从 Markdown 文件

```javascript
await resumeStore.generateFromMarkdownFile(file, {
  overwriteBasicInfo: true,
  appendExperience: false,
})
```

### 3. 从 API

```javascript
await resumeStore.generateFromAPI('https://api.example.com/resume')
```

### 4. 从 JSON

```javascript
resumeStore.importJSON(jsonData)
```

---

## 📤 数据导出

```javascript
// 导出为 JSON 文件（自动下载）
resumeStore.exportJSON()
```

---

## ➕ 添加数据

```javascript
// 工作经历
resumeStore.addExperience()

// 教育背景
resumeStore.addEducation()

// 项目经验
resumeStore.addProject()

// 技能
resumeStore.addSkill('Vue.js')
```

---

## ➖ 删除数据

```javascript
// 工作经历
resumeStore.removeExperience(id)

// 教育背景
resumeStore.removeEducation(id)

// 项目经验
resumeStore.removeProject(id)

// 技能
resumeStore.removeSkill('Vue.js')
```

---

## 📊 状态查询

```javascript
// 加载状态
resumeStore.loading // true/false

// 错误信息
resumeStore.error // string | null

// 完成度
resumeStore.completionPercentage // 0-100

// 是否完整
resumeStore.isComplete // true/false

// 技能列表
resumeStore.skillsList // Array

// 最后保存时间
resumeStore.lastSaved // ISO string
```

---

## 🔧 其他操作

```javascript
// 设置目标岗位
resumeStore.setTargetJob('前端工程师')

// 清除错误
resumeStore.clearError()

// 重置所有数据
resumeStore.resetResume()

// 手动更新保存时间
resumeStore.updateSaveTime()
```

---

## 📝 访问数据

```javascript
// 完整的简历数据对象
resumeStore.resumeData

// 基本信息
resumeStore.resumeData.fullName
resumeStore.resumeData.title
resumeStore.resumeData.email

// 工作经历数组
resumeStore.resumeData.experience

// 教育背景数组
resumeStore.resumeData.education

// 项目经验数组
resumeStore.resumeData.projects

// 技能列表
resumeStore.resumeData.skills
```

---

## ⚡ 常用模式

### 加载状态显示

```vue
<button :disabled="resumeStore.loading">
  {{ resumeStore.loading ? '加载中...' : '导入' }}
</button>
```

### 错误提示

```vue
<div v-if="resumeStore.error" class="error">
  {{ resumeStore.error }}
  <button @click="resumeStore.clearError">关闭</button>
</div>
```

### 完成度进度条

```vue
<div class="progress-bar">
  <div :style="{ width: resumeStore.completionPercentage + '%' }"></div>
</div>
<span>{{ resumeStore.completionPercentage }}%</span>
```

### 文件上传

```vue
<input
  type="file"
  accept=".md"
  @change="e => resumeStore.generateFromMarkdownFile(e.target.files[0])"
/>
```

---

## 🎨 模板和主题

```javascript
// 选择模板
resumeStore.selectedTemplate = 'modern' // 'modern', 'classic', 'creative'

// 主题颜色
resumeStore.themeColor = '#667eea' // HEX 颜色
```

---

## 💾 数据持久化

所有数据**自动保存**到 localStorage：

- `resume-draft` - 简历数据
- `resume-last-saved` - 最后保存时间
- `resume-template` - 模板选择
- `resume-theme-color` - 主题颜色

**清除所有数据：**

```javascript
resumeStore.resetResume() // 会弹出确认对话框
```

---

## 🔍 数据验证

```javascript
// 检查必填项
if (!resumeStore.isComplete) {
  console.log('请填写完整信息')
}

// 检查完成度
if (resumeStore.completionPercentage < 50) {
  console.log('简历完成度过低')
}
```

---

## 📚 完整文档

- **使用指南：** `/docs/简历Store使用指南.md`
- **测试指南：** `/docs/简历Store功能测试.md`
- **升级报告：** `/docs/简历Store升级完成报告.md`
- **开发规范：** `/src/stores/README.md`

---

## 🐛 问题排查

### 数据没有保存

```javascript
// 检查 localStorage
console.log(localStorage.getItem('resume-draft'))
```

### 导入失败

```javascript
// 查看错误信息
console.log(resumeStore.error)

// 清除错误后重试
resumeStore.clearError()
```

### 完成度不更新

```javascript
// 手动触发更新
resumeStore.updateSaveTime()
```

---

## 💡 最佳实践

1. ✅ 使用 `loading` 状态禁用按钮
2. ✅ 显示错误信息给用户
3. ✅ 定期导出 JSON 备份
4. ✅ 导入前询问用户是否覆盖
5. ✅ 监听数据变化显示保存状态

---

**版本：** v1.0  
**更新时间：** 2025-10-09
