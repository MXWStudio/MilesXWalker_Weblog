<template>
  <div class="payment-form-container">
    <!-- 支付表单卡片 -->
    <div class="payment-card">
      <div class="payment-header">
        <h2 class="payment-title">
          <span class="payment-icon">💳</span>
          安全支付
        </h2>
        <p class="payment-subtitle">使用 Stripe 提供的安全支付系统</p>
      </div>

      <!-- 订单信息 -->
      <div v-if="orderInfo" class="order-summary">
        <h3 class="order-title">订单信息</h3>
        <div class="order-details">
          <div class="order-item">
            <span class="item-name">{{ orderInfo.name }}</span>
            <span class="item-price">{{ formatPrice(orderInfo.amount) }}</span>
          </div>
          <div class="order-total">
            <span class="total-label">总计</span>
            <span class="total-amount">{{ formatPrice(orderInfo.amount) }}</span>
          </div>
        </div>
      </div>

      <!-- 支付表单 -->
      <form class="payment-form" @submit.prevent="handleSubmit">
        <!-- Stripe Elements 容器 -->
        <div ref="cardElementRef" class="stripe-card-element" :class="{ error: hasCardError }">
          <!-- Stripe Card Element 将挂载到这里 -->
        </div>

        <!-- 错误信息显示 -->
        <div v-if="errorMessage" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ errorMessage }}
        </div>

        <!-- 账单信息 -->
        <div class="billing-details">
          <h4 class="billing-title">账单信息</h4>
          <div class="billing-grid">
            <div class="input-group">
              <label for="customerName">姓名</label>
              <input
                id="customerName"
                v-model="billingDetails.name"
                type="text"
                placeholder="请输入您的姓名"
                required
                class="billing-input"
              />
            </div>
            <div class="input-group">
              <label for="customerEmail">邮箱</label>
              <input
                id="customerEmail"
                v-model="billingDetails.email"
                type="email"
                placeholder="请输入您的邮箱"
                required
                class="billing-input"
              />
            </div>
          </div>
        </div>

        <!-- 支付按钮 -->
        <button
          type="submit"
          :disabled="!canSubmit"
          class="payment-submit-btn"
          :class="{ processing: isProcessing }"
        >
          <span v-if="!isProcessing" class="btn-content">
            <span class="btn-icon">🔒</span>
            立即支付 {{ formatPrice(amount) }}
          </span>
          <span v-else class="btn-processing">
            <span class="spinner"></span>
            处理中...
          </span>
        </button>
      </form>

      <!-- 支付安全提示 -->
      <div class="security-notice">
        <p class="security-text">
          <span class="security-icon">🛡️</span>
          您的支付信息通过 SSL 加密安全传输
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import stripeService from '@/services/stripeService'

// Props 定义
const props = defineProps({
  amount: {
    type: Number,
    required: true,
    validator: value => value > 0,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  orderInfo: {
    type: Object,
    default: null,
  },
})

// Emits 定义
const emit = defineEmits(['payment-success', 'payment-error', 'payment-processing'])

// 响应式数据
const cardElementRef = ref(null)
const stripe = ref(null)
const elements = ref(null)
const cardElement = ref(null)
const clientSecret = ref('')
const isProcessing = ref(false)
const errorMessage = ref('')
const hasCardError = ref(false)

// 账单信息
const billingDetails = reactive({
  name: '',
  email: '',
})

// 计算属性
const canSubmit = computed(() => {
  return (
    !isProcessing.value &&
    billingDetails.name.trim() &&
    billingDetails.email.trim() &&
    !hasCardError.value &&
    cardElement.value
  )
})

// 格式化价格显示
const formatPrice = amount => {
  return stripeService.formatAmount(amount, props.currency)
}

// 初始化 Stripe Elements
const initializeStripe = async () => {
  try {
    // 初始化 Stripe
    stripe.value = await stripeService.getStripe()

    // 创建支付意图
    const { client_secret } = await stripeService.createPaymentIntent(
      props.amount,
      props.currency,
      props.orderInfo
    )
    clientSecret.value = client_secret

    // 创建 Elements 实例
    elements.value = stripe.value.elements({
      clientSecret: client_secret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#ffffff',
          colorText: '#374151',
          colorDanger: '#ef4444',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      },
    })

    // 创建卡片元素
    cardElement.value = elements.value.create('payment', {
      layout: 'tabs',
    })

    // 挂载到 DOM
    cardElement.value.mount(cardElementRef.value)

    // 监听卡片状态变化
    cardElement.value.on('change', handleCardChange)

    console.log('✅ Stripe Elements 初始化成功')
  } catch (error) {
    console.error('❌ Stripe 初始化失败:', error)
    errorMessage.value = '支付系统初始化失败，请刷新页面重试'
  }
}

