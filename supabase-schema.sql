-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create wishlist table
CREATE TABLE wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Insert sample products
INSERT INTO products (name, price, description, category, images, specifications) VALUES
('Luxury Velvet Sofa', 2499.99, 'Premium velvet sofa with elegant design and superior comfort.', 'Sofas', 
 ARRAY['/images/sofa-1.jpg', '/images/sofa-2.jpg'], 
 '{"weight": "85kg", "length": "220cm", "width": "95cm", "height": "85cm"}'),
 
('Modern Dining Table', 1899.99, 'Contemporary dining table crafted from solid oak wood.', 'Tables', 
 ARRAY['/images/table-1.jpg', '/images/table-2.jpg'], 
 '{"weight": "45kg", "length": "180cm", "width": "90cm", "height": "75cm"}'),
 
('Executive Office Chair', 899.99, 'Ergonomic office chair with premium leather upholstery.', 'Chairs', 
 ARRAY['/images/chair-1.jpg', '/images/chair-2.jpg'], 
 '{"weight": "25kg", "length": "65cm", "width": "65cm", "height": "120cm"}'),
 
('Minimalist Bookshelf', 1299.99, 'Clean-lined bookshelf with adjustable shelves.', 'Storage', 
 ARRAY['/images/bookshelf-1.jpg', '/images/bookshelf-2.jpg'], 
 '{"weight": "35kg", "length": "120cm", "width": "35cm", "height": "180cm"}');

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own wishlist" ON wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);
