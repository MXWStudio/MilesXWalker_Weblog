<template>
  <div class="trail-log-article">
    <div class="article-content">
      <h1>Trail Log 开发日志 · 第一篇</h1>
      <p class="meta">
        作者：Miles Walker &nbsp;|&nbsp; 分类：开发日志 · App开发 · 徒步工具 &nbsp;|&nbsp;
        发布时间：2024-12-20
      </p>

      <section class="content">
        <h2>从 FullTrack 到 Trail Log：我开始打造自己的徒步 App</h2>

        <div class="article-image-float">
          <img
            src="https://picsum.photos/400/300?random=trail1"
            alt="Trail Log App 界面设计概念图"
          />
          <p class="image-caption">Trail Log App 界面设计概念图</p>
        </div>

        <p>
          最近，我正式将我开发的徒步路线工具命名为 <strong>Trail Log</strong>。
          这个名字很简单，也很有意义：它是"Trail"（徒步路线）和"Log"（记录）的组合，表达了我想做一款既能探索路线、又能留下痕迹的
          App 的愿景。
        </p>

        <p>
          这个项目的起点很直接 —— 国内的徒步类 App
          要么广告太多，要么设计太杂乱，要么功能繁琐到难以使用。我想做一个更纯粹、更安静的工具，它只是帮你找到路，记录你走的每一步。
        </p>

        <h3>技术选型与开发进展</h3>

        <div class="tech-info-box">
          <h4>🛠️ 技术栈</h4>
          <ul>
            <li><strong>React Native</strong> - 跨平台移动应用开发</li>
            <li><strong>Tailwind CSS (NativeWind)</strong> - 美观一致的样式系统</li>
            <li><strong>Mapbox / Leaflet</strong> - 开源地图平台（暂定）</li>
            <li><strong>Figma</strong> - 界面设计与原型</li>
            <li><strong>Cursor</strong> - 开发环境</li>
          </ul>
        </div>

        <p>
          目前 Trail Log 正在进行地图模块的配置，我打算接入开源地图平台（暂定 Mapbox 或
          Leaflet），来实现：
        </p>

        <ul class="feature-list">
          <li>🗺️ <strong>基础路线可视化</strong> - 清晰展示徒步路线轨迹</li>
          <li>📱 <strong>用户路线浏览与卡片展示</strong> - 优雅的内容呈现</li>
          <li>✏️ <strong>后期支持自定义路线绘制与保存</strong> - 个性化路线创建</li>
        </ul>

        <div class="article-image-center">
          <img src="https://picsum.photos/600/400?random=development" alt="开发环境截图" />
          <p class="image-caption">在 Cursor 中进行 Trail Log 开发</p>
        </div>

        <p>
          整个 App 是我在 Cursor 上独立开发的，用的是 React Native + Tailwind（NativeWind）技术栈。
          界面设计在 Figma 中同步完成，现在已经初步搭建了导航结构、主页面和内容卡片展示部分。
        </p>

        <hr class="section-divider" />

        <h2>Trail Log 的目标愿景</h2>

        <div class="vision-grid">
          <div class="vision-item">
            <div class="vision-icon">🧭</div>
            <h4>浏览路线，查看真实轨迹</h4>
            <p>提供准确的路线数据和轨迹信息，让每一次出行都有据可依</p>
          </div>

          <div class="vision-item">
            <div class="vision-icon">✍️</div>
            <h4>记录自己的徒步过程</h4>
            <p>简单直观的记录工具，捕捉每一次徒步的珍贵回忆</p>
          </div>

          <div class="vision-item">
            <div class="vision-icon">🗺️</div>
            <h4>支持离线使用和设备同步</h4>
            <p>无网络环境下也能正常使用，数据安全同步</p>
          </div>

          <div class="vision-item">
            <div class="vision-icon">🚫</div>
            <h4>没有广告，没有干扰</h4>
            <p>纯净的使用体验，专注于徒步本身的乐趣</p>
          </div>
        </div>

        <h3>开发理念</h3>

        <blockquote class="quote-block">
          这个项目对我来说，不只是一个工具，也是一次把自己思考过的东西落地的过程。
          从名字、功能、设计再到代码，每一步都在提醒我：去做你真正想要用的东西，而不是别人告诉你该做的东西。
        </blockquote>

        <div class="article-image-center">
          <img src="https://picsum.photos/800/500?random=hiking" alt="山野徒步场景" />
          <p class="image-caption">Trail Log 希望陪你走过每一条山野小径</p>
        </div>

        <hr class="section-divider" />

        <h2>下一步计划</h2>

        <p>接下来我会记录开发中的每一阶段，包括：</p>

        <ul>
          <li>🗺️ 地图模块的详细实现过程</li>
          <li>📊 路线数据结构的设计思路</li>
          <li>🎨 用户界面的迭代优化</li>
          <li>🧪 实际徒步场景的测试反馈</li>
          <li>🚀 上线准备和用户体验优化</li>
        </ul>

        <p>未来上线后，我希望它能陪你走过一条又一条山野小径。</p>

        <div class="contact-section">
          <h3>联系方式</h3>
          <p>欢迎关注我的网站和社交媒体：</p>
          <ul class="contact-links">
            <li>🌐 <a href="https://mxwfilm.work" target="_blank">mxwfilm.work</a></li>
            <li>🌐 <a href="https://milesxwalker.com" target="_blank">milesxwalker.com</a></li>
            <li>📱 小红书 / 微博搜索：<strong>Miles Walker</strong></li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// 页面元数据
