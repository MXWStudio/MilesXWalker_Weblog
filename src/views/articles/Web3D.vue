<template>
  <div class="web3d-article-float">
    <div class="web3d-article-content">
      <h1>我们需要一个属于创作者的 Web3D 虚拟人物标准</h1>
      <p class="meta">作者：Miles Walker &nbsp;|&nbsp; 分类：Web3D · 虚拟人物 · 创作标准 &nbsp;|&nbsp; 发布时间：2024-06-01</p>
      <section class="content">
        <h2>前言：当我开始"虚拟人+摄影"创作时，遇到了什么？</h2>
        <p>
          在构建我的摄影品牌虚拟分身、策划在线沉浸式展览时，我发现一件看似简单的事：把一个虚拟人物带到多个平台使用，居然极其困难。
        </p>
        <ul>
          <li>模型导出后，在A平台能动，在B平台就不兼容；</li>
          <li>想添加一个"拿相机的动作"，每个平台的定义方式完全不同；</li>
          <li>想发布在网页上，又得压缩、转换、加脚本……</li>
        </ul>
        <p>
          我开始思考：我们是不是缺少一个真正统一、开放、轻量、Web友好的虚拟人标准？
        </p>
        <hr class="section-divider" />
        <h2>我找到了两个"最接近"的答案：glTF 和 VRM</h2>
        <div class="web3d-article-video-float">
          <iframe
            width="420"
            height="236"
            src="https://www.youtube.com/embed/tonSNnEj-ow?si=1wzwjMG-vXp3JibA"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
          <!-- 将第二个视频也移到这里 -->
          <iframe
            width="420"
            height="236"
            src="https://www.youtube.com/embed/zNOwRF3K8yE?si=VSegt3FQLOc5VcBU"
            title="YouTube video player - VRM"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>
        <h3>✅ 什么是 glTF？</h3>
        <p>
          glTF 是一个被称为"3D界的JPEG"的文件格式，由 Khronos Group 推出。它让3D模型像图片一样轻便，能快速加载到网页、APP、VR、AR里，支持骨骼、动画、PBR 材质等。<br>
          <strong>📦 适合通用模型传输。</strong>
        </p>
        <h3>✅ 什么是 VRM？</h3>
        <p>
          VRM 是一个基于 glTF 扩展的虚拟人标准，由日本Unity社区提出，专门用来描述人物的骨架、表情、服装、挂件、物理效果。它是目前 Vtuber、虚拟偶像、虚拟人展示中最常用的格式之一。<br>
          <strong>🧍 适合人物语义、动作表现。</strong>
        </p>
        <h3>✅ 组合使用：glTF（通用模型） + VRM（虚拟人定义），是目前最实用的"事实标准"。</h3>
        
        <!-- 标准对比表格 -->
        <div class="compare-table-wrapper">
          <table class="compare-table">
            <thead>
              <tr>
                <th>标准</th>
                <th>优点</th>
                <th>局限</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>glTF</td>
                <td>通用、轻量、支持Web展示</td>
                <td>缺少语义，无法表达"这个动作是挥手"</td>
              </tr>
              <tr>
                <td>VRM</td>
                <td>表情、动作、挂件定义清晰</td>
                <td>依赖Unity，不适合网页/WebXR直接使用</td>
              </tr>
              <tr>
                <td>USD</td>
                <td>专业影视标准</td>
                <td>太重，不适合普通创作者使用</td>
              </tr>
              <tr>
                <td>Ready Player Me</td>
                <td>快速构建虚拟人</td>
                <td>平台封闭，API受限，不利于创作自由</td>
              </tr>
            </tbody>
          </table>
          
        </div>
        
        <!-- 新增：我们真正需要的标准 -->
        <h2>我们真正需要的是一种什么样的标准？</h2>
        <ul>
          <li>✅ 轻量级：像glTF一样，适合Web发布、快速加载；</li>
          <li>✅ 结构化语义：能描述"动作=拍照"，"挂件=相机"，"反应=点头"等行为含义；</li>
          <li>✅ 平台无关：不绑定Unity、Unreal等特定引擎；</li>
          <li>✅ 开放协作：创作者、开发者都可以参与标准制定；</li>
          <li>✅ 与AI协同：未来虚拟人需要与AI互动，标准需要支持可读语义。</li>
        </ul>
        <hr class="section-divider" />
        <h2>谁在推动这件事？</h2>
        <ul>
          <li>Khronos Group：glTF 发布方，正推进行为语义扩展；</li>
          <li>VRM社区（日本 Unity 组）：持续更新VRM1.0，开放中；</li>
          <li>Open Metaverse Interoperability Group (OMI)：在制定 Avatar ID、物品互通等协议；</li>
          <li>WebXR开发者社群：探索 glTF + JSON 动作语义格式，适配Web空间。</li>
        </ul>
        <hr class="section-divider" />
        <h2>作为创作者，我想参与推动这个标准</h2>
        <ul>
          <li>利用 VRoid Studio + VRM 打造 MXW 虚拟人物；</li>
          <li>导出为 glTF，嵌入网页相册或沉浸式博客；</li>
          <li>自定义"动作脚本"如举起相机、挥手、进入展览空间；</li>
          <li>计划将这套实践输出为开源模板，分享给更多创作者。</li>
        </ul>
        <hr class="section-divider" />
        <h2>如果你也是创作者，这些是我们可以一起做的</h2>
        <ul>
          <li>分享你在做虚拟人/展览/空间创作中遇到的问题；</li>
          <li>参与 glTF / VRM 的 GitHub 社区，哪怕只是提出一个 Issue；</li>
          <li>关注 OMI、WebXR、Khronos 的标准动态；</li>
          <li>加入我们的共创计划，一起定义"创作者的虚拟人语义标准"。</li>
        </ul>
        <hr class="section-divider" />
        <h2>结语：虚拟人标准，不是平台说了算，而是我们一起定义的</h2>
        <p>
          一个开放、轻量、跨平台的虚拟人+动作+挂件标准，将是Web3D时代最重要的基础设施之一。<br>
          它值得每一位创作者、艺术家、设计师共同参与。
        </p>
        <p>
          📧 如果你想一起参与这项实践，欢迎联系我：<br>
          👉 milesxwalkerstudio@gmail.com<br>
          👉 www.mxwstudio.com
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
// 目前无需特殊逻辑
</script>

