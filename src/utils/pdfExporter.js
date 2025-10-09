/**
 * PDF 导出工具
 * 使用 html2pdf.js 将 HTML 元素导出为 PDF 文件
 */

import html2pdf from 'html2pdf.js'

/**
 * 导出元素为 PDF
 * @param {HTMLElement} element - 要导出的 DOM 元素
 * @param {Object} options - 导出选项
 * @returns {Promise} - Promise 对象
 */
export async function exportToPDF(element, options = {}) {
  const defaultOptions = {
    margin: [10, 10],
    filename: `resume-${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    await html2pdf().set(mergedOptions).from(element).save()
    return { success: true }
  } catch (error) {
    console.error('PDF 导出失败:', error)
    return { success: false, error }
  }
}

/**
 * 导出简历为 PDF
 * @param {HTMLElement} element - 简历预览元素
 * @param {String} fileName - 文件名（不含扩展名）
 * @param {Object} customOptions - 自定义选项
 * @returns {Promise}
 */
export async function exportResumePDF(element, fileName = 'resume', customOptions = {}) {
  const options = {
    margin: [10, 10, 10, 10],
    filename: `${fileName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    },
    ...customOptions,
  }

  return exportToPDF(element, options)
}

/**
 * 获取 PDF Blob 对象（用于预览或上传）
 * @param {HTMLElement} element - 要转换的 DOM 元素
 * @param {Object} options - 导出选项
 * @returns {Promise<Blob>}
 */
export async function getPDFBlob(element, options = {}) {
  const defaultOptions = {
    margin: [10, 10],
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    const pdf = await html2pdf().set(mergedOptions).from(element).output('blob')
    return pdf
  } catch (error) {
    console.error('生成 PDF Blob 失败:', error)
    throw error
  }
}

/**
 * 在新窗口预览 PDF
 * @param {HTMLElement} element - 要预览的 DOM 元素
 * @param {Object} options - 导出选项
 * @returns {Promise}
 */
export async function previewPDF(element, options = {}) {
  try {
    const blob = await getPDFBlob(element, options)
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    // 延迟释放 URL 以确保窗口已加载
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return { success: true }
  } catch (error) {
    console.error('PDF 预览失败:', error)
    return { success: false, error }
  }
}

/**
 * 打印 PDF（直接打印，不下载）
 * @param {HTMLElement} element - 要打印的 DOM 元素
 * @param {Object} options - 导出选项
 * @returns {Promise}
 */
export async function printPDF(element, options = {}) {
  try {
    const blob = await getPDFBlob(element, options)
    const url = URL.createObjectURL(blob)
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    document.body.appendChild(iframe)

    iframe.onload = () => {
      iframe.contentWindow.print()
      setTimeout(() => {
        document.body.removeChild(iframe)
        URL.revokeObjectURL(url)
      }, 1000)
    }

    return { success: true }
  } catch (error) {
    console.error('PDF 打印失败:', error)
    return { success: false, error }
  }
}

/**
 * 从 Pinia Store 生成 PDF
 * 直接从简历 store 读取数据并生成 PDF
 *
 * @param {Object} resumeStore - Pinia 简历 store 实例
 * @param {Object} options - 导出选项
 * @returns {Promise}
 *
 * @example
 * import { useResumeStore } from '@/stores/resumeStore'
 * const resumeStore = useResumeStore()
 * await exportResumeFromStore(resumeStore, {
 *   fileName: '张三-前端工程师-简历',
 *   template: 'modern'
 * })
 */
