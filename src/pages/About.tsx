import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Award, Globe, Heart, Shield, Clock, Star, CheckCircle, ArrowRight, MapPin, MessageCircle, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

const About = () => {
  const navigate = useNavigate();

  const handleWhatsAppClick = () =>
    window.open('https://wa.me/9856664440?text=Hello, I would like to inquire about your travel services.', '_blank');

  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '10,000+', color: 'bg-blue-50 text-blue-600' },
    { icon: Globe, label: 'Destinations', value: '150+', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Award, label: 'Years Experience', value: '15+', color: 'bg-amber-50 text-amber-600' },
    { icon: Star, label: 'Average Rating', value: '4.9/5', color: 'bg-rose-50 text-rose-600' },
  ];

  const values = [
    { icon: Heart, title: 'Passion for Travel', description: 'We live and breathe travel, bringing you experiences that create lifelong memories.', color: 'text-rose-500', bg: 'bg-rose-50' },
    { icon: Shield, title: 'Trust & Reliability', description: 'Your safety and satisfaction are our top priorities. We always deliver on our promises.', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock assistance ensures your journey is smooth from start to finish.', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: CheckCircle, title: 'Quality Assurance', description: 'Every detail is carefully planned to exceed your expectations and deliver excellence.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const team = [
    {
      name: 'Riyaz Vasani',
      role: 'Managing Partner',
      experience: '30+ years',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Passionate travel enthusiast with extensive experience in hospitality and tourism.',
      quote: 'Travel is the only thing you can buy that makes you richer.',
    },
    {
      name: 'Sohail Rupani',
      role: 'Managing Partner',
      experience: '25+ years',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Expert in travel operations and ticketing, ensuring seamless travel experiences.',
      quote: 'Every journey begins with the courage to take the first step.',
    },
    {
      name: 'Rizan Vasani',
      role: 'Senior Associate',
      experience: '2+ years',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Specialist in corporate ticketing with deep knowledge of group travel management.',
      quote: 'The world is a book — those who don\'t travel read only one page.',
    },
  ];

  const milestones = [
    { year: '2019', event: 'Founded Wisdom Travel & Tours in Mumbai', icon: '🚀' },
    { year: '2020', event: 'Expanded portfolio to international destinations', icon: '✈️' },
    { year: '2021', event: 'Launched online booking and visa services', icon: '💻' },
    { year: '2022', event: 'Reached 5,000+ satisfied customers milestone', icon: '🎯' },
    { year: '2023', event: 'Introduced digital visa processing services', icon: '🛂' },
    { year: '2024', event: 'Celebrating 6 years of extraordinary journeys', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEO
        title="About Us"
        description="Founded in 2019 in Mumbai, Wisdom Travel and Tours has helped 10,000+ travelers explore 150+ destinations. Learn about our story, values, and travel experts."
        path="/about"
      />
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-0 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/4 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/4 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative container mx-auto px-6 max-w-7xl pb-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div className="space-y-7">
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase">
                  Est. 2019 · Mumbai, India
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-[1.1]">
                  Journeys crafted<br />
                  with <span className="gradient-text">heart & soul</span>
                </h1>
              </div>

              <p className="text-slate-500 text-base lg:text-lg leading-relaxed max-w-md">
                For 15 years, Wisdom Travel & Tours has been turning travel dreams into reality — one extraordinary journey at a time.
              </p>

              {/* Inline stats row */}
              <div className="flex flex-wrap gap-6 py-2 border-y border-slate-100">
                {stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-base font-bold font-serif text-slate-900 leading-none">{s.value}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                Dheeraj Heritage, Santacruz (West), Mumbai
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate('/plan-trip')}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-11 text-sm font-semibold gap-2 shadow-lg shadow-primary/20"
                >
                  Plan Your Trip <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleWhatsAppClick}
                  variant="outline"
                  className="border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary rounded-xl px-6 h-11 text-sm font-semibold gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </Button>
              </div>
            </div>

            {/* Right: stacked images */}
            <div className="relative h-[520px] hidden lg:block">
              <div className="absolute top-0 right-0 w-[72%] h-[60%] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80">
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Travel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-[58%] h-[50%] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80 border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Travel"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Founded badge */}
              <div className="absolute top-[52%] right-[24%] bg-primary text-white rounded-2xl p-4 shadow-xl">
                <p className="text-white/70 text-[8px] uppercase tracking-widest">Founded</p>
                <p className="text-2xl font-bold font-serif leading-none">2019</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-[#F8FAFC]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-14 items-center">

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Quote card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 max-w-[220px]">
                <Quote className="w-5 h-5 text-primary/30 mb-2" />
                <p className="text-slate-700 text-xs leading-relaxed font-medium italic">
                  "We don't just book trips. We build memories that last forever."
                </p>
                <p className="text-primary text-[10px] font-bold mt-2">— Riyaz Vasani, Founder</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-7">
              <div>
                <div className="inline-flex items-center px-2.5 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase mb-4">
                  Our Story
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 leading-tight">
                  From a small dream to <span className="gradient-text">India's trusted</span> travel partner
                </h2>
              </div>

              <div className="space-y-4 text-slate-500 text-sm leading-relaxed">
                <p>
                  Founded in 2019 with a simple vision — to make travel accessible, memorable, and transformative for everyone. What started as a small travel agency has grown into one of India's most trusted travel partners.
                </p>
                <p>
                  Our journey began with a passionate team of travel enthusiasts who believed that travel is not just about visiting places, but about creating connections, understanding cultures, and building memories that last a lifetime.
                </p>
                <p>
                  Today, we've helped over 10,000 travelers explore 150+ destinations across the globe, from exotic international locations to hidden gems within India.
                </p>
              </div>

              {/* Milestone pills */}
              {/* Why choose us — replaces duplicate milestone pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { emoji: '🌍', label: '150+ Destinations', sub: 'Domestic & international' },
                  { emoji: '⭐', label: '4.9/5 Rating', sub: 'From verified travelers' },
                  { emoji: '🤝', label: 'Personal Service', sub: 'Tailored to every trip' },
                  { emoji: '🛡️', label: 'Fully Insured', sub: 'Safe, reliable bookings' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-slate-100 p-3.5 hover:border-primary/20 hover:shadow-sm transition-all">
                    <span className="text-lg flex-shrink-0">{item.emoji}</span>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-4 space-y-4">
              <div className="inline-flex items-center px-2.5 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase">
                What We Stand For
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 leading-tight">
                Values that <span className="gradient-text">guide us</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every decision we make, every package we craft, every trip we plan is rooted in these core principles.
              </p>
              <Button
                onClick={() => navigate('/plan-trip')}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-10 text-xs font-semibold gap-2 mt-2"
              >
                Work With Us <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <div key={i} className="group bg-[#F8FAFC] rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-transparent hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 ${v.bg} rounded-full blur-2xl opacity-40 translate-x-6 -translate-y-6 pointer-events-none`} />
                  <div className={`w-11 h-11 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                    <v.icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Dedicated professionals committed to making your travels truly exceptional
            </p>
          </div>

          {/* Mobile: horizontal scroll — Desktop: 3-col grid */}
          <div
            className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto no-scrollbar lg:overflow-visible pb-2 lg:pb-0"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            {team.map((member, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2 transition-all duration-500 flex-shrink-0 lg:flex-shrink-0 lg:min-w-0 w-[78vw] lg:w-auto"
                style={{ scrollSnapAlign: 'start' } as React.CSSProperties}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {member.experience}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold font-serif text-xl leading-tight">{member.name}</p>
                    <p className="text-white/70 text-xs font-medium mt-0.5">{member.role}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">{member.description}</p>
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                    <Quote className="w-3.5 h-3.5 text-primary/40 mb-1.5" />
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">"{member.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile swipe hint */}
          <p className="text-center text-[10px] text-slate-400 mt-3 lg:hidden">
            ← Swipe to meet the team →
          </p>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">

          <div className="text-center mb-16">
            <div className="inline-flex items-center px-2.5 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase mb-4">
              Our Journey
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-bold text-slate-900">
              5+ Years of <span className="gradient-text">Excellence</span>
            </h2>
            <p className="text-slate-400 text-sm mt-3">Key milestones that shaped who we are today</p>
          </div>

          {/* Timeline */}
          <div className="relative">

            {/* Central spine line — desktop only */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2" />

            <div className="space-y-6 lg:space-y-0">
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col lg:flex-row items-stretch lg:items-center gap-0 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >

                    {/* Card */}
                    <div className={`lg:w-[calc(50%-2rem)] group`}>
                      <div className={`relative bg-[#F8FAFC] rounded-2xl border border-slate-100 p-6 lg:p-8 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-500 ${isLeft ? 'lg:mr-8' : 'lg:ml-8'}`}>

                        {/* Big faded year watermark */}
                        <div className="absolute top-3 right-4 text-6xl font-bold font-serif text-slate-100 select-none pointer-events-none leading-none">
                          {m.year}
                        </div>

                        <div className="relative z-10 space-y-2">
                          <span className="inline-block text-[10px] font-bold text-primary bg-primary/10 rounded-full px-3 py-1 tracking-widest uppercase">
                            {m.year}
                          </span>
                          <p className="text-slate-800 font-semibold text-sm sm:text-base leading-snug pr-12">
                            {m.event}
                          </p>
                        </div>

                        {/* Connector arrow — desktop */}
                        <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-8 h-px bg-primary/30 ${isLeft ? '-right-8' : '-left-8'}`} />

                        {/* Hover bottom accent */}
                        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      </div>
                    </div>

                    {/* Center dot — desktop */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary shadow-md shadow-primary/20 items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>

                    {/* Left side dot — mobile */}
                    <div className="lg:hidden absolute left-0 top-7 w-3 h-3 rounded-full bg-primary/20 border-2 border-primary/40" />

                    {/* Empty spacer for the other side — desktop */}
                    <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />

                  </div>
                );
              })}
            </div>

            {/* Mobile left spine */}
            <div className="lg:hidden absolute left-1.5 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2" />
          </div>

        </div>
      </section>
      {/* ── CTA ── */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="relative overflow-hidden bg-primary rounded-3xl">

            {/* Background image overlay */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"
                alt=""
                className="w-full h-full object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
            </div>

            <div className="relative px-8 sm:px-14 py-14 sm:py-16 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center lg:text-left">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3">Ready to explore?</p>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                  Your next adventure<br />starts right here
                </h3>
                <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-md">
                  Join thousands of satisfied travelers who've trusted us with their dreams. Let us craft your perfect journey.
                </p>

                {/* Social proof row */}
                <div className="flex items-center gap-4 mt-6 justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {['photo-1472099645785-5658abf4ff4e', 'photo-1507003211169-0a1dd7228f2d', 'photo-1500648767791-00dcc994a43e'].map((id, i) => (
                      <img
                        key={i}
                        src={`https://images.unsplash.com/${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80`}
                        className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                        alt=""
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-white/60 text-[10px] mt-0.5">Trusted by 10,000+ travelers</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-shrink-0 w-full sm:w-auto">
                <Button
                  onClick={() => navigate('/plan-trip')}
                  className="bg-white text-primary hover:bg-white/90 rounded-xl px-8 h-12 text-sm font-bold gap-2 shadow-xl w-full sm:w-auto"
                >
                  Plan Your Trip <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleWhatsAppClick}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 h-12 text-sm font-semibold gap-2 w-full sm:w-auto text-red-600"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </Button>
                {/* <Button
                  onClick={() => window.open('tel:+919856664440', '_self')}
                  className="text-white/50 text-xs text-center hover:text-white/80 transition-colors mt-1"
                >
                  or call +91 98566 64440
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;