<style scoped>
.web3d-article-float {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px 80px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(118,159,205,0.08);
}
.web3d-article-content {
  text-align: left;
}
.web3d-article-video-float {
  float: right;
  width: 420px;
  margin: 0 0 24px 36px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(118,159,205,0.10);
  /* background: #000; */ /* 移除背景色，使视频间隙透明，显示页面背景 */
}
.web3d-article-video-float iframe {
  width: 100%;
  height: 236px;
  border-radius: 12px;
  display: block;
}
/* 为同一列中的多个视频之间添加间距 */
.web3d-article-video-float iframe:not(:last-child) {
  margin-bottom: 16px; 
}
@media (max-width: 900px) {
  .web3d-article-video-float {
    float: none;
    width: 100%;
    margin: 0 0 18px 0;
  }
  .web3d-article-video-float iframe {
    height: 200px;
  }
}
.web3d-article-content h1 {
  font-size: 1.6em;
  color: #2c3e50;
  margin-bottom: 24px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}
.meta {
  color: #888;
  font-size: 0.95em;
  margin-bottom: 36px;
}
.content p, .content ul {
  font-size: 1em;
  color: #333;
  line-height: 1.8;
  margin-bottom: 18px;
}
.content strong {
  color: #4a6fa5;
}
.content h2 {
  font-size: 1.08em;
  color: #4a6fa5;
  margin: 36px 0 14px 0;
  font-weight: 700;
}
.content h3 {
  font-size: 0.98em;
  color: #2c3e50;
  margin: 18px 0 8px 0;
  font-weight: 600;
}
.section-divider {
  border: none;
  border-top: 2px dashed #e0e7ef;
  margin: 36px 0 30px 0;
}
.compare-table-wrapper {
  margin: 32px 0 36px 0;
  overflow-x: auto;
}
.compare-table {
  width: 100%;
  border-collapse: collapse;
  background: #f8fafc;
  border-radius: 10px;
  overflow: hidden;
  font-size: 0.98em;
}
.compare-table th, .compare-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e0e7ef;
  text-align: left;
}
.compare-table th {
  background: #e0e7ef;
  color: #2c3e50;
  font-weight: 700;
}
.compare-table tr:last-child td {
  border-bottom: none;
}
@media (max-width: 600px) {
  .compare-table th, .compare-table td {
    padding: 10px 8px;
    font-size: 0.95em;
  }
}
</style> 