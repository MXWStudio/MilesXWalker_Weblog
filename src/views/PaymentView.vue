<template>
  <div class="payment-view">
    <!-- 页面头部 -->
    <div class="payment-header">
      <div class="container">
        <h1 class="page-title">💳 安全支付</h1>
        <p class="page-description">使用 Stripe 提供的国际标准支付系统，您的支付信息完全安全</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="payment-content">
      <div class="container">
        <div class="payment-layout">
          <!-- 左侧：产品信息 -->
          <div class="product-section">
            <div class="product-card">
              <h2 class="product-title">🌟 MXW 会员服务</h2>
              <div class="product-description">
                <p>解锁所有高级功能：</p>
                <ul class="feature-list">
                  <li>✨ 高级 3D 头像定制</li>
                  <li>🎨 专业设计模板</li>
                  <li>☁️ 云端数据同步</li>
                  <li>⚡ 优先技术支持</li>
                  <li>🔄 定期功能更新</li>
                </ul>
              </div>

              <!-- 价格信息 -->
              <div class="pricing-section">
                <div class="price-card">
                  <span class="currency">$</span>
                  <span class="amount">{{ (selectedPlan.amount / 100).toFixed(2) }}</span>
                  <span class="period">/ {{ selectedPlan.period }}</span>
                </div>

                <!-- 套餐选择 -->
                <div class="plan-selector">
                  <h3 class="selector-title">选择套餐</h3>
                  <div class="plan-options">
                    <div
                      v-for="plan in plans"
                      :key="plan.id"
                      class="plan-option"
                      :class="{ selected: selectedPlan.id === plan.id }"
                      @click="selectPlan(plan)"
                    >
                      <div class="plan-info">
                        <div class="plan-name">{{ plan.name }}</div>
                        <div class="plan-price">${{ (plan.amount / 100).toFixed(2) }}</div>
                      </div>
                      <div class="plan-discount" v-if="plan.discount">省 {{ plan.discount }}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：支付表单 -->
          <div class="payment-section">
            <PaymentForm
              :amount="selectedPlan.amount"
              :currency="currency"
              :order-info="orderInfo"
              @payment-success="handlePaymentSuccess"
              @payment-error="handlePaymentError"
              @payment-processing="handlePaymentProcessing"
            />

            <!-- 支付处理状态 -->
            <div v-if="isProcessing" class="processing-overlay">
              <div class="processing-content">
                <div class="processing-spinner"></div>
                <p class="processing-text">正在处理您的支付...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功/错误提示 -->
    <div v-if="showAlert" class="alert-overlay" @click="closeAlert">
      <div class="alert-card" :class="alertType">
        <div class="alert-icon">
          {{ alertType === 'success' ? '✅' : '❌' }}
        </div>
        <div class="alert-content">
          <h3 class="alert-title">
            {{ alertType === 'success' ? '支付成功！' : '支付失败' }}
          </h3>
          <p class="alert-message">{{ alertMessage }}</p>
        </div>
        <button @click="closeAlert" class="alert-close">×</button>
      </div>
    </div>

    <!-- 安全保障信息 -->
    <div class="security-section">
      <div class="container">
        <h3 class="security-title">🔒 安全保障</h3>
        <div class="security-features">
          <div class="security-item">
            <span class="security-icon">🛡️</span>
            <span class="security-text">SSL 加密传输</span>
          </div>
          <div class="security-item">
            <span class="security-icon">🏦</span>
            <span class="security-text">银行级别安全</span>
          </div>
          <div class="security-item">
            <span class="security-icon">✅</span>
            <span class="security-text">PCI DSS 合规</span>
          </div>
          <div class="security-item">
            <span class="security-icon">🔄</span>
            <span class="security-text">7天无理由退款</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PaymentForm from '@/components/payment/PaymentForm.vue'

// Vue Router
const router = useRouter()

// 响应式数据
const currency = ref('usd')
const isProcessing = ref(false)
const showAlert = ref(false)
const alertType = ref('success')
const alertMessage = ref('')

// 套餐配置
const plans = ref([
  {
    id: 'monthly',
    name: '月度会员',
    amount: 999, // $9.99
    period: '月',
    discount: null,
  },
  {
    id: 'yearly',
    name: '年度会员',
    amount: 9999, // $99.99
    period: '年',
    discount: 17,
  },
  {
    id: 'lifetime',
    name: '终身会员',
    amount: 19999, // $199.99
    period: '终身',
    discount: 33,
  },
])

