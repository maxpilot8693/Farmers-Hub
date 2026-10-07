import { Category, FilterOptions, Listing, UserProfile } from '../types';
import { SEED_CATEGORIES, SEED_FARMERS, SEED_LISTINGS } from '../data/seedData';

// Local storage keys
const LISTINGS_KEY = 'farmershub_listings';
const FARMERS_KEY = 'farmershub_farmers';
const FAVORITES_KEY = 'farmershub_favorites';
const CURRENT_USER_KEY = 'farmershub_current_user';

// Initialize local storage with seed data if empty
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(LISTINGS_KEY)) {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(SEED_LISTINGS));
  }
  if (!localStorage.getItem(FARMERS_KEY)) {
    localStorage.setItem(FARMERS_KEY, JSON.stringify(SEED_FARMERS));
  }
  if (!localStorage.getItem(FAVORITES_KEY)) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
  }
}

initializeLocalStorage();

// Helper to get items
function getStoredListings(): Listing[] {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY);
    return raw ? JSON.parse(raw) : SEED_LISTINGS;
  } catch (e) {
    return SEED_LISTINGS;
  }
}

function saveStoredListings(listings: Listing[]) {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
}

function getStoredFarmers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(FARMERS_KEY);
    return raw ? JSON.parse(raw) : SEED_FARMERS;
  } catch (e) {
    return SEED_FARMERS;
  }
}

function saveStoredFarmers(farmers: UserProfile[]) {
  localStorage.setItem(FARMERS_KEY, JSON.stringify(farmers));
}

