import { Component } from '@geajs/core'
import tmgStore from '../../stores/tmg-store'
import MeetingDetailView from './MeetingDetailView'

export default class MeetingContent extends Component {
  template() {
    if (tmgStore.detailStatus === 'loading') {
      return (
        <section class="tmg-meeting-content">
          <p class="tmg-meeting-content__status">Loading selected meeting…</p>
        </section>
      )
    }

    if (tmgStore.detailError) {
      return (
        <section class="tmg-meeting-content">
          <p class="tmg-meeting-content__status tmg-meeting-content__status--error">
            {tmgStore.detailError}
          </p>
        </section>
      )
    }

    if (!tmgStore.selectedMeeting) {
      return (
        <section class="tmg-meeting-content">
          <p class="tmg-meeting-content__status">Select a meeting to view its updates.</p>
        </section>
      )
    }

    return <MeetingDetailView detail={tmgStore.selectedMeeting} />
  }
}
