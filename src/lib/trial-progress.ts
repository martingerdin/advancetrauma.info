import { trialProgressConfig, totalTrialPeriods } from '../data/trial-progress'
import { getBatchStatus, siteBatches } from '../data/sites'

function parseYearMonth(value: string): { year: number; month: number } {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

/** Inclusive calendar months elapsed since batch start (period 1 = start month). */
export function countElapsedPeriods(startMonth: string, now = new Date()): number {
  const { year, month } = parseYearMonth(startMonth)
  const start = new Date(year, month - 1, 1)
  const current = new Date(now.getFullYear(), now.getMonth(), 1)
  if (current < start) return 0

  return (
    (current.getFullYear() - start.getFullYear()) * 12 +
    (current.getMonth() - start.getMonth()) +
    1
  )
}

export function getCompletedTrialPeriods(now = new Date()): number {
  const { clustersPerBatch, periodsPerCluster } = trialProgressConfig
  let completed = 0

  for (const batch of siteBatches) {
    const status = getBatchStatus(batch, now)

    if (status === 'upcoming' || status === 'starting' || status === 'screening') {
      continue
    }

    if (status === 'completed') {
      completed += clustersPerBatch * periodsPerCluster
      continue
    }

    if (!batch.start) continue

    const periods = Math.min(countElapsedPeriods(batch.start, now), periodsPerCluster)
    completed += clustersPerBatch * periods
  }

  return completed
}

export function getTrialProgressPercent(now = new Date()): number {
  if (totalTrialPeriods === 0) return 0
  return Math.min(100, Math.round((getCompletedTrialPeriods(now) / totalTrialPeriods) * 100))
}

export function formatTrialCount(value: number): string {
  return value.toLocaleString('en-GB')
}

export function getTrialProgressSnapshot(now = new Date()) {
  const completedPeriods = getCompletedTrialPeriods(now)
  const percent = getTrialProgressPercent(now)

  return {
    completedPeriods,
    totalPeriods: totalTrialPeriods,
    percent,
    includedPatients: trialProgressConfig.includedPatients,
    targetPatients: trialProgressConfig.targetPatients,
    statusLabel: trialProgressConfig.statusLabel,
    includedPatientsLabel: formatTrialCount(trialProgressConfig.includedPatients),
    targetPatientsLabel: formatTrialCount(trialProgressConfig.targetPatients),
  }
}
