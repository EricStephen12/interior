-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Brands Table
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo VARCHAR(255),
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Delivery Zones Table
CREATE TABLE delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_name VARCHAR(255) NOT NULL, -- e.g., "Abuja", "Benin"
  price DECIMAL(10,2) NOT NULL,
  estimated_days VARCHAR(100), -- e.g., "2-3 Business Days"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table (Updated)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- Mattress, Pillow, Bedding, Furniture
  type VARCHAR(100), -- Sub-category info if needed
  images TEXT[] DEFAULT '{}',
  materials TEXT, -- e.g., "Memory Foam, Latex"
  firmness VARCHAR(100), -- e.g., "Medium", "Hard"
  warranty VARCHAR(100), -- e.g., "10 Years"
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Sizes / Dimensions Table (Standard sizes)
CREATE TABLE sizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- e.g., "King", "Queen", "6x6"
  dimensions VARCHAR(255), -- e.g., "180cm x 200cm"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Product Variants (Links Products to Sizes with Prices)
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size_id UUID REFERENCES sizes(id) ON DELETE RESTRICT,
  price DECIMAL(10,2) NOT NULL,
  promo_price DECIMAL(10,2), -- Nullable if no promo
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, size_id)
);

-- 6. Profiles (Extended Users - Admin Flag)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  state VARCHAR(100),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- specific user or guest (null)
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_zone_id UUID REFERENCES delivery_zones(id),
  delivery_cost DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_method VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, card, transfer
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Order Items
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id),
  product_name VARCHAR(255) NOT NULL, -- Snapshot
  size_name VARCHAR(100), -- Snapshot
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL, -- Snapshot of price at time of order
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Wishlist (Updated)
CREATE TABLE wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Security Policies (RLS)

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public brands view" ON brands FOR SELECT USING (true);
CREATE POLICY "Public delivery zones view" ON delivery_zones FOR SELECT USING (true);
CREATE POLICY "Public products view" ON products FOR SELECT USING (true);
CREATE POLICY "Public sizes view" ON sizes FOR SELECT USING (true);
CREATE POLICY "Public variants view" ON product_variants FOR SELECT USING (true);

-- Admin Write Access (Assuming you will manually set an admin in Supabase Dashboard first)
-- For simplicity in development, you might start with public read/write or authenticated write, 
-- but here is the secure pattern:

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Brands Policies
CREATE POLICY "Admin manage brands" ON brands FOR ALL USING (is_admin());

-- Products & Variants Policies
CREATE POLICY "Admin manage products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admin manage sizes" ON sizes FOR ALL USING (is_admin());
CREATE POLICY "Admin manage variants" ON product_variants FOR ALL USING (is_admin());
CREATE POLICY "Admin manage delivery zones" ON delivery_zones FOR ALL USING (is_admin());

-- Profiles Policies
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Admin can view all profiles
CREATE POLICY "Admin view all profiles" ON profiles FOR SELECT USING (is_admin());

-- Orders Policies
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
-- Admin view all orders
CREATE POLICY "Admin view all orders" ON orders FOR SELECT USING (is_admin());
-- Anyone can create an order ( Guest Checkout ) - *Caution with this, usually we want auth*
-- For now, allow authenticated users to create.
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items Policies
CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admin view all order items" ON order_items FOR SELECT USING (is_admin());

-- Create Storage Bucket for Products
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'products' AND is_admin() );

-- Seed Data (Optional)
INSERT INTO sizes (name, dimensions) VALUES 
('Single', '90cm x 190cm'),
('Double', '135cm x 190cm'),
('King', '150cm x 200cm'),
('Super King', '180cm x 200cm');

INSERT INTO brands (name, slug, description) VALUES
('Vitafoam', 'vitafoam', 'The fine art of living'),
('Mouka', 'mouka', 'Adding comfort to life'),
('Royal Foam', 'royal-foam', 'Rest assured'),
('Sara Foam', 'sara-foam', 'Quality foam products');
