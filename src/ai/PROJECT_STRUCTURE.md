# AI 模块项目结构

> 完整的项目文件组织和依赖关系

## 📁 完整目录结构

```
MilesXWalker/
│
├── src/
│   ├── ai/                                    ← 🆕 AI 模块（核心）
│   │   ├── README.md                          ← 模块文档
│   │   ├── USAGE_EXAMPLE.md                   ← 使用示例
│   │   ├── PROJECT_STRUCTURE.md               ← 本文件
│   │   ├── useAIResumeGenerator.js            ← AI 调用核心
│   │   └── systemPrompts/
│   │       └── resumeSystemPrompt.js          ← 系统 Prompt
│   │
│   ├── composables/
│   │   └── useAI.js                           ← 保留（兼容）
│   │
│   ├── components/
│   │   ├── ResumeGenerator.vue                ← 简历生成器
│   │   ├── ResumeEditor.vue                   ← 简历编辑器
│   │   └── ResumePreview.vue                  ← 简历预览
│   │
│   ├── stores/
│   │   └── resumeStore.js                     ← 简历状态管理
│   │
│   └── utils/
│       └── blogParser.js                      ← 博客内容解析
│
├── docs/
│   ├── AI功能快速验证清单.md                  ← 快速测试
│   ├── AI简历优化功能使用指南.md              ← 使用指南
│   ├── AI简历优化功能测试.md                  ← 测试清单
│   ├── AI模块架构升级完成报告.md              ← 架构报告
│   ├── 简历生成器AI统一接口实现总结.md        ← 实现总结
│   ├── 简历生成器v2.3更新日志.md              ← 版本日志
│   └── commands/
│       └── AI功能快速参考.md                  ← 快速参考
│
└── .env                                        ← 环境配置
    VITE_OPENAI_API_KEY=sk-...
```

## 🔗 文件依赖关系

### 核心调用链

```
ResumeGenerator.vue
    │
    ├─→ import { generateSmartResume }
    │   from '@/ai/useAIResumeGenerator'
    │
    └─→ useAIResumeGenerator.js
            │
            ├─→ import { resumeSystemPrompt }
            │   from './systemPrompts/resumeSystemPrompt'
            │
            ├─→ buildUserPrompt()
            │   ├─ 构建用户 Prompt
            │   └─ 结合简历数据和岗位
            │
            ├─→ callOpenAI()
            │   ├─ System Prompt
            │   ├─ User Prompt
            │   └─ API 调用
            │
            └─→ callOllama()
                ├─ Combined Prompt
                └─ 本地 API 调用
```

### 数据流向

```
┌──────────────────────┐
│  用户输入            │
│  - 目标岗位          │
│  - 配置选项          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  ResumeGenerator     │
│  - 收集用户输入      │
│  - 调用 AI 接口      │
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────┐
│  useAIResumeGenerator      │
│  - buildUserPrompt()       │
│  - getSystemPrompt()       │
│  - callOpenAI/Ollama()     │
└──────────┬─────────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌──────────┐
│ System  │  │ User     │
│ Prompt  │  │ Prompt   │
└────┬────┘  └────┬─────┘
     │            │
     └─────┬──────┘
           │
           ▼
    ┌──────────────┐
    │  AI API      │
    │  (OpenAI /   │
    │   Ollama)    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  JSON Result │
    │  - summary   │
    │  - skills    │
    │  - recomm... │
    └──────┬───────┘
           │
           ▼
┌──────────────────────┐
│  ResumeStore         │
│  - 更新简历数据      │
│  - 触发界面更新      │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│  UI 更新             │
│  - 显示优化结果      │
│  - 提示用户确认      │
└──────────────────────┘
```

## 📋 文件清单和职责

### AI 核心模块

| 文件                                         | 职责                   | 状态      |
| -------------------------------------------- | ---------------------- | --------- |
| `src/ai/README.md`                           | 模块文档和 API 说明    | ✅ 已完成 |
| `src/ai/USAGE_EXAMPLE.md`                    | 详细使用示例           | ✅ 已完成 |
| `src/ai/PROJECT_STRUCTURE.md`                | 项目结构说明（本文件） | ✅ 已完成 |
| `src/ai/useAIResumeGenerator.js`             | AI 调用核心逻辑        | ✅ 已完成 |
| `src/ai/systemPrompts/resumeSystemPrompt.js` | 系统 Prompt 模板       | ✅ 已完成 |

### 业务组件

| 文件                                 | 职责             | 修改状态    |
| ------------------------------------ | ---------------- | ----------- |
| `src/components/ResumeGenerator.vue` | 简历生成器主组件 | ✅ 已优化   |
| `src/components/ResumeEditor.vue`    | 简历编辑区       | ⏸️ 无需修改 |
| `src/components/ResumePreview.vue`   | 简历预览区       | ⏸️ 无需修改 |

### 状态管理

| 文件                        | 职责             | 状态        |
| --------------------------- | ---------------- | ----------- |
| `src/stores/resumeStore.js` | 简历数据状态管理 | ⏸️ 无需修改 |

### 兼容层

| 文件                       | 职责         | 状态            |
| -------------------------- | ------------ | --------------- |
| `src/composables/useAI.js` | 旧版 AI 接口 | ⚠️ 保留向后兼容 |

### 文档

