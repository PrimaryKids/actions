export interface DataPoint {
  metricName: string
  value: string
}
interface MetricDataPoint {
  host: string
  metric: string
  points: [string, string][]
  type: string
}
export interface MetricData {
  series: MetricDataPoint[]
}

export interface NetworkAsset {
  resourceType: string
  transferSize: number
}

export interface JSReport {
  audits: Record<string, unknown>
  categories: Record<string, unknown>
}
