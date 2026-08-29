-- ========================================================
-- Supabase Database Schema for Wisdom Voyage / Compass
-- Run this script in your Supabase SQL Editor to set up tables.
-- ========================================================

-- 1. Create Packages Table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Destinations Table
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

-- 3. Create Inquiries Table (Customer Trip Bookings & Enquiries)
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

-- 4. Create Enquiries Table (Package Itinerary Enquiries & WhatsApp Clicks)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_title TEXT NOT NULL,
    package_id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    travel_date DATE,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    notes TEXT,
    source TEXT NOT NULL CHECK (source IN ('whatsapp', 'enquire_form')),
    itinerary_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read access to packages & destinations
CREATE POLICY "Public Read Packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Public Read Destinations" ON public.destinations FOR SELECT USING (true);

-- Allow public insertion to inquiries & enquiries
CREATE POLICY "Public Insert Inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Inquiries" ON public.inquiries FOR SELECT USING (true);

CREATE POLICY "Allow public insert on enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read on enquiries" ON public.enquiries FOR SELECT USING (true);

-- Allow full access for anon/authenticated roles (for admin operation without complex auth)
CREATE POLICY "Full Access Packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Destinations" ON public.destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Enquiries" ON public.enquiries FOR ALL USING (true) WITH CHECK (true);
