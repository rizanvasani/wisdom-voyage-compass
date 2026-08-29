import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { createInquiry, createEnquiryRecord } from '@/lib/supabase-services';

export interface EnquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageInfo?: {
    id?: string;
    name: string;
    itinerary_url?: string;
  } | null;
  sourceContext?: string;
  defaultValues?: Partial<{
    name: string;
    email: string;
    phone: string;
    travel_date_from: string;
    travel_date_to: string;
    budget_per_person: string;
    needs: string[];
    adults: number;
    children: number;
    notes: string;
  }>;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  open,
  onOpenChange,
  packageInfo,
  sourceContext = 'general',
  defaultValues
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: defaultValues?.name || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    travel_date_from: defaultValues?.travel_date_from || '',
    travel_date_to: defaultValues?.travel_date_to || '',
    budget_per_person: defaultValues?.budget_per_person || '',
    needs: defaultValues?.needs || ([] as string[]),
    adults: defaultValues?.adults || 2,
    children: defaultValues?.children || 0,
    notes: defaultValues?.notes || ''
  });

  useEffect(() => {
    if (open) {
      const initialNotes = defaultValues?.notes || (
        packageInfo?.name
          ? packageInfo.itinerary_url && packageInfo.itinerary_url.trim()
            ? `Enquiry for: ${packageInfo.name}\nItinerary: ${packageInfo.itinerary_url.trim()}`
            : `Enquiry for: ${packageInfo.name}`
          : ''
      );

      setFormData({
        name: defaultValues?.name || '',
        email: defaultValues?.email || '',
        phone: defaultValues?.phone || '',
        travel_date_from: defaultValues?.travel_date_from || '',
        travel_date_to: defaultValues?.travel_date_to || '',
        budget_per_person: defaultValues?.budget_per_person || '',
        needs: defaultValues?.needs || [],
        adults: defaultValues?.adults || 2,
        children: defaultValues?.children || 0,
        notes: initialNotes
      });
    }
  }, [open, packageInfo, defaultValues]);

  const toggleNeed = (need: string) => {
    setFormData(prev => {
      const exists = prev.needs.includes(need);
      return {
        ...prev,
        needs: exists ? prev.needs.filter(n => n !== need) : [...prev.needs, need]
      };
    });
  };

  const getFormattedNotes = (baseNotes: string) => {
    if (packageInfo?.itinerary_url && packageInfo.itinerary_url.trim()) {
      const url = packageInfo.itinerary_url.trim();
      if (!baseNotes.includes(url)) {
        return baseNotes ? `${baseNotes}\nItinerary: ${url}` : `Itinerary: ${url}`;
      }
    }
    return baseNotes;
  };

  const getDatesSummary = () => {
    if (formData.travel_date_from && formData.travel_date_to) {
      return `${formData.travel_date_from} to ${formData.travel_date_to}`;
    }
    return formData.travel_date_from || formData.travel_date_to || '';
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter your Name.');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your Phone Number.');
      return;
    }

    setIsSubmitting(true);
    const finalNotes = getFormattedNotes(formData.notes);
    const datesSummary = getDatesSummary();

    try {
      // 1. Save to Supabase inquiries table
      await createInquiry({
        name: formData.name.trim(),
        email: formData.email.trim() || 'lead@wisdomtravel.in',
        phone: formData.phone.trim(),
        destination: packageInfo?.name || 'General Inquiry',
        travel_dates: datesSummary,
        adults: formData.adults,
        children: formData.children,
        notes: `[Budget/Person: ${formData.budget_per_person || 'N/A'}] [Needs: ${formData.needs.join(', ') || 'N/A'}] ${finalNotes || ''}`,
        status: 'Pending'
      });

      // 2. Save to dedicated enquiries table
      await createEnquiryRecord({
        package_title: packageInfo?.name || 'General Inquiry',
        package_id: packageInfo?.id || null,
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim(),
        travel_date: formData.travel_date_from || null,
        travel_date_from: formData.travel_date_from || null,
        travel_date_to: formData.travel_date_to || null,
        budget_per_person: formData.budget_per_person || null,
        needs: formData.needs,
        adults: formData.adults,
        children: formData.children,
        notes: finalNotes || null,
        source: (sourceContext || 'enquire_form') as any,
        itinerary_url: packageInfo?.itinerary_url || null
      });

      // 3. Send via EmailJS
      try {
        await emailjs.send(
          'service_7jd4cv7',
          'template_66u4wg8',
          {
            from_name: formData.name,
            from_email: formData.email || 'no-reply@wisdomtravel.in',
            phone: formData.phone,
            destination: packageInfo?.name || 'General Website Inquiry',
            travel_dates: datesSummary || 'Not specified',
            adults: String(formData.adults),
            children: String(formData.children),
            notes: `Budget/Person: ${formData.budget_per_person || 'N/A'}\nNeeds: ${formData.needs.join(', ') || 'N/A'}\n${finalNotes || ''}`,
            to_email: 'rizan@wisdomtravel.in',
            subject: `New Inquiry (${sourceContext}): ${packageInfo?.name || formData.name}`,
          },
          'IyzAcrjwMY4P_StOx'
        );
      } catch (emailErr) {
        console.warn('EmailJS notification warning:', emailErr);
      }

      toast.success(`Enquiry submitted successfully! Our team will contact you shortly.`);
      onOpenChange(false);
    } catch (err: any) {
      console.error('Error submitting enquiry:', err);
      toast.error('Failed to submit enquiry. Please try again or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter your Name to continue to WhatsApp.');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your Phone Number to continue to WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    const finalNotes = getFormattedNotes(formData.notes);
    const datesSummary = getDatesSummary();

    try {
      // 1. Save customer details to Supabase enquiries table
      await createEnquiryRecord({
        package_title: packageInfo?.name || 'General WhatsApp Inquiry',
        package_id: packageInfo?.id || null,
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim(),
        travel_date: formData.travel_date_from || null,
        travel_date_from: formData.travel_date_from || null,
        travel_date_to: formData.travel_date_to || null,
        budget_per_person: formData.budget_per_person || null,
        needs: formData.needs,
        adults: formData.adults,
        children: formData.children,
        notes: finalNotes || null,
        source: 'whatsapp' as any,
        itinerary_url: packageInfo?.itinerary_url || null
      });

      // Also save to inquiries table
      await createInquiry({
        name: formData.name.trim(),
        email: formData.email.trim() || 'whatsapp@lead.com',
        phone: formData.phone.trim(),
        destination: packageInfo?.name || 'General WhatsApp Lead',
        travel_dates: datesSummary,
        adults: formData.adults,
        children: formData.children,
        notes: `[WhatsApp Inquiry (${sourceContext})] [Budget: ${formData.budget_per_person || 'N/A'}] [Needs: ${formData.needs.join(', ') || 'N/A'}] ${finalNotes || ''}`,
        status: 'Pending'
      });

      // 2. Construct rich pre-filled WhatsApp message
      const msgLines = [
        `Hello Wisdom Travel!`,
        `*Name:* ${formData.name}`,
        `*Phone:* ${formData.phone}`,
        formData.email ? `*Email:* ${formData.email}` : '',
        packageInfo?.name ? `*Inquiring Package:* ${packageInfo.name}` : '',
        packageInfo?.itinerary_url ? `*Itinerary:* ${packageInfo.itinerary_url}` : '',
        datesSummary ? `*Travel Dates:* ${datesSummary}` : '',
        formData.budget_per_person ? `*Budget/Person:* ${formData.budget_per_person}` : '',
        formData.needs && formData.needs.length > 0 ? `*Needs:* ${formData.needs.join(', ')}` : '',
        `*Travelers:* ${formData.adults} Adults${formData.children ? `, ${formData.children} Children` : ''}`,
        formData.notes ? `*Notes:* ${formData.notes}` : ''
      ].filter(Boolean).join('\n');

      const whatsappUrl = `https://wa.me/9856664440?text=${encodeURIComponent(msgLines)}`;

      toast.success('Your details have been saved! Opening WhatsApp...');
      onOpenChange(false);
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Error saving WhatsApp enquiry details:', err);
      const fallbackUrl = `https://wa.me/9856664440?text=${encodeURIComponent(`Hello Wisdom Travel! Name: ${formData.name}, Phone: ${formData.phone}`)}`;
      window.open(fallbackUrl, '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-slate-100 text-slate-900 max-w-lg rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden p-6 z-[100]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {packageInfo?.name ? `Enquire for ${packageInfo.name}` : 'Plan Your Travel Inquiry'}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs">
            Please provide your details below. Your lead will be saved securely and you can chat live on WhatsApp or receive an email response.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEmailSubmit} className="space-y-4 pt-2 overflow-y-auto flex-1 pr-1.5 custom-scrollbar">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Your Name *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="bg-slate-50 border-slate-200 text-slate-900 focus:border-primary h-10 text-xs rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address *</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@example.com"
                className="bg-slate-50 border-slate-200 text-slate-900 focus:border-primary h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="bg-slate-50 border-slate-200 text-slate-900 focus:border-primary h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Travel Dates Range */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Travel Dates (Optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-medium">From Date</span>
                <Input
                  type="date"
                  value={formData.travel_date_from}
                  onChange={(e) => setFormData({ ...formData, travel_date_from: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 h-9 text-xs rounded-xl"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium">To Date</span>
                <Input
                  type="date"
                  value={formData.travel_date_to}
                  onChange={(e) => setFormData({ ...formData, travel_date_to: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 h-9 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Budget Per Person Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Budget Per Person (Optional)</label>
            <div className="flex flex-wrap gap-1.5">
              {['Under ₹25K', '₹25K–₹50K', '₹50K–₹1L', '₹1L–₹2L', '₹2L+'].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFormData({ ...formData, budget_per_person: formData.budget_per_person === opt ? '' : opt })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    formData.budget_per_person === opt
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* What do you need? */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">What do you need? (Optional)</label>
            <div className="flex flex-wrap gap-1.5">
              {['Flights', 'Hotel', 'Land Package', 'Visa', 'Insurance'].map((need) => {
                const selected = formData.needs.includes(need);
                return (
                  <button
                    type="button"
                    key={need}
                    onClick={() => toggleNeed(need)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{need}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Adults</label>
              <Input
                type="number"
                min={1}
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                className="bg-slate-50 border-slate-200 text-slate-900 h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Children</label>
              <Input
                type="number"
                min={0}
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                className="bg-slate-50 border-slate-200 text-slate-900 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Special Notes / Requirements</label>
            <Textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Mention preferred destinations, hotel types, extra days..."
              className="bg-slate-50 border-slate-200 text-slate-900 text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="pt-3 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleWhatsAppSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2 h-10 rounded-xl shadow-md shadow-emerald-600/20 flex-1"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Chat on WhatsApp
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-white text-xs font-bold gap-2 h-10 rounded-xl flex-1 shadow-md shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Email Enquiry
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
