'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Microscope, HeartPulse, ClipboardList } from 'lucide-react';
import { get } from '@/lib/api';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { DoctorDetailModal, type DoctorDetailData } from '@/components/specialists/DoctorDetailModal';

/* ── Types ── */
interface TeamMember {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  bio?: string;
  photo?: string;
  experience?: number;
  phone?: string;
  staffType?: 'doctor' | 'admin_staff' | 'nurse' | 'technician';
  isTopRated?: boolean;
  availableDays?: string;
  images?: string[];
  highlights?: string[];
}

const DEPT_GROUPS = [
  {
    label: 'Specialist Doctors',
    icon: Stethoscope,
    tile: 'bg-primary-50 text-primary-600',
    bar: 'from-primary-400 to-primary-600',
    trace: 'rgba(1,173,165,0.5)',
    glow: 'rgba(1,173,165,0.3)',
    eyebrow: 'Clinical Team',
    subtitle: 'Experienced doctors delivering consultations, lab tests, and preventive care.',
    types: ['doctor'],
  },
  {
    label: 'Lab & Technical Staff',
    icon: Microscope,
    tile: 'bg-emerald-50 text-emerald-600',
    bar: 'from-emerald-400 to-emerald-600',
    trace: 'rgba(16,185,129,0.5)',
    glow: 'rgba(16,185,129,0.3)',
    eyebrow: 'Lab & Imaging Team',
    subtitle: 'Precise laboratory and imaging support behind every accurate result.',
    types: ['technician'],
  },
  {
    label: 'Nursing Team',
    icon: HeartPulse,
    tile: 'bg-rose-50 text-rose-600',
    bar: 'from-rose-400 to-rose-600',
    trace: 'rgba(244,63,94,0.5)',
    glow: 'rgba(244,63,94,0.3)',
    eyebrow: 'Care Team',
    subtitle: 'Compassionate nurses coordinating patient comfort and follow-up.',
    types: ['nurse'],
  },
  {
    label: 'Administrative Staff',
    icon: ClipboardList,
    tile: 'bg-amber-50 text-amber-600',
    bar: 'from-amber-400 to-amber-600',
    trace: 'rgba(245,158,11,0.5)',
    glow: 'rgba(245,158,11,0.3)',
    eyebrow: 'Front Desk',
    subtitle: 'Friendly support for appointments, records, billing, and every visit detail.',
    types: ['admin_staff'],
  },
];

