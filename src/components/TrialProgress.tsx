import { Component } from '@geajs/core'
import { hero } from '../data/content'
import { getTrialProgressSnapshot } from '../lib/trial-progress'

type TrialProgressVariant = 'hero' | 'header'

export default class TrialProgress extends Component<{
  variant?: TrialProgressVariant
}> {
  private get snapshot() {
    return getTrialProgressSnapshot()
  }

  private applyFillWidth() {
    const fill = this.el?.querySelector('.trial-progress__bar-fill') as HTMLElement | null
    if (fill) fill.style.width = `${this.snapshot.percent}%`
  }

  onAfterRender() {
    this.applyFillWidth()
  }

  template() {
    const variant = this.props.variant ?? 'hero'
    const { percent, includedPatientsLabel, statusLabel } = this.snapshot
    const title = hero.details[3].label

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
            <div class="trial-progress__bar-fill" />
          </div>
          <span class="trial-progress__count">{includedPatientsLabel}</span>
          <span class="status-pill status-pill--live status-pill--compact">{statusLabel}</span>
        </div>
      )
    }

    return (
      <div
        class="trial-progress trial-progress--hero"
        aria-label={`Trial progress: ${percent}%, ${includedPatientsLabel} patients included, ${statusLabel}`}
      >
        <p class="trial-progress__title">{title}</p>
        <div class="trial-progress__row">
          <span class="status-pill status-pill--live">{statusLabel}</span>
          <div
            class="trial-progress__bar"
            role="progressbar"
            aria-valuenow={String(percent)}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Trial progress"
          >
            <div class="trial-progress__bar-fill" />
          </div>
          <p class="trial-progress__meta">
            <span class="trial-progress__percent">{percent}%</span>
            <span class="trial-progress__patients">{includedPatientsLabel} patients</span>
          </p>
        </div>
      </div>
    )
  }
}