document.title = 'Trail Log 开发日志 · 第一篇 - MilesXWalker Studio'
</script>

<style scoped>
.trail-log-article {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px 80px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(118, 159, 205, 0.08);
}

.article-content {
  text-align: left;
  line-height: 1.7;
  color: #333;
}

.article-content h1 {
  font-size: 2.2em;
  color: #2c3e50;
  margin-bottom: 24px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}

.meta {
  text-align: center;
  color: #666;
  font-size: 0.95em;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e7ef;
}

.content h2 {
  font-size: 1.6em;
  color: #2c3e50;
  margin: 40px 0 20px 0;
  font-weight: 600;
}

.content h3 {
  font-size: 1.3em;
  color: #34495e;
  margin: 30px 0 15px 0;
  font-weight: 600;
}

.content h4 {
  font-size: 1.1em;
  color: #34495e;
  margin: 20px 0 10px 0;
  font-weight: 600;
}

.content p {
  margin-bottom: 16px;
  text-align: justify;
}

.content ul {
  margin-bottom: 20px;
  padding-left: 20px;
}

.content li {
  margin-bottom: 8px;
}

/* 图片样式 */
.article-image-float {
  float: right;
  width: 400px;
  margin: 0 0 24px 36px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.article-image-float img {
  width: 100%;
  height: auto;
  display: block;
}

.article-image-center {
  text-align: center;
  margin: 30px 0;
}

.article-image-center img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.image-caption {
  font-size: 0.9em;
  color: #666;
  font-style: italic;
  margin-top: 8px;
  text-align: center;
}

/* 技术信息框 */
.tech-info-box {
  background: #f8f9fa;
  border-left: 4px solid #769fcd;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
}

.tech-info-box h4 {
  margin-top: 0;
  color: #2c3e50;
}

.tech-info-box ul {
  margin-bottom: 0;
}

.tech-info-box li {
  margin-bottom: 6px;
}

/* 功能列表样式 */
.feature-list {
  list-style: none;
  padding-left: 0;
}

.feature-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.feature-list li:last-child {
  border-bottom: none;
}

/* 愿景网格 */
.vision-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin: 30px 0;
}

.vision-item {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e9ecef;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.vision-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.vision-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.vision-item h4 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  color: #2c3e50;
}

.vision-item p {
  margin: 0;
  font-size: 0.95em;
  color: #666;
  text-align: center;
}

/* 引用块 */
.quote-block {
  background: #f8f9fa;
  border-left: 4px solid #769fcd;
  padding: 20px;
  margin: 25px 0;
  font-style: italic;
  font-size: 1.05em;
  color: #555;
  border-radius: 0 8px 8px 0;
}

/* 分隔线 */
.section-divider {
  border: none;
  height: 2px;
  background: linear-gradient(to right, transparent, #769fcd, transparent);
  margin: 40px 0;
}

/* 联系方式 */
.contact-section {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-top: 40px;
}

.contact-links {
  list-style: none;
  padding-left: 0;
}

.contact-links li {
  margin-bottom: 8px;
}

.contact-links a {
  color: #769fcd;
  text-decoration: none;
  font-weight: 500;
}

.contact-links a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .article-image-float {
    float: none;
    width: 100%;
    margin: 0 0 20px 0;
  }

  .vision-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .trail-log-article {
    padding: 40px 16px 60px 16px;
  }

  .article-content h1 {
    font-size: 1.8em;
  }

  .content h2 {
    font-size: 1.4em;
  }

  .tech-info-box {
    padding: 16px;
  }

  .vision-item {
    padding: 20px 16px;
  }
}
</style>
