/**
 * aiConfig.js
 * AI模型配置管理中心
 *
 * 功能：
 * - 统一管理所有AI模型配置
 * - 支持OpenAI多种模型选择
 * - 自动根据速率限制切换模型
 * - 提供成本估算和性能对比
 *
 * @author AI进化论-花生
 * @date 2025-10-12
 */

/**
 * OpenAI 模型配置列表
 * 包含免费和付费模型的详细信息
 */
export const OPENAI_MODELS = {
  // 免费模型（速率限制较低）
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: '轻量级模型，速度快，成本低',
    category: 'free',
    pricing: {
      input: 0.00015, // 每1K tokens 美元
      output: 0.0006,
    },
    limits: {
      tpm: 100000, // 每分钟tokens限制
      rpm: 500, // 每分钟请求限制
    },
    features: {
      speed: '快速',
      quality: '良好',
      cost: '极低',
      contextWindow: '128K tokens',
    },
    recommended: true, // 默认推荐
    tier: 'free',
  },

  // 付费模型 - 平衡性能
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: '最新一代模型，平衡性能和成本',
    category: 'premium',
    pricing: {
      input: 0.0025,
      output: 0.01,
    },
    limits: {
      tpm: 800000,
      rpm: 10000,
    },
    features: {
      speed: '快速',
      quality: '优秀',
      cost: '中等',
      contextWindow: '128K tokens',
    },
    recommended: false,
    tier: 'paid',
  },

  // 付费模型 - 高性能
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: '更强大的GPT-4版本，适合复杂任务',
    category: 'premium',
    pricing: {
      input: 0.01,
      output: 0.03,
    },
    limits: {
      tpm: 600000,
      rpm: 10000,
    },
    features: {
      speed: '较快',
      quality: '卓越',
      cost: '较高',
      contextWindow: '128K tokens',
    },
    recommended: false,
    tier: 'paid',
  },

  // 付费模型 - 标准版
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    description: '经典GPT-4，最高质量',
    category: 'premium',
    pricing: {
      input: 0.03,
      output: 0.06,
    },
    limits: {
      tpm: 300000,
      rpm: 10000,
    },
    features: {
      speed: '较慢',
      quality: '最佳',
      cost: '高',
      contextWindow: '8K tokens',
    },
    recommended: false,
    tier: 'paid',
  },

  // 付费模型 - 经济型
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: '性价比之选，适合日常使用',
    category: 'standard',
    pricing: {
      input: 0.0005,
      output: 0.0015,
    },
    limits: {
      tpm: 1000000,
      rpm: 10000,
    },
    features: {
      speed: '极快',
      quality: '良好',
      cost: '低',
      contextWindow: '16K tokens',
    },
    recommended: false,
    tier: 'paid',
  },
}

/**
 * Google Gemini 模型配置
 */
export const GEMINI_MODELS = {
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    description: 'Google 2.0版本，快速且强大',
    category: 'premium',
    pricing: {
      input: 0, // 免费额度：每分钟15次请求
      output: 0,
    },
    limits: {
      tpm: 1000000, // 每分钟tokens限制
      rpm: 15, // 每分钟请求限制（免费版）
    },
    features: {
      speed: '极快',
      quality: '优秀',
      cost: '免费额度',
      contextWindow: '1M tokens',
    },
    recommended: false,
    tier: 'free',
  },

  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    description: 'Google最新2.5版本，性能大幅提升',
    category: 'premium',
    pricing: {
      input: 0, // 免费额度：每分钟15次请求
      output: 0,
    },
    limits: {
      tpm: 1000000,
      rpm: 15, // 每分钟请求限制（免费版）
    },
    features: {
      speed: '极快',
      quality: '卓越',
      cost: '免费额度',
      contextWindow: '1M tokens',
    },
    recommended: true, // 设为推荐
    tier: 'free',
  },

  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    description: 'Google最强模型，超长上下文和最高质量',
    category: 'premium',
    pricing: {
      input: 0.00125, // 每1K tokens
      output: 0.005,
    },
    limits: {
      tpm: 4000000,
      rpm: 360,
    },
    features: {
      speed: '快速',
      quality: '最佳',
      cost: '低',
      contextWindow: '2M tokens',
    },
    recommended: false,
    tier: 'paid',
  },

  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    description: 'Google高级模型，长上下文支持',
    category: 'premium',
    pricing: {
      input: 0.00125, // 每1K tokens
      output: 0.005,
    },
    limits: {
      tpm: 4000000,
      rpm: 360,
    },
    features: {
      speed: '快速',
      quality: '卓越',
      cost: '低',
      contextWindow: '2M tokens',
    },
    recommended: false,
    tier: 'paid',
  },

  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    description: 'Google快速模型，性价比极高',
    category: 'standard',
    pricing: {
      input: 0.000075,
      output: 0.0003,
    },
    limits: {
      tpm: 4000000,
      rpm: 1000,
    },
    features: {
      speed: '极快',
      quality: '优秀',
      cost: '极低',
      contextWindow: '1M tokens',
    },
    recommended: false,
    tier: 'paid',
  },
}

/**
 * 本地模型配置
 */
export const LOCAL_MODELS = {
  'llama3.2': {
    id: 'llama3.2',
    name: 'Llama 3.2',
    provider: 'ollama',
    description: '本地运行，完全免费，无网络限制',
    category: 'local',
    pricing: {
      input: 0,
      output: 0,
    },
    limits: {
      tpm: Infinity,
      rpm: Infinity,
    },
    features: {
      speed: '取决于硬件',
      quality: '良好',
      cost: '免费',
      contextWindow: '128K tokens',
    },
    recommended: false,
    tier: 'local',
    requirements: '需要安装Ollama并下载模型',
  },
}

