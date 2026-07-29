import { Component } from '@geajs/core'
import { hero, links } from '../data/content'
import CtaButton from './CtaButton'

export default class Hero extends Component {
  template() {
    return (
      <section class="hero" aria-label="Introduction">
        <div class="hero__inner">
          {/*
          Remove brandmark for now
          <img class="hero__brandmark" src="/brandmark.png" alt="ADVANCE TRAUMA brandmark" />
          */}
          <h1 class="hero__title">{hero.title}</h1>
          <p class="hero__tagline">{hero.tagline}</p>
          <p class="hero__lead">{hero.lead}</p>
          <div class="hero__ctas">
            <CtaButton href={links.publication} external>
              Publication in Trials
            </CtaButton>
            <CtaButton href={links.protocol} download>
              Download Protocol
            </CtaButton>
            <CtaButton href={links.clinicalTrials} external variant="ghost">
              ClinicalTrials.gov
            </CtaButton>
          </div>
        </div>
      </section>
    )
  }
}
