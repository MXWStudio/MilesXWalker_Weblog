# Avatar3D 虚拟人组件

## 功能概述

Avatar3D 是一个基于 Vue 3 和 TresJS 的3D虚拟人展示组件，支持多种使用场景和交互模式。

## 主要功能

- ✨ **可旋转3D展示**：支持鼠标/触摸交互旋转查看
- 🎭 **个人形象替身**：展示你的虚拟身份形象
- 📖 **文章讲解助手**：未来可扩展语音讲解功能
- 🎨 **装饰型可视化**：美观的装饰性角色展示
- 📱 **响应式设计**：适配不同设备尺寸

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
    height="400px"
    :show-controls="false"
    :show-ground="true"
    :initial-scale="1.2"
    :initial-position="[0, -1, 0]"
    model-url="你的模型URL"
  />
</template>
```

## Props 参数说明

| 参数名            | 类型    | 默认值               | 说明                                                                 |
| ----------------- | ------- | -------------------- | -------------------------------------------------------------------- |
| `modelUrl`        | String  | ReadyPlayerMe模型URL | 3D模型文件地址                                                       |
| `mode`            | String  | 'full'               | 显示模式：'full'(完整功能)、'simple'(简单展示)、'decorative'(装饰性) |
| `height`          | String  | '600px'              | 容器高度                                                             |
| `showControls`    | Boolean | true                 | 是否显示控制面板                                                     |
| `showGround`      | Boolean | false                | 是否显示地面                                                         |
| `groundColor`     | String  | '#cccccc'            | 地面颜色                                                             |
| `initialScale`    | Number  | 1                    | 初始缩放比例                                                         |
| `initialPosition` | Array   | [0, -1, 0]           | 初始位置[x, y, z]                                                    |

## 显示模式

### 1. Full Mode (完整功能)

- 支持平移、缩放、旋转
- 显示控制面板
- 适合独立展示页面

### 2. Simple Mode (简单展示)

- 支持缩放和旋转
- 简化的交互控制
- 适合文章内嵌入

### 3. Decorative Mode (装饰性)

- 仅支持旋转
- 限制缩放范围
- 适合侧边栏装饰

## 技术实现

### 依赖包

- `@tresjs/core`: Vue 3 的 Three.js 渲染器
- `@tresjs/cientos`: TresJS 组件库
- `three`: 3D 图形库

### 核心特性

- 异步加载3D模型
- 错误处理和重试机制
- 性能优化和响应式适配
- 多光源照明系统
- 轨道控制器交互

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
