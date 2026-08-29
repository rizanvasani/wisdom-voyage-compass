import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from '@emailjs/browser';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Calendar, Users, MapPin, Phone, Mail, Send, Plane, Hotel, FileText, Shield, CheckCircle, ArrowRight, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { createInquiry, createEnquiryRecord } from "@/lib/supabase-services";
import { EnquiryModal } from "@/components/EnquiryModal";

const planTripSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  destination: z.string().optional(),
  travelDates: z.string().optional(),
  adults: z.number().min(1).optional(),
  children: z.number().min(0).optional(),
  budget: z.array(z.number()).optional(),
  tripType: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type PlanTripForm = z.infer<typeof planTripSchema>;

const tripTypes = [
  "Honeymoon", "Family", "Adventure", "Luxury",
  "Business", "Solo Travel", "Group Tour", "Cruise Vacation",
];

const requirementOptions = [
  { label: "Flights", icon: Plane },
  { label: "Hotel", icon: Hotel },
  { label: "Land Package", icon: MapPin },
  { label: "Visa", icon: FileText },
  { label: "Insurance", icon: Shield },
];

const tripTypeEmojis: Record<string, string> = {
  "Honeymoon": "💑", "Family": "👨‍👩‍👧‍👦", "Adventure": "🧗",
  "Luxury": "✨", "Business": "💼", "Solo Travel": "🧳",
  "Group Tour": "👥", "Cruise Vacation": "🚢",
};

