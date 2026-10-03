import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  Phone,
  MessageCircle,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Search,
  X,
  ChevronDown,
  Laptop,
  AlertCircle,
  FileCheck,
  Plane,
  Sparkles,
  HelpCircle,
  Info
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { EnquiryModal } from '@/components/EnquiryModal';
import { COUNTRIES, Country, getCountryByCode, getFlagEmoji } from '@/data/countries';

// --- ORIZN VISA RESPONSE SHAPE ---
export interface OriznVisaData {
  passport: string;          // e.g. "IND"
  destination: string;       // e.g. "JPN"
  requirement: 'visa_free' | 'visa_on_arrival' | 'evisa' | 'eta' | 'visa_required' | string;
  visa_free_days?: number | null;
  visa_required?: boolean;
  description?: string;
  documents_required?: string[];
  process?: string[];
  tips?: string[];
}

export interface VisaErrorState {
  error: 'NO_DATA' | 'QUOTA' | 'INVALID' | 'SERVER';
  message: string;
}

// --- REQUIREMENT DISPLAY CONFIG ---
interface RequirementConfig {
  label: string;
  headlineFallback: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBg: string;
  cardBorder: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const requirementConfig: Record<string, RequirementConfig> = {
  visa_free: {
    label: 'Visa Free',
    headlineFallback: 'Visa-Free Entry',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    cardBg: 'bg-emerald-50/50',
    cardBorder: 'border-emerald-200',
    desc: 'You can travel to this destination without prior visa formalities.',
    icon: CheckCircle2,
  },
  visa_on_arrival: {
    label: 'Visa on Arrival',
    headlineFallback: 'Visa on Arrival Available',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    cardBg: 'bg-blue-50/50',
    cardBorder: 'border-blue-200',
    desc: 'Obtain your visa stamp or permit directly upon arrival at the immigration port.',
    icon: Plane,
  },
  evisa: {
    label: 'eVisa Required',
    headlineFallback: 'Electronic Visa (eVisa) Required',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    cardBg: 'bg-amber-50/50',
    cardBorder: 'border-amber-200',
    desc: 'Apply online and receive official electronic authorization before departing.',
    icon: Laptop,
  },
  eta: {
    label: 'eTA Required',
    headlineFallback: 'Electronic Travel Authorization (eTA)',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    badgeBorder: 'border-violet-200',
    cardBg: 'bg-violet-50/50',
    cardBorder: 'border-violet-200',
    desc: 'Fast online authorization linked electronically to your passport.',
    icon: FileCheck,
  },
  visa_required: {
    label: 'Visa Required',
    headlineFallback: 'Consulate / Embassy Visa Required',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200',
    cardBg: 'bg-red-50/50',
    cardBorder: 'border-red-200',
    desc: 'You must apply for an entry visa via the embassy or consulate before travel.',
    icon: AlertCircle,
  },
};

const defaultRequirementConfig: RequirementConfig = {
  label: 'Visa Required',
  headlineFallback: 'Visa Application Required',
  badgeBg: 'bg-slate-50',
  badgeText: 'text-slate-700',
  badgeBorder: 'border-slate-200',
  cardBg: 'bg-slate-50/50',
  cardBorder: 'border-slate-200',
  desc: 'Confirm the exact requirements with our visa team before traveling.',
  icon: HelpCircle,
};

// --- COUNTRY SELECTOR COMPONENT ---
interface CountrySelectorProps {
  value: string; // ISO alpha-3 code (e.g. "IND")
  onChange: (val: string) => void;
  placeholder: string;
  label: string;
  emoji: string;
  id: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder,
  label,
  emoji,
  id
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = useMemo(() => getCountryByCode(value), [value]);

