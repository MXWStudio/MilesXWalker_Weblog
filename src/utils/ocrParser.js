import Tesseract from 'tesseract.js'

export async function extractTextFromImage(imageFile) {
  const { data: { text } } = await Tesseract.recognize(imageFile, 'chi_sim')
  return text
}