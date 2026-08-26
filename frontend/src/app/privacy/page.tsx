import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="section-padding bg-neutral-50">
      <div className="container-custom max-w-3xl">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">Nita Clinic</p>
          <h1 className="mt-2 text-3xl font-heading font-bold text-neutral-900">Privacy Policy</h1>
          <p className="mt-4 text-neutral-600">We collect only the information needed to provide appointments, reports, enquiries, and clinic services.</p>
          <div className="mt-8 space-y-6 text-sm leading-7 text-neutral-700">
            <section><h2 className="text-lg font-semibold text-neutral-900">Information we use</h2><p>Contact details, appointment details, account information, and service-related records may be used to coordinate care, respond to requests, and maintain secure patient access.</p></section>
            <section><h2 className="text-lg font-semibold text-neutral-900">How we protect it</h2><p>Access is limited to authorised clinic personnel and service providers who need the information to operate the website and clinic workflows. We do not sell personal information.</p></section>
            <section><h2 className="text-lg font-semibold text-neutral-900">Your choices</h2><p>For questions or requests about your information, contact the clinic at <a className="text-primary-700 underline" href="mailto:info@nitaclinics.com">info@nitaclinics.com</a> or call +977-01-4533361.</p></section>
          </div>
          <Link href="/" className="mt-8 inline-flex text-sm font-semibold text-primary-700 hover:underline">Back to Nita Clinic</Link>
        </div>
      </div>
    </main>
  );
}