const selectedPlan = ref(plans.value[1]) // 默认选择年度会员

// 计算属性
const orderInfo = computed(() => ({
  name: selectedPlan.value.name,
  amount: selectedPlan.value.amount,
  description: `MXW ${selectedPlan.value.name} - ${selectedPlan.value.period}`,
  planId: selectedPlan.value.id,
}))

// 选择套餐
const selectPlan = plan => {
  selectedPlan.value = plan
}

// 处理支付成功
const handlePaymentSuccess = data => {
  console.log('✅ 支付成功:', data)

  // 显示成功提示
  showAlert.value = true
  alertType.value = 'success'
  alertMessage.value = '支付成功！正在跳转到成功页面...'

  // 延迟跳转到成功页面
  setTimeout(() => {
    router.push({
      name: 'PaymentSuccess',
      query: {
        payment_intent: data.paymentIntent.id,
      },
    })
  }, 2000)
}

// 处理支付错误
const handlePaymentError = error => {
  console.error('❌ 支付失败:', error)

  showAlert.value = true
  alertType.value = 'error'
  alertMessage.value = error.error || '支付处理失败，请重试'
}

// 处理支付处理状态
const handlePaymentProcessing = processing => {
  isProcessing.value = processing
}

// 关闭提示
const closeAlert = () => {
  showAlert.value = false
}

// 组件挂载
onMounted(() => {
  console.log('💳 支付页面加载完成')
})
</script>

<style scoped>
.payment-view {
  @apply min-h-screen bg-gray-50;
}

.container {
  @apply max-w-6xl mx-auto px-4;
}

.payment-header {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12;
}

.page-title {
  @apply text-3xl font-bold mb-4;
}

.page-description {
  @apply text-blue-100 text-lg;
}

.payment-content {
  @apply py-12;
}

.payment-layout {
  @apply grid lg:grid-cols-2 gap-8;
}

.product-section {
  @apply lg:order-1;
}

.product-card {
  @apply bg-white rounded-xl shadow-lg p-6 sticky top-8;
}

.product-title {
  @apply text-2xl font-bold text-gray-800 mb-4;
}

.product-description {
  @apply mb-6;
}

.feature-list {
  @apply space-y-2 mt-3;
}

.feature-list li {
  @apply text-gray-600 flex items-center gap-2;
}

.pricing-section {
  @apply space-y-6;
}

.price-card {
  @apply text-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg;
}

.currency {
  @apply text-2xl font-medium;
}

.amount {
  @apply text-4xl font-bold;
}

.period {
  @apply text-lg text-blue-100;
}

.plan-selector {
  @apply space-y-4;
}

.selector-title {
  @apply text-lg font-semibold text-gray-800;
}

.plan-options {
  @apply space-y-3;
}

.plan-option {
  @apply border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-300;
}

.plan-option.selected {
  @apply border-blue-500 bg-blue-50;
}

.plan-info {
  @apply flex justify-between items-center;
}

.plan-name {
  @apply font-medium text-gray-800;
}

.plan-price {
  @apply font-bold text-blue-600;
}

.plan-discount {
  @apply text-sm text-green-600 bg-green-100 px-2 py-1 rounded mt-2 inline-block;
}

.payment-section {
  @apply lg:order-2 relative;
}

.processing-overlay {
  @apply absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl;
}

.processing-content {
  @apply text-center;
}

.processing-spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4;
}

.processing-text {
  @apply text-gray-600 font-medium;
}

.alert-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.alert-card {
  @apply bg-white rounded-xl shadow-xl max-w-md mx-4 p-6 relative;
}

.alert-card.success {
  @apply border-l-4 border-green-500;
}

.alert-card.error {
  @apply border-l-4 border-red-500;
}

.alert-icon {
  @apply text-4xl mb-4 text-center;
}

.alert-title {
  @apply text-xl font-bold text-gray-800 mb-2;
}

.alert-message {
  @apply text-gray-600;
}

.alert-close {
  @apply absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl;
}

.security-section {
  @apply bg-white py-12 border-t;
}

.security-title {
  @apply text-2xl font-bold text-center text-gray-800 mb-8;
}

.security-features {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-6;
}

.security-item {
  @apply text-center space-y-2;
}

.security-icon {
  @apply text-2xl block;
}

.security-text {
  @apply text-sm text-gray-600 font-medium;
}
</style>
