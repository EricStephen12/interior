# 🏗 FurniLux - Luxury Furniture Ecommerce Website

A modern, responsive furniture ecommerce website built with Next.js, Supabase, and Framer Motion. Features a luxury design system with warm colors, elegant typography, and smooth animations.

## ✨ Features

### 🎨 Design & UI
- **Luxury Design System**: Warm browns, beige/cream, muted gold accents
- **Typography**: Playfair Display (serif) for headings, Inter (sans-serif) for body
- **Responsive Layout**: Mobile-first design with clean, minimalist spacing
- **Custom Scrollbar**: Branded scrollbar styling

### 🚀 Functionality
- **Product Catalog**: Grid layout with filtering and sorting
- **Product Details**: Image gallery, specifications, and interactive features
- **Shopping Cart**: Slide-out cart drawer with item management
- **Wishlist**: Heart icon toggle for favorite items
- **Contact Form**: Full contact page with form validation
- **Story Section**: Company story with image layouts

### 🎭 Animations (Framer Motion)
- **Hero Section**: Fade-in + slide-up text animations
- **Story Images**: Scroll-triggered fade-in effects
- **Product Grid**: Staggered card animations
- **Hover Effects**: Image zoom & button color changes
- **Cart Drawer**: Smooth slide-in from right
- **Scroll Indicators**: Animated scroll prompts

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **UI Components**: Headless UI
- **TypeScript**: Full type safety

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Homepage
│   ├── products/
│   │   ├── page.tsx        # Products listing
│   │   └── [id]/
│   │       └── page.tsx    # Product detail
│   ├── our-story/
│   │   └── page.tsx        # Company story
│   ├── contact/
│   │   └── page.tsx        # Contact page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   ├── Layout.tsx          # Main layout wrapper
│   ├── HeroSection.tsx     # Hero banner
│   ├── StorySection.tsx    # Company story
│   ├── ShopSection.tsx     # Product grid
│   └── CartDrawer.tsx      # Shopping cart
└── lib/
    └── supabase.ts         # Database client & types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd furni
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

The application uses the following Supabase tables:

### Products Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `price` (DECIMAL)
- `description` (TEXT)
- `category` (VARCHAR)
- `images` (TEXT[])
- `specifications` (JSONB)
- `in_stock` (BOOLEAN)
- `created_at` (TIMESTAMP)

### Cart Items Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `product_id` (UUID, Foreign Key)
- `quantity` (INTEGER)
- `created_at` (TIMESTAMP)

### Wishlist Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `product_id` (UUID, Foreign Key)
- `created_at` (TIMESTAMP)

## 🎨 Design System

### Colors
- **Primary**: Amber-600 (#D97706)
- **Secondary**: Amber-100 (#FEF3C7)
- **Background**: Amber-50 (#FFFBEB)
- **Text**: Amber-900 (#78350F)
- **Accent**: Amber-300 (#FCD34D)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Sizes**: Responsive scale from 14px to 72px

### Components
- **Buttons**: Primary (amber-600) and Secondary (amber-100)
- **Cards**: White background with subtle shadows
- **Forms**: Rounded inputs with amber focus states

## 🔧 Customization

### Adding New Products
1. Update the mock data in `ShopSection.tsx`
2. Add real product data to Supabase
3. Implement data fetching with Supabase client

### Styling Changes
- Modify `globals.css` for global styles
- Update Tailwind classes in components
- Customize color palette in `tailwind.config.js`

### Animation Tweaks
- Adjust Framer Motion variants in components
- Modify transition durations and delays
- Add new animation triggers

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `out` folder
- **Railway**: Connect GitHub repo and set environment variables
- **DigitalOcean**: Use App Platform with Node.js buildpack

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Supabase** for the backend infrastructure
- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling
- **Heroicons** for beautiful icons

---

Built with ❤️ for luxury furniture lovers everywhere.