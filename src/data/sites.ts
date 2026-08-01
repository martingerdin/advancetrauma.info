export type SiteBatch = '1' | '2'

export type BatchStatus = 'upcoming' | 'ongoing' | 'completed'

export type ParticipatingSite = {
  name: string
  city: string
  batch: SiteBatch
  website: string
  location: { lat: number; lng: number }
  pi: string
}

export type SiteBatchInfo = {
  id: SiteBatch
  title: string
  /** Inclusive start month as YYYY-MM */
  start: string
  /** Inclusive end month as YYYY-MM */
  end: string
  sites: ParticipatingSite[]
}

/** Batch marker/label colors — resolve from design tokens at call time. */
export const batchColorTokens: Record<SiteBatch, string> = {
  '1': '--brand',
  '2': '--accent',
}

export const participatingSites: ParticipatingSite[] = [
  {
    name: 'HBT Medical College And Dr. R N Cooper Municipal General Hospital',
    location: { lat: 19.10790971021016, lng: 72.83623768267398 },
    city: 'Mumbai',
    batch: '1',
    website: 'https://hbtmc.edu.in/',
    pi: 'Geeta Ghag, Vipul Nandu',
  },
  {
    name: 'IPGME&R and SSKM Hospital',
    location: { lat: 22.540269944753586, lng: 88.34186296554837 },
    city: 'Kolkata',
    batch: '1',
    website: 'http://www.ipgmer.gov.in/',
    pi: 'Shamita Chatterjee, Maitreyee Mukherjee',
  },
  {
    name: 'Christian Medical College & Hospital',
    location: { lat: 30.911165478936997, lng: 75.86348436577856 },
    city: 'Ludhiana',
    batch: '1',
    website: 'https://www.cmcludhiana.in/',
    pi: 'Parvez Haque, Thejus Varghese',
  },
  {
    name: 'Government Medical College & Hospital',
    location: { lat: 30.692216564214863, lng: 76.7551942229613 },
    city: 'Chandigarh',
    batch: '1',
    website: 'https://www.gmch.gov.in/',
    pi: 'Rajeev Sharma',
  },
  {
    name: 'Himalayan Institute of Medical Sciences',
    location: { lat: 30.193327822632433, lng: 78.16497428998137 },
    city: 'Dehradun',
    batch: '1',
    website: 'https://srhu.edu.in/medical-sciences/',
    pi: 'Hemant Nautiyal',
  },
  {
    name: 'Seth G.S. Medical College and King Edward Memorial Hospital',
    location: { lat: 19.002633531934915, lng: 72.84142762699638 },
    city: 'Mumbai',
    batch: '2',
    website: 'https://www.kem.edu/',
    pi: 'Monty Khajanchi',
  },
  {
    name: 'Lokmanya Tilak Municipal Medical College and General Hospital',
    location: { lat: 19.036157387791466, lng: 72.85942328082004 },
    city: 'Mumbai',
    batch: '2',
    website: 'https://ltmgh.com/',
    pi: 'Vineet Kumar',
  },
  {
    name: 'Holy Family Hospital',
    location: { lat: 28.56218828970658, lng: 77.27511129639481 },
    city: 'New Delhi',
    batch: '2',
    website: 'https://www.hfhdelhi.org/',
    pi: 'Aisvarya Kapoor',
  },
  {
    name: 'Assam Medical College & Hospital',
    location: { lat: 27.483625508772267, lng: 94.94401488101919 },
    city: 'Dibrugarh',
    batch: '2',
    website: 'https://amch-dibrugarh.assam.gov.in/',
    pi: 'Jishan Ahmed',
  },
  {
    name: 'Dayanand Medical College & Hospital',
    location: { lat: 30.916655731118574, lng: 75.83081233862086 },
    city: 'Ludhiana',
    batch: '2',
    website: 'https://www.dmch.edu/',
    pi: 'Jaspal Singh',
  },
]

/**
 * Batch windows follow the protocol: each batch runs 13 months with an
 * anticipated 6-month overlap, starting from the trial start (Feb 2025).
 */
export const siteBatches: SiteBatchInfo[] = [
  {
    id: '1',
    title: 'Batch 1',
    start: '2025-02',
    end: '2026-03',
    sites: participatingSites.filter((site) => site.batch === '1'),
  },
  {
    id: '2',
    title: 'Batch 2',
    start: '2025-12',
    end: '2027-01',
    sites: participatingSites.filter((site) => site.batch === '2'),
  },
]

const monthFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
})

function parseYearMonth(value: string): { year: number; month: number } {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

export function formatBatchMonth(value: string): string {
  const { year, month } = parseYearMonth(value)
  return monthFormatter.format(new Date(year, month - 1, 1))
}

export function getBatchStatus(batch: Pick<SiteBatchInfo, 'start' | 'end'>, now = new Date()): BatchStatus {
  const start = parseYearMonth(batch.start)
  const end = parseYearMonth(batch.end)
  const startDate = new Date(start.year, start.month - 1, 1)
  const endDate = new Date(end.year, end.month, 0, 23, 59, 59, 999)

  if (now < startDate) return 'upcoming'
  if (now > endDate) return 'completed'
  return 'ongoing'
}

export const batchStatusLabels: Record<BatchStatus, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
}

export const batchStatusPillClass: Record<BatchStatus, string> = {
  upcoming: 'status-pill status-pill--upcoming',
  ongoing: 'status-pill status-pill--live',
  completed: 'status-pill status-pill--completed',
}

export const siteBatchViews = siteBatches.map((batch) => {
  const status = getBatchStatus(batch)
  const startLabel = formatBatchMonth(batch.start)
  const endLabel = formatBatchMonth(batch.end)
  return {
    ...batch,
    status,
    statusLabel: batchStatusLabels[status],
    statusClass: batchStatusPillClass[status],
    startLabel,
    endLabel,
    startedPill: `${status === 'upcoming' ? 'Starts' : 'Started'} ${startLabel}`,
    endsPill: `${status === 'completed' ? 'Ended' : 'Ends'} ${endLabel}`,
  }
})
