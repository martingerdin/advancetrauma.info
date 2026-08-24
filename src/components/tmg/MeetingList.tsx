import { Component } from '@geajs/core'
import type { MeetingSummary } from '../../lib/tmg'
import MeetingListItem from './MeetingListItem'

export default class MeetingList extends Component {
  declare props: {
    meetings: MeetingSummary[]
    selectedMeetingId: string
    loading: boolean
    onSelect: (id: string) => void
  }

  template({ meetings, selectedMeetingId, loading, onSelect }: this['props']) {
    return (
      <aside class="tmg-meeting-list">
        <h2 class="tmg-meeting-list__title">Meetings</h2>
        {loading ? (
          <p class="tmg-meeting-list__status">Loading meetings…</p>
        ) : meetings.length === 0 ? (
          <p class="tmg-meeting-list__status">No meetings found.</p>
        ) : (
          <ul class="tmg-meeting-list__items">
            {meetings.map((meeting) => (
              <MeetingListItem
                meeting={meeting}
                selected={meeting.id === selectedMeetingId}
                onSelect={() => onSelect(meeting.id)}
              />
            ))}
          </ul>
        )}
      </aside>
    )
  }
}
