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
          <div class="tmg__intro">
            <div>
              <p class="tmg__eyebrow">Members Area</p>
              <h1 class="section__heading">Trial Management Group</h1>
              <p class="section__lead">
                View recent meeting updates pulled from the public ADVANCE TRAUMA meeting
                repository.
              </p>
            </div>
            {tmgStore.authenticated ? (
              <button class="cta cta--ghost" type="button" click={() => tmgStore.logout()}>
                Sign out
              </button>
            ) : null}
          </div>

          {!tmgStore.authenticated ? (
            <div class="tmg__login-card">
              <LoginForm
                configured={tmgStore.configured}
                password={tmgStore.password}
                errorMessage={tmgStore.loginError}
                onInput={(event: Event) =>
                  tmgStore.setPassword((event.target as HTMLInputElement).value)
                }
                onSubmit={(event: Event) => tmgStore.submitPassword(event)}
              />
            </div>
          ) : (
            <div class="tmg__layout">
              <MeetingList
                meetings={tmgStore.meetings}
                selectedMeetingId={tmgStore.selectedMeetingId}
                loading={tmgStore.indexStatus === 'loading'}
                onSelect={(id: string) => tmgStore.selectMeeting(id)}
              />
              <MeetingContent
                detail={tmgStore.selectedMeeting}
                loading={tmgStore.detailStatus === 'loading'}
                errorMessage={tmgStore.detailError}
              />
            </div>
          )}
        </div>
      </section>
    )
  }
}