/**
 * 所有可用模型
 */
export const ALL_MODELS = {
  ...OPENAI_MODELS,
  ...GEMINI_MODELS,
  ...LOCAL_MODELS,
}

/**
 * 模型分组
 * 注意：需要在 ALL_MODELS 定义之后定义，以确保能正确过滤
 */
const getAllModelsList = () => ({
  ...OPENAI_MODELS,
  ...GEMINI_MODELS,
  ...LOCAL_MODELS,
})

export const MODEL_GROUPS = {
  free: {
    label: '免费模型',
    description: '免费额度，适合测试和日常使用',
    models: Object.values(getAllModelsList()).filter(m => m.tier === 'free'),
  },
  paid: {
    label: '付费模型',
    description: '更高速率限制，更好的性能',
    models: Object.values(getAllModelsList()).filter(m => m.tier === 'paid'),
  },
  local: {
    label: '本地模型',
    description: '完全免费，隐私保护，无网络限制',
    models: Object.values(getAllModelsList()).filter(m => m.tier === 'local'),
  },
}

/**
 * 获取默认模型
 */
export function getDefaultModel() {
  return 'gemini-2.5-flash' // 切换到 Gemini 2.5 Flash 作为默认（最新免费版本）
}

/**
 * 获取模型配置
 */
export function getModelConfig(modelId) {
  return ALL_MODELS[modelId] || ALL_MODELS[getDefaultModel()]
}

/**
 * 估算请求成本
 * @param {string} modelId - 模型ID
 * @param {number} inputTokens - 输入tokens数量
 * @param {number} outputTokens - 输出tokens数量
 * @returns {number} 成本（美元）
 */
export function estimateCost(modelId, inputTokens, outputTokens) {
  const model = getModelConfig(modelId)
  if (!model) return 0

  const inputCost = (inputTokens / 1000) * model.pricing.input
  const outputCost = (outputTokens / 1000) * model.pricing.output

  return inputCost + outputCost
}

/**
 * 格式化成本显示
 */
export function formatCost(cost) {
  if (cost === 0) return '免费'
  if (cost < 0.01) return `<$0.01`
  return `$${cost.toFixed(3)}`
}

/**
 * 检查是否超出速率限制
 * @param {string} error - 错误信息
 * @returns {boolean} 是否是速率限制错误
 */
export function isRateLimitError(error) {
  const errorMessage = error.message || error.toString()
  return (
    errorMessage.includes('Rate limit') ||
    errorMessage.includes('rate_limit') ||
    errorMessage.includes('429') ||
    errorMessage.includes('TPM')
  )
}

/**
 * 建议替代模型（当遇到速率限制时）
 * @param {string} currentModel - 当前模型ID
 * @returns {Array} 推荐的替代模型列表
 */
export function suggestAlternativeModels(currentModel) {
  const current = getModelConfig(currentModel)

  // 如果是免费模型遇到限制，建议付费模型或本地模型
  if (current.tier === 'free') {
    return [
      {
        model: 'gpt-3.5-turbo',
        reason: '性价比高，速率限制更宽松',
      },
      {
        model: 'gpt-4o',
        reason: '性能更好，速率限制大幅提升',
      },
      {
        model: 'llama3.2',
        reason: '本地运行，完全免费，无速率限制',
      },
    ]
  }

  // 如果付费模型也遇到限制，建议更高级或本地模型
  return [
    {
      model: 'llama3.2',
      reason: '本地运行，无速率限制',
    },
  ]
}

/**
 * 从localStorage获取用户选择的模型
 */
export function getSavedModel() {
  try {
    return localStorage.getItem('ai_model_preference') || getDefaultModel()
  } catch {
    return getDefaultModel()
  }
}

/**
 * 保存用户选择的模型
 */
export function saveModelPreference(modelId) {
  try {
    localStorage.setItem('ai_model_preference', modelId)
  } catch (error) {
    console.warn('无法保存模型偏好:', error)
  }
}

/**
 * 比较两个模型
 */
export function compareModels(modelId1, modelId2) {
  const model1 = getModelConfig(modelId1)
  const model2 = getModelConfig(modelId2)

  return {
    cost: {
      winner: model1.pricing.input < model2.pricing.input ? modelId1 : modelId2,
      difference: Math.abs(model1.pricing.input - model2.pricing.input),
    },
    speed: {
      model1: model1.features.speed,
      model2: model2.features.speed,
    },
    quality: {
      model1: model1.features.quality,
      model2: model2.features.quality,
    },
    limits: {
      model1: model1.limits.tpm,
      model2: model2.limits.tpm,
      winner: model1.limits.tpm > model2.limits.tpm ? modelId1 : modelId2,
    },
  }
}

/**
 * 获取推荐模型（基于用户需求）
 */
export function getRecommendedModel(requirements = {}) {
  const { priority = 'balanced', budget = 'low' } = requirements

  // 如果预算紧张，优先免费或低成本
  if (budget === 'low') {
    return ['gpt-4o-mini', 'gpt-3.5-turbo', 'llama3.2']
  }

  // 如果追求质量
  if (priority === 'quality') {
    return ['gpt-4', 'gpt-4-turbo', 'gpt-4o']
  }

  // 如果追求速度
  if (priority === 'speed') {
    return ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini']
  }

  // 平衡选择
  return ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
}

export default {
  OPENAI_MODELS,
  GEMINI_MODELS,
  LOCAL_MODELS,
  ALL_MODELS,
  MODEL_GROUPS,
  getDefaultModel,
  getModelConfig,
  estimateCost,
  formatCost,
  isRateLimitError,
  suggestAlternativeModels,
  getSavedModel,
  saveModelPreference,
  compareModels,
  getRecommendedModel,
}
