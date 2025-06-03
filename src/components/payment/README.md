# Payment 支付组件

## 📋 组件概述

本目录包含与支付功能相关的所有Vue组件，基于Stripe支付系统构建，提供安全、可靠的在线支付解决方案。

## 🧩 组件列表

### 1. PaymentForm.vue

**主要支付表单组件**

**功能特性：**

- 🔐 Stripe Elements集成
- 💳 支持信用卡/借记卡支付
- 🛡️ PCI DSS合规的安全支付
- 📱 响应式设计
- ⚡ 实时表单验证
- 🌍 国际化支付支持

**使用方式：**

```vue
<PaymentForm
  :amount="9999"
  currency="usd"
  :order-info="orderDetails"
  @payment-success="handleSuccess"
  @payment-error="handleError"
  @payment-processing="handleProcessing"
/>
```

**Props参数：**

- `amount` (Number, 必需) - 支付金额（以分为单位）
- `currency` (String, 默认: 'usd') - 货币类型
- `orderInfo` (Object, 可选) - 订单信息对象

**Events事件：**

- `@payment-success` - 支付成功时触发
- `@payment-error` - 支付失败时触发
- `@payment-processing` - 支付处理状态变化时触发

### 2. PaymentSuccess.vue

**支付成功页面组件**

**功能特性：**

- ✅ 支付成功状态展示
- 📄 订单详情显示
- 🎯 收据下载功能
- 🏠 返回首页导航
- 📞 客服联系信息

**自动功能：**

- 从URL参数获取支付信息
- 验证支付状态
- 显示格式化的支付详情

## 🔧 配置要求

### 环境变量配置

确保在`.env`文件中配置以下变量：

```bash
# Stripe API密钥
STRIPE_SECRET_KEY=sk_live_vzhe1sDF1FqnsLZEF9hEMvqj0AEHd6F-vyF
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# 支付功能开关
VITE_ENABLE_PAYMENTS=true

# API端点配置
VITE_PAYMENT_API_URL=http://localhost:3000/api/payment
VITE_WEBHOOK_ENDPOINT=/api/webhooks/stripe
```

### 依赖包要求

```bash
npm install @stripe/stripe-js
```

## 🚀 快速开始

### 1. 基础集成示例

```vue
<template>
  <div>
    <!-- 基础支付表单 -->
    <PaymentForm
      :amount="1999"
      currency="usd"
      :order-info="{
        name: 'MXW 会员服务',
        amount: 1999,
        description: '年度会员订阅',
      }"
      @payment-success="onPaymentSuccess"
      @payment-error="onPaymentError"
    />
  </div>
</template>

<script setup>
import PaymentForm from '@/components/payment/PaymentForm.vue'

const onPaymentSuccess = data => {
  console.log('支付成功:', data)
  // 处理支付成功逻辑
}

const onPaymentError = error => {
  console.error('支付失败:', error)
  // 处理支付失败逻辑
}
</script>
```

### 2. 路由配置

在`src/router/index.js`中添加支付路由：

```javascript
import PaymentView from '../views/PaymentView.vue'
import PaymentSuccess from '../components/payment/PaymentSuccess.vue'

const routes = [
  {
    path: '/payment',
    name: 'Payment',
    component: PaymentView,
    meta: { title: '安全支付' },
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: PaymentSuccess,
    meta: { title: '支付成功' },
  },
]
```

## 🔒 安全注意事项

### ✅ 安全最佳实践

1. **API密钥安全**

   - 服务器端密钥(`sk_live_`)绝不暴露到前端
   - 只有可发布密钥(`pk_live_`)可在前端使用
   - 生产环境使用Vercel环境变量

2. **数据验证**

   - 所有支付金额在服务器端验证
   - 订单信息在后端二次确认
   - 支付状态通过Webhook验证

3. **错误处理**
   - 支付失败时提供清晰的错误信息
   - 网络错误时的重试机制
   - 异常情况的用户友好提示

### ❌ 安全禁忌

- ❌ 不要在前端代码中硬编码敏感密钥
- ❌ 不要信任前端传递的金额数据
- ❌ 不要跳过支付状态验证

## 🎨 样式定制

组件使用Tailwind CSS构建，支持以下定制：

### 主题配置

```css
/* 自定义支付表单主题色 */
.payment-card {
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --error-color: #ef4444;
}
```

### 响应式设计

- 移动端优化的表单布局
- 自适应卡片宽度
- 触摸友好的交互元素

## 🔗 相关服务

### StripeService

位置：`src/services/stripeService.js`

**主要功能：**

- Stripe实例初始化
- 支付意图创建
- 支付确认处理
- 支付状态检查
- 金额格式化

**使用示例：**

```javascript
import stripeService from '@/services/stripeService'

// 格式化金额显示
const formattedPrice = stripeService.formatAmount(1999, 'usd')
// 输出: "$19.99"

// 验证支付金额
const isValid = stripeService.validateAmount(1999)
// 输出: true
```

## 🐛 常见问题

### Q1: Stripe初始化失败

**原因：** 缺少VITE_STRIPE_PUBLISHABLE_KEY环境变量
**解决：** 在`.env`文件中配置正确的可发布密钥

### Q2: 支付表单无法显示

**原因：** 网络问题或Stripe服务不可用
**解决：** 检查网络连接，确认Stripe服务状态

### Q3: 支付成功但页面异常

**原因：** 支付成功页面路由配置错误
**解决：** 检查路由配置和PaymentSuccess组件导入

## 📚 扩展功能

### 计划中的功能

- 🌍 多币种支持
- 📱 移动支付集成
- 🔄 订阅管理
- 📊 支付分析仪表板
- 🎁 优惠券系统

### 自定义扩展

可以通过继承现有组件来实现自定义支付流程：

```vue
<template>
  <PaymentForm v-bind="$attrs" @payment-success="customSuccessHandler">
    <!-- 自定义插槽内容 -->
    <template #custom-fields>
      <div>自定义表单字段</div>
    </template>
  </PaymentForm>
</template>
```

---

## 📞 技术支持

如遇到支付相关技术问题，请：

1. 📖 查看 [Stripe 官方文档](https://stripe.com/docs)
2. 🔍 搜索项目Issues记录
3. 💬 联系技术团队

**重要提醒：** 支付功能涉及资金安全，请在生产环境部署前进行充分测试！
