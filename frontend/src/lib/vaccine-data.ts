/**
 * Types for vaccines. Catalog comes from API `vaccinations`.
 */

export type VaccineCategory = 'All' | 'Children' | 'Adults' | 'Travel' | 'Women' | 'Seniors';

export type Vaccine = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: VaccineCategory[];
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  whoItIsFor: string;
  schedule: string;
  doses: string;
  protectsAgainst: string[];
  sideEffects: string[];
  contraindications: string[];
  notes?: string;
  availability: 'Available in Clinic' | 'On Request' | 'Seasonal';
  priceNote: string;
};

export const VACCINE_CATEGORIES: VaccineCategory[] = [
  'All',
  'Children',
  'Adults',
  'Travel',
  'Women',
  'Seniors',
];

const PLACEHOLDER = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80';

function asAvail(v: string | undefined): Vaccine['availability'] {
  if (v === 'On Request' || v === 'Seasonal') return v;
  return 'Available in Clinic';
}

export function mapVaccineFromApi(raw: Record<string, unknown>): Vaccine {
  const cats = Array.isArray(raw.category) ? (raw.category as string[]) : [];
  return {
    id: String(raw.id),
    slug: String(raw.slug || ''),
    name: String(raw.name || ''),
    shortName: String(raw.shortName || raw.name || ''),
    category: cats as VaccineCategory[],
    tagline: String(raw.tagline || ''),
    description: String(raw.description || ''),
    longDescription: String(raw.longDescription || raw.description || ''),
    image: raw.image != null ? String(raw.image) : PLACEHOLDER,
    whoItIsFor: String(raw.whoItIsFor || ''),
    schedule: String(raw.schedule || ''),
    doses: String(raw.doses || ''),
    protectsAgainst: Array.isArray(raw.protectsAgainst) ? (raw.protectsAgainst as string[]) : [],
    sideEffects: Array.isArray(raw.sideEffects) ? (raw.sideEffects as string[]) : [],
    contraindications: Array.isArray(raw.contraindications) ? (raw.contraindications as string[]) : [],
    notes: raw.notes != null ? String(raw.notes) : undefined,
    availability: asAvail(raw.availability != null ? String(raw.availability) : undefined),
    priceNote: String(raw.priceNote || 'Contact clinic for pricing'),
  };
}

