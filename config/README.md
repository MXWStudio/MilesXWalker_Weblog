# 🔧 配置文件说明

## 📋 当前有效的配置文件（项目根目录）

| 文件名               | 用途           | 说明                 |
| -------------------- | -------------- | -------------------- |
| `eslint.config.js`   | 代码质量检查   | ESLint 9 新格式配置  |
| `.prettierrc`        | 代码格式化     | Prettier配置         |
| `tsconfig.json`      | TypeScript配置 | 类型检查和编译配置   |
| `vite.config.ts`     | 构建工具配置   | Vite开发和构建配置   |
| `tailwind.config.ts` | 样式框架配置   | Tailwind CSS配置     |
| `postcss.config.ts`  | CSS处理配置    | PostCSS插件配置      |
| `components.json`    | 组件库配置     | shadcn/ui组件库配置  |
| `vercel.json`        | 部署配置       | Vercel部署规则配置   |
| `.editorconfig`      | 编辑器配置     | 跨编辑器代码风格配置 |
| `.gitignore`         | Git忽略配置    | Git版本控制忽略规则  |
| `.nvmrc`             | Node版本配置   | Node.js版本锁定      |

## 🚨 注意事项

1. **修改配置文件**：只修改根目录的当前有效配置文件
2. **配置冲突**：如果发现配置冲突，优先使用根目录的文件
3. **版本管理**：配置文件的更改都会被Git跟踪

## 🔄 配置文件历史升级

项目已完成以下配置升级（过时文件已清理）：

- **ESLint**: `.eslintrc.*` → `eslint.config.js` (使用ESLint 9新格式)
- **TypeScript**: `jsconfig.json` → `tsconfig.json` (全面使用TypeScript)
- **构建工具**: `babel.config.ts` → `vite.config.ts` (迁移到Vite)
- **部署**: `.nowignore` → `vercel.json` + `.gitignore` (更新部署配置)

## 🧹 清理说明

为保持项目整洁，已删除以下过时文件：

- `.eslintrc.js` / `.eslintrc.ts` (已被eslint.config.js替代)
- `cursorrules.md` (已整合到新规则系统)
- `nuxt.config.ts` (项目使用Vite，不需要Nuxt)
- `.nowignore` (已被.gitignore替代)
- `jsconfig.json` (已被tsconfig.json替代)
- `babel.config.ts` (Vite内置处理，不需要)

---

💡 **提示**：项目现在只保留必要的配置文件，结构更加清晰简洁！