  const filtered = useMemo(() => {
    if (!query) return COUNTRIES.slice(0, 80);
    const q = query.toLowerCase().trim();
    const starts = COUNTRIES.filter((c) => c.name.toLowerCase().startsWith(q));
    const contains = COUNTRIES.filter(
      (c) =>
        !c.name.toLowerCase().startsWith(q) &&
        (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    );
    return [...starts, ...contains].slice(0, 50);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
        {emoji} {label}
      </label>

      <button
        id={id}
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border rounded-xl text-sm text-left transition-all duration-200 ${
          open
            ? 'border-primary ring-2 ring-primary/20 bg-white'
            : 'border-slate-200 hover:border-slate-300 hover:bg-white'
        }`}
      >
        {selectedCountry ? (
          <>
            <span className="text-xl leading-none flex-shrink-0">
              {getFlagEmoji(selectedCountry.alpha2)}
            </span>
            <span className="flex-1 text-slate-900 font-medium truncate">
              {selectedCountry.name}{' '}
              <span className="text-xs text-slate-400 font-mono ml-1">({selectedCountry.code})</span>
            </span>
          </>
        ) : (
          <>
            <span className="text-lg leading-none flex-shrink-0 opacity-30">🌐</span>
            <span className="flex-1 text-slate-400">{placeholder}</span>
          </>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          {value && (
            <span
              onClick={handleClear}
              className="w-5 h-5 rounded-full bg-slate-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country name or code..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400 min-w-0"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <ul
            className="overflow-y-auto overscroll-contain"
            style={{ maxHeight: '220px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-400">No countries found</li>
            ) : (
              filtered.map((c) => {
                const isSelected = c.code === value;
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(c.code);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg leading-none flex-shrink-0 w-6 text-center">
                        {getFlagEmoji(c.alpha2)}
                      </span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-xs text-slate-400 font-mono uppercase">{c.code}</span>
                      {isSelected && (
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80">
            <p className="text-[10px] text-slate-400 text-center">
              {filtered.length} {query ? 'results' : 'countries'} · Select your country
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN VISA PAGE COMPONENT ---
export const Visa: React.FC = () => {
  // Default Passport Country to India (IND)
  const [passport, setPassport] = useState('IND');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState<OriznVisaData | null>(null);
  const [errorState, setErrorState] = useState<VisaErrorState | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const passportCountry = useMemo(() => getCountryByCode(passport), [passport]);
  const destinationCountry = useMemo(() => getCountryByCode(destination), [destination]);

  const handleCheck = async () => {
    setErrorState(null);
    setValidationError(null);
    setResult(null);

    if (!passport || !destination) {
      setValidationError('Please select both your passport country and destination country.');
      return;
    }

    if (passport === destination) {
      setValidationError('Passport country and destination country cannot be the same.');
      return;
    }

    setDataLoading(true);

    try {
      const supabaseUrl =
        import.meta.env.VITE_SUPABASE_URL || 'https://evbyakybmoezpqqlcogs.supabase.co';
      const supabaseKey =
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        'sb_publishable_uyb5KRbnF37c-SnhqWIrIQ_XdEOfqku';

      // Call the secure Supabase edge function proxy
      const res = await fetch(`${supabaseUrl}/functions/v1/visa-requirement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          passport: passport.trim().toUpperCase(),
          destination: destination.trim().toUpperCase(),
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok || body?.error) {
        const errType: VisaErrorState['error'] =
          body?.error || (res.status === 404 ? 'NO_DATA' : res.status === 429 ? 'QUOTA' : 'SERVER');
        let errMsg = body?.message;

        if (!errMsg) {
          if (errType === 'NO_DATA') {
            errMsg = "We don't have confirmed data for this route yet — our visa team can help.";
          } else {
            errMsg = 'Visa lookup is busy right now, please try again shortly or contact our team.';
          }
        }

        setErrorState({ error: errType, message: errMsg });
        setResult(null);
      } else {
        const visaData: OriznVisaData = body?.data || body;
        setResult(visaData);
        setErrorState(null);
      }
    } catch (err: any) {
      console.error('Error checking visa requirement:', err);
      setErrorState({
        error: 'SERVER',
        message: 'Visa lookup is busy right now, please try again shortly or contact our team.',
      });
      setResult(null);
    } finally {
      setDataLoading(false);
    }
  };

  const handleOpenEnquiry = () => {
    setEnquiryOpen(true);
  };

  const handlePhoneClick = () => window.open('tel:+919856664440', '_self');

  // Compute headline text
  const getHeadline = (data: OriznVisaData) => {
    if (data.visa_free_days && data.visa_free_days > 0) {
      return `Visa-free for up to ${data.visa_free_days} days`;
    }
    const cfg = requirementConfig[data.requirement] || defaultRequirementConfig;
    return cfg.headlineFallback;
  };

