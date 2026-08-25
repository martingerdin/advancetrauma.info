import { Component } from '@geajs/core'
import { getTrialProgressSnapshot } from '../lib/trial-progress'

type TrialProgressVariant = 'hero' | 'header'

export default class TrialProgress extends Component<{
  variant?: TrialProgressVariant
}> {
  private get snapshot() {
    return getTrialProgressSnapshot()
  }

  template() {
    const variant = this.props.variant ?? 'hero'
    const {
      percent,
      includedPatientsLabel,
      completedPeriods,
      totalPeriods,
      statusLabel,
    } = this.snapshot

    if (variant === 'header') {
      return (
        <div
          class="trial-progress trial-progress--header"
          aria-label={`Trial progress: ${percent}%, ${includedPatientsLabel} patients included, ${statusLabel}`}
        >
          <div
            class="trial-progress__bar"
            role="progressbar"
            aria-valuenow={String(percent)}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Trial progress"
          >
            <div class="trial-progress__bar-fill" style={`width: ${percent}%`} />
          </div>
          <span class="trial-progress__count">{includedPatientsLabel}</span>
          <span class="status-pill status-pill--live status-pill--compact">{statusLabel}</span>
        </div>
      )
    }

    return (
      <div class="trial-progress trial-progress--hero">
        <div class="trial-progress__top">
          <span class="status-pill status-pill--live">{statusLabel}</span>
          <span class="trial-progress__percent">{percent}%</span>
        </div>
        <div
          class="trial-progress__bar"
          role="progressbar"
          aria-valuenow={String(percent)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Trial progress"
        >
          <div class="trial-progress__bar-fill" style={`width: ${percent}%`} />
        </div>
        <p class="trial-progress__meta">
          <span class="trial-progress__patients">{includedPatientsLabel} patients included</span>
          <span class="trial-progress__periods">
            {completedPeriods} / {totalPeriods} periods
          </span>
        </p>
      </div>
    )
  }
}