const PlanTrip = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<PlanTripForm>({
    resolver: zodResolver(planTripSchema),
    defaultValues: {
      name: "", email: "", phone: "",
      destination: "", travelDates: "",
      adults: 2, children: 0,
      budget: [50000],
      tripType: "", requirements: [], notes: "",
    },
  });

  const sendEmailJS = async (data: PlanTripForm) => {
    const serviceID = 'service_7jd4cv7';
    const publicKey = 'IyzAcrjwMY4P_StOx';
    const teamTemplateID = 'template_66u4wg8';
    const userTemplateID = 'template_98kngzo';

    const travelDates = (() => {
      const raw = data.travelDates || '';
      const [from, to] = raw.split('|');
      if (from && to) {
        const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const nights = Math.round((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24));
        return `${fmt(from)} to ${fmt(to)} (${nights} nights)`;
      }
      return raw || 'Not specified';
    })();

    const commonParams = {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      destination: data.destination || '',
      travel_dates: travelDates,
      adults: data.adults ?? 0,
      children: data.children ?? 0,
      budget: `₹${(data.budget?.[0] ?? 0).toLocaleString()}`,
      trip_type: data.tripType || '',
      requirements: data.requirements?.join(', ') || '',
      notes: data.notes || 'None',
    };

    const [teamResult, userResult] = await Promise.allSettled([

      // 1️⃣ Rizan gets full trip details
      emailjs.send(serviceID, teamTemplateID, {
        ...commonParams,
        to_email: 'rizan@wisdomtravel.in',
        subject: `New Trip Request from ${data.name}`,
      }, publicKey),

      // 2️⃣ Traveler gets confirmation
      emailjs.send(serviceID, userTemplateID, {
        ...commonParams,
        to_email: data.email,
        user_email: data.email,
        subject: `Your trip request to ${data.destination || 'your dream destination'} — Wisdom Travel & Tours`,
      }, publicKey),

    ]);

    if (teamResult.status === 'rejected') {
      console.error('Team email failed:', teamResult.reason);
      throw new Error('Failed to notify team');
    }
    if (userResult.status === 'rejected') {
      console.error('Confirmation email failed:', userResult.reason);
    }
  };

  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const handleWhatsAppSubmit = async () => {
    const data = form.getValues();
    if (!data.name || !data.name.trim()) {
      toast.error("Please enter your Full Name before sending on WhatsApp.");
      return;
    }
    if (!data.phone || !data.phone.trim()) {
      toast.error("Please enter your Phone Number before sending on WhatsApp.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnquiryRecord({
        package_title: data.destination ? `Plan Trip: ${data.destination}` : 'Custom Trip Request',
        package_id: null,
        name: data.name.trim(),
        email: data.email ? data.email.trim() : null,
        phone: data.phone.trim(),
        travel_date_from: data.travelDates || null,
        budget_per_person: data.budget ? `₹${data.budget[0].toLocaleString('en-IN')}` : null,
        needs: data.requirements || [],
        adults: data.adults || 2,
        children: data.children || 0,
        notes: data.notes || null,
        source: 'plan_trip'
      });

      await createInquiry({
        name: data.name.trim(),
        email: data.email || 'plantrip@lead.com',
        phone: data.phone.trim(),
        destination: data.destination || 'Custom Trip',
        travel_dates: data.travelDates || '',
        adults: data.adults,
        children: data.children,
        budget: data.budget ? `₹${data.budget[0].toLocaleString('en-IN')}` : '',
        trip_type: data.tripType,
        requirements: data.requirements,
        notes: `[Plan Trip WhatsApp] ${data.notes || ''}`,
        status: 'Pending'
      });

      const msgLines = [
        `Hello Wisdom Travel!`,
        `*Name:* ${data.name}`,
        `*Phone:* ${data.phone}`,
        data.email ? `*Email:* ${data.email}` : '',
        data.destination ? `*Destination:* ${data.destination}` : '',
        data.travelDates ? `*Travel Dates:* ${data.travelDates}` : '',
        data.budget ? `*Budget/Person:* ₹${data.budget[0].toLocaleString('en-IN')}` : '',
        data.tripType ? `*Trip Type:* ${data.tripType}` : '',
        data.requirements && data.requirements.length > 0 ? `*Needs:* ${data.requirements.join(', ')}` : '',
        `*Travelers:* ${data.adults || 2} Adults${data.children ? `, ${data.children} Children` : ''}`,
        data.notes ? `*Notes:* ${data.notes}` : ''
      ].filter(Boolean).join('\n');

      const whatsappUrl = `https://wa.me/9856664440?text=${encodeURIComponent(msgLines)}`;
      toast.success('Your trip details have been saved! Opening WhatsApp...');
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Error saving Plan Trip WhatsApp lead:', err);
      window.open('https://wa.me/9856664440', '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: PlanTripForm) => {
    setIsSubmitting(true);
    try {
      await createInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        destination: data.destination,
        travel_dates: data.travelDates,
        adults: data.adults,
        children: data.children,
        budget: data.budget,
        trip_type: data.tripType,
        requirements: data.requirements,
        notes: data.notes
      }).catch(err => console.warn('Supabase inquiry save warning:', err));

      await createEnquiryRecord({
        package_title: data.destination ? `Plan Trip: ${data.destination}` : 'Custom Trip Request',
        package_id: null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        travel_date_from: data.travelDates || null,
        budget_per_person: data.budget ? `₹${data.budget[0].toLocaleString('en-IN')}` : null,
        needs: data.requirements || [],
        adults: data.adults || 2,
        children: data.children || 0,
        notes: data.notes || null,
        source: 'plan_trip'
      }).catch(err => console.warn('Supabase enquiry record save warning:', err));

      await sendEmailJS(data);
      setSubmitted(true);
      toast.success("Request sent! Check your inbox for a confirmation email.");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or WhatsApp us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedRequirements = form.watch("requirements") || [];
  const watchedBudget = form.watch("budget") || [50000];
  const watchedAdults = form.watch("adults") ?? 2;
  const watchedChildren = form.watch("children") ?? 0;

  const toggleRequirement = (req: string) => {
    const current = form.getValues("requirements") || [];
    form.setValue(
      "requirements",
      current.includes(req) ? current.filter(r => r !== req) : [...current, req]
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="text-center max-w-md space-y-6">
            <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Request Sent!</h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                We've received your trip request and sent a confirmation to your email. Our team will reach out within 24 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setSubmitted(false)}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-11 text-sm font-semibold gap-2"
              >
                Plan Another Trip <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => window.open('https://wa.me/9856664440', '_blank')}
                variant="outline"
                className="border-slate-200 text-slate-600 rounded-xl px-6 h-11 text-sm font-semibold"
              >
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEO
        title="Plan Your Trip"
        description="Tell us your travel dreams and Wisdom Travel and Tours will craft a custom itinerary — destinations, dates, budget, and preferences, all in one simple form."
        path="/plan-trip"
      />
      <Header />

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative container mx-auto px-6 max-w-7xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-2.5 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase mb-5">
              Trip Planning
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight mb-4">
              Plan Your <span className="gradient-text">Dream Trip</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg">
              Fill in your details below and our travel experts will craft a personalised itinerary just for you — usually within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* Left: form */}
            <div className="lg:col-span-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* ── CONTACT ── */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Contact Details</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Required so we can reach you</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input placeholder="Your full name" className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input placeholder="+91 XXXXX XXXXX" className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input type="email" placeholder="your@email.com" className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                        <p className="text-[10px] text-slate-400 mt-1">A confirmation will be sent to this address</p>
                      </FormItem>
                    )} />
                  </div>

                  {/* ── DESTINATION & DATES ── */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Where & When</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Help us understand your travel plans</p>
                    </div>

                    {/* Destination */}
                    <FormField control={form.control} name="destination" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Destination
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <Input
                              placeholder="e.g. Paris, Dubai, Goa, Switzerland..."
                              autoComplete="off"
                              autoCorrect="off"
                              autoCapitalize="words"
                              className="pl-9 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="travelDates" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Travel Dates
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {/* From */}
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                              <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                onChange={e => {
                                  const from = e.target.value;
                                  const current = field.value || '';
                                  const to = current.split('|')[1] || '';
                                  field.onChange(from ? `${from}|${to}` : `|${to}`);
                                }}
                                value={field.value?.split('|')[0] || ''}
                                className="w-full pl-9 pr-4 h-11 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                style={{ colorScheme: 'light' }}
                              />
                              <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider pointer-events-none select-none bg-slate-50 pr-1"
                                style={{ display: field.value?.split('|')[0] ? 'none' : 'block' }}>
                              </span>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-2 px-1">
                              <div className="flex-1 h-px bg-slate-200" />
                              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">to</span>
                              <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            {/* To */}
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                              <input
                                type="date"
                                min={field.value?.split('|')[0] || new Date().toISOString().split('T')[0]}
                                onChange={e => {
                                  const to = e.target.value;
                                  const from = field.value?.split('|')[0] || '';
                                  field.onChange(`${from}|${to}`);
                                }}
                                value={field.value?.split('|')[1] || ''}
                                className="w-full pl-9 pr-4 h-11 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                style={{ colorScheme: 'light' }}
                              />
                            </div>

                            {/* Summary pill */}
                            {field.value?.split('|')[0] && field.value?.split('|')[1] && (() => {
                              const [from, to] = field.value.split('|');
                              const diff = Math.round((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24));
                              const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                              return (
                                <div className="flex items-center justify-between bg-primary/8 border border-primary/20 rounded-xl px-3 py-2">
                                  <span className="text-xs font-semibold text-primary">{fmt(from)} → {fmt(to)}</span>
                                  <span className="text-[10px] font-bold text-primary/70 bg-primary/10 rounded-full px-2 py-0.5">{diff} nights</span>
                                </div>
                              );
                            })()}
                          </div>
                        </FormControl>
                      </FormItem>
                    )} />
                    {/* Travelers counter */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Adults */}
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Adults</p>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                          <button type="button" onClick={() => form.setValue('adults', Math.max(1, watchedAdults - 1))}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary/30 hover:text-primary transition-all">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="flex-1 text-center text-sm font-bold text-slate-900">{watchedAdults}</span>
                          <button type="button" onClick={() => form.setValue('adults', watchedAdults + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary/30 hover:text-primary transition-all">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Children <span className="text-slate-400 normal-case font-normal">(under 12)</span></p>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                          <button type="button" onClick={() => form.setValue('children', Math.max(0, watchedChildren - 1))}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary/30 hover:text-primary transition-all">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="flex-1 text-center text-sm font-bold text-slate-900">{watchedChildren}</span>
                          <button type="button" onClick={() => form.setValue('children', watchedChildren + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary/30 hover:text-primary transition-all">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── TRIP PREFERENCES ── */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Trip Preferences</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Tell us what kind of trip you're dreaming of</p>
                    </div>

                    {/* Trip type */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Trip Type</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {tripTypes.map(type => {
                          const isSelected = form.watch('tripType') === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => form.setValue('tripType', isSelected ? '' : type)}
                              className={`relative py-3 px-3 rounded-2xl border text-xs font-bold transition-all duration-200 text-center overflow-hidden ${isSelected
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-primary/30 hover:text-primary hover:shadow-sm'
                                }`}
                            >
                              {/* Selected glow */}
                              {isSelected && (
                                <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                              )}
                              <span className="relative z-10">{type}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Budget slider */}
                    <FormField control={form.control} name="budget" render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Budget Per Person</p>
                          <span className="text-sm font-bold text-primary bg-primary/10 rounded-full px-3 py-1">
                            ₹{(field.value?.[0] ?? 50000).toLocaleString()}
                          </span>
                        </div>

                        {/* Quick preset buttons */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {[
                            { label: 'Under ₹25K', value: 25000 },
                            { label: '₹50K', value: 50000 },
                            { label: '₹1L', value: 100000 },
                            { label: '₹2L', value: 200000 },
                            { label: '₹5L+', value: 500000 },
                          ].map(preset => {
                            const isActive = field.value?.[0] === preset.value;
                            return (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => field.onChange([preset.value])}
                                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${isActive
                                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary/20 hover:text-primary'
                                  }`}
                              >
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Fine-tune slider */}
                        <FormControl>
                          <Slider
                            min={10000} max={1000000} step={10000}
                            value={field.value || [50000]}
                            onValueChange={field.onChange}
                            className="w-full"
                          />
                        </FormControl>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                          <span>₹10,000</span>
                          <span>₹10,00,000</span>
                        </div>
                      </FormItem>
                    )} />

                    {/* Requirements */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">What do you need?</p>
                      <div className="flex flex-wrap gap-2.5">
                        {requirementOptions.map(({ label, icon: Icon }) => {
                          const isSelected = watchedRequirements.includes(label);
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => toggleRequirement(label)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${isSelected
                                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary/20 hover:text-primary'
                                }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── NOTES ── */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Anything else?</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Special requests, dietary needs, accessibility requirements…</p>
                    </div>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us anything that would help us plan the perfect trip for you..."
                            className="min-h-[120px] rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm resize-none"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleWhatsAppSubmit}
                      disabled={isSubmitting}
                      className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-60"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Send on WhatsApp
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm gap-2.5 shadow-xl shadow-primary/20 transition-all disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending request...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Email Request
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-[11px] text-slate-400">
                    By submitting you agree to be contacted by Wisdom Travel & Tours. No spam, ever.
                  </p>
                </form>
              </Form>
            </div>

            {/* Right: sidebar */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">

              {/* Why us */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Why plan with us?</h3>
                {[
                  { icon: CheckCircle, text: 'Response within 24 hours' },
                  { icon: Shield, text: 'No hidden fees, ever' },
                  { icon: Users, text: 'Personalised itineraries' },
                  { icon: Phone, text: '24/7 support on your trip' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-600 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>

              {/* Contact shortcuts */}
              <div className="bg-primary rounded-3xl p-6 space-y-3 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Prefer to talk?</p>
                <h3 className="text-white font-bold text-base font-serif">Reach us directly</h3>
                <button
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-4 py-3 text-xs font-semibold transition-all"
                >
                  <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp Us
                </button>
                <button
                  type="button"
                  onClick={() => window.open('tel:+919856664440', '_self')}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-4 py-3 text-xs font-semibold transition-all"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +91 98566 64440
                </button>
              </div>

              {/* Trust note */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-center">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Trusted by <span className="font-bold text-slate-700">10,000+ travelers</span> since 2019. Your data is safe and never shared.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      <EnquiryModal
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        sourceContext="plan_trip"
      />
    </div>
  );
};

export default PlanTrip;