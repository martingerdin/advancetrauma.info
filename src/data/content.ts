export const siteMeta = {
  title: 'The ADVANCE TRAUMA Trial',
  description:
    'ADVANCE TRAUMA is the clinical trial to determine if ATLS® improves patient outcomes.',
}

export const links = {
  publication: 'https://doi.org/10.1186/s13063-026-09491-z',
  protocol: '/protocol/protocol-v1.5.0-2025-06-12.pdf',
  clinicalTrials: 'https://clinicaltrials.gov/study/NCT06321419',
  karolinska: 'https://ki.se',
  georgeInstitute: 'https://www.georgeinstitute.org/',
  birmingham: 'https://www.birmingham.ac.uk/',
  github: 'https://github.com/martingerdin/advancetrauma.info',
}

export const hero = {
  eyebrow: 'International clinical trial',
  title: 'ADVANCE TRAUMA',
  tagline: 'The clinical trial to determine if ATLS® improves patient outcomes',
  cta: 'Learn more',
  ctaSecondary: 'Watch the film',
  details: [
    { label: 'Start', value: 'February 2025' },
    { label: 'End', value: 'December 2029' },
    { label: 'Target', value: '4,320', note: 'participants' },
    { label: 'Status', value: 'Ongoing', live: true },
  ],
}

export const about = {
  title: 'About',
  lead: 'ADVANCE TRAUMA is a batched stepped-wedge cluster randomised trial in India, comparing ATLS® training with standard care on outcomes in adult trauma patients.',
  paragraphs: [
    'ADVANCE TRAUMA is a major clinical study testing whether ATLS® training for doctors improves outcomes for people with serious injuries. ATLS® is the most established and widely used training programme to help doctors quickly recognise and treat life-threatening injuries, but there is currently no strong evidence that it improves patients’ outcomes.',
    'The trial is taking place in multiple hospitals in India. All hospitals begin by caring for patients as usual. Over time, doctors in each hospital undergo ATLS® training, and outcomes before and after are compared. This step-by-step approach allows every hospital to take part while helping us assess whether the training leads to better outcomes.',
  ],
  partners: [
    { name: 'Karolinska Institutet', href: links.karolinska },
    { name: 'George Institute for Global Health in India', href: links.georgeInstitute },
    { name: 'University of Birmingham', href: links.birmingham },
  ],
}

export const resources = {
  title: 'Resources',
  lead: 'Read the protocol, the published paper, and the trial registration.',
  items: [
    {
      label: 'Protocol',
      description: 'Download the full ADVANCE TRAUMA study protocol (PDF).',
      href: links.protocol,
      download: true,
      image: '/resources/protocol.webp',
      imageAlt: '',
    },
    {
      label: 'Publication',
      description: 'Read the trial protocol paper published in Trials.',
      href: links.publication,
      external: true,
      image: '/resources/publication.webp',
      imageAlt: '',
    },
    {
      label: 'ClinicalTrials.gov',
      description: 'View the registered trial record (NCT06321419).',
      href: links.clinicalTrials,
      external: true,
      image: '/resources/clinicaltrials.webp',
      imageAlt: '',
    },
  ],
}

export const sites = {
  title: 'Participating Sites',
  lead: 'Explore the hospitals participating in the ADVANCE TRAUMA trial across India.',
}

export const team = {
  title: 'Team',
  lead: 'The people leading, collaborating on, and overseeing the ADVANCE TRAUMA trial.',
}

export const contact = {
  title: 'Contact Us',
  lead: 'If you have any questions about the ADVANCE TRAUMA trial, please contact us.',
}

export const footer = {
  brand: 'ADVANCE TRAUMA',
  tagline: 'The clinical trial to determine if ATLS® improves patient outcomes.',
  navigateTitle: 'On this page',
  navigate: [
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Resources', href: '/#resources', id: 'resources' },
    { label: 'Sites', href: '/#sites', id: 'sites' },
    { label: 'Team', href: '/#team', id: 'team' },
    { label: 'Contact', href: '/#contact', id: 'contact' },
  ],
  resourcesTitle: 'Resources',
  resources: [
    { label: 'Protocol', href: links.protocol, download: true },
    { label: 'Publication', href: links.publication, external: true },
    { label: 'ClinicalTrials.gov', href: links.clinicalTrials, external: true },
  ],
  sourceLabel: 'View source on GitHub',
  sourceHref: links.github,
  creditPrefix: 'An international collaboration led by',
  partners: about.partners,
}
