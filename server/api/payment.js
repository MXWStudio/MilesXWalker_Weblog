/**
 * Stripe 支付 API
 * 提供支付意图创建、支付状态检查等功能
 */

import express from 'express'
import Stripe from 'stripe'

const router = express.Router()

// 初始化 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

/**
 * 健康检查
 */
router.get('/health', (req, res) => {
  const hasSecretKey = !!process.env.STRIPE_SECRET_KEY
  const hasPublishableKey = !!process.env.VITE_STRIPE_PUBLISHABLE_KEY
  const paymentsEnabled = process.env.VITE_ENABLE_PAYMENTS === 'true'

  res.json({
    status: 'healthy',
    service: 'Stripe Payment API',
    timestamp: new Date().toISOString(),
    configuration: {
      secretKey: hasSecretKey ? '✅ Configured' : '❌ Missing',
      publishableKey: hasPublishableKey ? '✅ Configured' : '❌ Missing',
      paymentsEnabled: paymentsEnabled ? '✅ Enabled' : '❌ Disabled',
      environment: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test' : 'live',
    },
  })
})

/**
 * 创建支付意图
 * POST /api/payment/create-payment-intent
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body

    // 验证必需参数
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be a positive number',
      })
    }

    // Stripe 最小金额验证（50分 = $0.50）
    if (amount < 50) {
      return res.status(400).json({
        error: 'Amount too small',
        message: 'Minimum amount is $0.50 (50 cents)',
      })
    }

    // 创建支付意图
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // 确保是整数
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        source: 'MXW_Studio',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    console.log(
      `✅ 支付意图创建成功: ${paymentIntent.id} - ${amount / 100} ${currency.toUpperCase()}`
    )

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    })
  } catch (error) {
    console.error('❌ 创建支付意图失败:', error)

    // Stripe 错误处理
    if (error.type === 'StripeCardError') {
      res.status(400).json({
        error: 'Card error',
        message: error.message,
      })
    } else if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({
        error: 'Invalid request',
        message: error.message,
      })
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Unable to create payment intent',
      })
    }
  }
})

/**
 * 检查支付状态
 * GET /api/payment/status/:payment_intent_id
 */
router.get('/status/:payment_intent_id', async (req, res) => {
  try {
    const { payment_intent_id } = req.params

    if (!payment_intent_id) {
      return res.status(400).json({
        error: 'Missing payment intent ID',
        message: 'Payment intent ID is required',
      })
    }

    // 获取支付意图状态
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)

    console.log(`📊 支付状态查询: ${payment_intent_id} - ${paymentIntent.status}`)

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      metadata: paymentIntent.metadata,
      client_secret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('❌ 支付状态查询失败:', error)

    if (error.type === 'StripeInvalidRequestError') {
      res.status(404).json({
        error: 'Payment not found',
        message: 'Payment intent not found',
      })
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Unable to retrieve payment status',
      })
    }
  }
})

/**
 * 取消支付
 * POST /api/payment/cancel/:payment_intent_id
 */
router.post('/cancel/:payment_intent_id', async (req, res) => {
  try {
    const { payment_intent_id } = req.params

    if (!payment_intent_id) {
      return res.status(400).json({
        error: 'Missing payment intent ID',
        message: 'Payment intent ID is required',
      })
    }

    // 取消支付意图
    const paymentIntent = await stripe.paymentIntents.cancel(payment_intent_id)

    console.log(`🚫 支付已取消: ${payment_intent_id}`)

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      message: 'Payment cancelled successfully',
    })
  } catch (error) {
    console.error('❌ 取消支付失败:', error)

    if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({
        error: 'Cannot cancel payment',
        message: error.message,
      })
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Unable to cancel payment',
      })
    }
  }
})

/**
 * Webhook 处理 (用于接收 Stripe 事件)
 * POST /api/payment/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.warn('⚠️ Webhook secret not configured')
    return res.status(400).json({ error: 'Webhook secret not configured' })
  }

  let event

  try {
    // 验证 webhook 签名
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('❌ Webhook 签名验证失败:', err.message)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    // 处理事件
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log(`✅ 支付成功 Webhook: ${paymentIntent.id}`)
        // 这里可以添加支付成功后的业务逻辑
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log(`❌ 支付失败 Webhook: ${failedPayment.id}`)
        // 这里可以添加支付失败后的业务逻辑
        break

      default:
        console.log(`🔄 未处理的事件类型: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook 处理失败:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

/**
 * 获取支付方法
 * GET /api/payment/payment-methods
 */
router.get('/payment-methods', (req, res) => {
  res.json({
    available_methods: [
      {
        type: 'card',
        name: '信用卡/借记卡',
        supported_brands: ['visa', 'mastercard', 'amex', 'discover'],
        currencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
      },
    ],
    test_cards: [
      {
        number: '4242424242424242',
        description: '通用测试卡 - 支付成功',
        exp: '任意未来日期',
        cvc: '任意3位数字',
      },
      {
        number: '4000000000000002',
        description: '测试卡 - 卡片被拒绝',
        exp: '任意未来日期',
        cvc: '任意3位数字',
      },
      {
        number: '4000002500003155',
        description: '测试卡 - 需要验证',
        exp: '任意未来日期',
        cvc: '任意3位数字',
      },
    ],
  })
})

export default router
