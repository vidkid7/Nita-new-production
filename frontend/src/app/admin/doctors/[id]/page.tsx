'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiClock } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, getErrorMessage } from '@/lib/api';

interface DoctorDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee?: number;
  isActive: boolean;
  bio?: string;
  department?: { name?: string };
  availabilities?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration?: number;
  }>;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatClinicTime(value: string) {
  const [hourText, minute = '00'] = String(value || '').slice(0, 5).split(':');
  const hour = Number(hourText);
  if (!Number.isFinite(hour)) return value || '—';
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setIsLoading(true);
        const data = await get<DoctorDetail>(`doctors/${params.id}`);
        setDoctor(data);
      } catch (error) {
        console.error('Failed to load doctor', error);
        toast.error(getErrorMessage(error) || 'Failed to load doctor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/admin/doctors')}>
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Button>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <p className="text-neutral-600">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/admin/doctors')}>
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Button>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <p className="text-neutral-700 font-medium">Doctor not found.</p>
        </div>
      </div>
    );
  }

  const initials = doctor.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(doctor.email);
      toast.success('Email copied to clipboard');
    } catch {
      toast.error('Unable to copy email');
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(doctor.phone);
      toast.success('Phone number copied to clipboard');
    } catch {
      toast.error('Unable to copy phone number');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push('/admin/doctors')}>
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-neutral-900">{doctor.name}</h1>
            <p className="text-neutral-600 text-sm">
              {doctor.specialization} • {doctor.qualification}
              {doctor.department?.name ? ` • ${doctor.department.name}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/doctors/${doctor.id}/edit`}>
            <Button variant="secondary">Edit Profile</Button>
          </Link>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              doctor.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {doctor.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
        {/* Left: Profile & About */}
        <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-lg">{initials}</span>
            </div>
            <div>
              <p className="text-neutral-700">
                Experience:{' '}
                <span className="font-semibold text-neutral-900">
                  {doctor.experience}+ years
                </span>
              </p>
              <p className="text-neutral-700">
                Consultation Fee:{' '}
                <span className="font-semibold text-neutral-900">
                  {doctor.consultationFee != null ? `Rs. ${Number(doctor.consultationFee).toLocaleString('en-IN')}` : 'Not set'}
                </span>
              </p>

            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-3">
            <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-primary-500" />
              Availability
            </h2>
            {doctor.availabilities?.length ? (
              <ul className="grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
                {doctor.availabilities.map((slot) => (
                  <li key={`${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`} className="rounded-lg bg-neutral-50 px-3 py-2">
                    <span className="font-medium text-neutral-900">{DAY_NAMES[slot.dayOfWeek] || 'Day'}</span>
                    <span className="block">{formatClinicTime(slot.startTime)} – {formatClinicTime(slot.endTime)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-amber-700">No active availability is configured yet.</p>
            )}
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-3">
            <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
              <FiClock className="w-4 h-4 text-primary-500" />
              Clinical Information
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {doctor.bio || `${doctor.specialization} consultations at Nita Clinic.`}
            </p>
          </div>
        </div>

        {/* Right: Contact & Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-3">
            <h2 className="font-semibold text-neutral-900">Contact Information</h2>
            <button
              onClick={handleCopyEmail}
              className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-sm text-neutral-700"
            >
              <span className="flex items-center gap-2">
                <FiMail className="w-4 h-4 text-primary-500" />
                {doctor.email}
              </span>
              <span className="text-xs text-primary-600 font-medium">Copy</span>
            </button>
            <button
              onClick={handleCopyPhone}
              className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-sm text-neutral-700"
            >
              <span className="flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-primary-500" />
                {doctor.phone}
              </span>
              <span className="text-xs text-primary-600 font-medium">Copy</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 space-y-3">
            <h2 className="font-semibold text-neutral-900">Doctor Workspace</h2>
            <div className="space-y-2">
              <Link href={`/admin/doctors/${doctor.id}/edit`} className="block">
                <Button className="w-full justify-center">Manage Availability</Button>
              </Link>
              <Link href={`/admin/appointments?doctorId=${encodeURIComponent(doctor.id)}`} className="block">
                <Button variant="secondary" className="w-full justify-center">View Appointments</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

