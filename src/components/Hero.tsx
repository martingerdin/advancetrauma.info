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
          <a
            class="cta"
            href="#about"
            click={(e: Event) => scrollToSection(e, 'about')}
          >
            Learn more about the trial
          </a>
        </div>
      </section>
    )
  }
}
