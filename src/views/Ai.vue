<template>
  <div class="ai-page-container">
    <div class="publish-status">
      <span class="status-badge">开发中</span>
      <span class="status-text">当前内容为测试数据，实际内容待更新</span>
    </div>
    <header class="page-header">
      <h1>AI 功能模块展示</h1>
      <p>探索以下交互式卡片，了解各项特性详情。</p>
    </header>

    <div class="card-grid">
      <div v-for="card in cards" :key="card.id" class="card-flip-container">
        <div class="card-flipper">
          <div class="card-front">
            <img :src="card.thumbnail" :alt="card.title" class="card-thumbnail" />
            <h3 class="card-title">{{ card.title }}</h3>
          </div>
          <div class="card-back">
            <h4 class="card-back-title">{{ card.title }}</h4>
            <p class="card-description">{{ card.description }}</p>
            <div class="card-tags">
              <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Card {
  id: number
  title: string
  thumbnail: string
  description: string
  tags: string[]
}

const cards = ref<Card[]>([
  {
    id: 1,
    title: '智能图像识别',
    thumbnail: 'https://placehold.co/400x300/E8117F/white?text=图像识别&font=montserrat',
    description:
      '先进的图像识别技术，能够准确识别图片中的物体、场景和人脸。支持自定义模型训练，广泛应用于安防、零售、医疗等领域。',
    tags: ['计算机视觉', '深度学习', 'API'],
  },
  {
    id: 2,
    title: '自然语言处理',
    thumbnail: 'https://placehold.co/400x300/11E87F/white?text=NLP&font=montserrat',
    description:
      '强大的自然语言处理引擎，支持文本分析、情感识别、机器翻译和智能问答等功能。助力企业理解和处理海量文本数据。',
    tags: ['NLP', 'AI助手', '文本分析'],
  },
  {
    id: 3,
    title: '语音合成与识别',
    thumbnail: 'https://placehold.co/400x300/7F11E8/white?text=语音技术&font=montserrat',
    description:
      '提供高自然度的语音合成（TTS）和高准确率的语音识别（ASR）服务，赋能语音交互应用，如智能客服、语音助手等。',
    tags: ['语音识别', 'TTS', 'ASR', '智能家居'],
  },
  {
    id: 4,
    title: '推荐系统',
    thumbnail: 'https://placehold.co/400x300/E87F11/white?text=推荐引擎&font=montserrat',
    description:
      '基于用户行为和内容的智能推荐系统，为您的用户提供个性化的内容或商品推荐，提升用户粘性和转化率。',
    tags: ['个性化推荐', '机器学习', '大数据'],
  },
  {
    id: 5,
    title: 'AI聊天机器人',
    thumbnail: 'https://placehold.co/400x300/11AEE8/white?text=ChatBot&font=montserrat',
    description:
      '构建智能聊天机器人，7x24小时在线，自动解答用户疑问，处理常见业务，提升客户服务效率和用户体验。',
    tags: ['聊天机器人', '客服', '自动化'],
  },
  {
    id: 6,
    title: '数据分析与预测',
    thumbnail: 'https://placehold.co/400x300/E8E211/white?text=数据分析&font=montserrat',
    description:
      '利用机器学习算法进行数据分析和趋势预测，从复杂数据中提取有价值的洞察，帮助企业做出更明智的决策。',
    tags: ['数据科学', '预测模型', '商业智能'],
  },
  {
    id: 7,
    title: '自动化内容生成',
    thumbnail: 'https://placehold.co/400x300/4AE811/white?text=AIGC&font=montserrat',
    description:
      'AI驱动的内容生成工具（AIGC），可以自动撰写文章、生成报告、创作营销文案、甚至编写代码片段，大幅提升内容生产效率。',
    tags: ['AIGC', '内容创作', '效率工具'],
  },
  {
    id: 8,
    title: '智能风控',
    thumbnail: 'https://placehold.co/400x300/E8112D/white?text=风险控制&font=montserrat',
    description:
      '基于AI的智能风险控制系统，通过实时数据分析和模式识别，有效识别和防范金融欺诈、账户盗用、恶意攻击等风险。',
    tags: ['金融科技', '安全', '反欺诈'],
  },
  {
    id: 9,
    title: 'AI辅助设计',
    thumbnail: 'https://placehold.co/400x300/11E8D5/white?text=AI设计&font=montserrat',
    description:
      '利用AI技术辅助设计师进行创意构思、图像编辑、版式自动生成、色彩搭配建议等，提升设计效率和作品质量。',
    tags: ['设计工具', '创意产业', '人机协作'],
  },
])
</script>

