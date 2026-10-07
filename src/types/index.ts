export type UserRole = 'farmer' | 'buyer' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type AccountStatus = 'active' | 'suspended' | 'banned';
export type ListingStatus = 'draft' | 'published' | 'sold' | 'archived' | 'suspended';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  county: string;
  sub_county?: string;
  ward?: string;
  profile_photo?: string;
  bio?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  listing_count?: number;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  storage_path?: string;
  sort_order: number;
}

export interface Listing {
  id: string;
  farmer_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  price_unit: string;
  quantity: number;
  unit: string;
  county: string;
  sub_county?: string;
  ward?: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  status: ListingStatus;
  is_available: boolean;
  contact_phone?: string;
  whatsapp_number?: string;
  created_at: string;
  updated_at: string;
  // Joined relational fields
  farmer?: UserProfile;
  category?: Category;
  images?: ListingImage[];
  is_favorite?: boolean;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing;
}

export interface FilterOptions {
  categorySlug?: string;
  searchQuery?: string;
  county?: string;
  subCounty?: string;
  minPrice?: number;
  maxPrice?: number;
  onlyVerified?: boolean;
  onlyAvailable?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
}

export interface KenyaCounty {
  name: string;
  code: string;
  subCounties: {
    name: string;
    wards: string[];
  }[];
}
