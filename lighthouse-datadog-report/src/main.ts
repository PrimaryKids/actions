import { sendMetric, toMetricDataPoint } from './datadogUtils'
import { parseResults, extractReportFileNames } from './reportUtils'

export const main = async (namespace: string) => {
  const jsonReports = await extractReportFileNames()

  const promises = jsonReports.map(async (fileName) => {
    const { timeStamp, dataPoints } = await parseResults(fileName)

    return dataPoints.map((dataPoint) => {
      return sendMetric(toMetricDataPoint(namespace, timeStamp, dataPoint))
    })
  })

  await Promise.all(promises)
}
