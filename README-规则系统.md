# MilesXWalkerStudio 规则系统说明

## 系统概述

为MilesXWalkerStudio Vue3.js项目创建的模块化Cursor规则管理系统，将开发规范拆分为多个专门的规则文件，便于管理和维护。

## 规则文件列表

| 文件名 | 用途 | 主要内容 |
|--------|------|----------|
| `.cursorrules` | 主规则文件 | 核心开发理念、工作流程、规则引用指南 |
| `.cursorrules.main` | 核心规则 | 角色定义、项目初始化、工作流程 |
| `.cursorrules.code` | 代码规范 | Vue3、TypeScript、ESLint配置 |
| `.cursorrules.component` | 组件开发 | 组件设计、Props/Events/Slots规范 |
| `.cursorrules.store` | 状态管理 | Pinia使用规范、数据持久化 |
| `.cursorrules.router` | 路由管理 | Vue Router配置、导航守卫 |
| `.cursorrules.style` | 样式规范 | Tailwind CSS、响应式设计、深色模式 |
| `.cursorrules.structure` | 项目结构 | 目录组织、文件命名、文档规范 |
| `.cursorrules.deploy` | 部署配置 | 环境管理、Vercel部署、监控 |
| `.cursorrules.debug` | 调试指南 | 问题诊断、错误处理、Bug修复 |
| `.cursorrules.manager` | 规则管理器 | 系统使用指南、维护流程 |

## 快速使用

### 1. 查看规则文件
```bash
# 查看所有规则文件
ls -la .cursorrules*

# 查看主规则
cat .cursorrules

# 查看特定规则
cat .cursorrules.component
```

### 2. 根据任务选择规则

**开发新组件：**
- `.cursorrules.component` - 组件开发规范
- `.cursorrules.style` - 样式处理
- `.cursorrules.code` - 代码质量

**添加新页面：**
- `.cursorrules.router` - 路由配置
- `.cursorrules.structure` - 文件组织
- `.cursorrules.component` - 页面组件

**状态管理：**
- `.cursorrules.store` - Pinia规范
- `.cursorrules.code` - 代码质量

**问题调试：**
- `.cursorrules.debug` - 调试指南
- `.cursorrules.deploy` - 环境检查

### 3. 规则系统特点

✅ **模块化设计** - 每个文件专注特定领域  
✅ **完整覆盖** - 涵盖开发全流程  
✅ **实用性强** - 基于实际项目经验  
✅ **易于维护** - 独立更新，相互引用  
✅ **文档完善** - 详细说明和代码示例  

## 维护指南

### 更新规则
1. 确定需要更新的规则类型
2. 修改对应的 `.cursorrules.[type]` 文件
3. 更新主规则文件引用（如需要）
4. 更新相关文档

### 添加新规则
```bash
# 创建新规则文件
touch .cursorrules.[new-type]

# 添加规则内容
echo "# [新规则类型] 规范" > .cursorrules.[new-type]

# 在主规则中添加引用
```

## 使用建议

**初级开发者：**
- 重点关注代码规范和组件开发规则
- 严格按照规范执行
- 遇到问题参考调试指南

**中级开发者：**
- 熟悉所有规则文件
- 灵活运用各种规范
- 协助维护规则系统

**高级开发者：**
- 负责规则制定和更新
- 指导团队使用规则
- 确保架构规范执行

## 版权信息

本规则系统由 AI进化论-花生 创建，版权所有，引用请注明出处。

---

*完整的规则系统使用指南请查看 `.cursorrules.manager` 文件* 