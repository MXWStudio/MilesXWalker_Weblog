# utils 目录说明

本目录用于存放项目级通用工具函数。

- 建议按功能分类存放，如字符串处理、日期格式化等。
- 仅包含无副作用的纯函数。

## 工具文件列表

### blogParser.js

博客数据解析工具，提供以下功能：

1. **简历数据解析** - 从 Markdown 文件解析简历数据
2. **博客内容抓取** - 从多种数据源抓取博客内容并提取个人信息
   - 支持本地博客数据
   - 支持 Markdown 文件
   - 支持 API 接口

**主要函数:**

- `parseMarkdownResume()` - 解析 Markdown 格式的简历
- `fetchBlogResumeData()` - 抓取博客内容并提取简历数据
- `fetchAndParseBlog()` - 从 URL 获取并解析博客内容
- `parseLocalMarkdownFile()` - 从本地文件读取并解析
- `validateResumeData()` - 验证简历数据完整性
- `mergeResumeData()` - 合并简历数据

**详细文档:** 参见 `/docs/博客内容抓取使用指南.md`

### pdfExporter.js

PDF 导出工具，用于将简历导出为 PDF 格式。

**主要函数:**

- `exportToPDF()` - 导出简历为 PDF

### 其他工具文件

可根据项目需要添加更多工具函数文件。
