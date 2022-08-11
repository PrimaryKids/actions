import { promises as fs } from 'fs'
import { scoresToDataPoints } from './datadogUtils'

const JSON_REPORT_FILENAME_REGEXP = /lhr-\d+\.json$/

export const extractReportFileNames = async () => {
  const allReports = await fs.readdir(process.env['INPUT-RESULTS-PATH'] as string)
  const jsonReports = allReports.filter((fileName: string) => {
    return JSON_REPORT_FILENAME_REGEXP.test(fileName)
  })
  return jsonReports
}

export const parseResults = async (fileName: string) => {
  const filePath = `${process.env['INPUT-RESULTS-PATH']}/${fileName}`
  const report = await fs.readFile(filePath, 'utf8')

  const reportTimeStamp = fileName.match(/\d+/)?.[0]
  const rawTimeStamp = reportTimeStamp
    ? Number(reportTimeStamp) / 1000
    : new Date().getTime() / 1000
  const timeStamp = `${Math.floor(rawTimeStamp)}`
  const dataPoints = scoresToDataPoints(JSON.parse(report))

  return {
    timeStamp,
    dataPoints,
  }
}
