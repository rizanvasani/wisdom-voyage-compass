import { supabase } from '@/integrations/supabase/client';

export interface TravelPackage {
  id?: string;
  name: string;
  category: 'domestic' | 'international';
  location: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  groupSize: string;
  tag: string;
  itinerary_url?: string | null;
  created_at?: string;
}

export interface PopularDestination {
  id?: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  tag: string;
  duration: string;
  description: string;
  created_at?: string;
}

export interface CustomerInquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  destination?: string;
  travel_dates?: string;
  adults?: number;
  children?: number;
  budget?: number[];
  trip_type?: string;
  requirements?: string[];
  notes?: string;
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Cancelled';
  created_at?: string;
}

export interface EnquiryRecord {
  id?: string;
  package_title: string;
  package_id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  travel_date?: string | null;
  travel_date_from?: string | null;
  travel_date_to?: string | null;
  budget_per_person?: string | null;
  needs?: string[] | null;
  adults?: number | null;
  children?: number | null;
  notes?: string | null;
  source: 'whatsapp' | 'enquire_form';
  itinerary_url?: string | null;
  created_at?: string;
}

// Initial default seed datasets
export const DEFAULT_PACKAGES: TravelPackage[] = [
  {
    id: 'default-pkg-1',
    name: 'Golden Triangle Tour',
    category: 'domestic',
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
    id: 'default-pkg-2',
    name: 'Kerala Backwaters',
    category: 'domestic',
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
    id: 'default-pkg-3',
    name: 'Goa Beach Paradise',
    category: 'domestic',
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
    id: 'default-pkg-4',
    name: 'Himachal Hill Stations',
    category: 'domestic',
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
    id: 'default-pkg-5',
    name: 'Swiss Alps Adventure',
    category: 'international',
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
    id: 'default-pkg-6',
    name: 'Iceland Nature Tour',
    category: 'international',
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
    id: 'default-pkg-7',
    name: 'Bali Tropical Escape',
    category: 'international',
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
    id: 'default-pkg-8',
    name: 'Dubai Luxury Getaway',
    category: 'international',
    location: 'Dubai, Abu Dhabi, Sharjah',
    duration: '5 Days / 4 Nights',
    price: '₹85,000',
    rating: 4.8,
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Gold Souk', 'Dhow Cruise'],
    groupSize: '2–20 people',
    tag: 'Glamour',
  }
];

export const DEFAULT_DESTINATIONS: PopularDestination[] = [
  {
    id: 'default-dest-1',
    name: 'The Swiss Alps',
    location: 'Bernese Oberland, Switzerland',
    price: '₹1.5L',
    rating: 4.9,
    reviews: 842,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tag: 'Luxury Escape',
    duration: '7 Days',
    description: 'Experience the majesty of snow-capped peaks and crystal alpine lakes in the heart of Europe.'
  },
  {
    id: 'default-dest-2',
    name: 'Bali Retreat',
    location: 'Ubud, Indonesia',
    price: '₹85K',
    rating: 4.8,
    reviews: 1250,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tag: 'Tropical Zen',
    duration: '6 Days',
    description: 'Discover the perfect blend of spiritual heritage, lush jungles, and pristine emerald beaches.'
  },
  {
    id: 'default-dest-3',
    name: 'Nordic Aurora',
    location: 'Reykjavík, Iceland',
    price: '₹2.1L',
    rating: 4.9,
    reviews: 615,
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tag: 'Arctic Adventure',
    duration: '8 Days',
    description: 'Embark on a surreal journey through volcanic landscapes, glaciers, and the dancing Northern Lights.'
  }
];

// --- PACKAGES API ---
export async function getPackages(): Promise<TravelPackage[]> {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase packages not found or empty, returning fallback default packages.', error);
      return DEFAULT_PACKAGES;
    }

    return data.map((item: any, idx: number) => ({
      id: item.id || `pkg-${idx + 1}`,
      name: item.name || item.title || '',
      category: item.category,
      location: item.location,
      duration: item.duration,
      price: item.price,
      rating: Number(item.rating || 4.5),
      reviews: Number(item.reviews || 0),
      image: item.image,
      highlights: Array.isArray(item.highlights) ? item.highlights : [],
      groupSize: item.group_size || '2–10 people',
      tag: item.tag || '',
      itinerary_url: item.itinerary_url || item.itineraryUrl || '',
      created_at: item.created_at
    }));
  } catch (err) {
    console.error('Error fetching packages from Supabase:', err);
    return DEFAULT_PACKAGES;
  }
}

