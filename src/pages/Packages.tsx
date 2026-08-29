import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, MapPin, Calendar, Users, ArrowRight, Compass, Globe, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { getPackages, TravelPackage, DEFAULT_PACKAGES } from '@/lib/supabase-services';
import { supabase } from '@/integrations/supabase/client';
import { EnquiryModal } from '@/components/EnquiryModal';

const CARDS_PER_PAGE = 4;

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
  'Best Seller': 'bg-amber-500',
  'Popular': 'bg-primary',
  'Featured': 'bg-indigo-600',
  'Trending': 'bg-emerald-600',
};

export interface PackagesProps {
  initialCategory?: 'domestic' | 'international';
}

const PackageCard = ({
  pkg,
  onNavigate,
  onWhatsApp
}: {
  pkg: TravelPackage;
  onNavigate: (path: string, state?: any) => void;
  onWhatsApp: () => void;
}) => {
  const safeHighlights = Array.isArray(pkg?.highlights)
    ? pkg.highlights
    : typeof pkg?.highlights === 'string'
    ? (pkg.highlights as string).split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const tagClass = (pkg?.tag && tagColors[pkg.tag]) ? tagColors[pkg.tag] : 'bg-slate-700/90';

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/80 hover:-translate-y-1 transition-all duration-500 flex flex-col">
      {/* Image */}
      <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0">
        <img
          src={pkg?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80'}
          alt={pkg?.name || 'Package'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-bold uppercase tracking-widest ${tagClass} text-white px-2.5 py-1 rounded-full backdrop-blur-sm`}>
            {pkg?.tag || 'Featured'}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-[11px] font-bold text-slate-800">{pkg?.rating || 4.8}</span>
          <span className="text-[9px] text-slate-400">({pkg?.reviews || 0})</span>
        </div>

        {/* Price on image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-[9px] font-semibold uppercase tracking-widest">Starts from</p>
            <p className="text-white text-2xl font-bold font-serif leading-none">{pkg?.price || 'On Request'}</p>
            <p className="text-white/60 text-[9px] mt-0.5">per person</p>
          </div>
          <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1">
            <Calendar className="w-2.5 h-2.5 text-white/80" />
            <span className="text-white/90 text-[9px] font-medium">{pkg?.duration || 'Flexible'}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 space-y-3.5">
        {/* Title + location */}
        <div>
          <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900 leading-tight">{pkg?.name || 'Untitled Package'}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
            <p className="text-slate-400 text-[11px] line-clamp-1">{pkg?.location || 'Multiple Locations'}</p>
          </div>
        </div>

        {/* Group size */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Users className="w-3 h-3 text-primary/50" />
          {pkg?.groupSize || '2–10 people'}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
          {safeHighlights.map((h, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">{String(h)}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-3 mt-auto border-t border-slate-100">
          <Button
            onClick={() => {
              if (pkg?.itinerary_url && pkg?.id) {
                onNavigate(`/packages/${pkg.id}/itinerary`);
              } else {
                onNavigate('/plan-trip', { state: { selectedPackage: pkg?.name } });
              }
            }}
            className="w-full h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-white gap-2 font-semibold transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
          >
            Book This Package
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Packages = ({ initialCategory = 'domestic' }: PackagesProps) => {
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>(initialCategory);
  const [page, setPage] = useState(1);
  const [allPackages, setAllPackages] = useState<TravelPackage[]>(DEFAULT_PACKAGES);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState<{ id?: string; name: string; itinerary_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadLivePackages() {
      setLoading(true);
      try {
        const pkgs = await getPackages();
        if (pkgs && pkgs.length > 0) {
          setAllPackages(pkgs);
        }
      } catch (err) {
        console.error('Error loading Supabase packages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLivePackages();

    const channel = supabase
      .channel('packages-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'packages' },
        () => {
          loadLivePackages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleWhatsAppClick = () => {
    setSelectedPackageInfo(null);
    setEnquiryOpen(true);
  };

  const getCategory = (cat?: string) => (cat || 'domestic').toLowerCase();

  const filteredPackages = (allPackages || []).filter(
    (pkg) => pkg && getCategory(pkg.category) === activeTab.toLowerCase()
  );
  const packagesToDisplay = filteredPackages.length > 0 ? filteredPackages : (allPackages || []);

  const domesticCount = (allPackages || []).filter(p => p && getCategory(p.category) === 'domestic').length;
  const intlCount = (allPackages || []).filter(p => p && getCategory(p.category) === 'international').length;

  const packagesRef = useRef<HTMLDivElement>(null);

  const switchTab = (tab: 'domestic' | 'international') => {
    setActiveTab(tab);
    setPage(1);
    packagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
                { id: 'domestic', label: 'Domestic', icon: Compass, count: domesticCount },
                { id: 'international', label: 'International', icon: Globe, count: intlCount },
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
                Showing all {packagesToDisplay.length} {activeTab} packages
              </p>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packagesToDisplay.map((pkg, index) => (
              <PackageCard key={pkg.id || `${activeTab}-${index}`} pkg={pkg} onNavigate={navigate} onWhatsApp={handleWhatsAppClick} />
            ))}
          </div>

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

      <EnquiryModal
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        packageInfo={selectedPackageInfo}
        sourceContext="packages_page"
      />
    </div>
  );
};

export default Packages;