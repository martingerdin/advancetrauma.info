import { Component } from '@geajs/core'
import LoginForm from '../components/tmg/LoginForm'
import MeetingContent from '../components/tmg/MeetingContent'
import MeetingList from '../components/tmg/MeetingList'
import tmgStore from '../stores/tmg-store'

export default class TMG extends Component {
  onAfterRender() {
    tmgStore.initialize()
  }

  template() {
    return (
      <section class="section section--muted">
        <div class="section__inner tmg">
          <header class="section__intro">
            <p class="section__eyebrow">Members Area</p>
            <h1 class="section__heading">Trial Management Group</h1>
            <p class="section__lead">
              View trial updates for the Trial Management Group.
            </p>
          </header>

          {tmgStore.authenticated ? (
            <div class="tmg__layout">
              <MeetingList />
              <MeetingContent />
            </div>
          ) : (
            <LoginForm />
          )}
        </div>
      </section>
    )
  }
}
