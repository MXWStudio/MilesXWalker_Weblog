<template>
  <div class="payment-success-container">
    <div class="success-card">
      <!-- 成功图标动画 -->
      <div class="success-icon-wrapper">
        <div class="success-icon">✅</div>
        <div class="success-ring"></div>
      </div>

      <!-- 成功信息 -->
      <div class="success-content">
        <h1 class="success-title">支付成功！</h1>
        <p class="success-message">感谢您的购买，您的订单已经成功处理。</p>

        <!-- 订单详情 -->
        <div class="order-details" v-if="paymentData">
          <h3 class="details-title">订单详情</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">订单号</span>
              <span class="detail-value">{{ paymentData.id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付金额</span>
              <span class="detail-value">{{ formatAmount(paymentData.amount) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付时间</span>
              <span class="detail-value">{{ formatDate(paymentData.created) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付状态</span>
              <span class="detail-value status-success">已完成</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button @click="downloadReceipt" class="btn-secondary">📄 下载收据</button>
          <button @click="goToHome" class="btn-primary">🏠 返回首页</button>
        </div>

        <!-- 联系信息 -->
        <div class="contact-info">
          <p class="contact-text">
            如有疑问，请联系客服：
            <a href="mailto:support@example.com" class="contact-link"> support@example.com </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import stripeService from '@/services/stripeService'

// Vue Router
const router = useRouter()
const route = useRoute()

// 响应式数据
const paymentData = ref(null)
const loading = ref(true)
const error = ref('')

// 格式化金额
const formatAmount = amount => {
  return stripeService.formatAmount(amount)
}

// 格式化日期
const formatDate = timestamp => {
  return new Date(timestamp * 1000).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 下载收据
const downloadReceipt = () => {
  if (!paymentData.value) return

  // 这里可以实现收据下载逻辑
  console.log('下载收据:', paymentData.value.id)
  // 实际项目中可以调用后端API生成并下载PDF收据
}

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 获取支付信息
const fetchPaymentData = async () => {
  try {
    const paymentIntentId = route.query.payment_intent
    const clientSecret = route.query.payment_intent_client_secret

    if (!paymentIntentId) {
      error.value = '缺少支付信息参数'
      return
    }

    // 检查支付状态
    const result = await stripeService.checkPaymentStatus(paymentIntentId)

    if (result.status === 'succeeded') {
      paymentData.value = result
      console.log('✅ 支付信息获取成功:', result)
    } else {
      error.value = '支付状态异常，请联系客服'
    }
  } catch (err) {
    console.error('❌ 获取支付信息失败:', err)
    error.value = '获取支付信息失败，请联系客服'
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取支付信息
onMounted(() => {
  fetchPaymentData()
})
</script>

<style scoped>
.payment-success-container {
  @apply min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4;
}

.success-card {
  @apply bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center;
}

.success-icon-wrapper {
  @apply relative mb-8;
}

.success-icon {
  @apply text-6xl mb-4 inline-block;
  animation: bounce 1s ease-in-out;
}

.success-ring {
  @apply absolute inset-0 border-4 border-green-200 rounded-full;
  animation: ping 1s linear infinite;
}

.success-content {
  @apply space-y-6;
}

.success-title {
  @apply text-2xl font-bold text-gray-800 mb-4;
}

.success-message {
  @apply text-gray-600 mb-6;
}

.order-details {
  @apply bg-gray-50 rounded-lg p-4 text-left;
}

.details-title {
  @apply text-lg font-semibold text-gray-800 mb-4;
}

.details-grid {
  @apply space-y-3;
}

.detail-item {
  @apply flex justify-between items-center;
}

.detail-label {
  @apply text-gray-600 text-sm;
}

.detail-value {
  @apply font-medium text-gray-800;
}

.status-success {
  @apply text-green-600 bg-green-100 px-2 py-1 rounded text-xs;
}

.action-buttons {
  @apply flex gap-3 justify-center;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors;
}

.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors;
}

.contact-info {
  @apply pt-4 border-t border-gray-200;
}

.contact-text {
  @apply text-sm text-gray-600;
}

.contact-link {
  @apply text-blue-600 hover:text-blue-700 underline;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translateY(0);
  }
  40%,
  43% {
    transform: translateY(-10px);
  }
  70% {
    transform: translateY(-5px);
  }
  90% {
    transform: translateY(-2px);
  }
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%,
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
