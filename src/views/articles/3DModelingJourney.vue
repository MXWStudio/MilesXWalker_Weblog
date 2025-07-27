<template>
  <div class="modeling-journey-article">
    <!-- 文章头部 -->
    <header class="article-header">
      <div class="header-content">
        <h1>我的3D建模学习之路：从零基础到创作作品集</h1>
        <div class="article-meta">
          <span class="author">作者：Miles Walker</span>
          <span class="date">发布时间：2024年12月15日</span>
          <span class="category">分类：3D建模 · 学习心得</span>
        </div>
        <p class="article-intro">
          这篇文章记录了我从零基础开始学习3D建模的完整历程。从最初的几何体练习到复杂的场景创作，
          我想分享这段学习旅程中的8个重要作品、遇到的挑战、掌握的技巧以及收获的心得体会。
          希望能为同样在学习3D建模的朋友们提供一些参考和启发。
        </p>
      </div>
    </header>

    <div class="article-container">
      <!-- 学习历程时间线 -->
      <section class="learning-timeline">
        <h2>📅 学习历程时间线</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-date">2024年9月</div>
            <div class="timeline-content">
              <h3>🔰 Blender基础入门阶段</h3>
              <p>
                跟随课程从最基本的几何体开始，熟悉Blender的界面布局和基础操作。这个阶段主要是建立对3D软件的认知，学会基础的建模工具和材质概念。通过几何抽象练习，掌握了PBR材质的基本原理。
              </p>
              <div class="skills-learned">
                <strong>掌握技能：</strong>界面操作、基础建模工具、材质节点基础、渲染设置
              </div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">2024年10月</div>
            <div class="timeline-content">
              <h3>🛠️ 建模与材质进阶阶段</h3>
              <p>
                开始尝试更复杂的建模项目，包括硬表面建模和角色建模。这个阶段重点学习修改器的使用、多材质的搭配以及不同质感的表现技巧。电脑和卡通人物的建模让我对结构设计有了更深的理解。
              </p>
              <div class="skills-learned">
                <strong>掌握技能：</strong>硬表面建模、修改器应用、多材质组合、角色比例设计
              </div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">2024年11月</div>
            <div class="timeline-content">
              <h3>🎨 综合渲染提升阶段</h3>
              <p>
                专注于渲染技巧的学习，掌握了HDRI环境光照、产品摄影光照以及不同材质的高级表现。通过场景渲染练习，学会了如何营造氛围和表达主题。这个阶段的作品在视觉效果上有了质的飞跃。
              </p>
              <div class="skills-learned">
                <strong>掌握技能：</strong>环境光照、HDRI使用、场景构图、氛围营造、后期渲染优化
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 作品展示 -->
      <section class="works-showcase">
        <h2>🎨 学习作品展示</h2>

        <!-- 课程学习案例 -->
        <div class="work-section">
          <h3 class="section-title">📚 Blender课程学习案例</h3>
          <p class="section-intro">
            以下是我跟随Blender课程完成的8个学习案例，主要专注于软件操作、材质制作、灯光布置和渲染技巧的掌握。
            通过这些练习，我逐步建立了对3D制作流程的完整认知：
          </p>

          <div class="works-grid">
            <div
              v-for="work in courseLearningWorks"
              :key="work.id"
              class="work-card"
              @click="openWorkDetail(work)"
            >
              <div class="work-image">
                <img :src="work.image" :alt="work.title" />
                <div class="work-overlay">
                  <span class="work-category">{{ work.category }}</span>
                  <span class="learning-stage">{{ work.learningStage }}</span>
                </div>
              </div>
              <div class="work-info">
                <h3>{{ work.title }}</h3>
                <p class="work-description">{{ work.description }}</p>
                <div class="work-meta">
                  <span class="focus">🎯 {{ work.learningFocus }}</span>
                </div>
                <div class="work-tags">
                  <span v-for="tag in work.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 独立创作作品 -->
        <div class="work-section">
          <h3 class="section-title">🚀 独立创作作品</h3>
          <p class="section-intro">
            基于课程学习的基础，我开始尝试独立创作。这些作品融合了个人创意和技术实践，
            代表着我从学习者向创作者的转变：
          </p>

          <div class="independent-works-grid">
            <div
              v-for="work in independentWorks"
              :key="work.id"
              class="independent-work-card"
              @click="openWorkDetail(work)"
            >
              <div class="work-image">
                <!-- 视频预览 -->
                <video
                  v-if="work.type === 'video'"
                  :src="work.video"
                  :poster="work.image"
                  muted
                  loop
                  autoplay
                  playsinline
                  class="work-video"
                  @mouseenter="playVideo"
                  @mouseleave="pauseVideo"
                />
                <!-- 图片预览 -->
                <img v-else :src="work.image" :alt="work.title" />
                <div class="work-overlay">
                  <span class="work-category">{{ work.category }}</span>
                  <span class="creation-type">独立创作</span>
                  <span v-if="work.type === 'video'" class="media-type">🎥 视频作品</span>
                </div>
              </div>
              <div class="work-info">
                <h3>{{ work.title }}</h3>
                <p class="work-description">{{ work.description }}</p>
                <div class="work-meta">
                  <span class="creation-focus">🎯 {{ work.learningFocus }}</span>
                </div>
                <div class="work-tags">
                  <span v-for="tag in work.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术心得分享 -->
      <section class="tech-insights">
        <h2>💡 技术心得与经验分享</h2>

        <div class="insights-grid">
          <div class="insight-card">
            <h3>🎯 建模技巧</h3>
            <div class="insight-content">
              <h4>从简单几何体开始</h4>
              <p>
                课程教会我万物皆可由基础几何体构建。立方体可以变成电脑，圆柱体可以成为角色的身体，这种思维方式让建模变得不再神秘。
              </p>

              <h4>修改器的强大威力</h4>
              <p>
                倒角修改器让硬表面建模变得简单，镜像修改器保证了对称物体的精确性，阵列修改器快速生成重复结构。掌握修改器的组合使用是提高效率的关键。
              </p>

              <h4>比例与结构的重要性</h4>
              <p>
                无论是电脑的屏幕比例还是卡通人物的头身比，正确的比例是作品成功的基础。课程中反复强调的测量和参考习惯让我受益匪浅。
              </p>
            </div>
          </div>

          <div class="insight-card">
            <h3>🎨 材质与渲染</h3>
            <div class="insight-content">
              <h4>节点编辑器的奥秘</h4>
              <p>
                初次接触Blender的节点编辑器时感到复杂，但通过课程的逐步引导，我理解了材质就是数据的流动和计算。掌握了基础节点的连接方式后，制作各种材质变得得心应手。
              </p>

              <h4>HDRI环境光照</h4>
              <p>
                HDRI环境贴图的使用让我的作品有了质的飞跃。一张好的HDRI不仅提供光照，还能在物体表面产生真实的环境反射，这比传统灯光更加自然。
              </p>

              <h4>渲染设置的平衡</h4>
              <p>
                课程教会我如何在渲染质量和速度之间找到平衡。适当的采样设置既能保证质量，又不会让等待变得漫长。
              </p>
            </div>
          </div>

          <div class="insight-card">
            <h3>📚 学习方法</h3>
            <div class="insight-content">
              <h4>跟随课程系统学习</h4>
              <p>
                相比于零散的教程，系统性的课程让我的学习更有章法。每个项目都有明确的学习目标，知识点环环相扣，避免了东一榔头西一棒子的学习状态。
              </p>

              <h4>重复练习的重要性</h4>
              <p>
                课程中的每个案例我都会练习多遍，第一遍跟着做，第二遍尝试改变参数，第三遍完全独立完成。这种重复练习让技能真正变成肌肉记忆。
              </p>

              <h4>笔记与总结习惯</h4>
              <p>
                每完成一个课程项目，我都会总结关键操作步骤和参数设置。这些笔记成为了我最宝贵的学习资料，遇到问题时能快速找到解决方案。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 遇到的挑战 -->
      <section class="challenges">
        <h2>⚡ 学习过程中的挑战与突破</h2>

        <div class="challenge-list">
          <div class="challenge-item">
            <h3>🎯 挑战一：节点编辑器的理解</h3>
            <p>
              <strong>遇到的问题：</strong
              >初次接触材质节点时完全摸不着头脑，各种节点的连接让人眼花缭乱。
            </p>
            <p>
              <strong>解决方案：</strong
              >跟随课程从最基础的单个节点开始，逐步理解每个节点的作用和参数含义。
            </p>
            <p><strong>收获：</strong>掌握了节点思维方式，能够独立搭建复杂的材质效果。</p>
          </div>

          <div class="challenge-item">
            <h3>💧 挑战二：透明材质的真实感</h3>
            <p><strong>遇到的问题：</strong>制作精华水瓶时，玻璃总是显得很假，缺乏真实的质感。</p>
            <p><strong>解决方案：</strong>在课程指导下学习IOR值的设置，理解不同材质的物理特性。</p>
            <p>
              <strong>收获：</strong>理解了透明材质的本质，掌握了玻璃、液体等透明效果的制作方法。
            </p>
          </div>

          <div class="challenge-item">
            <h3>🔧 挑战三：硬表面建模精度</h3>
            <p><strong>遇到的问题：</strong>制作电脑模型时，边缘处理不够干净，倒角效果不自然。</p>
            <p>
              <strong>解决方案：</strong
              >学会使用倒角修改器的各种参数，理解拓扑结构对最终效果的影响。
            </p>
            <p><strong>收获：</strong>掌握了硬表面建模的核心技巧，能够制作出工业级精度的模型。</p>
          </div>
        </div>
      </section>

      <!-- 工具与资源推荐 -->
      <section class="resources">
        <h2>🔧 推荐工具与学习资源</h2>

        <div class="resources-grid">
          <div class="resource-category">
            <h3>核心软件工具</h3>
            <ul>
              <li><strong>Blender</strong> - 我学习的主要工具，免费且功能完整</li>
              <li><strong>Photoshop</strong> - 偶尔用于后期微调和图片处理</li>
              <li><strong>文档工具</strong> - 用于记录学习笔记和操作步骤</li>
              <li><strong>屏幕录制</strong> - 记录操作过程，方便后续回顾</li>
            </ul>
          </div>

          <div class="resource-category">
            <h3>推荐学习资源</h3>
            <ul>
              <li><strong>系统化课程</strong> - 比零散教程更有学习效率</li>
              <li><strong>Blender官方文档</strong> - 权威的功能说明和参数解释</li>
              <li><strong>YouTube教程</strong> - 补充学习的好资源</li>
              <li><strong>Blender社区</strong> - 问题讨论和作品交流</li>
            </ul>
          </div>

          <div class="resource-category">
            <h3>必备素材资源</h3>
            <ul>
              <li><strong>HDRI Haven</strong> - 免费高质量环境光照文件</li>
              <li><strong>Blender内置素材</strong> - 软件自带的材质和贴图</li>
              <li><strong>课程配套资源</strong> - 跟随课程提供的模型和贴图</li>
              <li><strong>个人素材库</strong> - 逐步积累的材质和模型资源</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 未来展望 -->
      <section class="future-plans">
        <h2>🚀 未来学习计划</h2>
        <div class="plans-content">
          <p>
            通过课程学习，我已经掌握了Blender的基础操作和核心功能，但这只是3D学习之路的起点。接下来我计划：
          </p>

          <div class="plan-items">
            <div class="plan-item">
              <h3>🎨 独立创作实践</h3>
              <p>
                基于课程学到的技能，开始进行独立的创作实践，将所学技术应用到个人项目中，培养独立解决问题的能力。
              </p>
            </div>

            <div class="plan-item">
              <h3>🔧 进阶技能学习</h3>
              <p>
                深入学习雕刻、动画、节点编程等更高级的功能，拓展Blender的应用范围，提升作品的复杂度和表现力。
              </p>
            </div>

            <div class="plan-item">
              <h3>📚 综合能力提升</h3>
              <p>
                学习相关的美术理论、设计原理和行业标准，从技术操作向艺术创作转变，培养独特的个人风格。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 结语 -->
      <section class="conclusion">
        <h2>💭 写在最后</h2>
        <div class="conclusion-content">
          <p>
            通过系统的Blender课程学习，我从完全的零基础变成了能够独立操作软件、制作基础作品的初学者。
            这个过程虽然有挑战，但每次掌握新技能时的成就感都让我充满动力。看到自己的作品从无到有，
            从粗糙到精致，这种成长的喜悦是学习过程中最大的收获。
          </p>

          <p>
            如果你也想学习3D建模，我强烈建议选择系统性的课程而不是零散的教程。
            课程的结构化学习让知识点更有条理，练习项目也更有针对性。记住，工具只是手段，
            重要的是培养3D思维和解决问题的能力。
          </p>

          <p>
            这8个课程案例只是我学习历程的第一阶段。接下来，我会在这个基础上开始独立创作，
            将所学的技能转化为真正的作品。感谢课程老师的耐心指导，也感谢坚持学习的自己。
            3D的世界才刚刚向我敞开大门，前方还有更广阔的创作天地等待探索！
          </p>

          <div class="author-signature">
            <p>—— Miles Walker，2024年12月于Blender学习之路</p>
          </div>
        </div>
      </section>
    </div>

    <!-- 作品详情弹窗 -->
    <div v-if="selectedWork" class="work-modal" @click.self="closeWorkDetail">
      <!-- 左侧点击区域 -->
      <div class="modal-click-area modal-click-left" @click="closeWorkDetail"></div>

      <div class="modal-content">
        <button class="close-btn" @click="closeWorkDetail">×</button>
        <div class="modal-image">
          <!-- 视频展示 -->
          <video
            v-if="selectedWork.type === 'video'"
            :src="selectedWork.video"
            :poster="selectedWork.image"
            controls
            muted
            loop
            playsinline
            class="modal-video"
          />
          <!-- 图片展示 -->
          <img v-else :src="selectedWork.image" :alt="selectedWork.title" />
        </div>
        <div class="modal-info">
          <h3>{{ selectedWork.title }}</h3>
          <p class="modal-description">{{ selectedWork.fullDescription }}</p>
          <div class="modal-meta">
            <div class="meta-row">
              <span class="meta-label">学习阶段：</span>
              <span class="learning-stage">{{ selectedWork.learningStage }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">主要工具：</span>
              <span>Blender</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">学习重点：</span>
              <span>{{ selectedWork.learningFocus }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">课程分类：</span>
              <span>{{ selectedWork.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧点击区域 -->
      <div class="modal-click-area modal-click-right" @click="closeWorkDetail"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedWork = ref(null)

// Blender课程学习案例数据
const courseLearningWorks = ref([
  {
    id: 1,
    title: '透明精华水瓶',
    description: '课程案例：透明材质与液体效果练习，重点掌握玻璃质感的制作',
    fullDescription:
      '这是我跟随Blender课程完成的透明材质学习案例。课程提供了基础模型，我主要专注于材质节点的搭建和调整。通过这个练习，我学会了如何在Blender中设置PBR材质，特别是透明玻璃的IOR（折射率）、粗糙度和透射颜色的控制。最大的收获是理解了材质节点编辑器的工作原理，以及如何通过调整参数来模拟真实的玻璃质感和内部液体的视觉效果。',
    image: '/images/3D/精华水.png',
    category: '材质练习',
    tags: ['透明材质', 'PBR材质', '节点编辑'],
    learningStage: '基础阶段',
    learningFocus: '材质制作、透明效果、节点搭建',
  },
  {
    id: 2,
    title: '神秘小蛇场景',
    description: '课程案例：完整场景渲染练习，学习环境光照和构图技巧',
    fullDescription:
      '这是一个综合性的课程练习项目，课程提供了基础场景模型，我的任务是完成材质、光照和渲染设置。通过这个项目，我学会了如何使用HDRI环境光照，掌握了三点光照的基本原理。最有挑战性的部分是调整各种材质的参数，让整个场景看起来和谐统一。这个练习让我理解了光影对氛围营造的重要性，以及如何通过后期渲染设置来增强视觉效果。',
    image: '/images/3D/小蛇场景.png',
    category: '场景渲染',
    tags: ['环境光照', 'HDRI', '场景构图'],
    learningStage: '进阶阶段',
    learningFocus: '光照设置、环境渲染、氛围营造',
  },
  {
    id: 3,
    title: '拿破仑雕像',
    description: '课程案例：经典雕像渲染练习，掌握石材质感和戏剧性光照',
    fullDescription:
      '这个课程案例使用了经典的拿破仑雕像模型，重点学习石材材质的制作和戏剧性光照的布置。我学会了如何通过调整材质的粗糙度、法线贴图和置换贴图来模拟大理石的质感。光照方面，我掌握了如何使用聚光灯营造戏剧性的效果，突出雕像的立体感和细节。这个练习让我理解了材质和光照相互配合的重要性，以及如何通过技术手段来传达艺术感受。',
    image: '/images/3D/拿破伦.png',
    category: '材质渲染',
    tags: ['石材质感', '戏剧光照', '法线贴图'],
    learningStage: '进阶阶段',
    learningFocus: '材质细节、光影塑造、质感表现',
  },
  {
    id: 4,
    title: '现代座椅',
    description: '课程案例：多材质组合练习，学习木材、金属、布料的质感制作',
    fullDescription:
      '这个课程练习专注于多种材质的组合表现。基于课程提供的椅子模型，我需要为不同部分制作相应的材质：木质框架、金属连接件和布料坐垫。通过这个练习，我学会了如何在同一个作品中协调多种不同的材质效果，掌握了木纹、金属反射和布料织物的制作技巧。最重要的收获是理解了真实材质的物理特性如何在数字环境中进行模拟。',
    image: '/images/3D/椅子4.png',
    category: '材质练习',
    tags: ['多材质', '木材质感', '金属反射'],
    learningStage: '中级阶段',
    learningFocus: '材质组合、质感对比、表面细节',
  },
  {
    id: 5,
    title: '几何抽象构成',
    description: '课程案例：基础几何体练习，学习材质和光照的基本原理',
    fullDescription:
      '这是课程中的基础练习项目，使用简单的几何体来学习材质和光照的基本概念。虽然模型简单，但这个练习涵盖了很多重要的基础知识：漫反射、镜面反射、菲涅尔效应等。我学会了如何通过改变材质属性来创造不同的视觉效果，理解了金属度和粗糙度这两个关键参数的作用。这个基础练习为后续更复杂的材质制作打下了扎实的理论基础。',
    image: '/images/3D/几何物体.png',
    category: '基础练习',
    tags: ['几何体', '基础材质', 'PBR原理'],
    learningStage: '入门阶段',
    learningFocus: '基础概念、材质原理、光照理论',
  },
  {
    id: 6,
    title: '现代电脑设备',
    description: '课程案例：硬表面建模练习，从零开始构建电子产品模型',
    fullDescription:
      '这是我在课程中完成的第一个完整建模项目。从基础的立方体开始，逐步学习了硬表面建模的核心技巧：倒角修改器的使用、循环切割工具、以及如何保持模型的拓扑结构清晰。建模过程中最具挑战性的是屏幕的圆角处理和键盘按键的阵列制作。通过这个项目，我掌握了Blender建模工具的基本使用方法，理解了从概念到模型的完整制作流程。',
    image: '/images/3D/电脑.png',
    category: '建模练习',
    tags: ['硬表面建模', '倒角工具', '修改器应用'],
    learningStage: '中级阶段',
    learningFocus: '建模技巧、工具使用、结构设计',
  },
  {
    id: 7,
    title: '流线型吹风机',
    description: '课程案例：曲面建模和产品渲染，学习流线型产品的光影表现',
    fullDescription:
      '这个课程案例基于现有的吹风机模型，重点学习产品级的渲染技巧。我学会了如何设置产品摄影式的光照环境，掌握了HDRI环境贴图的使用方法。材质方面，重点学习了塑料材质的制作，包括如何模拟不同类型的塑料表面：磨砂、光滑、以及带有轻微纹理的表面。这个练习让我理解了产品渲染的专业标准和技术要求。',
    image: '/images/3D/吹风机.png',
    category: '产品渲染',
    tags: ['产品摄影', '塑料材质', 'HDRI光照'],
    learningStage: '中级阶段',
    learningFocus: '产品渲染、光照布置、材质细节',
  },
  {
    id: 8,
    title: '卡通角色三人组',
    description: '课程案例：角色建模练习，学习基础角色建模和卡通渲染技巧',
    fullDescription:
      '这是课程中最有趣的建模项目之一。我从基础的球体和圆柱体开始，学习了角色建模的基本流程。重点掌握了如何使用比例变形来创造卡通风格的角色，学会了面部特征的建模方法。材质方面，我学习了卡通渲染的技巧，包括如何设置简洁的材质和柔和的光照来营造可爱的视觉效果。这个项目让我理解了角色建模与产品建模在思路上的差异。',
    image: '/images/3D/三个呆呆.png',
    category: '角色建模',
    tags: ['角色建模', '卡通风格', '比例设计'],
    learningStage: '进阶阶段',
    learningFocus: '角色建模、卡通渲染、造型设计',
  },
  {
    id: 9,
    title: '小女孩刷手机场景',
    description: '课程案例：角色动画练习，学习基础动画制作和场景叙事技巧',
    fullDescription:
      '这是课程中的角色动画学习案例。基于课程提供的角色模型，我学习了如何为3D角色添加简单的动作和表情。这个练习涵盖了角色绑定的基础概念、关键帧动画的制作方法，以及如何通过动作来表达角色的情绪和故事性。通过制作小女孩刷手机这个日常场景，我理解了动画不仅是技术的展现，更是讲述故事的重要手段。这个项目让我初次接触了3D动画制作的完整流程。',
          image: '/images/3D/小女孩刷手机视频.mp4',
      video: '/images/3D/小女孩刷手机视频.mp4',
    category: '角色动画',
    tags: ['角色动画', '场景叙事', '关键帧动画'],
    learningStage: '进阶阶段',
    learningFocus: '动画制作、角色表演、场景叙事',
    type: 'video',
  },
])

// 独立创作作品数据
const independentWorks = ref([
  {
    id: 1,
    title: '珍珠女孩角色建模',
    description:
      '基于课程学习的角色建模技巧，独立创作的卡通女孩角色。专注于细节表现和整体氛围营造。',
    fullDescription:
      '这是我独立创作的珍珠女孩角色建模作品。在掌握了课程中的角色建模基础后，我开始尝试独立创作更具个人风格的角色。这个作品融合了我对角色设计的理解和3D建模技巧的运用。我特别注重了角色的整体比例、面部特征的细节表现，以及整体氛围的营造。通过这次独立创作，我不仅巩固了技术技能，也培养了自己的创作思维和艺术表达能力。',
    image: '/images/3D/珍珠女孩.png',
    category: '角色创作',
    tags: ['角色建模', '卡通风格', '独立创作'],
    learningStage: '创作阶段',
    learningFocus: '角色设计、细节雕琢、氛围营造',
    type: 'image',
  },
  {
    id: 2,
    title: '梦幻海岛场景',
    description: '独立创作的3D海岛场景，融合了建模、材质、光照和动画技巧，展现完整的环境设计能力。',
    fullDescription:
      '这是我独立创作的梦幻海岛场景作品，是我3D学习历程中一个重要的里程碑。这个项目综合运用了建模、材质制作、环境光照和简单动画等多项技能。海岛场景包含了海岸线设计、植被布置、建筑结构和环境氛围营造。我特别关注了整体的构图平衡和色彩搭配，力求创造一个既有视觉冲击力又充满细节的虚拟世界。这个项目不仅展现了我的技术进步，也体现了我对完整场景设计的理解。',
    image: '/images/3D/海岛.png',
    video: '/images/3D/海岛视频.mp4',
    category: '场景设计',
    tags: ['场景建模', '环境设计', '综合创作'],
    learningStage: '高级创作阶段',
    learningFocus: '环境设计、场景构建、综合技能运用',
    type: 'video',
  },
  {
    id: 3,
    title: '悬浮按钮界面设计',
    description: '运用3D技术设计的现代化界面元素，探索3D在UI设计中的应用可能性。',
    fullDescription:
      '这是我独立创作的悬浮按钮界面设计作品。在学习了3D建模和渲染技巧之后，我开始思考如何将3D技术应用到界面设计中。这个悬浮按钮设计融合了现代UI设计理念和3D视觉效果，展现了3D技术在用户界面设计中的创新应用可能性。我特别关注了按钮的立体感、光影效果和交互视觉反馈，力求在视觉吸引力和实用性之间找到平衡。',
    image: '/images/3D/悬浮按钮.png',
    category: '界面设计',
    tags: ['UI设计', '界面元素', '创新应用'],
    learningStage: '创作阶段',
    learningFocus: 'UI设计、3D界面、视觉创新',
    type: 'image',
  },
])

// 打开作品详情
const openWorkDetail = work => {
  selectedWork.value = work
  document.body.style.overflow = 'hidden'
}

// 关闭作品详情
const closeWorkDetail = () => {
  selectedWork.value = null
  document.body.style.overflow = 'auto'
}

// 视频播放控制
const playVideo = event => {
  if (event.target.tagName === 'VIDEO') {
    event.target.play()
  }
}

const pauseVideo = event => {
  if (event.target.tagName === 'VIDEO') {
    event.target.pause()
  }
}
</script>

<style scoped>
.modeling-journey-article {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  line-height: 1.7;
  color: #333;
}

/* 文章头部 */
.article-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  padding: 50px 40px;
  margin-bottom: 40px;
  text-align: center;
}

.article-header h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  font-size: 0.95rem;
  opacity: 0.9;
}

.article-intro {
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.95;
  max-width: 800px;
  margin: 0 auto;
}

.article-container {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

/* 章节标题 */
section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
  position: relative;
}

.section-intro {
  font-size: 1.05rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.7;
}

/* 时间线样式 */
.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -35px;
  top: 25px;
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 0 0 3px #667eea;
}

.timeline-date {
  color: #667eea;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.timeline-content h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.timeline-content p {
  color: #666;
  margin-bottom: 15px;
}

.skills-learned {
  background: #e8f0fe;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-size: 0.95rem;
  color: #555;
}

/* 作品展示分区 */
.work-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 1.5rem;
  color: #667eea;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #667eea;
  background: linear-gradient(135deg, #f5f7ff 0%, #e8f0fe 100%);
  padding: 15px 20px;
  border-radius: 10px;
}

/* 作品展示网格 */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.work-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.work-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.work-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.work-card:hover .work-image img {
  transform: scale(1.05);
}

.work-overlay {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.work-category {
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
}

.learning-stage {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.work-info {
  padding: 25px;
}

.work-info h3 {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: #333;
}

.work-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

.work-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #888;
}

.work-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 独立创作作品网格 */
.independent-works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.independent-work-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.independent-work-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.independent-work-card .work-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.independent-work-card .work-image img,
.independent-work-card .work-image video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.work-video {
  background: #000;
}

.work-video::-webkit-media-controls {
  display: none !important;
}

.independent-work-card:hover .work-image img,
.independent-work-card:hover .work-image video {
  transform: scale(1.05);
}

.independent-work-card .work-overlay {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.independent-work-card .work-category {
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.creation-type {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.media-type {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  margin-top: 5px;
}

.independent-work-card .work-info {
  padding: 25px;
}

.independent-work-card .work-info h3 {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: #333;
}

.independent-work-card .work-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

.independent-work-card .work-meta {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.creation-focus {
  color: #667eea;
  font-weight: bold;
  font-size: 0.95rem;
}

.independent-work-card .work-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.independent-work-card .tag {
  background: linear-gradient(135deg, #e3f2fd 0%, #f1f8ff 100%);
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

/* 技术心得网格 */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.insight-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-top: 4px solid #667eea;
}

.insight-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.4rem;
}

.insight-content h4 {
  color: #667eea;
  margin: 20px 0 10px 0;
  font-size: 1.1rem;
}

.insight-content p {
  color: #666;
  line-height: 1.7;
  margin-bottom: 15px;
}

/* 挑战列表 */
.challenge-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.challenge-item {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #ff6b6b;
}

.challenge-item h3 {
  color: #ff6b6b;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.challenge-item p {
  margin-bottom: 10px;
  line-height: 1.6;
}

.challenge-item strong {
  color: #333;
}

/* 资源推荐网格 */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.resource-category {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.resource-category h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.resource-category ul {
  list-style: none;
  padding: 0;
}

.resource-category li {
  color: #666;
  line-height: 1.8;
  margin-bottom: 12px;
  padding-left: 20px;
  position: relative;
}

.resource-category li::before {
  content: '▶';
  color: #667eea;
  position: absolute;
  left: 0;
  font-size: 0.8rem;
}

.resource-category strong {
  color: #333;
}

/* 未来计划 */
.plans-content p {
  font-size: 1.05rem;
  color: #666;
  margin-bottom: 25px;
  line-height: 1.7;
}

.plan-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.plan-item {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
}

.plan-item h3 {
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.plan-item p {
  line-height: 1.6;
  opacity: 0.95;
}

/* 结语部分 */
.conclusion-content {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #e9ecef;
}

.conclusion-content p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
}

.author-signature {
  text-align: right;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.author-signature p {
  color: #888;
  font-style: italic;
  margin: 0;
}

/* 模态框样式 */
.work-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

/* 左右点击区域 */
.modal-click-area {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  cursor: pointer;
  z-index: 999;
}

.modal-click-left {
  left: 0;
}

.modal-click-right {
  right: 0;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: calc(100% - 100px);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 1001;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  z-index: 1001;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.modal-image {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  max-height: 500px;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  background: #f8f9fa;
}

.modal-image img,
.modal-image video {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
}

.modal-video {
  background: #000;
}

.modal-info {
  padding: 30px;
}

.modal-info h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
}

.modal-description {
  color: #666;
  line-height: 1.8;
  margin-bottom: 25px;
  font-size: 1.05rem;
}

.modal-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
}

.meta-label {
  color: #333;
  font-weight: bold;
  min-width: 80px;
}

/* 独立创作作品网格 */
.independent-works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.independent-work-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.independent-work-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.independent-work-card .work-image {
  height: 250px;
}

.independent-work-card .work-overlay {
  top: 15px;
  left: 15px;
  right: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.independent-work-card .work-category {
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
}

.independent-work-card .creation-type {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.independent-work-card .work-info {
  padding: 25px;
}

.independent-work-card .work-info h3 {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: #333;
}

.independent-work-card .work-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

.independent-work-card .work-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #888;
}

.independent-work-card .creation-focus {
  color: #667eea;
  font-weight: bold;
  font-size: 1.1rem;
}

.independent-work-card .work-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.independent-work-card .tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modeling-journey-article {
    padding: 15px;
  }

  .article-header {
    padding: 30px 20px;
  }

  .article-header h1 {
    font-size: 1.8rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 10px;
  }

  .works-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid,
  .resources-grid,
  .plan-items {
    grid-template-columns: 1fr;
  }

  .timeline {
    padding-left: 30px;
  }

  .modal-content {
    width: calc(100% - 60px);
    margin: 10px;
  }

  .modal-click-area {
    width: 40%;
  }

  .work-meta {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  section h2 {
    font-size: 1.5rem;
  }

  .work-card {
    margin-bottom: 20px;
  }

  .insight-card,
  .challenge-item,
  .resource-category {
    padding: 20px;
  }
}
</style>
