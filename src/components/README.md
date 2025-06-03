# Avatar3D 虚拟人组件

## 概述

Avatar3D 是一个基于 Vue 3 和 TresJS 的3D虚拟人展示组件，支持多种使用场景和交互模式。

## 主要功能

- ✨ **可旋转3D展示**：支持鼠标/触摸交互旋转查看
- 🎭 **个人形象替身**：展示你的虚拟身份形象
- 📖 **文章讲解助手**：未来可扩展语音讲解功能
- 🎨 **装饰型可视化**：美观的装饰性角色展示
- 📱 **响应式设计**：适配不同设备尺寸

## 技术实现

### 核心技术栈

- **Vue 3**: Composition API + TypeScript
- **TresJS**: Vue 3的Three.js生态系统
- **Three.js**: 3D图形渲染引擎
- **ReadyPlayerMe**: 3D虚拟人模型标准

### 组件架构

```
Avatar3D.vue (主组件)
├── AvatarModel.vue (模型加载器)
├── TresCanvas (3D画布)
├── OrbitControls (交互控制)
└── Loading UI (加载界面)
```

## 使用方法

### 基础使用

```vue
<template>
  <Avatar3D />
</template>

<script setup>
import Avatar3D from '@/components/Avatar3D.vue'
</script>
```

### 高级配置

```vue
<template>
  <Avatar3D
    mode="decorative"
    height="280px"
    :show-controls="false"
    :show-ground="false"
    :initial-scale="0.8"
    :initial-position="[0, -0.8, 0]"
  />
</template>

<script setup>
import Avatar3D from '@/components/Avatar3D.vue'
</script>
```

## Props 配置

| 属性              | 类型    | 默认值      | 说明                                     |
| ----------------- | ------- | ----------- | ---------------------------------------- |
| `mode`            | String  | `'full'`    | 显示模式：`full`、`decorative`、`simple` |
| `height`          | String  | `'600px'`   | 容器高度                                 |
| `showControls`    | Boolean | `true`      | 是否显示轨道控制器                       |
| `showGround`      | Boolean | `false`     | 是否显示地面网格                         |
| `initialScale`    | Number  | `1.0`       | 初始缩放比例                             |
| `initialPosition` | Array   | `[0, 0, 0]` | 初始位置 [x, y, z]                       |

## 显示模式

### 🎨 Decorative 装饰模式

```vue
<Avatar3D mode="decorative" height="280px" :show-controls="false" />
```

- 适用于侧边栏、卡片等装饰性展示
- 摄像机距离较近，视角更紧凑
- 默认禁用交互控制

### 🎮 Full 完整模式

```vue
<Avatar3D mode="full" height="500px" :show-ground="true" />
```

- 完整的3D展示体验
- 支持所有交互功能
- 适合专门的3D展示页面

### ⚡ Simple 简化模式

```vue
<Avatar3D mode="simple" height="300px" :initial-scale="0.8" />
```

- 基础的3D展示
- 中等交互功能
- 平衡性能和效果

## 事件处理

组件支持以下事件：

```vue
<template>
  <Avatar3D @loaded="handleLoaded" @error="handleError" />
</template>

<script setup>
const handleLoaded = () => {
  console.log('3D模型加载完成')
}

const handleError = error => {
  console.error('模型加载失败:', error)
}
</script>
```

## 样式自定义

### 容器样式

```vue
<style scoped>
.avatar-container {
  /* 自定义背景 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* 自定义圆角 */
  border-radius: 1rem;

  /* 自定义阴影 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style>
```

### 加载动画

```vue
<style scoped>
.loading-spinner {
  /* 自定义加载动画颜色 */
  border-top-color: #your-color;
}
</style>
```

## 性能优化

### 异步加载

- 使用 `Suspense` 组件实现异步加载
- 提供 fallback 占位内容
- 智能错误处理和重试机制

### 资源管理

- GLB模型懒加载
- 贴图和材质优化
- 内存管理和清理

### 渲染优化

- 根据模式调整渲染质量
- 自适应相机位置
- LOD（细节层次）支持

## 故障排除

### 常见问题

**1. 页面显示空白**

- 检查网络连接，确保能访问 ReadyPlayerMe CDN
- 检查浏览器控制台是否有错误信息
- 确认项目依赖正确安装

**2. 模型加载失败**

```javascript
// 检查控制台错误信息
console.error('3D虚拟形象加载失败:', error)
```

**3. 性能问题**

- 降低模型质量设置
- 减少同时渲染的3D组件数量
- 使用 `decorative` 模式减少渲染负担

### 调试技巧

**启用详细日志**

```javascript
// 在 AvatarModel.vue 中查看日志
console.log('开始加载3D虚拟形象...')
console.log('3D虚拟形象加载成功！', gltf)
```

**检查模型数据**

```javascript
// 验证模型结构
if (gltf && gltf.scene) {
  console.log('模型节点数量:', gltf.scene.children.length)
}
```

## 扩展开发

### 添加新功能

1. 继承 `AvatarModel.vue` 组件
2. 扩展 props 配置
3. 添加新的显示模式
4. 实现自定义动画

### 模型替换

```javascript
// 替换为自定义GLB模型
const gltf = await useGLTF('your-custom-model.glb')
```

### 动画支持

```javascript
// 添加模型动画
if (gltf.animations && gltf.animations.length > 0) {
  // 播放动画逻辑
}
```

## 版本信息

- **当前版本**: v1.0.0
- **Vue 版本**: ^3.4.15
- **TresJS 版本**: ^4.3.5
- **Three.js 版本**: ^0.177.0

## 许可证

MIT License - 详见项目根目录 LICENSE 文件

---

💡 **开发提示**:

- 使用 `npm run dev` 启动开发服务器
- 打开浏览器访问博客页面查看3D头像效果
- 检查浏览器控制台确认组件加载状态

## 使用场景

### 1. 博客侧边栏装饰

```vue
<Avatar3D mode="decorative" height="280px" :show-controls="false" />
```

### 2. 关于页面个人展示

```vue
<Avatar3D mode="full" height="500px" :show-ground="true" />
```

### 3. 文章内容辅助

```vue
<Avatar3D mode="simple" height="300px" :initial-scale="0.8" />
```

## 注意事项

- 模型文件较大，首次加载需要时间
- 移动端会自动隐藏装饰性展示以优化性能
- 支持 ReadyPlayerMe 和其他 GLB/GLTF 格式模型
- 建议使用 HTTPS 协议加载外部模型

## 扩展功能

- [ ] 动画播放控制
- [ ] 语音交互功能
- [ ] 表情动作控制
- [ ] 换装系统
- [ ] 背景环境切换
