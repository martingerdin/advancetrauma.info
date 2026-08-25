/** Trial-wide progress constants — see protocol stepped-wedge design. */
export const trialProgressConfig = {
  batchCount: 6,
  clustersPerBatch: 5,
  periodsPerCluster: 13,
  targetPatients: 4320,
  /**
   * Total patients included to date. Update from TMG reporting
   * (advance-trauma-trial/meetings/trial-management-group).
   */
  includedPatients: 1_700,
  statusLabel: 'Ongoing',
} as const

export const totalTrialPeriods =
  trialProgressConfig.batchCount *
  trialProgressConfig.clustersPerBatch *
  trialProgressConfig.periodsPerCluster