<style scoped>
.ai-page-container {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  padding: 20px;
  background-color: #f4f6f8;
  min-height: 100vh;
  box-sizing: border-box;
}

.publish-status {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.status-badge {
  background-color: #ffc107;
  color: #000;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  white-space: nowrap;
}

.status-text {
  font-size: 0.95em;
  line-height: 1.4;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.page-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #2c3e50;
  font-weight: 600;
}

.page-header p {
  font-size: 1.1em;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px; /* 卡片之间的间距 */
  padding: 10px;
}

.card-flip-container {
  perspective: 1000px;
  background-color: transparent;
  border-radius: 10px;
  height: 400px; /* 设置固定高度 */
}

.card-flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  transform-style: preserve-3d;
}

.card-flip-container:hover .card-flipper {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  overflow: hidden; /* 确保内容不会溢出卡片圆角 */
  box-sizing: border-box;
}

.card-front {
  background-color: #ffffff;
  justify-content: flex-start; /* 图片在上，标题在下 */
}

.card-thumbnail {
  width: 100%;
  height: 60%; /* 缩略图占据卡片正面大部分高度 */
  object-fit: cover;
  border-bottom: 1px solid #eee; /* 图片和标题间的细微分割 */
}

.card-title {
  padding: 15px;
  text-align: center;
  font-size: 1.15em;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex-grow: 1; /* 占据剩余空间，使得标题区域可以垂直居中（如果需要） */
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back {
  background-color: #f7f9fc;
  transform: rotateY(180deg);
  padding: 20px;
  justify-content: space-between; /* 使内容在垂直方向上分布 */
}

.card-back-title {
  font-size: 1.25em;
  margin-top: 0;
  margin-bottom: 12px;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
}

.card-description {
  font-size: 0.9em;
  color: #454545;
  line-height: 1.65;
  flex-grow: 1;
  overflow-y: auto; /* 如果内容过多，允许滚动 */
  margin-bottom: 15px;
  -webkit-overflow-scrolling: touch; /* 改善移动端滚动体验 */
}
/* 自定义滚动条样式 (可选) */
.card-description::-webkit-scrollbar {
  width: 6px;
}
.card-description::-webkit-scrollbar-thumb {
  background-color: #bdc3c7;
  border-radius: 3px;
}
.card-description::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center; /* 标签居中显示 */
  padding-top: 10px;
  border-top: 1px solid #e0e0e0; /* 标签区域与描述分割 */
}

.tag {
  background-color: #007bff;
  color: white;
  padding: 4px 10px;
  border-radius: 15px; /* 更圆润的标签 */
  font-size: 0.75em;
  font-weight: 500;
  transition: background-color 0.2s ease;
}
.tag:hover {
  background-color: #0056b3;
}

/* 响应式布局调整 */
@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  .page-header h1 {
    font-size: 2.2em;
  }
  .page-header p {
    font-size: 1em;
  }
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .page-header h1 {
    font-size: 2em;
  }
}

@media (max-width: 480px) {
  .ai-page-container {
    padding: 15px;
  }
  .page-header h1 {
    font-size: 1.8em;
  }
  .page-header p {
    font-size: 0.95em;
  }
  .card-title {
    font-size: 1.05em;
    padding: 10px;
  }
  .card-back-title {
    font-size: 1.15em;
  }
  .card-description {
    font-size: 0.85em;
  }
  .tag {
    font-size: 0.7em;
    padding: 3px 8px;
  }
  .publish-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 15px;
  }

  .status-badge {
    font-size: 0.85em;
  }

  .status-text {
    font-size: 0.9em;
  }
}
</style>
