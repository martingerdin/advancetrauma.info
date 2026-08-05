import { participatingSites } from './sites'

export type TeamMember = {
  name: string
  /** Institutional or site affiliation */
  affiliation?: string
  /** Primary role shown on the card */
  role?: string
  /** Committee or group memberships, shown in a collapsible section */
  committee?: string[]
  email?: string
  /** ORCID iD, e.g. 0000-0002-1825-0097 (with or without https://orcid.org/) */
  orcid?: string
  /** Link to institutional profile */
  profile?: string
}

export type TeamGroup = {
  id: 'contributors' | 'sdmc'
  title: string
  members: TeamMember[]
}

/**
 * Design and implementation contributors (from protocol contributors list).
 * Anna Olofsson’s ORCID was omitted — contributors.qmd duplicated Shamita Chatterjee’s ID.
 */
const contributors: TeamMember[] = [
  {
    name: 'Martin Gerdin Wärnberg',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
    role: 'Principal Investigator',
    committee: ['Trial Team member', 'Trial Management Group chair'],
    orcid: '0000-0001-6069-4794',
    email: 'martin.gerdin@ki.se',
    profile: 'https://ki.se/en/people/martin-gerdin',
  },
  {
    name: 'Vivekanand Jha',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
    role: 'Co-principal investigator',
    committee: ['Trial Management Group member'],
    orcid: '0000-0002-8015-9470',
    profile: 'https://www.georgeinstitute.org/about-us/our-people/people-at-the-george-institute/vivekanand-jha',
  },
  {
    name: 'Nobhojit Roy',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
    committee: ['Trial Management Group member'],
    orcid: '0000-0003-2022-7416',
    profile: 'https://www.georgeinstitute.org/about-us/our-people/people-at-the-george-institute/nobhojit-roy',
  },
  {
    name: 'Girish D Bakhshi',
    affiliation:
      'Grant Govt. Medical College & Sir J. J. Group of Hospitals, Mumbai, India',
    committee: ['Trial Management Group member'],
    orcid: '0000-0001-9542-4428',
  },
  {
    name: 'Debojit Basak',
    affiliation:
      'Institute of Post Graduate Medical Education & Research and Seth Sukhlal Karnani Memorial Hospital, Kolkata, India',
    role: 'Associate Project Manager',
    committee: ['Trial Team member', 'Trial Management Group member'],
    orcid: '0000-0002-8378-9689',
  },
  {
    name: 'Abhinav Bassi',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
    committee: ['Trial Management Group member'],
    orcid: '0000-0003-0750-9179',
  },
  {
    name: 'Johanna Berg',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
    committee: ['Trial Management Group member'],
    orcid: '0000-0001-7553-7337',
  },
  {
    name: 'Shamita Chatterjee',
    affiliation:
      'Institute of Post Graduate Medical Education & Research and Seth Sukhlal Karnani Memorial Hospital, Kolkata, India',
    role: 'Site investigator',
    committee: ['Trial Management Group member'],
    orcid: '0000-0002-9460-108X',
  },
  {
    name: 'Kapil Dev Soni',
    affiliation: 'All India Institute of Medical Sciences, New Delhi, India',
    committee: ['Trial Management Group member'],
    orcid: '0000-0003-1214-4119',
  },
  {
    name: 'Karla Hemming',
    affiliation: 'University of Birmingham, Birmingham, UK',
    committee: ['Trial Management Group member'],
    orcid: '0000-0002-2226-6550',
  },
  {
    name: 'Jessica Kasza',
    affiliation: 'Monash University, Melbourne, Australia',
    role: 'External statistician',
    orcid: '0000-0002-8940-0136',
  },
  {
    name: 'Monty Khajanchi',
    affiliation: 'King Edward Memorial Hospital, Mumbai, India',
    role: 'Site investigator',
    committee: ['Trial Team member', 'Trial Management Group member'],
    orcid: '0000-0002-0898-6391',
  },
  {
    name: 'James Martin',
    affiliation: 'University of Birmingham, Birmingham, UK',
    role: 'External statistician',
    orcid: '0000-0002-6949-4200',
  },
  {
    name: 'Anurag Mishra',
    affiliation: 'Maulana Azad Medical College, New Delhi, India',
    committee: ['Trial Management Group member'],
    orcid: '0000-0002-2302-0632',
  },
  {
    name: 'Anna Olofsson',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
    role: 'Trial Statistician',
    committee: ['Trial Management Group member'],
  },
  {
    name: 'Rajdeep Singh',
    affiliation: 'Maulana Azad Medical College, New Delhi, India',
    committee: ['Trial Management Group member'],
    orcid: '0000-0001-6593-2624',
  },
  {
    name: 'Lovisa Strömmer',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
    committee: ['Trial Management Group member'],
    orcid: '0000-0001-5424-7111',
  },
  {
    name: 'Li Felländer-Tsai',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
    committee: ['Trial Management Group member'],
    orcid: '0000-0003-0693-6080',
  },
  {
    name: 'Sara Fälth',
    affiliation: 'Karolinska Institutet, Stockholm, Sweden',
    role: 'Collaborator',
  },
  {
    name: 'Prashant Kharat',
    affiliation: 'The George Institute for Global Health, New Delhi, India',
    role: 'Clinical Research Associate',
    committee: ['Trial Team member', 'Trial Management Group member'],
  },
]

/**
 * Joint Trial Steering and Data Monitoring Committee.
 * Names are not listed in the public protocol — fill in when available.
 */
const steeringAndDataMonitoring: TeamMember[] = []

function splitNames(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
}

function addSiteMember(
  byName: Map<string, TeamMember>,
  excludeNames: ReadonlySet<string>,
  name: string,
  affiliation: string,
  role: string,
) {
  const key = name.toLowerCase()
  if (excludeNames.has(key)) return
  const existing = byName.get(key)
  if (existing) {
    if (existing.affiliation && !existing.affiliation.includes(affiliation)) {
      existing.affiliation = `${existing.affiliation}; ${affiliation}`
    }
    return
  }
  byName.set(key, { name, affiliation, role })
}

function siteTeamMembers(excludeNames: ReadonlySet<string>): TeamMember[] {
  const byName = new Map<string, TeamMember>()
  for (const site of participatingSites) {
    const affiliation = `${site.name}, ${site.city}`
    for (const name of splitNames(site.pi)) {
      addSiteMember(byName, excludeNames, name, affiliation, 'Site investigator')
    }
    for (const name of splitNames(site.coordinators)) {
      addSiteMember(
        byName,
        excludeNames,
        name,
        affiliation,
        'Clinical research coordinator',
      )
    }
  }
  return [...byName.values()]
}

function sortByName(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

const contributorNames = new Set(
  contributors.map((member) => member.name.toLowerCase()),
)

export const teamGroups: TeamGroup[] = [
  {
    id: 'contributors',
    title: 'Management, collaborators, and investigators',
    members: [...contributors, ...siteTeamMembers(contributorNames)],
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
