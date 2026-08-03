import { participatingSites } from './sites'

export type TeamMember = {
  name: string
  /** Affiliation, site, or other secondary line */
  detail?: string
  role?: string
}

export type TeamGroup = {
  id: 'tmg' | 'investigators' | 'sdmc'
  title: string
  members: TeamMember[]
}

/** Protocol §2.3 Trial Management Group members. */
const trialManagementGroup: TeamMember[] = [
  {
    name: 'Martin Gerdin Wärnberg',
    detail: 'Karolinska Institutet, Stockholm, Sweden',
    role: 'Principal investigator and TMG chair',
  },
  {
    name: 'Girish D Bakhshi',
    detail: 'Grant Govt. Medical College & Sir J. J. Group of Hospitals, Mumbai, India',
  },
  {
    name: 'Debojit Basak',
    detail: 'IPGME&R and SSKM Hospital, Kolkata, India',
  },
  {
    name: 'Abhinav Bassi',
    detail: 'The George Institute for Global Health, New Delhi, India',
  },
  {
    name: 'Johanna Berg',
    detail: 'Karolinska Institutet, Stockholm, Sweden',
  },
  {
    name: 'Shamita Chatterjee',
    detail: 'IPGME&R and SSKM Hospital, Kolkata, India',
  },
  {
    name: 'Kapil Dev Soni',
    detail: 'All India Institute of Medical Sciences, New Delhi, India',
  },
  {
    name: 'Karla Hemming',
    detail: 'University of Birmingham, Birmingham, UK',
  },
  {
    name: 'Vivekanand Jha',
    detail: 'The George Institute for Global Health, New Delhi, India',
  },
  {
    name: 'Monty Khajanchi',
    detail: 'King Edward Memorial Hospital, Mumbai, India',
  },
  {
    name: 'Anurag Mishra',
    detail: 'Maulana Azad Medical College, New Delhi, India',
  },
  {
    name: 'Samriddhi Ranjan',
    detail: 'The George Institute for Global Health, New Delhi, India',
  },
  {
    name: 'Anna Olofsson',
    detail: 'Karolinska Institutet, Stockholm, Sweden',
    role: 'Trial statistician',
  },
  {
    name: 'Nobhojit Roy',
    detail: 'The George Institute for Global Health, New Delhi, India',
  },
  {
    name: 'Rajdeep Singh',
    detail: 'Maulana Azad Medical College, New Delhi, India',
  },
  {
    name: 'Lovisa Strömmer',
    detail: 'Karolinska Institutet, Stockholm, Sweden',
  },
  {
    name: 'Li Felländer-Tsai',
    detail: 'Karolinska Institutet, Stockholm, Sweden',
  },
]

/** Protocol external statisticians and publication collaborators outside the TMG. */
const collaborators: TeamMember[] = [
  {
    name: 'Jessica Kasza',
    detail: 'Monash University, Melbourne, Australia',
    role: 'External statistician',
  },
  {
    name: 'James Martin',
    detail: 'University of Birmingham, Birmingham, UK',
    role: 'External statistician',
  },
  {
    name: 'Sara Fälth',
    detail: 'Karolinska Institutet, Stockholm, Sweden',
  },
  {
    name: 'Prashant Kharat',
    detail: 'The George Institute for Global Health, New Delhi, India',
  },
]

/**
 * Joint Trial Steering and Data Monitoring Committee.
 * Names are not listed in the public protocol — fill in when available.
 */
const steeringAndDataMonitoring: TeamMember[] = []

function siteInvestigators(): TeamMember[] {
  const members: TeamMember[] = []
  for (const site of participatingSites) {
    const names = site.pi.split(',').map((name) => name.trim()).filter(Boolean)
    for (const name of names) {
      members.push({
        name,
        detail: `${site.name}, ${site.city}`,
      })
    }
  }
  return members
}

function sortByName(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

function memberLine(member: TeamMember): string {
  const parts = [member.name]
  if (member.role) parts.push(member.role)
  if (member.detail) parts.push(member.detail)
  if (parts.length === 1) return member.name
  return `${parts[0]} — ${parts.slice(1).join('; ')}`
}

export const teamGroups: TeamGroup[] = [
  {
    id: 'tmg',
    title: 'Trial management group and collaborators',
    members: [...trialManagementGroup, ...collaborators],
  },
  {
    id: 'investigators',
    title: 'Site investigators',
    members: siteInvestigators(),
  },
  {
    id: 'sdmc',
    title: 'Joint trial steering and data monitoring committee',
    members: steeringAndDataMonitoring,
  },
]

/** Precomputed lines for Gea-safe list rendering (single text child per item). */
export const teamGroupViews = teamGroups.map((group) => ({
  id: group.id,
  title: group.title,
  lines: (group.id === 'sdmc' ? sortByName(group.members) : group.members).map(memberLine),
}))
