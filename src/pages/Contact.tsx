import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Send, ArrowRight, MessageCircle, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    title: '', firstName: '', lastName: '',
    email: '', mobile: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullName = `${formData.title ? formData.title + ' ' : ''}${formData.firstName} ${formData.lastName}`.trim();

    const commonParams = {
      from_name: fullName,
      from_email: formData.email,
      phone: `+91 ${formData.mobile}`,
      destination: '',
      travel_dates: '',
      adults: '',
      children: '',
      budget: '',
      trip_type: '',
      requirements: '',
      notes: formData.message,
    };

    try {
      const [teamResult, userResult] = await Promise.allSettled([

        // 1️⃣ Rizan gets the contact message
        emailjs.send(
          'service_7jd4cv7',
          'template_66u4wg8',
          {
            ...commonParams,
            to_email: 'rizan@wisdomtravel.in',
            subject: `Contact Us message from ${fullName}`,
          },
          'IyzAcrjwMY4P_StOx'
        ),

        // 2️⃣ Customer gets auto-reply
        emailjs.send(
          'service_7jd4cv7',
          'template_98kngzo',
          {
            ...commonParams,
            to_email: formData.email,
            user_email: formData.email,
            subject: `We received your message — Wisdom Travel & Tours`,
          },
          'IyzAcrjwMY4P_StOx'
        ),

      ]);

      if (teamResult.status === 'rejected') {
        console.error('Team email failed:', teamResult.reason);
      }
      if (userResult.status === 'rejected') {
        console.error('Auto-reply failed:', userResult.reason);
      }

      if (teamResult.status === 'fulfilled') {
        setSubmitted(true);
        toast.success("Message sent! We'll be in touch soon.");
        setFormData({ title: '', firstName: '', lastName: '', email: '', mobile: '', message: '' });
      } else {
        toast.error('Something went wrong. Please try again or WhatsApp us directly.');
      }

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleWhatsAppClick = () =>
    window.open('https://wa.me/9856664440?text=Hello, I would like to inquire about your travel services.', '_blank');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEO
        title="Contact Us"
        description="Get in touch with Wisdom Travel and Tours in Santacruz, Mumbai. Call, email, or WhatsApp us to plan your next domestic or international trip."
        path="/contact"
      />
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative container mx-auto px-6 max-w-7xl">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-2.5 py-1 bg-primary/10 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase mb-5">
              Get In Touch
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight mb-4">
              Let's plan your <span className="gradient-text">next adventure</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md">
              Have a question or need help planning? Our team typically responds within a few hours.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN ── */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* ── FORM ── */}
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center space-y-5">
                  <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">Message Sent!</h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                    We've received your message and will get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-10 text-sm font-semibold gap-2"
                  >
                    Send Another <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
                  <div className="mb-6">
                    <h2 className="text-base font-bold text-slate-900">Send us a message</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Fields marked * are required</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name row */}
                    {/* Name row — stacks title on its own row on mobile, then 3-col on sm+ */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Title</label>
                        <Select value={formData.title} onValueChange={v => handleInputChange('title', v)}>
                          <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm">
                            <SelectValue placeholder="Mr" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Mr', 'Ms', 'Mrs', 'Dr'].map(t => (
                              <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">First Name *</label>
                        <Input
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={e => handleInputChange('firstName', e.target.value)}
                          required
                          autoCapitalize="words"
                          className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Last Name *</label>
                        <Input
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={e => handleInputChange('lastName', e.target.value)}
                          required
                          autoCapitalize="words"
                          className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Email + Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                            required
                            className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Mobile *</label>
                        <div className="flex h-11">
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl px-3 flex-shrink-0">
                            <img src="https://flagcdn.com/16x12/in.png" alt="IN" className="w-4 h-3" />
                            <span className="text-xs text-slate-500 font-medium">+91</span>
                          </div>
                          <Input
                            type="tel"
                            placeholder="98765 43210"
                            value={formData.mobile}
                            onChange={e => handleInputChange('mobile', e.target.value)}
                            required
                            inputMode="numeric"
                            className="rounded-l-none rounded-r-xl border-slate-200 bg-slate-50 focus:bg-white text-sm h-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Message *</label>
                      <Textarea
                        placeholder="Tell us about your travel plans, questions, or anything else..."
                        value={formData.message}
                        onChange={e => handleInputChange('message', e.target.value)}
                        required
                        className="min-h-[140px] rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm gap-2 shadow-lg shadow-primary/20 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </Button>

                  </form>
                </div>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div className="lg:col-span-5 space-y-5">

              {/* Address card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h3 className="text-sm font-bold text-slate-900">Find Us</h3>

                {[
                  {
                    icon: MapPin,
                    label: 'Address',
                    content: (
                      <button
                        onClick={() => window.open('https://www.google.com/maps/place/Wisdom+Travel+and+Tours/@19.0897983,72.8377711,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c933d62324e3:0x6d5203898e11bf83!8m2!3d19.0897983!4d72.8377711!16s%2Fg%2F11j014gg7_', '_blank')}
                        className="text-xs text-slate-500 leading-relaxed text-left hover:text-primary transition-colors"
                      >
                        G-14, Ground Floor, Dheeraj Heritage,<br />
                        S.V. Road Junction, Santacruz West,<br />
                        Mumbai 400-054
                      </button>
                    )
                  },
                  {
                    icon: Phone,
                    label: 'Phone',
                    content: (
                      <div className="space-y-1">
                        {['+91 98566 64440', '+91 98205 44555'].map(num => (
                          <button
                            key={num}
                            onClick={() => window.open(`tel:${num.replace(/\s/g, '')}`, '_self')}
                            className="block text-xs text-slate-500 hover:text-primary transition-colors"
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    )
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    content: (
                      <button
                        onClick={() => window.open('mailto:sales@wisdomtravel.in', '_self')}
                        className="text-xs text-slate-500 hover:text-primary transition-colors"
                      >
                        sales@wisdomtravel.in
                      </button>
                    )
                  },
                  {
                    icon: Clock,
                    label: 'Hours',
                    content: (
                      <div className="space-y-0.5">
                        <p className="text-xs text-slate-500">Mon – Sat: 9:00 AM – 7:00 PM</p>
                        <p className="text-xs text-slate-400">Sun: 10:00 AM – 4:00 PM</p>
                      </div>
                    )
                  },
                ].map(({ icon: Icon, label, content }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                      {content}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="relative overflow-hidden bg-primary rounded-3xl p-6">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="relative space-y-3">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Prefer instant replies?</p>
                  <h3 className="text-white font-bold text-base font-serif leading-tight">Chat with us on WhatsApp</h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Our team is available on WhatsApp for quick answers and trip planning help.
                  </p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center justify-center gap-2 bg-white text-primary hover:bg-white/90 rounded-xl px-4 py-2.5 text-xs font-bold transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Open WhatsApp
                  </button>
                </div>
              </div>

              {/* Map embed */}
              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.5!2d72.8377711!3d19.0897983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c933d62324e3%3A0x6d5203898e11bf83!2sWisdom%20Travel%20and%20Tours!5e0!3m2!1sen!2sin!4v1691234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Wisdom Travel & Tours Location"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;