  const activeConfig = result
    ? requirementConfig[result.requirement] || defaultRequirementConfig
    : null;
  const ActiveIcon = activeConfig?.icon || HelpCircle;

  // Build pre-filled note string for lead capture
  const enquiryNote = useMemo(() => {
    const pCode = passport || 'N/A';
    const dCode = destination || 'N/A';
    const outcome = result?.requirement || errorState?.error || 'Enquiry';
    return `Visa enquiry: ${pCode} -> ${dCode} — result: ${outcome}`;
  }, [passport, destination, result, errorState]);

  const visaProcess = [
    {
      step: 1,
      title: 'Consultation',
      description: 'Free consultation to understand your travel requirements and visa type.',
      icon: Users,
    },
    {
      step: 2,
      title: 'Documentation',
      description: 'Guidance on required documents and assistance with accurate form filling.',
      icon: FileText,
    },
    {
      step: 3,
      title: 'Application',
      description: 'Submit your application with proper documentation and visa fees.',
      icon: CheckCircle,
    },
    {
      step: 4,
      title: 'Processing & Approval',
      description: 'Track your application status with continuous updates until approval.',
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEO
        title="Visa Services & Requirement Checker - Wisdom Travel"
        description="Check real-time visa requirements for any destination worldwide with official rules, stay limits, and expert visa assistance from Wisdom Travel and Tours."
        path="/visa"
      />
      <Header />

      {/* HERO */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-20 bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative container mx-auto px-6 max-w-7xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-2.5 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase mb-5">
              Visa Services
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight mb-5">
              Visa Made <span className="gradient-text">Effortless</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-8">
              Check official visa requirements instantly for any passport–destination pair, then let our experts handle your documents and application.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Globe, text: '200+ countries covered' },
                { icon: Zap, text: 'Real-time requirements' },
                { icon: Shield, text: 'Verified embassy rules' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-primary" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Requirement Checker Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 lg:sticky lg:top-24">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                  Check Visa Requirements
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Select your passport and destination to verify entry rules.
                </p>
              </div>

              <div className="space-y-4">
                <CountrySelector
                  id="passport-selector"
                  value={passport}
                  onChange={setPassport}
                  placeholder="Select your passport country"
                  label="Passport Country"
                  emoji="🛂"
                />

                <CountrySelector
                  id="destination-selector"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Select destination country"
                  label="Destination Country"
                  emoji="✈️"
                />

                <Button
                  onClick={handleCheck}
                  disabled={dataLoading || !passport || !destination || passport === destination}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-sm gap-2 shadow-lg shadow-primary/20 transition-all duration-200 disabled:opacity-50"
                >
                  {dataLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Checking Requirements...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Check Requirements
                    </>
                  )}
                </Button>
              </div>

              {/* Validation Warning */}
              {validationError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* ERROR / EMPTY STATE CARD WITH LEAD CAPTURE */}
              {errorState && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
                      {errorState.error === 'NO_DATA' ? (
                        <HelpCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {errorState.error === 'NO_DATA'
                          ? 'Route Needs Verification'
                          : 'Service Update'}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {errorState.message}
                      </p>
                    </div>
                  </div>

                  {/* Lead capture button inside error state */}
                  <div className="pt-2 border-t border-amber-200/60">
                    <Button
                      onClick={handleOpenEnquiry}
                      className="w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold gap-1.5 shadow-md shadow-primary/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Get Expert Visa Help
                    </Button>
                  </div>
                </div>
              )}

              {/* SUCCESS RESULT CARD */}
              {result && activeConfig && (
                <div className={`mt-6 rounded-2xl border ${activeConfig.cardBorder} ${activeConfig.cardBg} p-5 space-y-5 shadow-sm`}>
                  {/* Top Status & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        {passportCountry?.name || result.passport} → {destinationCountry?.name || result.destination}
                      </p>
                      <h3 className="text-lg font-serif font-bold text-slate-900 mt-1">
                        {getHeadline(result)}
                      </h3>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${activeConfig.badgeBg} ${activeConfig.badgeText} ${activeConfig.badgeBorder} flex-shrink-0`}
                    >
                      <ActiveIcon className="w-3.5 h-3.5" />
                      <span>{activeConfig.label}</span>
                    </div>
                  </div>

                  {/* Description sentence */}
                  {result.description && (
                    <p className="text-xs text-slate-700 leading-relaxed bg-white/80 border border-slate-200/60 rounded-xl p-3">
                      {result.description}
                    </p>
                  )}

                  {/* Required Documents List */}
                  {Array.isArray(result.documents_required) && result.documents_required.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-slate-200/60">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        <span>Required Documents</span>
                      </p>
                      <ul className="space-y-1.5 pl-1">
                        {result.documents_required.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Application Process List */}
                  {Array.isArray(result.process) && result.process.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-slate-200/60">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Application & Entry Process</span>
                      </p>
                      <ol className="space-y-1.5 pl-1">
                        {result.process.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="w-4 h-4 rounded-full bg-slate-200/80 text-[10px] font-bold text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Travel Tips List */}
                  {(() => {
                    const validTips = Array.isArray(result.tips)
                      ? result.tips.filter((t) => typeof t === 'string' && t.trim() && !t.toLowerCase().includes('upgrade'))
                      : [];
                    if (validTips.length === 0) return null;
                    return (
                      <div className="space-y-2 pt-1 border-t border-slate-200/60">
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Helpful Tips</span>
                        </p>
                        <ul className="space-y-1.5 pl-1">
                          {validTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <Info className="w-3.5 h-3.5 text-amber-500/80 flex-shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}

                  {/* Disclaimer */}
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 italic">
                    Indicative only — visa rules change frequently. Confirm with our visa team before you travel.
                  </div>

                  {/* Lead Capture Action Buttons */}
                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleOpenEnquiry}
                      className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold gap-1.5 shadow-md shadow-primary/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Get Expert Visa Help
                    </Button>
                    <Link to="/plan-trip" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full h-10 rounded-xl text-xs font-semibold border-slate-300 bg-white hover:bg-slate-50 text-slate-700 gap-1.5"
                      >
                        Plan Full Trip <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: How It Works & Guide */}
            <div className="lg:col-span-7 space-y-8">

              {/* Process steps */}
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center px-2.5 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase mb-3">
                    How It Works
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                    Our Visa Application Process
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Simple, transparent, and efficient in 4 easy steps.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {visaProcess.map((p) => (
                    <div
                      key={p.step}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <p.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                          Step {p.step}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{p.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category legend */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Visa Category Guide</h3>
                <div className="space-y-2.5">
                  {Object.entries(requirementConfig).map(([key, cfg]) => {
                    const LegendIcon = cfg.icon;
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-3 p-3 rounded-xl ${cfg.cardBg} border ${cfg.cardBorder}`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${cfg.badgeBg} flex items-center justify-center flex-shrink-0 ${cfg.badgeText}`}>
                          <LegendIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${cfg.badgeText}`}>{cfg.label}</p>
                          <p className="text-[11px] text-slate-500">{cfg.desc}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badgeBorder} ${cfg.badgeText} ${cfg.badgeBg} flex-shrink-0`}
                        >
                          {key.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expert Support CTA */}
              <div className="relative overflow-hidden bg-primary rounded-3xl p-7 sm:p-8">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                </div>
                <div className="relative">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">
                    Expert Assistance
                  </p>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                    Need personalized visa guidance?
                  </h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed max-w-lg">
                    Our certified travel consultants verify every form, booking voucher, and embassy requirement to ensure maximum visa approval rates.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handlePhoneClick}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-4 py-2.5 text-xs font-semibold transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" /> +91 98566 64440
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenEnquiry}
                      className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Enquire Online
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Shared Enquiry Form pre-filled with selected route and result */}
      <EnquiryModal
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        sourceContext="visa_service"
        packageInfo={{
          name: `Visa Assistance: ${passportCountry?.name || passport} → ${
            destinationCountry?.name || destination
          }`,
        }}
        defaultValues={{
          needs: ['Visa'],
          notes: enquiryNote,
        }}
      />
    </div>
  );
};

export default Visa;