import * as httpm from '@actions/http-client'
import _get from 'lodash.get'
import { MetricData, DataPoint, JSReport, NetworkAsset } from './types'

const _http = new httpm.HttpClient('lighthouse-datadog-report')

const METRIC_SCORE_MAP = {
  // General scores
  performance: 'categories.performance.score',
  accessibility: 'categories.accessibility.score',
  seo: 'categories.seo.score',
  best_practices: 'categories.["best-practices"].score',
  pwa: 'categories.pwa.score',
  // Performance breakdown
  first_contentful_paint: 'audits["first-contentful-paint"].numericValue',
  speed_index: 'audits["speed-index"].numericValue',
  largest_contentful_paint: 'audits["largest-contentful-paint"].numericValue',
  time_to_interactive: 'audits["interactive"].numericValue',
  total_blocking_time: 'audits["total-blocking-time"].numericValue',
  cumulative_layout_shift: 'audits["cumulative-layout-shift"].numericValue',
  server_response_time: 'audits["server-response-time"].numericValue',
}

export const sendMetric = (data: MetricData) => {
  return _http.postJson(`${process.env.INPUT_DATADOG_HOST}/api/v1/series`, data, {
    'DD-API-KEY': process.env.INPUT_DATADOG_API_KEY as string,
  })
}

export const toMetricDataPoint = (
  metricNameSpace: string,
  timeStamp: string,
  dataPoint: DataPoint
): MetricData => ({
  series: [
    {
      host: 'lighthouse',
      type: 'gauge',
      metric: `lighthouse.${dataPoint.metricName}.${metricNameSpace}`,
      points: [[timeStamp, dataPoint.value]],
    },
  ],
})

const pickReportScores = (jsReport: JSReport) =>
  Object.entries(METRIC_SCORE_MAP).map(([metricName, scorePath]) => ({
    metricName,
    value: _get(jsReport, scorePath),
  }))

const getScriptsSize = (jsReport: JSReport): number =>
  (jsReport.audits['network-requests'] as Record<string, { items: NetworkAsset[] }>).details.items
    .filter((asset: NetworkAsset) => asset.resourceType === 'Script')
    .reduce((totalSize: number, asset: NetworkAsset) => totalSize + asset.transferSize, 0)

export const scoresToDataPoints = (jsReport: JSReport): DataPoint[] => {
  return [
    ...pickReportScores(jsReport),
    {
      metricName: 'total_bundle_size',
      value: `${getScriptsSize(jsReport)}`,
    },
  ]
}
