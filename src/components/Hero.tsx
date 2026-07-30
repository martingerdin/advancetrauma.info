import { Component } from '@geajs/core'
import { hero } from '../data/content'
import { scrollToSection } from '../lib/scroll-to-section'
import HeroVideo, { hasHeroVideo, playHeroVideo } from './HeroVideo'

export default class Hero extends Component {
  template() {
    return (
      <section class="hero" aria-label="Introduction">
        <div class="hero__inner">
          <div class="hero__copy">
            <p class="hero__eyebrow">{hero.eyebrow}</p>
            <h1 class="hero__tagline">{hero.tagline}</h1>
            <div class="hero__actions">
              <a
                class="cta"
                href="#about"
                click={(e: Event) => scrollToSection(e, 'about')}
              >
                {hero.cta}
              </a>
              {hasHeroVideo ? (
                <a class="cta cta--ghost" href="#hero-video" click={playHeroVideo}>
                  {hero.ctaSecondary}
                </a>
              ) : null}
            </div>
            <dl class="hero__details">
              <div class="hero__detail">
                <dt>{hero.details[0].label}</dt>
                <dd>{hero.details[0].value}</dd>
              </div>
              <div class="hero__detail">
                <dt>{hero.details[1].label}</dt>
                <dd>{hero.details[1].value}</dd>
              </div>
              <div class="hero__detail">
                <dt>{hero.details[2].label}</dt>
                <dd>
                  <span class="hero__detail-value">{hero.details[2].value}</span>
                  <span class="hero__detail-note">{hero.details[2].note}</span>
                </dd>
              </div>
              <div class="hero__detail hero__detail--live">
                <dt>{hero.details[3].label}</dt>
                <dd>{hero.details[3].value}</dd>
              </div>
            </dl>
          </div>
          {hasHeroVideo ? <HeroVideo /> : null}
        </div>
      </section>
    )
  }
}