export default function TeamPage() {
  const [apiMembers, setApiMembers] = useState<TeamMember[]>([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetailData | null>(null);

  useEffect(() => {
    // Backend PaginationDto caps limit at 100 — higher values return 400 and an empty UI.
    get<{ data: Record<string, unknown>[] }>('doctors', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const rows = res.data || [];
        setApiMembers(
          rows.map((d) => ({
            id: String(d.id),
            name: String(d.name || ''),
            specialization: String(d.specialization || ''),
            qualification: d.qualification != null ? String(d.qualification) : undefined,
            bio: d.bio != null ? String(d.bio) : undefined,
            photo: d.photo != null ? String(d.photo) : undefined,
            experience: d.experience != null ? Number(d.experience) : undefined,
            phone: d.phone != null ? String(d.phone) : undefined,
            staffType: (d.staffType ?? (d as { staff_type?: string }).staff_type) as TeamMember['staffType'],
            images: d.photo ? [String(d.photo)] : undefined,
            highlights: [String(d.specialization || 'Clinical')],
          })),
        );
      })
      .catch(() => setApiMembers([]))
      .finally(() => setApiLoaded(true));
  }, []);

  const allMembers = apiMembers;
  const doctorCount = allMembers.filter((m) => m.staffType === 'doctor').length;
  const supportCount = allMembers.filter((m) =>
    ['nurse', 'technician', 'admin_staff'].includes(m.staffType || ''),
  ).length;

  function openModal(member: TeamMember) {
    setSelectedDoctor({
      name: member.name,
      specialization: member.specialization,
      qualification: member.qualification || 'Professional',
      experience: member.experience,
      rating: 4.8,
      availableDays: member.availableDays || 'Mon – Fri',
      bio: member.bio,
      phone: member.phone || '+977 01-4533361',
      isTopRated: member.isTopRated || false,
      images: member.images || (member.photo ? [member.photo] : ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80']),
      bookingHref: `/appointments/book?doctor=${encodeURIComponent(member.name)}&specialty=${encodeURIComponent(member.specialization)}`,
      highlights: member.highlights || [member.specialization, member.qualification || ''].filter(Boolean),
    });
  }

  return (
    <>
      <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      <main>
        <PremiumLandingHero
          eyebrow="Our People · Clinical & Support Teams"
          title="A coordinated team"
          highlight="around every patient."
          description="Specialist doctors, lab technicians, nurses, and administrative staff working together to make care feel clear, timely, and respectful."
          videoSrc="/videos/hero/doctor-tablet-consult.mp4"
          posterSrc="/videos/hero/doctor-tablet-consult.jpg"
          overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-primary-700/[0.42]"
          actions={[
            { label: 'Book Appointment', href: '/appointments/book' },
            { label: 'Meet Doctors', href: '/doctors', variant: 'secondary' },
          ]}
          trustPoints={[
            'Specialist doctors and clinical staff',
            'Lab and technical support',
            'Nursing and patient coordination',
            'Front-desk guidance for smoother visits',
          ]}
          stats={[
            { value: apiLoaded ? String(doctorCount) : '…', label: 'Specialist Doctors' },
            { value: apiLoaded ? String(supportCount) : '…', label: 'Support Staff' },
            { value: apiLoaded ? String(allMembers.length) : '…', label: 'Team Members' },
          ]}
          panelEyebrow="Team Workflow"
          panelTitle="Care works better when the team is connected."
          panelItems={[
            'Front desk support helps patients choose the right visit type.',
            'Clinical teams coordinate consultation, lab tests, and next steps.',
            'Support staff keep the visit organized from arrival through follow-up.',
          ]}
        />

        {/* ── Team sections ── */}
        {DEPT_GROUPS.map((grp, gi) => {
          const members = allMembers.filter((m) => grp.types.includes(m.staffType || 'doctor'));
          if (members.length === 0) return null;
          return (
            <section
              key={grp.label}
              className={`section-padding relative overflow-hidden ${gi % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 plus-pattern-light opacity-40" />
                <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
                <div className="absolute bottom-0 right-[-5rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
              </div>

              <div className="relative container-custom">
                <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${grp.tile} shadow-lg`}
                    >
                      <grp.icon className="h-6 w-6" />
                    </motion.span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-600">
                        {grp.eyebrow} · {String(gi + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
                        {grp.label}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-500">{grp.subtitle}</p>
                    </div>
                  </div>
                  {/* live pulse */}
                  <div className="hidden items-center gap-2 rounded-full border border-neutral-200/70 bg-white px-3.5 py-1.5 md:flex">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs font-semibold text-neutral-600">
                      {members.length} {members.length === 1 ? 'member' : 'members'} active
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {members.map((member, mi) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: mi * 0.07 }}
                    >
                      <DoctorCard
                        images={member.images || (member.photo ? [member.photo] : [])}
                        name={member.name}
                        specialization={member.specialization}
                        qualification={member.qualification || 'Professional'}
                        experience={member.experience}
                        rating={4.8}
                        availableDays={member.availableDays || 'Mon – Fri'}
                        bio={member.bio}
                        phone={member.phone}
                        isTopRated={member.isTopRated}
                        bookingHref={`/appointments/book?doctor=${encodeURIComponent(member.name)}`}
                        onViewProfile={() => openModal(member)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* CTA */}
      <CTAFooter
        title="Meet the people"
        highlight="who keep you healthy."
        subtitle="Our doctors, nurses, lab technicians and support staff work together to give you complete, connected care."
      />
    </>
  );
}
