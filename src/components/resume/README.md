# Resume Components - 简历组件

## 📋 组件说明

这个目录包含简历生成器相关的组件。

## 🧩 组件列表

### RichTextEditor.vue

富文本编辑器组件，基于 Tiptap 实现。

**功能特性：**

- ✅ 富文本编辑（粗体、斜体、下划线）
- ✅ 标题和段落格式
- ✅ 有序和无序列表
- ✅ 清除格式功能
- ✅ 只读模式
- ✅ 响应式设计

**使用示例：**

```vue
<template>
  <RichTextEditor
    v-model="content"
    placeholder="请输入内容..."
    min-height="200px"
    :readonly="false"
  />
</template>

<script setup>
import { ref } from 'vue'
import RichTextEditor from '@/components/resume/RichTextEditor.vue'

const content = ref('<p>初始内容</p>')
</script>
```

**Props：**

- `modelValue` (String): 编辑器内容 (HTML 格式)
- `placeholder` (String): 占位符文本，默认 "开始输入..."
- `minHeight` (String): 最小高度，默认 "150px"
- `readonly` (Boolean): 只读模式，默认 false

**Events：**

- `update:modelValue`: 内容变化时触发，返回 HTML 字符串

## 🎨 使用技术

- **Tiptap**: 现代化的富文本编辑器框架
- **@tiptap/vue-3**: Tiptap 的 Vue 3 绑定
- **@tiptap/starter-kit**: Tiptap 基础扩展包
- **@tiptap/extension-underline**: 下划线扩展

## 📝 开发规范

1. 所有简历相关的组件都应放在此目录下
2. 组件应遵循单一职责原则
3. 使用 Composition API 和 `<script setup>` 语法
4. 提供清晰的 Props 和 Events 文档
5. 确保组件的响应式设计

## 🔗 相关文件

- Store: `/src/stores/resume.js` - 简历数据管理
- Page: `/src/pages/ResumeGenerator.vue` - 简历生成器页面
- Router: `/src/router/index.js` - 路由配置 (`/resume-generator`)
