import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getPackages, createPackage, TravelPackage, DEFAULT_PACKAGES, createInquiry, createEnquiryRecord } from '@/lib/supabase-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  MapPin,
  Calendar,
  Users,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Sparkles
} from 'lucide-react';
import { EnquiryModal } from '@/components/EnquiryModal';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

export default function PackageItinerary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  // Enquiry Modal state
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useEffect(() => {
    async function loadPackage() {
      setLoading(true);
      try {
        if (id) {
          const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          if (data && !error) {
            setPkg({
              id: data.id,
              name: data.name || data.title || '',
              category: data.category as any,
              location: data.location,
              duration: data.duration,
              price: data.price,
              rating: Number(data.rating || 4.8),
              reviews: Number(data.reviews || 0),
              image: data.image,
              highlights: Array.isArray(data.highlights) ? data.highlights : [],
              groupSize: data.group_size || '2–10 people',
              tag: data.tag || '',
              itinerary_url: data.itinerary_url || (data as any).itineraryUrl || '',
              created_at: data.created_at
            });
            setLoading(false);
            return;
          }
        }

        // Fallback search in all packages or default packages
        const allPkgs = await getPackages();
        const found = allPkgs.find(p => p.id === id || p.name.toLowerCase().includes(id?.toLowerCase() || ''));
        if (found) {
          setPkg(found);
        } else {
          // Default fallback
          setPkg(DEFAULT_PACKAGES[0]);
        }
      } catch (err) {
        console.error('Error fetching itinerary package:', err);
        setPkg(DEFAULT_PACKAGES[0]);
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [id]);

  const openWhatsAppDirect = () => {
    setEnquiryOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4 text-slate-700">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading itinerary details...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-slate-800 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-2xl font-serif font-bold">Package Not Found</h2>
        <p className="text-slate-500 text-sm max-w-md">The requested tour package itinerary could not be found or has been removed.</p>
        <Button onClick={() => navigate('/packages')} className="bg-primary text-white gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Packages
        </Button>
      </div>
    );
  }

  const hasItineraryUrl = Boolean(pkg.itinerary_url && pkg.itinerary_url.trim().length > 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 font-sans">
      <SEO
        title={`${pkg.name} — Interactive Itinerary`}
        description={`View detailed day-by-day itinerary and inquire for ${pkg.name} with Wisdom Travel and Tours.`}
        path={`/packages/${pkg.id || 'view'}/itinerary`}
      />

      {/* STICKY TOP HEADER — BRANDED UI */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-3 flex items-center justify-between gap-4 shadow-sm shadow-slate-200/50">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            onClick={() => navigate('/packages')}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-2.5 sm:px-3 text-xs gap-1.5 flex-shrink-0 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Packages</span>
          </Button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base lg:text-lg font-serif font-bold text-slate-900 truncate leading-tight">
              {pkg.name}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                {pkg.location}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:flex items-center gap-1 text-slate-700 font-medium">
                <Calendar className="w-3 h-3 text-amber-500" />
                {pkg.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={openWhatsAppDirect}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 h-9 rounded-xl shadow-sm shadow-emerald-600/20 gap-1.5"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>

          {hasItineraryUrl && (
            <Button
              onClick={() => window.open(pkg.itinerary_url!, '_blank')}
              variant="outline"
              size="sm"
              title="Open full itinerary in new tab"
              className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs gap-1.5 hidden md:flex rounded-xl h-9"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Direct
            </Button>
          )}

          <Button
            onClick={() => setEnquiryOpen(true)}
            size="sm"
            className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 h-9 rounded-xl shadow-md shadow-primary/20 gap-2"
          >
            <Send className="w-4 h-4" />
            Enquire Now
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative flex flex-col bg-[#F8FAFC]">
        {hasItineraryUrl && !iframeError ? (
          <div className="relative w-full flex-1 min-h-[calc(100vh-60px)] bg-slate-900 flex flex-col">
            {iframeLoading && (
              <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-slate-500 text-xs font-medium">Loading itinerary viewer...</p>
              </div>
            )}

            <iframe
              src={pkg.itinerary_url!}
              title={`${pkg.name} Itinerary`}
              className="w-full flex-1 min-h-[calc(100vh-60px)] border-0"
              onLoad={() => setIframeLoading(false)}
              onError={() => {
                setIframeLoading(false);
                setIframeError(true);
              }}
            />
          </div>
        ) : (
          /* FALLBACK VIEW */
          <div className="container mx-auto px-4 py-12 max-w-4xl flex-1 flex flex-col justify-center">
            <Card className="bg-white border-slate-100 overflow-hidden shadow-xl rounded-3xl">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-primary/90 text-white uppercase text-[10px] font-bold tracking-widest px-3 py-1">
                    {pkg.category}
                  </Badge>
                  {pkg.tag && (
                    <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2.5 py-1">
                      {pkg.tag}
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                    {pkg.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-white">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {pkg.location}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {pkg.duration}
                    </span>
                    <span className="text-xl font-bold font-serif text-white ml-auto">
                      {pkg.price}
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-6 bg-white">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Key Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(pkg.highlights || []).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs text-slate-700 font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {hasItineraryUrl ? (
                    <Button
                      onClick={() => window.open(pkg.itinerary_url!, '_blank')}
                      variant="outline"
                      className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold gap-2 rounded-xl h-11"
                    >
                      <ExternalLink className="w-4 h-4 text-primary" />
                      Open Full Itinerary (External Link)
                    </Button>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Detailed PDF / digital itinerary available upon enquiry.</p>
                  )}

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={openWhatsAppDirect}
                      className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-11 px-5 shadow-md shadow-emerald-600/20 gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      WhatsApp Us
                    </Button>
                    <Button
                      onClick={() => setEnquiryOpen(true)}
                      className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-2 rounded-xl h-11 px-6 shadow-md shadow-primary/20"
                    >
                      <Send className="w-4 h-4" />
                      Enquire Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* BRANDED ENQUIRY MODAL */}
      <EnquiryModal
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        packageInfo={pkg ? { id: pkg.id, name: pkg.name, itinerary_url: pkg.itinerary_url } : null}
        sourceContext="package"
      />
    </div>
  );
}