function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredFavorites(favs: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export const api = {
  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    const listings = getStoredListings().filter((l) => l.status === 'published');
    return SEED_CATEGORIES.map((cat) => {
      const count = listings.filter((l) => l.category_id === cat.id || l.category?.slug === cat.slug).length;
      return {
        ...cat,
        listing_count: count,
      };
    });
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await this.getCategories();
    return categories.find((c) => c.slug === slug) || null;
  },

  // --- LISTINGS ---
  async getListings(filters: FilterOptions = {}): Promise<Listing[]> {
    let listings = getStoredListings();
    const favorites = getStoredFavorites();

    // Default filter for published listings
    listings = listings.filter((l) => l.status === 'published');

    // Attach farmer & category & favorite tag
    const farmers = getStoredFarmers();
    const categories = SEED_CATEGORIES;

    listings = listings.map((l) => {
      const farmer = farmers.find((f) => f.id === l.farmer_id) || l.farmer;
      const category = categories.find((c) => c.id === l.category_id) || l.category;
      return {
        ...l,
        farmer,
        category,
        is_favorite: favorites.includes(l.id),
      };
    });

    // Category Filter
    if (filters.categorySlug) {
      listings = listings.filter(
        (l) => l.category?.slug === filters.categorySlug || l.category_id === filters.categorySlug
      );
    }

    // Search Query (Title, Description, Farmer Name, Category, Location)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.county.toLowerCase().includes(q) ||
          (l.sub_county && l.sub_county.toLowerCase().includes(q)) ||
          (l.ward && l.ward.toLowerCase().includes(q)) ||
          l.location_name.toLowerCase().includes(q) ||
          (l.farmer && l.farmer.full_name.toLowerCase().includes(q)) ||
          (l.category && l.category.name.toLowerCase().includes(q))
      );
    }

    // Location Filter
    if (filters.county) {
      listings = listings.filter((l) => l.county.toLowerCase() === filters.county?.toLowerCase());
    }
    if (filters.subCounty) {
      listings = listings.filter((l) => l.sub_county?.toLowerCase() === filters.subCounty?.toLowerCase());
    }

    // Price Filter
    if (filters.minPrice !== undefined) {
      listings = listings.filter((l) => l.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      listings = listings.filter((l) => l.price <= filters.maxPrice!);
    }

    // Verified Filter
    if (filters.onlyVerified) {
      listings = listings.filter((l) => l.farmer?.verification_status === 'verified');
    }

    // Availability Filter
    if (filters.onlyAvailable) {
      listings = listings.filter((l) => l.is_available);
    }

    // Sort
    if (filters.sortBy === 'price_asc') {
      listings.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      listings.sort((a, b) => b.price - a.price);
    } else {
      // Newest first
      listings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return listings;
  },

  async getListingById(id: string): Promise<Listing | null> {
    const listings = getStoredListings();
    const favorites = getStoredFavorites();
    const l = listings.find((item) => item.id === id);
    if (!l) return null;

    const farmers = getStoredFarmers();
    const farmer = farmers.find((f) => f.id === l.farmer_id) || l.farmer;
    const category = SEED_CATEGORIES.find((c) => c.id === l.category_id) || l.category;

    return {
      ...l,
      farmer,
      category,
      is_favorite: favorites.includes(l.id),
    };
  },

  async getFarmerListings(farmerId: string): Promise<Listing[]> {
    const listings = getStoredListings();
    const farmers = getStoredFarmers();
    const farmer = farmers.find((f) => f.id === farmerId);

    return listings
      .filter((l) => l.farmer_id === farmerId)
      .map((l) => ({
        ...l,
        farmer,
        category: SEED_CATEGORIES.find((c) => c.id === l.category_id) || l.category,
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createListing(newListing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Promise<Listing> {
    const listings = getStoredListings();
    const id = `list-${Date.now()}`;
    const now = new Date().toISOString();

    const created: Listing = {
      ...newListing,
      id,
      created_at: now,
      updated_at: now,
    };

    listings.unshift(created);
    saveStoredListings(listings);
    return created;
  },

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    const listings = getStoredListings();
    const index = listings.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Listing not found');

    const updated = {
      ...listings[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    listings[index] = updated;
    saveStoredListings(listings);
    return updated;
  },

  async deleteListing(id: string): Promise<void> {
    let listings = getStoredListings();
    listings = listings.filter((l) => l.id !== id);
    saveStoredListings(listings);
  },

  // --- FARMER PROFILES ---
  async getFarmerProfile(id: string): Promise<UserProfile | null> {
    const farmers = getStoredFarmers();
    return farmers.find((f) => f.id === id) || null;
  },

  async updateFarmerProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const farmers = getStoredFarmers();
    const index = farmers.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Profile not found');

    const updated = {
      ...farmers[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    farmers[index] = updated;
    saveStoredFarmers(farmers);

    // Update current user session if applicable
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    }

    return updated;
  },

  // --- FAVORITES ---
  async toggleFavorite(listingId: string): Promise<boolean> {
    const favorites = getStoredFavorites();
    const exists = favorites.includes(listingId);
    let updated: string[];

    if (exists) {
      updated = favorites.filter((id) => id !== listingId);
    } else {
      updated = [...favorites, listingId];
    }

    saveStoredFavorites(updated);
    return !exists;
  },

  async getFavorites(): Promise<Listing[]> {
    const favoriteIds = getStoredFavorites();
    const listings = getStoredListings();
    const farmers = getStoredFarmers();

    return listings
      .filter((l) => favoriteIds.includes(l.id))
      .map((l) => ({
        ...l,
        farmer: farmers.find((f) => f.id === l.farmer_id) || l.farmer,
        category: SEED_CATEGORIES.find((c) => c.id === l.category_id) || l.category,
        is_favorite: true,
      }));
  },

  // --- AUTH EMULATION / SESSION ---
  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // default
    }
    // Default logged in user for smooth demo experience: Kiprono Cheruiyot (farmer)
    return SEED_FARMERS[0];
  },

  setCurrentUser(user: UserProfile | null) {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  },

  async registerUser(data: {
    full_name: string;
    email: string;
    phone: string;
    county: string;
    sub_county?: string;
    ward?: string;
    role: 'farmer' | 'buyer';
  }): Promise<UserProfile> {
    const farmers = getStoredFarmers();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      county: data.county,
      sub_county: data.sub_county || '',
      ward: data.ward || '',
      role: data.role,
      verification_status: data.role === 'farmer' ? 'pending' : 'unverified',
      account_status: 'active',
      bio: data.role === 'farmer' ? 'Kenyan farmer on FarmersHub.' : 'Produce buyer on FarmersHub.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    farmers.push(newUser);
    saveStoredFarmers(farmers);
    this.setCurrentUser(newUser);

    return newUser;
  },

  // --- ADMIN API ---
  async getAllUsers(): Promise<UserProfile[]> {
    return getStoredFarmers();
  },

  async getAllListingsAdmin(): Promise<Listing[]> {
    const listings = getStoredListings();
    const farmers = getStoredFarmers();
    return listings.map((l) => ({
      ...l,
      farmer: farmers.find((f) => f.id === l.farmer_id) || l.farmer,
      category: SEED_CATEGORIES.find((c) => c.id === l.category_id) || l.category,
    }));
  },
};
