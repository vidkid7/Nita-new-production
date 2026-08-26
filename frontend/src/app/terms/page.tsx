import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="section-padding bg-neutral-50">
      <div className="container-custom max-w-3xl">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">Nita Clinic</p>
          <h1 className="mt-2 text-3xl font-heading font-bold text-neutral-900">Terms of Use</h1>
          <div className="mt-8 space-y-6 text-sm leading-7 text-neutral-700">
            <section><h2 className="text-lg font-semibold text-neutral-900">Website information</h2><p>Information on this website is provided for clinic service guidance and does not replace a consultation with a qualified healthcare professional.</p></section>
            <section><h2 className="text-lg font-semibold text-neutral-900">Appointments and services</h2><p>Appointment requests are subject to clinician availability and clinic confirmation. Prices, schedules, and service details may be updated when clinic operations change.</p></section>
            <section><h2 className="text-lg font-semibold text-neutral-900">Responsible use</h2><p>Use accurate information when creating an account or booking a service. Do not attempt to access another person’s account or upload material you are not authorised to share.</p></section>
          </div>
          <Link href="/" className="mt-8 inline-flex text-sm font-semibold text-primary-700 hover:underline">Back to Nita Clinic</Link>
        </div>
      </div>
    </main>
  );
}
