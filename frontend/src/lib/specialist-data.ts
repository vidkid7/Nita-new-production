export type SpecialistPageData = {
  title: string;
  description: string;
  heading: string;
  icon: string;
  heroVideo: {
    src: string;
    poster: string;
  };
  gradient: string;
  accentColor: string;
  intro: string;
  conditions: string[];
  procedures: string[];
  faq: Array<{ q: string; a: string }>;
  fallbackDoctors: FallbackDoctor[];
};

export type FallbackDoctor = {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  rating: number;
  availableDays: string;
  bio: string;
  phone: string;
  isTopRated?: boolean;
  images: string[];
};

export const SPECIALIST_META: Record<string, SpecialistPageData> = {
  'gynecology-obstetrics': {
    title: 'Gynecology & Obstetrics | Nita Clinics',
    description:
      "Expert gynecology and obstetrics care at Nita Clinics. Prenatal care, delivery, and women's health services.",
    heading: 'Gynecology & Obstetrics',
    icon: '♀',
    heroVideo: {
      src: '/videos/hero/gynecology-consult.mp4',
      poster: '/videos/hero/gynecology-consult.jpg',
    },
    gradient: 'from-rose-700 to-pink-800',
    accentColor: 'bg-rose-500',
    intro:
      "Comprehensive women's health services covering routine gynecology, reproductive health, prenatal monitoring, and antenatal care — delivered by experienced consultants.",
    conditions: [
      'PCOS / Polycystic Ovary Syndrome',
      'Uterine Fibroids',
      'Infertility & Fertility Support',
      'Prenatal & Antenatal Care',
      'Menstrual Disorders',
      'Cervical Health',
      'Menopausal Symptoms',
      'Pregnancy Complications',
      'Family Planning',
    ],
    procedures: [
      'Prenatal Checkup',
      'Antenatal Monitoring',
      'Postnatal Care',
      'Family Planning Consultation',
      'Cervical PAP Smear',
      'Hormonal Profile Testing',
      'Pregnancy Test & Confirmation',
    ],
    faq: [
      {
        q: 'When should I see a gynecologist?',
        a: 'Annual checkups are recommended for women above 18. You should see a specialist immediately for unusual bleeding, pelvic pain, or any reproductive concerns.',
      },
      {
        q: 'Is prenatal care available?',
        a: 'Yes. Our obstetrics team offers full antenatal monitoring from first trimester through delivery planning and postnatal care.',
      },
      {
        q: 'Do I need a referral to see your gynecologist?',
        a: 'No referral is required. You can book a direct appointment online or by calling our clinic.',
      },
      {
        q: 'What should I bring to my first appointment?',
        a: 'Bring any prior medical reports, recent test results, your last menstrual cycle dates, and a list of current medications if any.',
      },
    ],
    fallbackDoctors: [
      {
        id: 'gyn-1',
        name: 'Josie R. Baral',
        specialization: 'Gynecology & Obstetrics',
        qualification: 'MD, MS Gynecology',
        experience: 14,
        rating: 4.9,
        availableDays: 'Mon – Fri, 10AM – 4PM',
        bio: 'Senior consultant with 14+ years in women\'s reproductive health, high-risk pregnancy management, and minimally invasive gynecological procedures.',
        phone: '+977 01-4533361',
        isTopRated: true,
        images: [
          'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
        ],
      },
      {
        id: 'gyn-2',
        name: 'Sajana Shrestha',
        specialization: 'Gynecology & Obstetrics',
        qualification: 'MD Obstetrics & Gynecology',
        experience: 9,
        rating: 4.8,
        availableDays: 'Tue – Sat, 9AM – 3PM',
        bio: 'Specialist in antenatal care, ultrasound-guided procedures, and postnatal wellness programs for mothers and newborns.',
        phone: '+977 01-4533361',
        images: [
          'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80',
          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
        ],
      },
    ],
  },

  pediatrics: {
    title: 'Pediatrician | Nita Clinics',
    description:
      'Qualified pediatrician at Nita Clinics providing comprehensive child healthcare from newborn to adolescent.',
    heading: 'Pediatrician',
    icon: '👶',
    heroVideo: {
      src: '/videos/hero/pediatric-consult.mp4',
      poster: '/videos/hero/pediatric-consult.jpg',
    },
    gradient: 'from-primary-700 to-primary-800',
    accentColor: 'bg-primary-500',
    intro:
      'Specialized medical care for infants, children, and adolescents — covering growth monitoring, immunization, developmental assessment, and pediatric illness management.',
    conditions: [
      'Common Cold, Flu & Fever',
      'Asthma & Respiratory Issues',
      'Growth & Developmental Disorders',
      'Nutritional Deficiency',
      'Diarrhea & Gastroenteritis',
      'Ear & Throat Infections',
      'Neonatal Concerns',
      'Behavioral & Learning Challenges',
      'Vaccine-Preventable Diseases',
      'Developmental Milestones',
    ],
    procedures: [
      'Growth Monitoring & Charting',
      'Vaccination Review & Planning',
      'Developmental Assessment',
      'Neonatal Checkup',
      'Nutritional Counseling',
      'Pediatric Blood & Urine Tests',
    ],
    faq: [
      {
        q: 'What age range does pediatrics cover?',
        a: 'Our pediatric care supports children from newborn stage through adolescence (up to 18 years).',
      },
      {
        q: 'Can I get vaccination guidance here?',
        a: 'Yes. Our team supports routine, catch-up, and travel immunization planning aligned with national and international guidelines.',
      },
      {
        q: 'How do I prepare my child for the first visit?',
        a: 'Bring their vaccination card, any previous health records, and note current symptoms. Most children adjust quickly in our child-friendly environment.',
      },
      {
        q: 'Do you handle newborn care?',
        a: 'Yes. We provide neonatal checkups, weight monitoring, feeding guidance, and jaundice assessments for newborns.',
      },
    ],
    fallbackDoctors: [
      {
        id: 'ped-1',
        name: 'Mukti Ghimire',
        specialization: 'Pediatrics',
        qualification: 'MD Pediatrics, FCPS',
        experience: 11,
        rating: 4.9,
        availableDays: 'Mon – Fri, 9AM – 5PM',
        bio: 'Senior pediatrician specializing in child growth, vaccine-preventable disease prevention, and neonatal health assessment.',
        phone: '+977 01-4533361',
        isTopRated: true,
        images: [
          'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80',
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80',
        ],
      },
      {
        id: 'ped-2',
        name: 'Kosh Raj RC',
        specialization: 'Pediatrics',
        qualification: 'MD Pediatrics',
        experience: 7,
        rating: 4.7,
        availableDays: 'Tue – Sat, 10AM – 4PM',
        bio: 'Pediatric consultant focused on nutritional counseling, developmental milestones, and allergy management in children.',
        phone: '+977 01-4533361',
        images: [
          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
        ],
      },
    ],
  },

  tuberculosis: {
    title: 'Tuberculosis (TB) Specialist | Nita Clinics',
    description:
      'Expert tuberculosis diagnosis and treatment at Nita Clinics using modern NTCC-aligned protocols.',
    heading: 'Tuberculosis (TB)',
    icon: '🫁',
    heroVideo: {
      src: '/videos/hero/tb-xray-doctor.mp4',
      poster: '/videos/hero/tb-xray-doctor.jpg',
    },
    gradient: 'from-emerald-700 to-teal-800',
    accentColor: 'bg-emerald-600',
    intro:
      'Focused diagnosis, treatment monitoring, and prevention for pulmonary and extra-pulmonary tuberculosis — aligned with NTCC protocols and WHO guidelines.',
    conditions: [
      'Pulmonary Tuberculosis',
      'Latent TB Infection (LTBI)',
      'Drug-Resistant TB (MDR-TB)',
      'Extra-Pulmonary TB',
      'TB Lymphadenitis',
      'Pleural TB',
      'TB Meningitis',
      'TB Peritonitis',
      'Bone & Joint TB',
      'Miliary (Disseminated) TB',
      'ADSN — Active Drug Safety & Monitoring',
      'Chest Conditions Requiring Cleaning & Drainage',
    ],
    procedures: [
      'Sputum Smear Microscopy (AFB)',
      'GeneXpert MTB/RIF',
      'Chest X-ray (Digital)',
      'Culture & Drug Sensitivity Test',
      'DOTS Therapy Initiation',
      'Treatment Monitoring',
      'Tuberculin Skin Test (TST)',
      'IGRA (Interferon-Gamma Release Assay)',
      'ADSN — Active Drug Safety Monitoring',
      'Chest Cleaning & Pleural Fluid Management',
    ],
    faq: [
      {
        q: 'Is TB treatment free?',
        a: 'First-line anti-TB medicines are available under national programs. Please consult our specialist for details on your specific case and coverage.',
      },
      {
        q: 'How long does TB treatment take?',
        a: 'Standard treatment is 6 months. Drug-resistant TB may require 9–24 months depending on the type and response.',
      },
      {
        q: 'Can TB spread to family members?',
        a: 'Pulmonary TB is airborne. Family contacts should be screened. Our team provides contact tracing advice and preventive therapy options.',
      },
      {
        q: 'What are the symptoms of TB?',
        a: 'Persistent cough for 2+ weeks, blood in sputum, unexplained weight loss, night sweats, and prolonged fever are key symptoms requiring urgent evaluation.',
      },
    ],
    fallbackDoctors: [
      {
        id: 'tb-1',
        name: 'Bikash Shrestha',
        specialization: 'Pulmonology & TB',
        qualification: 'MD Pulmonology, DTCD',
        experience: 10,
        rating: 4.8,
        availableDays: 'Mon – Fri, 8AM – 2PM',
        bio: 'Pulmonology specialist with extensive experience in TB diagnosis, DOTS therapy, and drug-resistant TB management using GeneXpert and culture-guided protocols.',
        phone: '+977 01-4533361',
        isTopRated: true,
        images: [
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80',
          'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80',
        ],
      },
      {
        id: 'tb-2',
        name: 'Anish Mahato',
        specialization: 'Internal Medicine & TB',
        qualification: 'MD Internal Medicine',
        experience: 6,
        rating: 4.7,
        availableDays: 'Wed – Sun, 10AM – 4PM',
        bio: 'Internal medicine physician with a focus on infectious disease management, contact screening, and preventive therapy for TB-exposed individuals.',
        phone: '+977 01-4533361',
        images: [
          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
          'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
        ],
      },
    ],
  },

  orthopedics: {
    title: 'Orthopedics | Nita Clinics',
    description:
      'Expert orthopedic care at Nita Clinics for bone, joint, muscle, and spine conditions, fractures, and post-injury rehabilitation.',
    heading: 'Orthopedics',
    icon: '🦴',
    heroVideo: {
      src: '/videos/hero/orthopedic-consult.mp4',
      poster: '/videos/hero/orthopedic-consult.jpg',
    },
    gradient: 'from-indigo-700 to-violet-800',
    accentColor: 'bg-indigo-500',
    intro:
      'Comprehensive musculoskeletal care covering bone, joint, muscle, and spine conditions — from acute fractures and trauma to chronic arthritis and post-injury rehabilitation — delivered by experienced orthopedic consultants.',
    conditions: [
      'Osteoarthritis & Joint Pain',
      'Back & Neck Pain',
      'Sciatica & Disc Problems',
      'Tendon & Ligament Injuries',
      'Shoulder & Knee Pain',
      'Osteoporosis',
      'Carpal Tunnel Syndrome',
      'Plantar Fasciitis',
      'Frozen Shoulder',
      'Knee & Hip Arthritis',
    ],
    procedures: [
      'Digital X-Ray & Bone Density',
      'Joint Aspiration & Injection',
      'Cast & Splint Application',
      'Orthopedic Consultation',
      'Post-Operative Care',
      'Spine & Posture Evaluation',
      'Pain Management',
    ],
    faq: [
      {
        q: 'When should I see an orthopedic specialist?',
        a: 'See a specialist for persistent joint or bone pain, swelling after an injury, limited movement, numbness, or any suspected fracture that does not improve within a few days.',
      },
      {
        q: 'What should I bring to my first appointment?',
        a: 'Bring any prior X-rays, MRI or CT reports, a list of current medications, and details of how and when your symptoms started.',
      },
    ],
    fallbackDoctors: [
      {
        id: 'ortho-1',
        name: 'Kamal Pradhan',
        specialization: 'Orthopedics & Trauma',
        qualification: 'MS Orthopedics',
        experience: 15,
        rating: 4.9,
        availableDays: 'Mon – Fri, 9AM – 3PM',
        bio: 'Senior orthopedic surgeon with 15+ years in trauma, joint replacement, and arthroscopy, focused on minimally invasive care and faster recovery.',
        phone: '+977 01-4533361',
        isTopRated: true,
        images: [
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80',
          'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80',
        ],
      },
      {
        id: 'ortho-2',
        name: 'Rita KC',
        specialization: 'Orthopedics & Rehabilitation',
        qualification: 'MD Orthopedics',
        experience: 8,
        rating: 4.8,
        availableDays: 'Tue – Sat, 10AM – 4PM',
        bio: 'Orthopedic specialist with a focus on musculoskeletal rehabilitation and non-surgical management of joint conditions.',
        phone: '+977 01-4533361',
        images: [
          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
          'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
        ],
      },
    ],
  },
};
