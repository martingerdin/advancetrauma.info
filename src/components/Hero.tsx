import { Component } from '@geajs/core'
import { hero, links } from '../data/content'
import { scrollToSection } from '../lib/scroll-to-section'
import CtaButton from './CtaButton'

export default class Hero extends Component {
  template() {
    return (
      <section class="hero" aria-label="Introduction">
        <div class="hero__inner">
          <h1 class="hero__title">{hero.title}</h1>
          <p class="hero__tagline">{hero.tagline}</p>
          <p class="hero__lead">{hero.lead}</p>
          <div class="hero__ctas">
            <CtaButton href="#summary" click={(e: Event) => scrollToSection(e, 'summary')}>
              Learn more about the trial
            </CtaButton>
          </div>
          <p class="hero__resources">
            <a href={links.protocol} download>
              Protocol
            </a>
            <span aria-hidden="true">·</span>
            <a href={links.publication} target="_blank" rel="noopener noreferrer">
              Publication
            </a>
            <span aria-hidden="true">·</span>
            <a href={links.clinicalTrials} target="_blank" rel="noopener noreferrer">
              ClinicalTrials.gov
            </a>
          </p>
        </div>
      </section>
    )
  }
}
