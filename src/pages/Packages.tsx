import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, MapPin, Calendar, Users, ArrowRight, Compass, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

const CARDS_PER_PAGE = 4;

const domesticPackages = [
  {
    name: 'Golden Triangle Tour',
    location: 'Delhi, Agra, Jaipur',
    duration: '6 Days / 5 Nights',
    price: '₹35,000',
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Taj Mahal Visit', 'Red Fort', 'Hawa Mahal', 'Local Cuisine'],
    groupSize: '2–15 people',
    tag: 'Most Popular',
  },
  {
    name: 'Kerala Backwaters',
    location: 'Kochi, Alleppey, Munnar',
    duration: '5 Days / 4 Nights',
    price: '₹28,000',
    rating: 4.7,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Houseboat Stay', 'Tea Plantations', 'Spice Gardens', 'Ayurvedic Spa'],
    groupSize: '2–12 people',
    tag: 'Serene',
  },
  {
    name: 'Goa Beach Paradise',
    location: 'North & South Goa',
    duration: '4 Days / 3 Nights',
    price: '₹22,000',
    rating: 4.6,
    reviews: 289,
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Beach Activities', 'Water Sports', 'Local Markets', 'Sunset Cruise'],
    groupSize: '2–20 people',
    tag: 'Beach Vibes',
  },
  {
    name: 'Himachal Hill Stations',
    location: 'Shimla, Manali, Dharamshala',
    duration: '7 Days / 6 Nights',
    price: '₹32,000',
    rating: 4.9,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Mountain Views', 'Adventure Sports', 'Local Culture', 'Photography'],
    groupSize: '2–10 people',
    tag: 'Adventure',
  },
  {
    name: 'Rajasthan Royal Circuit',
    location: 'Jaisalmer, Jodhpur, Udaipur',
    duration: '8 Days / 7 Nights',
    price: '₹42,000',
    rating: 4.8,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Desert Safari', 'Palace Hotels', 'Camel Ride', 'Folk Music'],
    groupSize: '2–14 people',
    tag: 'Heritage',
  },
  {
    name: 'Andaman Island Escape',
    location: 'Port Blair, Havelock, Neil Island',
    duration: '6 Days / 5 Nights',
    price: '₹45,000',
    rating: 4.8,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Scuba Diving', 'Glass Bottom Boat', 'Radhanagar Beach', 'Snorkelling'],
    groupSize: '2–10 people',
    tag: 'Island Life',
  },
  {
    name: 'Varanasi Spiritual Journey',
    location: 'Varanasi, Prayagraj, Ayodhya',
    duration: '5 Days / 4 Nights',
    price: '₹18,000',
    rating: 4.7,
    reviews: 224,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Ganga Aarti', 'Boat Ride', 'Kashi Vishwanath', 'Local Cuisine'],
    groupSize: '2–20 people',
    tag: 'Spiritual',
  },
];

const internationalPackages = [
  {
    name: 'Swiss Alps Adventure',
    location: 'Zurich, Interlaken, Jungfraujoch',
    duration: '8 Days / 7 Nights',
    price: '₹1,85,000',
    rating: 4.9,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Alpine Railways', 'Snow Activities', 'Lake Cruises', 'Mountain Hiking'],
    groupSize: '2–8 people',
    tag: 'Luxury',
  },
  {
    name: 'Iceland Nature Tour',
    location: 'Reykjavik, Blue Lagoon, Golden Circle',
    duration: '6 Days / 5 Nights',
    price: '₹1,95,000',
    rating: 4.8,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Northern Lights', 'Geysers', 'Waterfalls', 'Glacier Walks'],
    groupSize: '2–12 people',
    tag: 'Arctic Magic',
  },
  {
    name: 'Nepal Himalayan Trek',
    location: 'Kathmandu, Pokhara, Everest Base Camp',
    duration: '12 Days / 11 Nights',
    price: '₹95,000',
    rating: 4.9,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Everest Views', 'Sherpa Culture', 'Mountain Lodges', 'Photography'],
    groupSize: '4–12 people',
    tag: 'Trekking',
  },
  {
    name: 'Bali Tropical Escape',
    location: 'Ubud, Seminyak, Nusa Penida',
    duration: '7 Days / 6 Nights',
    price: '₹75,000',
    rating: 4.7,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Temple Visits', 'Beach Clubs', 'Rice Terraces', 'Volcano Tours'],
    groupSize: '2–15 people',
    tag: 'Tropical',
  },
  {
    name: 'Dubai Luxury Getaway',
    location: 'Dubai, Abu Dhabi, Sharjah',
    duration: '5 Days / 4 Nights',
    price: '₹85,000',
    rating: 4.8,
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Gold Souk', 'Dhow Cruise'],
    groupSize: '2–20 people',
    tag: 'Glamour',
  },
  {
    name: 'Thailand Island Hop',
    location: 'Bangkok, Phuket, Koh Samui',
    duration: '8 Days / 7 Nights',
    price: '₹68,000',
    rating: 4.7,
    reviews: 188,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Island Hopping', 'Street Food', 'Thai Massage', 'Phi Phi Islands'],
    groupSize: '2–16 people',
    tag: 'Island Hop',
  },
];

type Package = typeof domesticPackages[0];

