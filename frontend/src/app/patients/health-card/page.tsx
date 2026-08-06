'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCreditCard, FiArrowLeft, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { get, getErrorMessage } from '@/lib/api';

interface HealthCardApplication {
  id: string;
  fullName?: string;
  applicantName?: string;
  name?: string;
  holderType?: string;
  cardType?: string;
  email?: string;
  phone?: string;
  status: string;
  cardNumber?: string;
  validUntil?: string;
  validFrom?: string;
  validTo?: string;
  rejectionReason?: string;
  createdAt: string;
  isCollected?: boolean;
}

function formatHolderLabel(t?: string) {
  if (!t) return 'Health Card';
  return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_INFO: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <FiClock className="w-5 h-5 text-yellow-500" />, label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  approved: { icon: <FiCheckCircle className="w-5 h-5 text-green-500" />, label: 'Approved', color: 'bg-green-100 text-green-700' },
  rejected: { icon: <FiXCircle className="w-5 h-5 text-red-500" />, label: 'Rejected', color: 'bg-red-100 text-red-700' },
  collected: { icon: <FiCreditCard className="w-5 h-5 text-primary-500" />, label: 'Card Collected', color: 'bg-primary-100 text-primary-700' },
};

export default function MyHealthCardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<HealthCardApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) { router.push('/patients/login'); return; }
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await get<HealthCardApplication[]>('health-card/applications/my');
      setApplications(Array.isArray(res) ? res : []);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to load health card applications');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/patients/dashboard" className="text-neutral-500 hover:text-primary-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">My Health Card</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <FiCreditCard className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 mb-2">No health card application found.</p>
            <Link href="/health-card" className="btn btn-primary inline-block mt-2">
              Apply for Health Card
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const displayStatus =
                app.isCollected && app.status === 'approved' ? 'collected' : app.status;
              const info =
                STATUS_INFO[displayStatus] || {
                  icon: <FiAlertCircle className="w-5 h-5" />,
                  label: app.status,
                  color: 'bg-neutral-100 text-neutral-600',
                };
              const displayName = app.fullName || app.applicantName || app.name;
              return (
                <div key={app.id} className="bg-white rounded-xl shadow-soft p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      {info.icon}
                      <div>
                        <p className="font-semibold text-neutral-900">
                          {formatHolderLabel(app.holderType || app.cardType)}
                        </p>
                        <p className="text-sm text-neutral-500">
                          Applied {format(new Date(app.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${info.color}`}>
                      {info.label}
                    </span>
                  </div>

                  {app.status === 'approved' || displayStatus === 'collected' ? (
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-4 text-white">
                      <p className="text-xs font-medium opacity-75 mb-1">NITA CLINICS HEALTH CARD</p>
                      {app.cardNumber && (
                        <p className="font-mono text-lg font-bold tracking-widest mb-2">{app.cardNumber}</p>
                      )}
                      <p className="text-sm font-medium">{displayName}</p>
                      {app.validUntil && (
                        <p className="text-xs opacity-75 mt-1">
                          Valid until {format(new Date(app.validUntil), 'MMM yyyy')}
                        </p>
                      )}
                      {!app.validUntil && app.validFrom && app.validTo && (
                        <p className="text-xs opacity-75 mt-1">
                          Valid: {format(new Date(app.validFrom), 'MMM yyyy')} – {format(new Date(app.validTo), 'MMM yyyy')}
                        </p>
                      )}
                    </div>
                  ) : null}

                  {app.status === 'rejected' && app.rejectionReason && (
                    <div className="bg-red-50 rounded-lg p-3 mt-2">
                      <p className="text-sm text-red-700">
                        <span className="font-medium">Reason: </span>{app.rejectionReason}
                      </p>
                    </div>
                  )}

                  {app.status === 'pending' && (
                    <p className="text-sm text-neutral-500 mt-2">
                      Your application is being reviewed. You will be notified once approved.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
