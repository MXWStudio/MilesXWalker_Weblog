import { loadStripe } from '@stripe/stripe-js'

/**
 * Stripe 支付服务
 * 提供支付相关的核心功能
 */
class StripeService {
  constructor() {
    this.stripe = null
    this.publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    this.initialized = false
    this.apiBaseUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3000/api/payment'
  }

  /**
   * 初始化 Stripe 实例
   * @returns {Promise<Stripe>} Stripe 实例
   */
  async init() {
    if (this.initialized && this.stripe) {
      return this.stripe
    }

    if (!this.publishableKey) {
      throw new Error('Stripe 可发布密钥未配置。请在环境变量中设置 VITE_STRIPE_PUBLISHABLE_KEY')
    }

    try {
      this.stripe = await loadStripe(this.publishableKey)
      this.initialized = true
      console.log('✅ Stripe 初始化成功')
      return this.stripe
    } catch (error) {
      console.error('❌ Stripe 初始化失败:', error)
      throw new Error('Stripe 初始化失败')
    }
  }

  /**
   * 获取 Stripe 实例
   * @returns {Promise<Stripe>} Stripe 实例
   */
  async getStripe() {
    if (!this.stripe) {
      await this.init()
    }
    return this.stripe
  }

  /**
   * 创建支付意图
   * @param {number} amount - 支付金额（以分为单位）
   * @param {string} currency - 货币类型，默认为 'usd'
   * @param {Object} metadata - 元数据
   * @returns {Promise<Object>} 支付意图响应
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ 支付意图创建成功:', result.payment_intent_id)
      return result
    } catch (error) {
      console.error('❌ 创建支付意图失败:', error)
      throw error
    }
  }

  /**
   * 确认支付
   * @param {string} clientSecret - 客户端密钥
   * @param {Object} paymentElement - 支付元素
   * @param {Object} billingDetails - 账单详情
   * @returns {Promise<Object>} 支付结果
   */
  async confirmPayment(clientSecret, paymentElement, billingDetails = {}) {
    const stripe = await this.getStripe()

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements: paymentElement,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: billingDetails,
          },
        },
      })

      if (error) {
        console.error('❌ 支付确认失败:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ 支付确认成功:', paymentIntent)
      return { success: true, paymentIntent }
    } catch (error) {
      console.error('❌ 支付处理异常:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 检查支付状态
   * @param {string} paymentIntentId - 支付意图ID
   * @returns {Promise<Object>} 支付状态
   */
  async checkPaymentStatus(paymentIntentId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/status/${paymentIntentId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ 支付状态查询成功:', result.status)
      return result
    } catch (error) {
      console.error('❌ 检查支付状态失败:', error)
      throw error
    }
  }

  /**
   * 取消支付
   * @param {string} paymentIntentId - 支付意图ID
   * @returns {Promise<Object>} 取消结果
   */
  async cancelPayment(paymentIntentId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cancel/${paymentIntentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ 支付取消成功:', result.id)
      return result
    } catch (error) {
      console.error('❌ 取消支付失败:', error)
      throw error
    }
  }

  /**
   * 获取可用支付方法
   * @returns {Promise<Object>} 支付方法列表
   */
  async getPaymentMethods() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payment-methods`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('❌ 获取支付方法失败:', error)
      throw error
    }
  }

  /**
   * 格式化金额显示
   * @param {number} amount - 金额（以分为单位）
   * @param {string} currency - 货币类型
   * @returns {string} 格式化后的金额字符串
   */
  formatAmount(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  /**
   * 验证金额
   * @param {number} amount - 金额
   * @returns {boolean} 是否有效
   */
  validateAmount(amount) {
    return typeof amount === 'number' && amount > 0 && amount >= 50 // Stripe 最小金额
  }

  /**
   * 检查服务可用性
   * @returns {Promise<Object>} 服务状态
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('❌ 支付服务健康检查失败:', error)
      throw error
    }
  }
}

// 创建单例实例
const stripeService = new StripeService()

export default stripeService

/**
 * 支付状态枚举
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
}

/**
 * 支付错误类型
 */
export const PaymentErrors = {
  CARD_DECLINED: 'card_declined',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  INVALID_CVC: 'invalid_cvc',
  EXPIRED_CARD: 'expired_card',
  NETWORK_ERROR: 'network_error',
}