export async function exportResumeFromStore(resumeStore, options = {}) {
  const {
    fileName = generateFileName(resumeStore.resumeData),
    template = resumeStore.selectedTemplate || 'modern',
    includeTargetJob = false,
  } = options

  try {
    // 创建临时 HTML 元素用于渲染简历
    const resumeHTML = generateResumeHTML(resumeStore.resumeData, {
      template,
      themeColor: resumeStore.themeColor,
      includeTargetJob,
    })

    const tempElement = document.createElement('div')
    tempElement.innerHTML = resumeHTML
    tempElement.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 210mm;
      background: white;
      padding: 20mm;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    `

    document.body.appendChild(tempElement)

    // 导出 PDF
    const result = await exportResumePDF(tempElement, fileName, {
      margin: [15, 15, 15, 15],
    })

    // 清理临时元素
    document.body.removeChild(tempElement)

    return result
  } catch (error) {
    console.error('从 Store 导出 PDF 失败:', error)
    return { success: false, error }
  }
}

/**
 * 生成简历 HTML 内容
 * @private
 */
function generateResumeHTML(resumeData, options = {}) {
  const { template = 'modern', themeColor = '#667eea', includeTargetJob = false } = options

  const {
    fullName,
    title,
    email,
    phone,
    location,
    website,
    targetJob,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData

  // 处理技能列表
  const skillsList = Array.isArray(skills) ? skills : skills.split('\n').filter(s => s.trim())

  // 生成 HTML
  return `
    <div class="resume-container" style="color: #2d3748; line-height: 1.6;">
      <!-- 头部 -->
      <header style="margin-bottom: 30px; border-bottom: 3px solid ${themeColor}; padding-bottom: 20px;">
        <h1 style="margin: 0 0 10px 0; font-size: 32px; color: ${themeColor};">${fullName || '姓名'}</h1>
        <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #4a5568; font-weight: normal;">${title || '职位'}</h2>
        ${includeTargetJob && targetJob ? `<p style="margin: 0 0 10px 0; color: #718096;"><strong>目标岗位：</strong>${targetJob}</p>` : ''}
        <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px; color: #718096;">
          ${email ? `<span>📧 ${email}</span>` : ''}
          ${phone ? `<span>📱 ${phone}</span>` : ''}
          ${location ? `<span>📍 ${location}</span>` : ''}
          ${website ? `<span>🌐 ${website}</span>` : ''}
        </div>
      </header>

      <!-- 个人简介 -->
      ${
        summary
          ? `
        <section style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 12px 0; font-size: 18px; color: ${themeColor}; border-left: 4px solid ${themeColor}; padding-left: 10px;">个人简介</h3>
          <div style="font-size: 14px; color: #4a5568; line-height: 1.8;">${summary.replace(/<[^>]*>/g, '')}</div>
        </section>
      `
          : ''
      }

      <!-- 工作经历 -->
      ${
        experience.length > 0 && experience[0].company
          ? `
        <section style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 18px; color: ${themeColor}; border-left: 4px solid ${themeColor}; padding-left: 10px;">工作经历</h3>
          ${experience
            .map(
              exp => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong style="font-size: 16px; color: #2d3748;">${exp.company || ''} - ${exp.position || ''}</strong>
                <span style="color: #718096; font-size: 14px;">${exp.startDate || ''} - ${exp.endDate || ''}</span>
              </div>
              <div style="font-size: 14px; color: #4a5568; line-height: 1.8;">${exp.description ? exp.description.replace(/<[^>]*>/g, '') : ''}</div>
            </div>
          `
            )
            .join('')}
        </section>
      `
          : ''
      }

      <!-- 项目经验 -->
      ${
        projects.length > 0 && projects[0].name
          ? `
        <section style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 18px; color: ${themeColor}; border-left: 4px solid ${themeColor}; padding-left: 10px;">项目经验</h3>
          ${projects
            .map(
              proj => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong style="font-size: 16px; color: #2d3748;">${proj.name || ''} ${proj.role ? `- ${proj.role}` : ''}</strong>
                <span style="color: #718096; font-size: 14px;">${proj.startDate || ''} - ${proj.endDate || ''}</span>
              </div>
              ${proj.description ? `<div style="font-size: 14px; color: #4a5568; line-height: 1.8; margin-bottom: 8px;">${proj.description.replace(/<[^>]*>/g, '')}</div>` : ''}
              ${
                proj.technologies && proj.technologies.length > 0
                  ? `<div style="font-size: 13px; color: #718096;">技术栈：${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</div>`
                  : ''
              }
              ${proj.url ? `<div style="font-size: 13px; color: #718096;">项目链接：${proj.url}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </section>
      `
          : ''
      }

      <!-- 教育背景 -->
      ${
        education.length > 0 && education[0].school
          ? `
        <section style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 18px; color: ${themeColor}; border-left: 4px solid ${themeColor}; padding-left: 10px;">教育背景</h3>
          ${education
            .map(
              edu => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong style="font-size: 15px; color: #2d3748;">${edu.school || ''}</strong>
                <span style="color: #718096; font-size: 14px;">${edu.startDate || ''} - ${edu.endDate || ''}</span>
              </div>
              <div style="font-size: 14px; color: #4a5568;">${edu.degree || ''}</div>
              ${edu.gpa ? `<div style="font-size: 13px; color: #718096;">GPA: ${edu.gpa}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </section>
      `
          : ''
      }

      <!-- 技能 -->
      ${
        skillsList.length > 0
          ? `
        <section style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 18px; color: ${themeColor}; border-left: 4px solid ${themeColor}; padding-left: 10px;">专业技能</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${skillsList
              .map(
                skill => `
              <span style="display: inline-block; padding: 6px 14px; background: #f7fafc; color: #4a5568; border-radius: 20px; font-size: 13px;">${skill}</span>
            `
              )
              .join('')}
          </div>
        </section>
      `
          : ''
      }
    </div>
  `
}

/**
 * 生成文件名
 * @private
 */
function generateFileName(resumeData) {
  const { fullName, title, targetJob } = resumeData
  const namePart = fullName || '简历'
  const jobPart = targetJob || title || '通用'
  const timestamp = new Date().toISOString().split('T')[0]

  return `${namePart}-${jobPart}-${timestamp}`
}
