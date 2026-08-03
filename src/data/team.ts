import { participatingSites } from './sites'

export type TeamMember = {
  name: string
  /** Institutional or site affiliation */
  affiliation?: string
  role?: string
  email?: string
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
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
    role: 'Principal investigator and TMG chair',
  },
  {
    name: 'Girish D Bakhshi',
    affiliation: 'Grant Govt. Medical College & Sir J. J. Group of Hospitals, Mumbai, India',
  },
  {
    name: 'Debojit Basak',
    affiliation: 'IPGME&R and SSKM Hospital, Kolkata, India',
  },
  {
    name: 'Abhinav Bassi',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
  },
  {
    name: 'Johanna Berg',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
  },
  {
    name: 'Shamita Chatterjee',
    affiliation: 'IPGME&R and SSKM Hospital, Kolkata, India',
  },
  {
    name: 'Kapil Dev Soni',
    affiliation: 'All India Institute of Medical Sciences, New Delhi, India',
  },
  {
    name: 'Karla Hemming',
    affiliation: 'University of Birmingham, Birmingham, UK',
  },
  {
    name: 'Vivekanand Jha',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
  },
  {
    name: 'Monty Khajanchi',
    affiliation: 'King Edward Memorial Hospital, Mumbai, India',
  },
  {
    name: 'Anurag Mishra',
    affiliation: 'Maulana Azad Medical College, New Delhi, India',
  },
  {
    name: 'Samriddhi Ranjan',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
  },
  {
    name: 'Anna Olofsson',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
    role: 'Trial statistician',
  },
  {
    name: 'Nobhojit Roy',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
  },
  {
    name: 'Rajdeep Singh',
    affiliation: 'Maulana Azad Medical College, New Delhi, India',
  },
  {
    name: 'Lovisa Strömmer',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
  },
  {
    name: 'Li Felländer-Tsai',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
  },
]

/** Protocol external statisticians and publication collaborators outside the TMG. */
const collaborators: TeamMember[] = [
  {
    name: 'Jessica Kasza',
    affiliation: 'Monash University, Melbourne, Australia',
    role: 'External statistician',
  },
  {
    name: 'James Martin',
    affiliation: 'University of Birmingham, Birmingham, UK',
    role: 'External statistician',
  },
  {
    name: 'Sara Fälth',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
  },
  {
    name: 'Prashant Kharat',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
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
        affiliation: `${site.name}, ${site.city}`,
        role: 'Site investigator',
      })
    }
  }
  return members
}

function sortByName(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => a.name.localeCompare(b.name, 'en'))
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

export const teamGroupViews = teamGroups.map((group) => ({
  id: group.id,
  title: group.title,
  members: group.id === 'sdmc' ? sortByName(group.members) : group.members,
}))
