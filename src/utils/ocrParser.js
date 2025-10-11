import Tesseract from 'tesseract.js'

/**
 * 压缩图片到合适的大小
 * @param {File} file - 原始图片文件
 * @param {number} maxWidth - 最大宽度（默认1200px）
 * @param {number} quality - 压缩质量（默认0.8）
 * @returns {Promise<Blob>} 压缩后的图片
 */
async function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 如果图片宽度超过最大宽度，按比例缩小
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          blob => {
            if (blob) {
              console.log(
                `✅ 图片压缩完成: ${(file.size / 1024).toFixed(2)}KB → ${(blob.size / 1024).toFixed(2)}KB`
              )
              resolve(blob)
            } else {
              reject(new Error('图片压缩失败'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => reject(new Error('图片加载失败'))
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
  })
}

/**
 * 从图片中提取文本（OCR）
 * @param {File} imageFile - 图片文件
 * @returns {Promise<string>} 识别出的文本
 */
export async function extractTextFromImage(imageFile) {
  try {
    console.log(`📷 开始处理图片: ${(imageFile.size / 1024).toFixed(2)}KB`)

    // 1. 压缩图片（减少OCR处理时间和识别内容量）
    const compressedImage = await compressImage(imageFile, 1200, 0.8)

    // 2. OCR识别
    console.log('🔍 正在进行OCR识别...')
    const {
      data: { text },
    } = await Tesseract.recognize(compressedImage, 'chi_sim')

    console.log(`✅ OCR识别完成，文本长度: ${text.length} 字符`)

    return text
  } catch (error) {
    console.error('❌ OCR处理失败:', error)
    throw new Error(`图片文字识别失败: ${error.message}`)
  }
}
