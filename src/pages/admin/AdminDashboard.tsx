import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Package,
  MapPin,
  Users,
  Plus,
  Trash2,
  Edit,
  Database,
  Search,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  LogOut,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { clearAdminSession, getAdminUser } from '@/lib/admin-auth';
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  seedDatabaseIfEmpty,
  getEnquiryRecords,
  EnquiryRecord,
  TravelPackage,
  PopularDestination,
  CustomerInquiry
} from '@/lib/supabase-services';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const adminUser = getAdminUser();
  const [activeTab, setActiveTab] = useState<'packages' | 'destinations' | 'inquiries' | 'database'>('packages');

  // State arrays
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [destinations, setDestinations] = useState<PopularDestination[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [enquiryRecords, setEnquiryRecords] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [packageSearch, setPackageSearch] = useState('');
  const [packageCategoryFilter, setPackageCategoryFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');

  // Package Modal State
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [pkgForm, setPkgForm] = useState<Omit<TravelPackage, 'id'>>({
    name: '',
    category: 'domestic',
    location: '',
    duration: '',
    price: '',
    rating: 4.8,
    reviews: 50,
    image: '',
    highlights: [],
    groupSize: '2–10 people',
    tag: 'Popular'
  });
  const [highlightsInput, setHighlightsInput] = useState('');

  // Destination Modal State
  const [destModalOpen, setDestModalOpen] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | null>(null);
  const [destForm, setDestForm] = useState<Omit<PopularDestination, 'id'>>({
    name: '',
    location: '',
    price: '',
    rating: 4.8,
    reviews: 100,
    image: '',
    tag: 'Featured',
    duration: '5 Days',
    description: ''
  });

  // SQL Script Modal / Copy
  const [copiedSql, setCopiedSql] = useState(false);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [pkgs, dests, inqs, enqs] = await Promise.all([
        getPackages(),
        getDestinations(),
        getInquiries(),
        getEnquiryRecords()
      ]);
      setPackages(pkgs);
      setDestinations(dests);
      setInquiries(inqs);
      setEnquiryRecords(enqs);
    } catch (err) {
      toast.error('Failed to load data from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    toast.info('Exited admin portal');
    navigate('/');
  };

  // --- PACKAGE ACTIONS ---
  const handleOpenPackageModal = (pkg?: TravelPackage) => {
    if (pkg) {
      setEditingPackageId(pkg.id || null);
      setPkgForm({
        name: pkg.name || '',
        category: pkg.category || 'domestic',
        location: pkg.location || '',
        duration: pkg.duration || '',
        price: pkg.price || '',
        rating: pkg.rating || 4.8,
        reviews: pkg.reviews || 50,
        image: pkg.image || '',
        highlights: pkg.highlights || [],
        groupSize: pkg.groupSize || '2–10 people',
        tag: pkg.tag || '',
        itinerary_url: pkg.itinerary_url || ''
      });
      setHighlightsInput(pkg.highlights ? pkg.highlights.join(', ') : '');
    } else {
      setEditingPackageId(null);
      setPkgForm({
        name: '',
        category: 'domestic',
        location: '',
        duration: '5 Days / 4 Nights',
        price: '₹25,000',
        rating: 4.8,
        reviews: 20,
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        highlights: [],
        groupSize: '2–12 people',
        tag: 'New',
        itinerary_url: ''
      });
      setHighlightsInput('Local Sightseeing, Hotel Stay, Breakfast');
    }
    setPackageModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const highlights = highlightsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = { ...pkgForm, highlights };

    try {
      if (editingPackageId && !editingPackageId.startsWith('default-')) {
        await updatePackage(editingPackageId, payload);
        toast.success('Package updated successfully!');
      } else {
        await createPackage(payload);
        toast.success('Package saved to database successfully!');
      }
      setPackageModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error saving package to Supabase');
    }
  };

  const handleDeletePackage = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete package "${name || 'selected'}"?`)) return;
    try {
      if (!id.startsWith('default-')) {
        await deletePackage(id);
      }
      toast.success('Package deleted');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete package');
    }
  };

  // --- DESTINATION ACTIONS ---
  const handleOpenDestModal = (dest?: PopularDestination) => {
    if (dest) {
      setEditingDestId(dest.id || null);
      setDestForm({
        name: dest.name || '',
        location: dest.location || '',
        price: dest.price || '',
        rating: dest.rating || 4.8,
        reviews: dest.reviews || 100,
        image: dest.image || '',
        tag: dest.tag || '',
        duration: dest.duration || '',
        description: dest.description || ''
      });
    } else {
      setEditingDestId(null);
      setDestForm({
        name: '',
        location: '',
        price: '₹50,000',
        rating: 4.8,
        reviews: 50,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        tag: 'Featured',
        duration: '5 Days',
        description: 'Experience an unforgettable getaway filled with breathtaking sights and culture.'
      });
    }
    setDestModalOpen(true);
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDestId && !editingDestId.startsWith('default-')) {
        await updateDestination(editingDestId, destForm);
        toast.success('Destination updated successfully!');
      } else {
        await createDestination(destForm);
        toast.success('Destination saved to database successfully!');
      }
      setDestModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error saving destination');
    }
  };

  const handleDeleteDestination = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete destination "${name || 'selected'}"?`)) return;
    try {
      if (!id.startsWith('default-')) {
        await deleteDestination(id);
      }
      toast.success('Destination deleted');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete destination');
    }
  };

  // --- INQUIRY ACTIONS ---
  const exportInquiriesToCSV = () => {
    const hasInqs = inquiries && inquiries.length > 0;
    const hasEnqs = enquiryRecords && enquiryRecords.length > 0;

    if (!hasInqs && !hasEnqs) {
      toast.error('No inquiry records available to export.');
      return;
    }

    const headers = ['ID', 'Source', 'Package / Destination', 'Name', 'Email', 'Phone', 'Travel Date / Range', 'Budget/Person', 'Needs', 'Adults', 'Children', 'Notes', 'Itinerary URL', 'Status / Date Submitted'];

    const rows1 = (inquiries || []).map((inq) => [
      `"${inq.id || ''}"`,
      `"website_form"`,
      `"${(inq.destination || '').replace(/"/g, '""')}"`,
      `"${(inq.name || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.travel_dates || '').replace(/"/g, '""')}"`,
      `""`,
      `"${(Array.isArray(inq.requirements) ? inq.requirements.join(', ') : '').replace(/"/g, '""')}"`,
      `"${inq.adults || 1}"`,
      `"${inq.children || 0}"`,
      `"${(inq.notes || '').replace(/"/g, '""')}"`,
      `""`,
      `"${inq.status || 'Pending'} (${inq.created_at ? new Date(inq.created_at).toLocaleString() : ''})"`
    ]);

    const rows2 = (enquiryRecords || []).map((enq) => {
      const datesRange = enq.travel_date_from && enq.travel_date_to
        ? `${enq.travel_date_from} to ${enq.travel_date_to}`
        : enq.travel_date_from || enq.travel_date || '';
      return [
        `"${enq.id || ''}"`,
        `"${enq.source || 'enquire_form'}"`,
        `"${(enq.package_title || '').replace(/"/g, '""')}"`,
        `"${(enq.name || '').replace(/"/g, '""')}"`,
        `"${(enq.email || '').replace(/"/g, '""')}"`,
        `"${(enq.phone || '').replace(/"/g, '""')}"`,
        `"${datesRange.replace(/"/g, '""')}"`,
        `"${(enq.budget_per_person || '').replace(/"/g, '""')}"`,
        `"${(Array.isArray(enq.needs) ? enq.needs.join(', ') : '').replace(/"/g, '""')}"`,
        `"${enq.adults ?? 1}"`,
        `"${enq.children ?? 0}"`,
        `"${(enq.notes || '').replace(/"/g, '""')}"`,
        `"${(enq.itinerary_url || '').replace(/"/g, '""')}"`,
        `"${enq.created_at ? new Date(enq.created_at).toLocaleString() : ''}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows1.map(r => r.join(',')), ...rows2.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wisdom_travel_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('All enquiries exported successfully to Excel!');
  };

  const handleUpdateInquiryStatus = async (id: string, status: CustomerInquiry['status']) => {
    try {
      await updateInquiryStatus(id, status);
      toast.success(`Inquiry status updated to ${status}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      await deleteInquiry(id);
      toast.success('Inquiry deleted');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete inquiry');
    }
  };

  // --- SEED DATABASE ACTION ---
  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      const res = await seedDatabaseIfEmpty();
      toast.success(`Database checked! Packages: ${res.totalExistingPackages}, Destinations: ${res.totalExistingDestinations}`);
      loadData();
    } catch (err: any) {
      toast.error('Database seed error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const sqlCode = `-- ========================================================
-- Supabase Database Schema for Wisdom Voyage / Compass
-- Run this script in your Supabase SQL Editor to set up tables.
-- ========================================================

CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('domestic', 'international')),
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    price TEXT NOT NULL,
    rating NUMERIC DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    group_size TEXT DEFAULT '2–10 people',
    tag TEXT DEFAULT '',
    itinerary_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    price TEXT NOT NULL,
    rating NUMERIC DEFAULT 4.8,
    reviews INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    tag TEXT DEFAULT '',
    duration TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    destination TEXT,
    travel_dates TEXT,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    budget INTEGER[] DEFAULT '{}',
    trip_type TEXT,
    requirements TEXT[] DEFAULT '{}',
    notes TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Confirmed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_title TEXT NOT NULL,
    package_id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    travel_date DATE,
    travel_date_from DATE,
    travel_date_to DATE,
    budget_per_person TEXT,
    needs TEXT[] DEFAULT '{}',
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    notes TEXT,
    source TEXT NOT NULL CHECK (source IN ('whatsapp', 'enquire_form')),
    itinerary_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Full Access Packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Destinations" ON public.destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Enquiries" ON public.enquiries FOR ALL USING (true) WITH CHECK (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    toast.success('SQL script copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
      pkg.location.toLowerCase().includes(packageSearch.toLowerCase());
    const matchesCategory =
      packageCategoryFilter === 'all' || pkg.category === packageCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter === 'all') return true;
    return inq.status.toLowerCase() === inquiryStatusFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <SEO title="Admin Dashboard - Wisdom Voyage Compass" description="Backend portal to manage travel packages, destinations, and customer inquiries." />

      {/* TOP ADMIN NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-white leading-none">Wisdom Voyage</h1>
              <span className="text-xs text-amber-400 font-medium">Admin Management Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminUser && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-emerald-300 text-[11px] font-bold">{adminUser.email}</span>
              </div>
            )}

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors font-medium"
            >
              Live Website <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-500/40 bg-red-950/40 text-red-300 hover:bg-red-900/60 text-xs flex items-center gap-1.5 rounded-xl h-9"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Packages</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{packages.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Popular Destinations</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{destinations.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Customer Leads</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{inquiries.length + enquiryRecords.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">WhatsApp Leads</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                  {enquiryRecords.filter(e => e.source === 'whatsapp').length}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Button
            onClick={() => setActiveTab('packages')}
            variant={activeTab === 'packages' ? 'default' : 'ghost'}
            className={`text-xs font-semibold gap-2 rounded-xl h-10 ${
              activeTab === 'packages'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" /> Tour Packages ({packages.length})
          </Button>

          <Button
            onClick={() => setActiveTab('destinations')}
            variant={activeTab === 'destinations' ? 'default' : 'ghost'}
            className={`text-xs font-semibold gap-2 rounded-xl h-10 ${
              activeTab === 'destinations'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Compass className="w-4 h-4" /> Destinations ({destinations.length})
          </Button>

          <Button
            onClick={() => setActiveTab('inquiries')}
            variant={activeTab === 'inquiries' ? 'default' : 'ghost'}
            className={`text-xs font-semibold gap-2 rounded-xl h-10 ${
              activeTab === 'inquiries'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Users className="w-4 h-4" /> Customer Leads ({inquiries.length + enquiryRecords.length})
          </Button>

          <Button
            onClick={() => setActiveTab('database')}
            variant={activeTab === 'database' ? 'default' : 'ghost'}
            className={`text-xs font-semibold gap-2 rounded-xl h-10 ${
              activeTab === 'database'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Database className="w-4 h-4" /> Database Setup & Schema
          </Button>
        </div>

        {/* TAB 1: TOUR PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    placeholder="Search package name or location..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-900 text-xs pl-9 h-10 rounded-xl"
                  />
                </div>

                <Select
                  value={packageCategoryFilter}
                  onValueChange={(val: any) => setPackageCategoryFilter(val)}
                >
                  <SelectTrigger className="w-full sm:w-40 bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-100 text-slate-900">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => handleOpenPackageModal()}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-white font-bold text-xs gap-2 rounded-xl h-10 px-5 shadow-md shadow-primary/20"
              >
                <Plus className="w-4 h-4" /> Add New Package
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-slate-500 text-sm">Loading packages from Supabase...</div>
            ) : filteredPackages.length === 0 ? (
              <Card className="bg-white border-slate-100 text-center py-12 shadow-sm rounded-2xl">
                <CardContent className="space-y-3">
                  <Package className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="text-slate-800 font-semibold">No Packages Found</h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">
                    Try adjusting your search query or click "Add New Package" to create your first package.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPackages.map((pkg) => (
                  <Card key={pkg.id || pkg.name} className="bg-white border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all rounded-2xl">
                    <div className="relative h-44 w-full">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <Badge className="bg-primary/90 text-white text-[10px] uppercase font-bold px-2 py-0.5">
                          {pkg.category}
                        </Badge>
                        {pkg.tag && (
                          <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5">
                            {pkg.tag}
                          </Badge>
                        )}
                      </div>

                      {pkg.itinerary_url && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 shadow">
                            <Sparkles className="w-3 h-3" /> Digital Itinerary Linked
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900 truncate">{pkg.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-primary" /> {pkg.location} • {pkg.duration}
                        </p>
                      </div>

                      {pkg.itinerary_url && (
                        <p className="text-[11px] text-slate-500 truncate bg-slate-50 p-2 rounded-lg border border-slate-100">
                          🔗 {pkg.itinerary_url}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="font-serif font-bold text-slate-900 text-lg">{pkg.price}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => handleOpenPackageModal(pkg)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => pkg.id && handleDeletePackage(pkg.id, pkg.name)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DESTINATIONS */}
        {activeTab === 'destinations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <h2 className="text-base font-serif font-bold text-slate-900">Featured Popular Destinations</h2>
                <p className="text-xs text-slate-500">Manage highlight cards on the homepage grid</p>
              </div>

              <Button
                onClick={() => handleOpenDestModal()}
                className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-white font-bold text-xs gap-2 rounded-xl h-10 px-5 shadow-md shadow-primary/20"
              >
                <Plus className="w-4 h-4" /> Add Destination
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-slate-500 text-sm">Loading destinations...</div>
            ) : destinations.length === 0 ? (
              <Card className="bg-white border-slate-100 text-center py-12 shadow-sm rounded-2xl">
                <CardContent className="space-y-3">
                  <Compass className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="text-slate-800 font-semibold">No Destinations Found</h3>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map((dest) => (
                  <Card key={dest.id || dest.name} className="bg-white border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all rounded-2xl">
                    <div className="relative h-44 w-full">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5">
                          {dest.tag || 'Featured'}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900 truncate">{dest.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-primary" /> {dest.location} • {dest.duration}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="font-serif font-bold text-slate-900 text-lg">{dest.price}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => handleOpenDestModal(dest)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => dest.id && handleDeleteDestination(dest.id, dest.name)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER INQUIRIES & BOOKINGS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <h2 className="text-base font-serif font-bold text-slate-900">Customer Leads & Enquiries</h2>
                <p className="text-xs text-slate-500">Incoming requests submitted from website forms and WhatsApp itinerary links</p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={exportInquiriesToCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-10 px-4 flex items-center gap-2 rounded-xl shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" /> Export to Excel (.csv)
                </Button>

                <div className="flex items-center gap-2">
                  <Label className="text-xs text-slate-500 font-medium">Filter:</Label>
                  <Select value={inquiryStatusFilter} onValueChange={setInquiryStatusFilter}>
                    <SelectTrigger className="w-32 bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-100 text-slate-900">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 text-slate-500 text-sm">Loading inquiries...</div>
            ) : filteredInquiries.length === 0 && enquiryRecords.length === 0 ? (
              <Card className="bg-white border-slate-100 text-center py-12 shadow-sm rounded-2xl">
                <CardContent className="space-y-3">
                  <Users className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="text-slate-800 font-semibold">No Inquiries Found</h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">
                    When visitors submit enquiry forms or WhatsApp clicks on your website, their requests will automatically appear here!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredInquiries.map((inq) => (
                  <Card key={inq.id || inq.email} className="bg-white border-slate-100 p-5 shadow-sm rounded-2xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-base text-slate-900">{inq.name}</h3>
                          <Badge
                            className={`text-xs font-bold ${
                              inq.status === 'Confirmed'
                                ? 'bg-emerald-600 text-white'
                                : inq.status === 'Contacted'
                                ? 'bg-blue-600 text-white'
                                : inq.status === 'Cancelled'
                                ? 'bg-red-600 text-white'
                                : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            {inq.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {inq.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {inq.phone}</span>
                          {inq.destination && <span className="flex items-center gap-1 text-primary font-medium"><MapPin className="w-3.5 h-3.5" /> Destination: {inq.destination}</span>}
                          {inq.travel_dates && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Dates: {inq.travel_dates}</span>}
                        </div>

                        {(inq.trip_type || (inq.requirements && inq.requirements.length > 0)) && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            {inq.trip_type && <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg font-medium">Type: {inq.trip_type}</span>}
                            {inq.adults && <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg">Adults: {inq.adults}, Children: {inq.children || 0}</span>}
                            {inq.requirements && inq.requirements.map((r, i) => (
                              <span key={i} className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-lg">{r}</span>
                            ))}
                          </div>
                        )}

                        {inq.notes && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                            "{inq.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end lg:self-center">
                        <Select
                          value={inq.status}
                          onValueChange={(val: any) => inq.id && handleUpdateInquiryStatus(inq.id, val)}
                        >
                          <SelectTrigger className="w-36 bg-slate-50 border-slate-200 text-slate-900 text-xs h-9 rounded-xl">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-100 text-slate-900">
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          onClick={() => inq.id && handleDeleteInquiry(inq.id)}
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Dedicated Enquiries Table Records Section */}
            {enquiryRecords.length > 0 && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Package Itinerary & WhatsApp Enquiries ({enquiryRecords.length})
                    </h3>
                    <p className="text-xs text-slate-500">Recorded from WhatsApp clicks and Itinerary Enquiry forms</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {enquiryRecords.map((enq, idx) => {
                    const datesRange = enq.travel_date_from && enq.travel_date_to
                      ? `${enq.travel_date_from} to ${enq.travel_date_to}`
                      : enq.travel_date_from || enq.travel_date || '';

                    return (
                      <Card key={enq.id || idx} className="bg-white border-slate-100 p-5 shadow-sm rounded-2xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                              <h4 className="font-bold text-sm text-slate-900">{enq.name || 'Anonymous Inquiry'}</h4>
                              <Badge className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-lg ${enq.source === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}>
                                {enq.source === 'whatsapp' ? '📱 WhatsApp Click' : '💬 Enquiry Form'}
                              </Badge>
                              {enq.created_at && (
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {new Date(enq.created_at).toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
                              {enq.package_title && (
                                <span className="text-primary font-bold">Package: {enq.package_title}</span>
                              )}
                              {enq.phone && (
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {enq.phone}</span>
                              )}
                              {enq.email && (
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {enq.email}</span>
                              )}
                              {datesRange && (
                                <span className="flex items-center gap-1 font-medium text-slate-700">
                                  <Calendar className="w-3 h-3 text-amber-500" /> Travel Dates: {datesRange}
                                </span>
                              )}
                              {enq.budget_per_person && (
                                <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md border border-amber-200/60">
                                  Budget: {enq.budget_per_person}
                                </span>
                              )}
                              {(enq.adults || enq.children) && (
                                <span className="text-slate-500">Travelers: {enq.adults || 1} Adults, {enq.children || 0} Children</span>
                              )}
                            </div>

                            {enq.needs && enq.needs.length > 0 && (
                              <div className="flex items-center gap-1.5 pt-1">
                                <span className="text-[11px] font-semibold text-slate-500">Needs:</span>
                                <div className="flex flex-wrap gap-1">
                                  {enq.needs.map((need, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px]">
                                      {need}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {enq.notes && (
                              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                "{enq.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DATABASE SETUP & SYNC */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 font-serif font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> 1-Click Supabase Initial Seeder
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs">
                  Populate your external Supabase project with initial sample tour packages and popular destinations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleSeedDatabase}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-white font-bold text-xs gap-2 rounded-xl h-10 px-5 shadow-md shadow-primary/20"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Seed Database Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 font-serif font-bold flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" /> Supabase SQL Schema Script
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs">
                  Copy this SQL and execute it in your Supabase SQL Editor to set up all tables and RLS policies.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-200 text-xs p-4 rounded-xl overflow-x-auto max-h-80 font-mono">
                    {sqlCode}
                  </pre>
                  <Button
                    onClick={copySqlToClipboard}
                    size="sm"
                    className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1.5 rounded-lg"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedSql ? 'Copied!' : 'Copy SQL'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* --- MODAL: ADD / EDIT PACKAGE --- */}
      <Dialog open={packageModalOpen} onOpenChange={setPackageModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackageId ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Fill in package details below. This will update live on the website.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
            <div className="space-y-1">
              <Label className="text-slate-200">Package Title *</Label>
              <Input
                required
                value={pkgForm.name}
                onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                placeholder="e.g. Kerala Backwaters Escape"
                className="bg-slate-950 border-slate-800 text-white h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-200">Category *</Label>
                <Select
                  value={pkgForm.category}
                  onValueChange={(val: any) => setPkgForm({ ...pkgForm, category: val })}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-slate-200">Price *</Label>
                <Input
                  required
                  value={pkgForm.price}
                  onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                  placeholder="e.g. ₹28,000"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-200">Locations / Cities *</Label>
                <Input
                  required
                  value={pkgForm.location}
                  onChange={(e) => setPkgForm({ ...pkgForm, location: e.target.value })}
                  placeholder="e.g. Kochi, Alleppey, Munnar"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-200">Duration *</Label>
                <Input
                  required
                  value={pkgForm.duration}
                  onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })}
                  placeholder="e.g. 5 Days / 4 Nights"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-200">Group Size</Label>
                <Input
                  value={pkgForm.groupSize}
                  onChange={(e) => setPkgForm({ ...pkgForm, groupSize: e.target.value })}
                  placeholder="e.g. 2–12 people"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-200">Badge Tag</Label>
                <Input
                  value={pkgForm.tag}
                  onChange={(e) => setPkgForm({ ...pkgForm, tag: e.target.value })}
                  placeholder="e.g. Most Popular, Serene, Luxury"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-slate-200">Image URL *</Label>
              <Input
                required
                value={pkgForm.image}
                onChange={(e) => setPkgForm({ ...pkgForm, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-slate-950 border-slate-800 text-white h-9"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-200">Itinerary URL (Optional)</Label>
              <Input
                value={pkgForm.itinerary_url || ''}
                onChange={(e) => setPkgForm({ ...pkgForm, itinerary_url: e.target.value })}
                placeholder="https://itinerary.digital/qi/wisdom-travel-and-tours/sample-itinerary/23292"
                className="bg-slate-950 border-slate-800 text-white h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-200">Highlights (comma separated)</Label>
              <Input
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Houseboat Stay, Tea Plantations, Ayurvedic Spa"
                className="bg-slate-950 border-slate-800 text-white h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setPackageModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white">
                Save Package
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: ADD / EDIT DESTINATION --- */}
      <Dialog open={destModalOpen} onOpenChange={setDestModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDestId ? 'Edit Destination' : 'Add Popular Destination'}</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Configure featured destination cards for the homepage.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveDestination} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-200">Destination Name *</Label>
                <Input
                  required
                  value={destForm.name}
                  onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                  placeholder="e.g. The Swiss Alps"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-200">Location *</Label>
                <Input
                  required
                  value={destForm.location}
                  onChange={(e) => setDestForm({ ...destForm, location: e.target.value })}
                  placeholder="e.g. Switzerland"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-200">Price *</Label>
                <Input
                  required
                  value={destForm.price}
                  onChange={(e) => setDestForm({ ...destForm, price: e.target.value })}
                  placeholder="e.g. ₹1.5L"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-200">Duration</Label>
                <Input
                  value={destForm.duration}
                  onChange={(e) => setDestForm({ ...destForm, duration: e.target.value })}
                  placeholder="e.g. 7 Days"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-200">Tag</Label>
                <Input
                  value={destForm.tag}
                  onChange={(e) => setDestForm({ ...destForm, tag: e.target.value })}
                  placeholder="e.g. Luxury Escape"
                  className="bg-slate-950 border-slate-800 text-white h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-slate-200">Image URL *</Label>
              <Input
                required
                value={destForm.image}
                onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-slate-950 border-slate-800 text-white h-9"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-200">Description *</Label>
              <Textarea
                required
                value={destForm.description}
                onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                placeholder="Short summary of destination..."
                className="bg-slate-950 border-slate-800 text-white h-20"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setDestModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white">
                Save Destination
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminDashboard;