| 文件                                   | 类型     | 状态      |
| -------------------------------------- | -------- | --------- |
| `docs/AI功能快速验证清单.md`           | 测试文档 | ✅ 已完成 |
| `docs/AI简历优化功能使用指南.md`       | 用户文档 | ✅ 已完成 |
| `docs/AI简历优化功能测试.md`           | 测试文档 | ✅ 已完成 |
| `docs/AI模块架构升级完成报告.md`       | 技术文档 | ✅ 已完成 |
| `docs/简历生成器AI统一接口实现总结.md` | 技术文档 | ✅ 已完成 |
| `docs/简历生成器v2.3更新日志.md`       | 版本文档 | ✅ 已完成 |
| `docs/commands/AI功能快速参考.md`      | 快速参考 | ✅ 已完成 |

## 🎯 关键接口

### 导出接口

```javascript
// src/ai/useAIResumeGenerator.js

export {
  generateSmartResume, // 简化接口（兼容旧版）
  generateAIResume, // 完整接口（新功能）
  buildUserPrompt, // Prompt 构建
  getSystemPrompt, // 获取系统 Prompt
}
```

### 导入方式

```javascript
// 推荐方式 1：使用简化接口
import { generateSmartResume } from '@/ai/useAIResumeGenerator'

// 推荐方式 2：使用完整接口
import { generateAIResume } from '@/ai/useAIResumeGenerator'

// 高级用法：自定义 Prompt
import { buildUserPrompt, getSystemPrompt } from '@/ai/useAIResumeGenerator'

// 兼容旧版（不推荐，但仍可用）
import { generateSmartResume } from '@/composables/useAI'
```

## 🔧 配置文件

### 环境变量

```env
# .env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

### Package.json 依赖

无需额外依赖，使用内置 fetch API

## 📊 代码统计

### 行数统计

| 文件                      | 代码行数 | 注释行数 | 总行数 |
| ------------------------- | -------- | -------- | ------ |
| `useAIResumeGenerator.js` | ~300     | ~100     | ~400   |
| `resumeSystemPrompt.js`   | ~200     | ~150     | ~350   |
| `README.md`               | -        | ~800     | ~800   |
| `USAGE_EXAMPLE.md`        | -        | ~600     | ~600   |
| **总计**                  | ~500     | ~1650    | ~2150  |

### 文件大小

| 文件                      | 大小   |
| ------------------------- | ------ |
| `useAIResumeGenerator.js` | ~15 KB |
| `resumeSystemPrompt.js`   | ~12 KB |
| `README.md`               | ~25 KB |
| `USAGE_EXAMPLE.md`        | ~20 KB |
| **总计**                  | ~72 KB |

## 🚀 部署清单

### 必需文件

- ✅ `src/ai/useAIResumeGenerator.js`
- ✅ `src/ai/systemPrompts/resumeSystemPrompt.js`
- ✅ `.env` (包含 API Key)

### 可选文件

- 📖 `src/ai/README.md`
- 📖 `src/ai/USAGE_EXAMPLE.md`
- 📖 `src/ai/PROJECT_STRUCTURE.md`
- 📖 所有 docs/ 下的文档

### 部署步骤

1. 确保所有核心文件已提交
2. 配置 `.env` 文件
3. 运行测试
4. 部署到生产环境

## 🧪 测试覆盖

### 单元测试（待添加）

```javascript
// tests/ai/useAIResumeGenerator.test.js
describe('useAIResumeGenerator', () => {
  test('generateSmartResume 基础调用', async () => {
    const result = await generateSmartResume('摄影师', mockData)
    expect(result).toHaveProperty('summary')
    expect(result).toHaveProperty('highlightedSkills')
    expect(result).toHaveProperty('recommendations')
  })

  test('buildUserPrompt 正确构建', () => {
    const prompt = buildUserPrompt('前端开发', mockData)
    expect(prompt).toContain('前端开发')
    expect(prompt).toContain(JSON.stringify(mockData))
  })

  test('getSystemPrompt 多语言支持', () => {
    const zhPrompt = getSystemPrompt('zh', 'full')
    const enPrompt = getSystemPrompt('en', 'full')
    expect(zhPrompt).toContain('中文')
    expect(enPrompt).toContain('English')
  })
})
```

### 集成测试

- ✅ OpenAI API 调用测试
- ✅ Ollama API 调用测试
- ✅ 错误处理测试
- ✅ 向后兼容性测试

## 🔐 安全注意事项

### API Key 管理

- ✅ 使用环境变量存储
- ✅ 不提交到代码仓库
- ✅ `.gitignore` 已配置

### 数据隐私

- ✅ OpenAI 模式：数据发送到 OpenAI
- ✅ Ollama 模式：数据完全本地处理
- ✅ 用户可选择使用模式

## 📈 性能指标

### API 调用时间

- OpenAI: 5-15 秒（取决于网络）
- Ollama: 3-10 秒（取决于硬件）

### Token 消耗

- Full Mode: ~2000-3000 tokens
- Simple Mode: ~1000-1500 tokens

### 内存占用

- 运行时: < 10 MB
- 缓存: 可选配置

## 🔄 版本历史

| 版本       | 日期       | 变更               |
| ---------- | ---------- | ------------------ |
| v2.4-alpha | 2025-01-09 | 🆕 AI 模块架构升级 |
| v2.3       | 2025-01-09 | ✨ AI 简历优化功能 |
| v2.2       | 2024-xx-xx | 简历编辑器功能     |
| v2.1       | 2024-xx-xx | 简历生成器基础功能 |

---

**最后更新：** 2025-01-09  
**维护者：** AI进化论-花生  
**状态：** ✅ 已完成
