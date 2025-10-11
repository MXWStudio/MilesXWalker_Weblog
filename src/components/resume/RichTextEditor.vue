<!-- RichTextEditor.vue - Tiptap 富文本编辑器组件 -->
<template>
  <div class="rich-text-editor">
    <!-- 编辑器工具栏 -->
    <div v-if="editor && !readonly" class="editor-toolbar">
      <div class="toolbar-group">
        <button
          :class="{ 'is-active': editor.isActive('bold') }"
          class="toolbar-btn"
          type="button"
          title="粗体 (Ctrl+B)"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <strong>B</strong>
        </button>
        <button
          :class="{ 'is-active': editor.isActive('italic') }"
          class="toolbar-btn"
          type="button"
          title="斜体 (Ctrl+I)"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <em>I</em>
        </button>
        <button
          :class="{ 'is-active': editor.isActive('underline') }"
          class="toolbar-btn"
          type="button"
          title="下划线 (Ctrl+U)"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <u>U</u>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          class="toolbar-btn"
          type="button"
          title="标题"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          H3
        </button>
        <button
          :class="{ 'is-active': editor.isActive('paragraph') }"
          class="toolbar-btn"
          type="button"
          title="段落"
          @click="editor.chain().focus().setParagraph().run()"
        >
          P
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          :class="{ 'is-active': editor.isActive('bulletList') }"
          class="toolbar-btn"
          type="button"
          title="无序列表"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          • 列表
        </button>
        <button
          :class="{ 'is-active': editor.isActive('orderedList') }"
          class="toolbar-btn"
          type="button"
          title="有序列表"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          1. 列表
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          type="button"
          title="换行"
          @click="editor.chain().focus().setHardBreak().run()"
        >
          换行
        </button>
        <button
          class="toolbar-btn"
          type="button"
          title="清除格式"
          @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
        >
          清除格式
        </button>
      </div>
    </div>

    <!-- 编辑器内容区 -->
    <EditorContent
      :editor="editor"
      :class="['editor-content', { 'is-readonly': readonly }]"
      :style="{ minHeight: minHeight }"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '开始输入...',
  },
  minHeight: {
    type: String,
    default: '150px',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// 创建编辑器实例
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [3, 4],
      },
    }),
    Underline,
  ],
  content: props.modelValue,
  editable: !props.readonly,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none',
      placeholder: props.placeholder,
    },
  },
})

// 监听外部数据变化
watch(
  () => props.modelValue,
  value => {
    if (editor.value && value !== null && value !== undefined) {
      const currentContent = editor.value.getHTML()
      // 只有当内容确实不同时才更新，避免循环更新
      if (currentContent !== value && value.trim() !== '') {
        editor.value.commands.setContent(value, false)
      }
    }
  }
)

// 监听只读状态变化
watch(
  () => props.readonly,
  value => {
    if (editor.value) {
      editor.value.setEditable(!value)
    }
  }
)

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: all 0.2s ease;
}

.rich-text-editor:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 工具栏样式 */
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #cbd5e0;
  margin: 0 4px;
}

.toolbar-btn {
  padding: 6px 10px;
  border: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  color: #4a5568;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.toolbar-btn:hover {
  background: #edf2f7;
  color: #2d3748;
}

.toolbar-btn.is-active {
  background: #667eea;
  color: white;
}

.toolbar-btn:active {
  transform: scale(0.95);
}

/* 编辑器内容区样式 */
.editor-content {
  padding: 16px;
}

.editor-content.is-readonly {
  background: #f7fafc;
  cursor: default;
}

/* Tiptap 编辑器内部样式 */
:deep(.ProseMirror) {
  outline: none;
  min-height: inherit;
  color: #2d3748;
  line-height: 1.6;
}

:deep(.ProseMirror p) {
  margin-bottom: 0.75em;
}

:deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.1em;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5em;
  margin-top: 1em;
}

:deep(.ProseMirror h3:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror h4) {
  font-size: 1em;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5em;
  margin-top: 0.75em;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin-bottom: 0.75em;
}

:deep(.ProseMirror li) {
  margin-bottom: 0.25em;
}

:deep(.ProseMirror strong) {
  font-weight: 700;
  color: #1a202c;
}

:deep(.ProseMirror em) {
  font-style: italic;
}

:deep(.ProseMirror u) {
  text-decoration: underline;
}

/* Placeholder 样式 */
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(placeholder);
  color: #a0aec0;
  pointer-events: none;
  height: 0;
  float: left;
}

/* 只读模式下的样式调整 */
.is-readonly :deep(.ProseMirror) {
  cursor: default;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .editor-toolbar {
    padding: 6px 8px;
  }

  .toolbar-btn {
    padding: 5px 8px;
    font-size: 0.8em;
  }

  .editor-content {
    padding: 12px;
  }
}
</style>
