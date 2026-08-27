import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

async function extractFromPdf(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pageTexts = []
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    pageTexts.push(content.items.map((item) => item.str).join(' '))
  }
  return pageTexts.join('\n')
}

async function extractFromDocx(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export async function extractResumeText(file) {
  const name = file.name.toLowerCase()
  const arrayBuffer = await file.arrayBuffer()

  if (name.endsWith('.pdf')) {
    return extractFromPdf(arrayBuffer)
  }
  if (name.endsWith('.docx')) {
    return extractFromDocx(arrayBuffer)
  }
  if (name.endsWith('.txt')) {
    return new TextDecoder('utf-8').decode(arrayBuffer)
  }
  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.')
}
