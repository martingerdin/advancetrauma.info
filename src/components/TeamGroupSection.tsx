import type { TeamMember } from '../data/team'
import TeamMemberCard from './TeamMemberCard'

/** One team group heading + member cards. */
export default function TeamGroupSection({
  title,
  members,
}: {
  title: string
  members: TeamMember[]
}) {
  return (
    <div class="team-group">
      <h3 class="team-group__title">{title}</h3>
      <div class="team-cards">
        {members.map((member) => (
          <TeamMemberCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  )
}
