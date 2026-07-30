export type SiteBatch = '1' | '2'

export type ParticipatingSite = {
  name: string
  city: string
  batch: SiteBatch
  website: string
  location: { lat: number; lng: number }
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
  },
  {
    name: 'IPGME&R and SSKM Hospital',
    location: { lat: 22.540269944753586, lng: 88.34186296554837 },
    city: 'Kolkata',
    batch: '1',
    website: 'http://www.ipgmer.gov.in/',
  },
  {
    name: 'Christian Medical College & Hospital',
    location: { lat: 30.911165478936997, lng: 75.86348436577856 },
    city: 'Ludhiana',
    batch: '1',
    website: 'https://www.cmcludhiana.in/',
  },
  {
    name: 'Government Medical College & Hospital',
    location: { lat: 30.692216564214863, lng: 76.7551942229613 },
    city: 'Chandigarh',
    batch: '1',
    website: 'https://www.gmch.gov.in/',
  },
  {
    name: 'Himalayan Institute of Medical Sciences',
    location: { lat: 30.193327822632433, lng: 78.16497428998137 },
    city: 'Dehradun',
    batch: '1',
    website: 'https://srhu.edu.in/medical-sciences/',
  },
  {
    name: 'Seth G.S. Medical College and King Edward Memorial Hospital',
    location: { lat: 19.002633531934915, lng: 72.84142762699638 },
    city: 'Mumbai',
    batch: '2',
    website: 'https://www.kem.edu/',
  },
  {
    name: 'Lokmanya Tilak Municipal Medical College and General Hospital',
    location: { lat: 19.036157387791466, lng: 72.85942328082004 },
    city: 'Mumbai',
    batch: '2',
    website: 'https://ltmgh.com/',
  },
  {
    name: 'Holy Family Hospital',
    location: { lat: 28.56218828970658, lng: 77.27511129639481 },
    city: 'New Delhi',
    batch: '2',
    website: 'https://www.hfhdelhi.org/',
  },
  {
    name: 'Assam Medical College & Hospital',
    location: { lat: 27.483625508772267, lng: 94.94401488101919 },
    city: 'Dibrugarh',
    batch: '2',
    website: 'https://amch-dibrugarh.assam.gov.in/',
  },
  {
    name: 'Dayanand Medical College & Hospital',
    location: { lat: 30.916655731118574, lng: 75.83081233862086 },
    city: 'Ludhiana',
    batch: '2',
    website: 'https://www.dmch.edu/',
  },
]

export const siteBatches: { id: SiteBatch; title: string; sites: ParticipatingSite[] }[] = [
  {
    id: '1',
    title: 'Batch 1',
    sites: participatingSites.filter((site) => site.batch === '1'),
  },
  {
    id: '2',
    title: 'Batch 2',
    sites: participatingSites.filter((site) => site.batch === '2'),
  },
]