// 处理卡片状态变化
const handleCardChange = event => {
  hasCardError.value = !!event.error
  if (event.error) {
    errorMessage.value = event.error.message
  } else {
    errorMessage.value = ''
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!canSubmit.value) return

  isProcessing.value = true
  errorMessage.value = ''
  emit('payment-processing', true)

  try {
    // 确认支付
    const result = await stripeService.confirmPayment(
      clientSecret.value,
      elements.value,
      billingDetails
    )

    if (result.success) {
      console.log('✅ 支付成功:', result.paymentIntent)
      emit('payment-success', {
        paymentIntent: result.paymentIntent,
        billingDetails,
      })
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('❌ 支付失败:', error)
    errorMessage.value = error.message || '支付处理失败，请重试'
    emit('payment-error', {
      error: error.message,
      billingDetails,
    })
  } finally {
    isProcessing.value = false
    emit('payment-processing', false)
  }
}

// 组件挂载时初始化
onMounted(() => {
  // 验证金额
  if (!stripeService.validateAmount(props.amount)) {
    errorMessage.value = '支付金额无效，最小金额为 $0.50'
    return
  }

  // 检查是否启用支付功能
  if (!import.meta.env.VITE_ENABLE_PAYMENTS) {
    errorMessage.value = '支付功能当前不可用'
    return
  }

  initializeStripe()
})

// 监听金额变化，重新初始化
watch(
  () => props.amount,
  () => {
    if (stripeService.validateAmount(props.amount)) {
      initializeStripe()
    }
  }
)
</script>

<style scoped>
.payment-form-container {
  @apply max-w-md mx-auto p-4;
}

.payment-card {
  @apply bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden;
}

.payment-header {
  @apply p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white;
}

.payment-title {
  @apply text-xl font-bold flex items-center gap-2 mb-2;
}

.payment-icon {
  @apply text-2xl;
}

.payment-subtitle {
  @apply text-blue-100 text-sm;
}

.order-summary {
  @apply p-6 bg-gray-50 border-b border-gray-200;
}

.order-title {
  @apply text-lg font-semibold text-gray-800 mb-4;
}

.order-details {
  @apply space-y-3;
}

.order-item {
  @apply flex justify-between items-center;
}

.item-name {
  @apply text-gray-600;
}

.item-price {
  @apply font-medium text-gray-800;
}

.order-total {
  @apply flex justify-between items-center pt-3 border-t border-gray-300 font-semibold;
}

.total-label {
  @apply text-gray-800;
}

.total-amount {
  @apply text-lg text-blue-600;
}

.payment-form {
  @apply p-6 space-y-6;
}

.stripe-card-element {
  @apply p-4 border border-gray-300 rounded-lg transition-colors;
}

.stripe-card-element.error {
  @apply border-red-500;
}

.error-message {
  @apply flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg;
}

.error-icon {
  @apply text-lg;
}

.billing-details {
  @apply space-y-4;
}

.billing-title {
  @apply text-lg font-semibold text-gray-800;
}

.billing-grid {
  @apply space-y-4;
}

.input-group {
  @apply space-y-2;
}

.input-group label {
  @apply block text-sm font-medium text-gray-700;
}

.billing-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.payment-submit-btn {
  @apply w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all;
}

.payment-submit-btn.processing {
  @apply bg-blue-400;
}

.btn-content {
  @apply flex items-center justify-center gap-2;
}

.btn-icon {
  @apply text-lg;
}

.btn-processing {
  @apply flex items-center justify-center gap-2;
}

.spinner {
  @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}

.security-notice {
  @apply p-4 bg-gray-50 text-center;
}

.security-text {
  @apply text-xs text-gray-600 flex items-center justify-center gap-1;
}

.security-icon {
  @apply text-sm;
}
</style>
