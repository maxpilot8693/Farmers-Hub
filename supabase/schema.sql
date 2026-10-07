-- FarmersHub Supabase PostgreSQL Database Schema
-- Run this script in the Supabase SQL Editor to set up tables, RLS policies, and seed data.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  county TEXT NOT NULL DEFAULT 'Kericho',
  sub_county TEXT,
  ward TEXT,
  profile_photo TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('farmer', 'buyer', 'admin')),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'banned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  price_unit TEXT NOT NULL, -- e.g. 'kg', 'head', 'bag', 'acre', 'hour', 'tray'
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  unit TEXT NOT NULL, -- e.g. 'kg', 'heads', 'bags', 'acres', 'hours', 'trays'
  county TEXT NOT NULL,
  sub_county TEXT,
  ward TEXT,
  location_name TEXT NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'sold', 'archived', 'suspended')),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LISTING IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_favorite UNIQUE (user_id, listing_id)
);

-- INDEXES FOR FAST MARKETPLACE QUERIES
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_county ON public.listings(county);
CREATE INDEX IF NOT EXISTS idx_listings_farmer ON public.listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (is_active = true);

-- Listings Policies
CREATE POLICY "Published listings are viewable by everyone"
  ON public.listings FOR SELECT
  USING (status = 'published' OR auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert their own listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own listings"
  ON public.listings FOR UPDATE
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own listings"
  ON public.listings FOR DELETE
  USING (auth.uid() = farmer_id);

-- Listing Images Policies
CREATE POLICY "Listing images are viewable by everyone"
  ON public.listing_images FOR SELECT USING (true);

CREATE POLICY "Farmers can manage images for their own listings"
  ON public.listing_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_images.listing_id
      AND listings.farmer_id = auth.uid()
    )
  );

-- Favorites Policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- SEED CATEGORIES
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Crops & Produce', 'crops-produce', 'Fresh agricultural produce including fruits, vegetables, cereals, grains and other crops.', 'Wheat'),
('Livestock', 'livestock', 'Cattle, goats, sheep, pigs, poultry and other farm animals.', 'Beef'),
('Animal Products', 'animal-products', 'Milk, eggs, honey, meat and other products derived from livestock.', 'Egg'),
('Seeds & Seedlings', 'seeds-seedlings', 'Seeds, seedlings, nursery plants and planting materials.', 'Sprout'),
('Farm Inputs', 'farm-inputs', 'Fertilizers, crop protection products, animal feeds and other farming inputs.', 'FlaskConical'),
('Farm Equipment', 'farm-equipment', 'Farm machinery, tools, irrigation equipment and agricultural equipment.', 'Tractor'),
('Agricultural Services', 'agricultural-services', 'Tractor services, transport, veterinary services, irrigation installation, farm labour and other services.', 'Wrench'),
('Land & Farm Spaces', 'land-farm-spaces', 'Farmland, farm spaces and agricultural land opportunities.', 'Trees'),
('Other', 'other', 'Other agricultural products and services that don''t fit the main categories.', 'Box')
ON CONFLICT (slug) DO NOTHING;
