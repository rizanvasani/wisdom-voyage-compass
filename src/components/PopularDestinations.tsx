import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getDestinations, PopularDestination, DEFAULT_DESTINATIONS } from '@/lib/supabase-services';

const PopularDestinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<PopularDestination[]>(DEFAULT_DESTINATIONS);

  useEffect(() => {
    async function loadLiveDestinations() {
      try {
        const data = await getDestinations();
        if (data && data.length > 0) {
          setDestinations(data);
        }
      } catch (err) {
        console.error('Error fetching Supabase destinations:', err);
      }
    }
    loadLiveDestinations();
  }, []);

  return (
    <section className="relative flex flex-col justify-center bg-white py-16 lg:py-24 overflow-x-hidden no-scrollbar">
      <div className="container-custom w-full px-6 sm:px-8 lg:px-0">

        {/* Layout Wrapper: Grid for Desktop, Block for Mobile */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Carousel Entity - Standardized with Services (Now on Left for Desktop) */}
          <div className="lg:col-span-8 lg:order-first order-last relative px-0">
            <Carousel
              opts={{
                align: "start",
                loop: false,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 flex no-scrollbar">
                {destinations.map((dest, index) => (
                  <CarouselItem key={dest.id} className="basis-[260px] sm:basis-[320px] lg:basis-[380px] pl-4 lg:pl-6 leading-none">
                    <div
                      className="group relative animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative h-[380px] sm:h-[480px] lg:h-[550px] w-full rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
                        {/* Image Component */}
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        />

                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />

                        {/* Top Badges */}
                        <div className="absolute top-4 inset-x-4 flex justify-between items-start">
                          <Badge className="bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-lg px-2 py-1 text-[8px] sm:text-[10px] font-semibold tracking-wide">
                            {dest.tag}
                          </Badge>
                          <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-xl shadow-lg flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-[10px] font-bold text-slate-800">{dest.rating}</span>
                          </div>
                        </div>

                        {/* Bottom Content Area */}
                        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 transform transition-transform duration-500 group-hover:-translate-y-1">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-1.5 text-white/80 text-[10px] sm:text-xs">
                              <MapPin className="w-3 h-3 text-primary-light" />
                              <span className="line-clamp-1">{dest.location}</span>
                            </div>

                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white leading-tight">
                              {dest.name}
                            </h3>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex flex-col">
                                <span className="text-white/60 text-[8px] uppercase tracking-widest">Starts from</span>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-lg sm:text-xl font-bold text-white font-serif">{dest.price}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 text-white/90 font-medium text-[10px] bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
                                <Calendar className="w-3 h-3 text-primary-light" />
                                <span>{dest.duration}</span>
                              </div>
                            </div>

                            <p className="text-white/50 text-[10px] sm:text-[11px] line-clamp-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
                              {dest.description}
                            </p>
                          </div>
                        </div>

                        {/* Clickable Area Overlay */}
                        <div
                          className="absolute inset-0 cursor-pointer"
                          onClick={() => navigate('/plan-trip', { state: { selectedDestination: dest.name } })}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Custom Navigation for Desktop */}
              <div className="hidden lg:flex absolute -bottom-14 right-0 gap-3">
                <CarouselPrevious className="static translate-y-0 h-11 w-11 rounded-xl border-2 border-slate-200 hover:border-primary hover:text-primary transition-all shadow-none" />
                <CarouselNext className="static translate-y-0 h-11 w-11 rounded-xl border-2 border-slate-200 hover:border-primary hover:text-primary transition-all shadow-none" />
              </div>
            </Carousel>
          </div>

          {/* Header Entity - Matched to Services Layout (Now on Right for Desktop) */}
          <div className="lg:col-span-4 lg:order-last order-first text-left space-y-3 lg:space-y-6 animate-fade-in lg:pl-16 mb-10 lg:mb-0">
            <div className="space-y-2 lg:space-y-3">
              <div className="inline-flex items-center px-2 py-0.5 bg-primary/10 rounded-full text-primary font-bold text-[8px] lg:text-[10px] tracking-widest uppercase">
                Expertise
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight">
                Popular <br className="hidden lg:block" /> <span className="gradient-text">Destinations</span>
              </h2>
            </div>
            <p className="max-w-[280px] lg:max-w-md text-[13px] lg:text-lg text-slate-600 leading-relaxed">
              Handpicked escapes designed for travelers who seek the extraordinary.
            </p>

            {/* <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-1 bg-primary/30 rounded-full" />
              <span className="text-slate-400 text-sm font-medium italic">Swipe to explore</span>
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
