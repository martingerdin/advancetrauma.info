import type { MeetingSummary } from '../../lib/tmg'
import tmgStore from '../../stores/tmg-store'

/** One meeting in the TMG sidebar list. */
export default function MeetingListItem({ meeting }: { meeting: MeetingSummary }) {
  return (
    <li>
      <button
        type="button"
        class={
          tmgStore.selectedMeetingId === meeting.id
            ? 'tmg-meeting-list__item tmg-meeting-list__item--active'
            : 'tmg-meeting-list__item'
        }
        click={() => tmgStore.selectMeeting(meeting.id)}
      >
        {meeting.dateLabel}
      </button>
    </li>
  )
}
