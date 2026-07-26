export default function FakeLanding() {
  const stats = [
    { value: '1M+', label: 'Patients Treated Annually' },
    { value: '900+', label: 'Locations Nationwide' },
    { value: '1,800+', label: 'Clinical Providers' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-y-auto">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg leading-tight">Hangerr Clinic</p>
              <p className="text-xs text-gray-500">Prosthetics & Orthotics</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-orange-400">About</a>
            <a href="#" className="hover:text-orange-400">Services</a>
            <a href="#" className="hover:text-orange-400">Patients</a>
            <a href="#" className="hover:text-orange-400">Blog</a>
            <a href="#" className="hover:text-orange-400">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-orange-400 hidden sm:block">1 (877) 442-6437</span>
            <button className="px-4 py-2 bg-orange-400 text-white text-sm font-semibold rounded-md hover:bg-orange-300 transition-colors">
              Request Appointment
            </button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              The Leading Provider of Orthotic and Prosthetic Care
            </h1>
            <p className="mt-5 text-lg text-orange-50 leading-relaxed">
              With the largest network of highly skilled orthotists and prosthetists, 
              Hangerr Clinic is committed to delivering personalized care and innovative 
              technology to transform lives.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 bg-white text-orange-500 font-semibold rounded-md hover:bg-orange-50 transition-colors">
                About Us
              </button>
              <button className="px-6 py-3 border border-white/40 text-white font-semibold rounded-md hover:bg-white/10 transition-colors">
                Find a Clinic
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Prosthetics', desc: 'Custom prosthetic solutions for upper and lower limb differences, designed for comfort and mobility.' },
              { title: 'Orthotics', desc: 'Comprehensive bracing solutions for ankles, knees, hips, spine, and more to support your recovery.' },
              { title: 'Pediatrics', desc: 'Specialized care for children including scoliosis bracing, cranial helmets, and pediatric prosthetics.' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                <a href="#" className="mt-3 inline-block text-sm font-semibold text-orange-400 hover:underline">Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Empowering Human Potential</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Hangerr Clinic, we care for our patients like family, working together to deliver 
            the best possible orthotic and prosthetic outcomes. With more than 900 locations 
            across the country, we create customized solutions for people of all ages.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-4xl font-bold text-orange-400">{s.value}</p>
                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="font-bold text-white">Hangerr Clinic</span>
              </div>
              <p className="text-sm leading-relaxed">Prosthetics & Orthotics</p>
            </div>
            {[
              { title: 'About', links: ['Overview', 'Patient Experience', 'Appointments', 'Locations'] },
              { title: 'Patients', links: ['Overview', 'New Patients', 'Billing & Insurance', 'Peer Support'] },
              { title: 'Corporate', links: ['Corporate Website', 'Careers', 'Newsroom', 'Foundation'] },
            ].map((col, i) => (
              <div key={i}>
                <p className="font-semibold text-white mb-3">{col.title}</p>
                <ul className="space-y-2 text-sm">
                  {col.links.map((l, j) => <li key={j}><a href="#" className="hover:text-white transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
            <p>©2026 Hangerr Clinic. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
