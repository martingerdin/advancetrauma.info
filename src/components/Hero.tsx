import { Component } from '@geajs/core'
import { hero } from '../data/content'
import { scrollToSection } from '../lib/scroll-to-section'

export default class Hero extends Component {
  template() {
    return (
      <section class="hero" aria-label="Introduction">
        <div class="hero__inner">
          <h1 class="hero__title">{hero.title}</h1>
          <p class="hero__tagline">{hero.tagline}</p>
          <dl class="hero__details">
            <div class="hero__detail">
              <dt>Start</dt>
              <dd>{hero.details.startDate}</dd>
            </div>
            <div class="hero__detail">
              <dt>End</dt>
              <dd>{hero.details.endDate}</dd>
            </div>
            <div class="hero__detail">
              <dt>Target</dt>
              <dd>{hero.details.target}</dd>
            </div>
            <div class="hero__detail">
              <dt>Status</dt>
              <dd>{hero.details.status}</dd>
            </div>
          </dl>
          <a
            class="cta"
            href="#about"
            click={(e: Event) => scrollToSection(e, 'about')}
          >
            {hero.cta}
          </a>
        </div>
      </section>
    )
  }
}
