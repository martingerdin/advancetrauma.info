import { Component } from '@geajs/core'
import { hero } from '../data/content'
import { scrollToSection } from '../lib/scroll-to-section'

const details = Object.entries(hero.details).map(([label, value]) => ({ label, value }))

export default class Hero extends Component {
  template() {
    return (
      <section class="hero" aria-label="Introduction">
        <div class="hero__inner">
          <h1 class="hero__title">{hero.title}</h1>
          <p class="hero__tagline">{hero.tagline}</p>
          <dl class="hero__details">
            {details.map((detail) => (
              <div class="hero__detail">
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
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