export async function createPackage(pkg: TravelPackage) {
  const insertPayload: any = {
    title: pkg.name,
    category: pkg.category,
    location: pkg.location,
    duration: pkg.duration,
    price: pkg.price,
    rating: pkg.rating,
    reviews: pkg.reviews,
    image: pkg.image,
    highlights: pkg.highlights,
    group_size: pkg.groupSize,
    tag: pkg.tag,
    itinerary_url: pkg.itinerary_url || null,
  };

  const { data, error } = await supabase
    .from('packages')
    .insert([insertPayload])
    .select();

  if (error) {
    // If table uses 'name' instead of 'title', retry with 'name'
    insertPayload.name = pkg.name;
    delete insertPayload.title;
    const { data: retryData, error: retryErr } = await supabase
      .from('packages')
      .insert([insertPayload])
      .select();
    if (retryErr) throw retryErr;
    return retryData;
  }
  return data;
}

export async function updatePackage(id: string, pkg: Partial<TravelPackage>) {
  const updateData: any = {};
  if (pkg.name !== undefined) {
    updateData.title = pkg.name;
  }
  if (pkg.category !== undefined) updateData.category = pkg.category;
  if (pkg.location !== undefined) updateData.location = pkg.location;
  if (pkg.duration !== undefined) updateData.duration = pkg.duration;
  if (pkg.price !== undefined) updateData.price = pkg.price;
  if (pkg.rating !== undefined) updateData.rating = pkg.rating;
  if (pkg.reviews !== undefined) updateData.reviews = pkg.reviews;
  if (pkg.image !== undefined) updateData.image = pkg.image;
  if (pkg.highlights !== undefined) updateData.highlights = pkg.highlights;
  if (pkg.groupSize !== undefined) updateData.group_size = pkg.groupSize;
  if (pkg.tag !== undefined) updateData.tag = pkg.tag;
  if (pkg.itinerary_url !== undefined) updateData.itinerary_url = pkg.itinerary_url || null;

  const { data, error } = await supabase
    .from('packages')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    if (pkg.name !== undefined) {
      updateData.name = pkg.name;
      delete updateData.title;
    }
    const { data: retryData, error: retryErr } = await supabase
      .from('packages')
      .update(updateData)
      .eq('id', id)
      .select();
    if (retryErr) throw retryErr;
    return retryData;
  }
  return data;
}

export async function deletePackage(id: string) {
  const { error } = await supabase.from('packages').delete().eq('id', id);
  if (error) throw error;
}

// --- DESTINATIONS API ---
export async function getDestinations(): Promise<PopularDestination[]> {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_DESTINATIONS;
    }

    return data.map((item: any, idx: number) => ({
      id: item.id || `dest-${idx + 1}`,
      name: item.name,
      location: item.location,
      price: item.price,
      rating: Number(item.rating || 4.8),
      reviews: Number(item.reviews || 0),
      image: item.image,
      tag: item.tag || '',
      duration: item.duration,
      description: item.description,
      created_at: item.created_at
    }));
  } catch (err) {
    console.error('Error fetching destinations from Supabase:', err);
    return DEFAULT_DESTINATIONS;
  }
}

export async function createDestination(dest: PopularDestination) {
  const { data, error } = await supabase
    .from('destinations')
    .insert([
      {
        name: dest.name,
        location: dest.location,
        price: dest.price,
        rating: dest.rating,
        reviews: dest.reviews,
        image: dest.image,
        tag: dest.tag,
        duration: dest.duration,
        description: dest.description,
      }
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function updateDestination(id: string, dest: Partial<PopularDestination>) {
  const { data, error } = await supabase
    .from('destinations')
    .update(dest)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteDestination(id: string) {
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  if (error) throw error;
}

// --- INQUIRIES API ---
export async function getInquiries(): Promise<CustomerInquiry[]> {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      destination: item.destination,
      travel_dates: item.travel_dates,
      adults: item.adults,
      children: item.children,
      budget: item.budget,
      trip_type: item.trip_type,
      requirements: item.requirements,
      notes: item.notes,
      status: item.status || 'Pending',
      created_at: item.created_at
    }));
  } catch (err) {
    console.error('Error fetching inquiries from Supabase:', err);
    return [];
  }
}