const tagColors: Record<string, string> = {
  'Most Popular': 'bg-amber-500/90',
  'Serene': 'bg-teal-500/90',
  'Beach Vibes': 'bg-cyan-500/90',
  'Adventure': 'bg-orange-500/90',
  'Heritage': 'bg-purple-500/90',
  'Island Life': 'bg-blue-500/90',
  'Spiritual': 'bg-rose-500/90',
  'Luxury': 'bg-yellow-500/90',
  'Arctic Magic': 'bg-sky-500/90',
  'Trekking': 'bg-green-600/90',
  'Tropical': 'bg-emerald-500/90',
  'Glamour': 'bg-pink-500/90',
  'Island Hop': 'bg-indigo-500/90',
};

const Packages = () => {
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const handleWhatsAppClick = () =>
    window.open('https://wa.me/9856664440?text=Hello, I would like to inquire about your travel services.', '_blank');

  const packages = activeTab === 'domestic' ? domesticPackages : internationalPackages;
  const totalPages = Math.ceil(packages.length / CARDS_PER_PAGE);
  const paginated = packages.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  const packagesRef = useRef<HTMLDivElement>(null);

  const switchTab = (tab: 'domestic' | 'international') => {
    setActiveTab(tab);
    setPage(1);
    packagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const changePage = (newPage: number) => {
    setPage(newPage);
    packagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const PackageCard = ({ pkg }: { pkg: Package }) => (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/80 hover:-translate-y-1 transition-all duration-500 flex flex-col">

      {/* Image */}
      <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-bold uppercase tracking-widest ${tagColors[pkg.tag] ?? 'bg-slate-700/90'} text-white px-2.5 py-1 rounded-full backdrop-blur-sm`}>
            {pkg.tag}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-[11px] font-bold text-slate-800">{pkg.rating}</span>
          <span className="text-[9px] text-slate-400">({pkg.reviews})</span>
        </div>

        {/* Price on image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-[9px] font-semibold uppercase tracking-widest">Starts from</p>
            <p className="text-white text-2xl font-bold font-serif leading-none">{pkg.price}</p>
            <p className="text-white/60 text-[9px] mt-0.5">per person</p>
          </div>
          <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1">
            <Calendar className="w-2.5 h-2.5 text-white/80" />
            <span className="text-white/90 text-[9px] font-medium">{pkg.duration}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 space-y-3.5">

        {/* Title + location */}
        <div>
          <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900 leading-tight">{pkg.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
            <p className="text-slate-400 text-[11px] line-clamp-1">{pkg.location}</p>
          </div>
        </div>

        {/* Group size */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Users className="w-3 h-3 text-primary/50" />
          {pkg.groupSize}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
          {pkg.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">{h}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-3 mt-auto border-t border-slate-100">
          <Button
            onClick={() => navigate('/plan-trip', { state: { selectedPackage: pkg.name } })}
            className="w-full h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-white gap-2 font-semibold transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
          >
            Book This Package
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEO
        title="Domestic & International Holiday Packages"
        description="Browse curated domestic and international travel packages from Wisdom Travel and Tours — Golden Triangle, Kerala, Goa, Bali, Europe & more, with flexible group sizes."
        path="/packages"
      />
      <Header />

      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-14 bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            {/* Left: Title */}
            <div className="max-w-xl">
              <div className="inline-flex items-center px-2.5 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase mb-4">
                Handcrafted Experiences
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-slate-900 leading-tight">
                Find Your <br className="hidden sm:block" />
                <span className="gradient-text">Perfect Trip</span>
              </h1>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed mt-4 max-w-md">
                From serene backwaters to arctic adventures — every package is crafted to create memories that last forever.
              </p>
            </div>

            {/* Right: Tab switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
              {[
                { id: 'domestic', label: 'Domestic', icon: Compass, count: domesticPackages.length },
                { id: 'international', label: 'International', icon: Globe, count: internationalPackages.length },
              ].map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => switchTab(id as 'domestic' | 'international')}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${activeTab === id
                    ? 'bg-white text-primary shadow-sm shadow-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === id ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'
                    }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section ref={packagesRef} className="py-12 lg:py-16">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                {activeTab === 'domestic' ? '🇮🇳 Domestic' : '✈️ International'} Packages
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Showing {(page - 1) * CARDS_PER_PAGE + 1}–{Math.min(page * CARDS_PER_PAGE, packages.length)} of {packages.length} packages
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-slate-100 rounded-xl px-3 py-2">
              <span className="font-medium text-slate-600">Page {page}</span>
              <span>of {totalPages}</span>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {paginated.map((pkg, index) => (
              <PackageCard key={`${activeTab}-${index}`} pkg={pkg} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => changePage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-semibold hover:border-primary/30 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${page === i + 1
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => changePage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-semibold hover:border-primary/30 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Custom CTA */}
          <div className="mt-14 relative overflow-hidden bg-primary rounded-3xl p-8 sm:p-10 lg:p-12">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="max-w-lg">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Custom Itinerary</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white leading-tight">
                  Can't find your dream trip?
                </h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                  Tell us your dates, budget, and dream destinations — our experts will craft an itinerary just for you.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Button
                  onClick={() => navigate('/plan-trip')}
                  className="bg-white text-primary hover:bg-white/90 rounded-xl px-6 h-11 text-sm font-bold gap-2 shadow-lg"
                >
                  Plan Custom Trip
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleWhatsAppClick}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6 h-11 text-sm font-semibold text-red-600"
                >
                  WhatsApp Us
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;