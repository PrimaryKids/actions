import * as core from '@actions/core'
import { main } from './main'

const run = async (): Promise<void> => {
  try {
    const metricNamespace = core.getInput('metric-namespace', { required: true })
    await main(metricNamespace)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