export async function createInquiry(inquiry: Omit<CustomerInquiry, 'id' | 'status' | 'created_at'>) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([
      {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        destination: inquiry.destination || '',
        travel_dates: inquiry.travel_dates || '',
        adults: inquiry.adults || 1,
        children: inquiry.children || 0,
        budget: inquiry.budget || [],
        trip_type: inquiry.trip_type || '',
        requirements: inquiry.requirements || [],
        notes: inquiry.notes || '',
        status: 'Pending',
      }
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function updateInquiryStatus(id: string, status: CustomerInquiry['status']) {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteInquiry(id: string) {
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
}

// --- 1-CLICK SEED HELPER ---
export async function seedDatabaseIfEmpty() {
  let seededPackagesCount = 0;
  let seededDestinationsCount = 0;

  try {
    // Check Packages
    const { data: existingPkgs, error: pkgErr } = await supabase.from('packages').select('id');
    if (pkgErr) {
      throw new Error(`Database connection error: ${pkgErr.message}`);
    }

    if (!existingPkgs || existingPkgs.length === 0) {
      for (const pkg of DEFAULT_PACKAGES) {
        await createPackage(pkg);
        seededPackagesCount++;
      }
    }

    // Check Destinations
    const { data: existingDests, error: destErr } = await supabase.from('destinations').select('id');
    if (destErr) {
      throw new Error(`Destinations table error: ${destErr.message}`);
    }

    if (!existingDests || existingDests.length === 0) {
      for (const dest of DEFAULT_DESTINATIONS) {
        await createDestination(dest);
        seededDestinationsCount++;
      }
    }

    return {
      seededPackagesCount,
      seededDestinationsCount,
      totalExistingPackages: existingPkgs?.length || 0,
      totalExistingDestinations: existingDests?.length || 0
    };
  } catch (err: any) {
    console.error('Seed helper error:', err);
    throw err;
  }
}

export async function createEnquiryRecord(enquiry: EnquiryRecord) {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{
        package_title: enquiry.package_title,
        package_id: enquiry.package_id || null,
        name: enquiry.name || null,
        email: enquiry.email || null,
        phone: enquiry.phone || null,
        travel_date: enquiry.travel_date || null,
        travel_date_from: enquiry.travel_date_from || null,
        travel_date_to: enquiry.travel_date_to || null,
        budget_per_person: enquiry.budget_per_person || null,
        needs: enquiry.needs || [],
        adults: enquiry.adults ?? 1,
        children: enquiry.children ?? 0,
        notes: enquiry.notes || null,
        source: enquiry.source,
        itinerary_url: enquiry.itinerary_url || null
      }])
      .select();

    if (error) {
      console.warn('Supabase enquiries insert warning:', error);
    }
    return data;
  } catch (err) {
    console.warn('Failed to insert enquiry record:', err);
    return null;
  }
}

export async function getEnquiryRecords(): Promise<EnquiryRecord[]> {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase enquiries fetch warning:', error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      package_title: item.package_title || item.packageTitle || '',
      package_id: item.package_id || item.packageId || null,
      name: item.name || '',
      email: item.email || '',
      phone: item.phone || '',
      travel_date: item.travel_date || item.travelDate || null,
      travel_date_from: item.travel_date_from || item.travelDateFrom || null,
      travel_date_to: item.travel_date_to || item.travelDateTo || null,
      budget_per_person: item.budget_per_person || item.budgetPerPerson || null,
      needs: Array.isArray(item.needs) ? item.needs : [],
      adults: item.adults ?? 1,
      children: item.children ?? 0,
      notes: item.notes || '',
      source: item.source || 'enquire_form',
      itinerary_url: item.itinerary_url || item.itineraryUrl || null,
      created_at: item.created_at
    }));
  } catch (err) {
    console.error('Failed to get enquiry records:', err);
    return [];
  }
}