/** Unsplash seed photo IDs (mirrors backend seed-catalog) for realistic imagery. */
const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&q=80`;

/**
 * Offline fallback vaccine catalog — mirrors the backend seed slugs so detail
 * pages still render (instead of a 404) when the API returns no data.
 */
export const FALLBACK_VACCINES: Vaccine[] = [
  {
    id: 'fb-flu',
    slug: 'flu-quadrivalent',
    name: 'Flu Vaccine – Quadrivalent',
    shortName: 'Influenza',
    category: ['Adults', 'Children', 'Seniors'],
    tagline: 'Annual seasonal flu protection',
    description: 'Covers four influenza strains; recommended yearly.',
    longDescription:
      'The seasonal quadrivalent influenza vaccine is updated each year and protects against four circulating influenza virus strains. An annual dose is recommended for everyone aged 6 months and older, and it is especially important for older adults, young children, pregnant women, and people with chronic conditions such as asthma, diabetes, or heart disease. Get vaccinated before the flu season peaks to reduce your risk of severe illness and complications.',
    image: img('photo-1576091160550-2173dba999ef'),
    whoItIsFor: '6 months and older',
    schedule: 'Once yearly',
    doses: '1 dose (2 for some children)',
    protectsAgainst: ['Influenza A/B strains'],
    sideEffects: ['Arm soreness', 'Mild fever'],
    contraindications: ['Severe allergy to components'],
    availability: 'Seasonal',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-hepb',
    slug: 'hepatitis-b',
    name: 'Hepatitis B Vaccine',
    shortName: 'Hep B',
    category: ['Adults', 'Children'],
    tagline: 'Prevent chronic HBV',
    description: 'Highly effective 3-dose series.',
    longDescription:
      'Hepatitis B is a serious viral liver infection that can become chronic and lead to cirrhosis or liver cancer. The vaccine is highly effective and is given as a 3-dose series. All unvaccinated individuals — including infants, children, and adults — are encouraged to complete the series for long-lasting protection.',
    image: img('photo-1628771065518-0d82f1938462'),
    whoItIsFor: 'All unvaccinated individuals',
    schedule: '0, 1, 6 months',
    doses: '3 doses',
    protectsAgainst: ['Hepatitis B'],
    sideEffects: ['Injection site soreness'],
    contraindications: ['Severe prior reaction'],
    availability: 'Available in Clinic',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-tdap',
    slug: 'tdap',
    name: 'Tdap Booster',
    shortName: 'Tdap',
    category: ['Adults', 'Women'],
    tagline: 'Diphtheria, tetanus, pertussis',
    description: 'Adolescent and adult booster.',
    longDescription:
      'The Tdap vaccine protects against tetanus, diphtheria, and pertussis (whooping cough). It is recommended as a booster every 10 years, and during pregnancy (ideally at 28–36 weeks) to pass protective antibodies to the newborn.',
    image: img('photo-1559757175-0eb30cd8c063'),
    whoItIsFor: 'Adults; pregnant women 28–36 wk',
    schedule: 'Every 10 years',
    doses: '1 dose',
    protectsAgainst: ['Diphtheria', 'Tetanus', 'Pertussis'],
    sideEffects: ['Sore arm', 'Fatigue'],
    contraindications: ['Encephalopathy after prior dose'],
    availability: 'Available in Clinic',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-hepa',
    slug: 'hepatitis-a',
    name: 'Hepatitis A Vaccine',
    shortName: 'Hep A',
    category: ['Adults', 'Travel'],
    tagline: 'Food & water borne liver infection',
    description: 'Two-dose long-term protection.',
    longDescription:
      'Hepatitis A spreads through contaminated food and water. The vaccine provides long-term protection after a two-dose series and is recommended for travellers to endemic areas, food handlers, and anyone at risk of exposure.',
    image: img('photo-1582719471384-894fbb16e074'),
    whoItIsFor: 'Travellers, food handlers',
    schedule: '0 and 6–12 months',
    doses: '2 doses',
    protectsAgainst: ['Hepatitis A'],
    sideEffects: ['Mild local reaction'],
    contraindications: ['Severe illness'],
    availability: 'Available in Clinic',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-cholera',
    slug: 'cholera',
    name: 'Cholera Vaccine (Oral)',
    shortName: 'Cholera',
    category: ['Travel'],
    tagline: 'Travel to endemic areas',
    description: 'Oral cholera vaccination.',
    longDescription:
      'Cholera is spread through contaminated water and causes severe watery diarrhoea. An oral vaccine provides protection for people travelling to or living in areas where cholera is present.',
    image: img('photo-1584308666744-24d5c474f2ae'),
    whoItIsFor: 'Travellers',
    schedule: 'Per manufacturer',
    doses: '2 oral doses',
    protectsAgainst: ['V. cholerae O1'],
    sideEffects: ['GI upset'],
    contraindications: ['Acute GI illness'],
    availability: 'On Request',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-hpv',
    slug: 'hpv',
    name: 'HPV Vaccine',
    shortName: 'HPV',
    category: ['Women', 'Adults'],
    tagline: 'Cervical cancer prevention',
    description: 'Gardasil / equivalent as available.',
    longDescription:
      'The HPV vaccine protects against the human papillomavirus types most commonly linked to cervical and other cancers. It is most effective when given before exposure, and is recommended on the national schedule.',
    image: img('photo-1579684385127-1ef15d508118'),
    whoItIsFor: 'Per national schedule',
    schedule: '2 or 3 doses',
    doses: 'Per age',
    protectsAgainst: ['HPV types in vaccine'],
    sideEffects: ['Local reaction'],
    contraindications: ['Pregnancy'],
    availability: 'Available in Clinic',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-mmr',
    slug: 'mmr',
    name: 'MMR Vaccine',
    shortName: 'MMR',
    category: ['Children', 'Adults'],
    tagline: 'Measles, mumps, rubella',
    description: 'Live attenuated combination vaccine.',
    longDescription:
      'The MMR vaccine protects against measles, mumps, and rubella in a single live-attenuated combination. It follows the national immunization schedule and provides long-lasting protection.',
    image: img('photo-1503454537195-1dcabb73ffb9'),
    whoItIsFor: 'Per national immunization schedule',
    schedule: '1–2 doses',
    doses: '1–2 doses',
    protectsAgainst: ['Measles', 'Mumps', 'Rubella'],
    sideEffects: ['Fever', 'Rash (rare)'],
    contraindications: ['Pregnancy', 'Severe immunosuppression'],
    availability: 'Available in Clinic',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-typhoid',
    slug: 'typhoid',
    name: 'Typhoid Vaccine',
    shortName: 'Typhoid',
    category: ['Travel', 'Adults'],
    tagline: 'Enteric fever prevention',
    description: 'Injectable or oral per availability.',
    longDescription:
      'Typhoid is a serious bacterial infection spread through contaminated food and water. Vaccination protects travellers to endemic areas and others at risk. It is available as oral or injectable depending on stock.',
    image: img('photo-1584036561566-baf8f0f1b144'),
    whoItIsFor: 'Endemic areas, travellers',
    schedule: 'Per product',
    doses: '1–4 doses (oral) or 1 (injectable)',
    protectsAgainst: ['Salmonella Typhi'],
    sideEffects: ['Fever', 'Headache'],
    contraindications: ['Acute illness'],
    availability: 'On Request',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-pneumo',
    slug: 'pneumococcal',
    name: 'Pneumococcal Vaccine',
    shortName: 'PCV/PPSV',
    category: ['Adults', 'Seniors', 'Children'],
    tagline: 'Pneumonia prevention',
    description: 'Conjugate or polysaccharide per age and risk.',
    longDescription:
      'The pneumococcal vaccine protects against invasive Streptococcus pneumoniae infection, which can cause pneumonia, meningitis, and bloodstream infections. It is recommended for infants, older adults and high-risk groups.',
    image: img('photo-1551601651-2a8555f1a136'),
    whoItIsFor: 'Infants, elderly, high-risk adults',
    schedule: 'Per schedule',
    doses: '1–4 doses',
    protectsAgainst: ['Streptococcus pneumoniae (covered serotypes)'],
    sideEffects: ['Local soreness', 'Fever'],
    contraindications: ['Severe allergy to vaccine'],
    availability: 'Available in Clinic',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-varicella',
    slug: 'varicella',
    name: 'Varicella (Chickenpox) Vaccine',
    shortName: 'Varicella',
    category: ['Children', 'Adults'],
    tagline: 'Chickenpox protection',
    description: 'Live vaccine for varicella-zoster virus.',
    longDescription:
      'The varicella (chickenpox) vaccine is a live vaccine against the varicella-zoster virus. It is recommended for unvaccinated children and susceptible adults who wish to avoid the uncomfortable rash and prevent its spread.',
    image: img('photo-1511895426328-dc8714191300'),
    whoItIsFor: 'Unvaccinated children and susceptible adults',
    schedule: '2 doses',
    doses: '2 doses',
    protectsAgainst: ['Varicella (chickenpox)'],
    sideEffects: ['Mild rash', 'Fever'],
    contraindications: ['Pregnancy', 'Immunosuppression'],
    availability: 'On Request',
    priceNote: 'Contact clinic',
  },
];

/** Look up a vaccine by slug from the offline fallback catalog. */
export function getVaccineBySlug(slug: string): Vaccine | undefined {
  return FALLBACK_VACCINES.find((v) => v.slug === slug);
}
