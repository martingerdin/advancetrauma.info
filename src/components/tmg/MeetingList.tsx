import { Component } from '@geajs/core'
import tmgStore from '../../stores/tmg-store'
import MeetingListItem from './MeetingListItem'

export default class MeetingList extends Component {
  template() {
    return (
      <aside class="tmg-meeting-list">
        <h2 class="tmg-meeting-list__title">Meetings</h2>
        {tmgStore.meetingsMessage ? (
          <p class={tmgStore.meetingsMessageClass}>{tmgStore.meetingsMessage}</p>
        ) : (
          <ul class="tmg-meeting-list__items">
            {tmgStore.meetings.map((meeting) => (
              <MeetingListItem key={meeting.id} meeting={meeting} />
            ))}
          </ul>
        )}
      </aside>
    )
  }
}
