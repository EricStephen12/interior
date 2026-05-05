'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  MessageCircle,
  Minus,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMembership } from '@/lib/membership-context';
import { useRouter, useParams } from 'next/navigation';
import { useWishlist } from '@/lib/wishlist-context';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { subscribe } = useMembership();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { isInWishlist, toggleItem } = useWishlist();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          const pr = data.product;
          setProduct(pr);
          setSelectedVariant({
            id: 'default',
            size: { name: pr.size?.label || 'Standard' },
            price: pr.price,
            promo_price: pr.promoPrice
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="w-12 h-12 border-2 border-gray-100 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">Loading</p>
      </motion.div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6">
        <p className="text-lg text-gray-400 font-medium">This product could not be found.</p>
        <Link href="/products" className="inline-block text-sm font-semibold text-primary underline underline-offset-4 hover:text-accent transition-colors">
          Browse all products
        </Link>
      </div>
    </div>
  );

  const images: string[] = Array.isArray(product.images) ? product.images : [];
  const activeImage = images[activeIndex] || '';
  const displayPrice = selectedVariant?.promo_price || selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.price || product.price;
  const hasDiscount = selectedVariant?.promo_price && selectedVariant.promo_price < selectedVariant.price;
  const discountPercent = hasDiscount ? Math.round((1 - selectedVariant.promo_price / selectedVariant.price) * 100) : 0;
  const liked = product ? isInWishlist(product.id) : false;
  const wishlistItem = product ? {
    id: product.id,
    name: product.name,
    price: product.price,
    promoPrice: product.promoPrice,
    image: images[0] || '',
    brand: product.brand?.name,
    type: product.type
  } : null;

  const handleAddToCart = () => {
    if (product.name.toLowerCase().includes('membership') || product.categories?.some((c: any) => c.category.name === 'Memberships')) {
      subscribe(30);
      router.push('/dashboard');
    } else {
      addToCart(product, selectedVariant, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const price = displayPrice?.toLocaleString() || '0';
    const text = `Hi SHARERS GYM, I'm interested in "${product.name}" (₦${price}). ${window.location.href}`;
    window.open(`https://wa.me/2349033333333?text=${encodeURIComponent(text)}`, '_blank');
  };

  const nextImage = () => setActiveIndex(i => (i + 1) % images.length);
  const prevImage = () => setActiveIndex(i => (i - 1 + images.length) % images.length);

  return (
    <div className="bg-white min-h-screen selection:bg-accent/10">

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-28 sm:pt-36 pb-4">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-[11px] text-gray-400 font-medium"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-200">/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          {product.type && (
            <>
              <span className="text-gray-200">/</span>
              <span>{product.type}</span>
            </>
          )}
          <span className="text-gray-200">/</span>
          <span className="text-primary font-semibold truncate max-w-[200px]">{product.name}</span>
        </motion.nav>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">

          {/* ═══════════ LEFT: IMAGE GALLERY ═══════════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-[#f8f7f5] rounded-2xl overflow-hidden group cursor-crosshair">
              <AnimatePresence mode="wait">
                {activeImage && (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full"
                  >
                    <Image
                      src={activeImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-primary hover:scale-110 shadow-xl shadow-black/5"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-primary hover:scale-110 shadow-xl shadow-black/5"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Discount badge */}
              {hasDiscount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-5 left-5"
                >
                  <span className="bg-primary text-white text-[11px] font-bold px-3.5 py-2 rounded-lg shadow-lg shadow-primary/20">
                    -{discountPercent}% OFF
                  </span>
                </motion.div>
              )}

              {/* Wishlist floating */}
              <button
                onClick={() => wishlistItem && toggleItem(wishlistItem)}
                className={`absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  liked
                    ? 'bg-red-500 text-white shadow-red-200'
                    : 'bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 hover:bg-white shadow-black/5'
                }`}
              >
                <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-current scale-110' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-[88px] h-[88px] flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                      activeIndex === idx
                        ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
                        : 'opacity-40 hover:opacity-80 grayscale hover:grayscale-0'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="88px" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ═══════════ RIGHT: PRODUCT INFO ═══════════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-32 lg:self-start py-4"
          >
            <div className="space-y-7">

              {/* Brand + Name */}
              <div className="space-y-4">
                {product.brand?.name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[11px] font-bold text-accent uppercase tracking-[0.35em]"
                  >
                    {product.brand.name}
                  </motion.p>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-primary leading-[1.1] tracking-tight">
                  {product.name}
                </h1>
                {product.type && (
                  <span className="inline-block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] border border-gray-100 px-3 py-1.5 rounded-full">
                    {product.type}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-4 pb-6 border-b border-gray-100">
                <span className="text-[2rem] sm:text-[2.5rem] font-bold text-primary tabular-nums leading-none">
                  ₦{displayPrice?.toLocaleString()}
                </span>
                {hasDiscount && (
                  <div className="flex items-center gap-3 pb-1">
                    <span className="text-lg text-gray-300 line-through tabular-nums font-medium">
                      ₦{originalPrice?.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                      SAVE {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="pb-6 border-b border-gray-100">
                  <p className="text-[15px] text-gray-500 leading-[1.9] font-normal whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size */}
              {product.size?.label && (
                <div className="pb-6 border-b border-gray-100 space-y-3">
                  <p className="text-[11px] font-bold text-gray-800 uppercase tracking-[0.15em]">Size</p>
                  <div className="flex gap-2">
                    <span className="px-6 py-3 text-sm font-bold bg-primary text-white rounded-lg shadow-md shadow-primary/15 transition-transform active:scale-95">
                      {product.size.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="space-y-3 pt-1">
                <p className="text-[11px] font-bold text-gray-800 uppercase tracking-[0.15em]">Quantity</p>
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center bg-[#f8f7f5] rounded-lg h-[54px] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold tabular-nums text-primary select-none">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`flex-1 h-[54px] rounded-lg flex items-center justify-center gap-3 text-[13px] font-bold tracking-wide transition-all duration-500 shadow-lg ${
                      added
                        ? 'bg-green-500 text-white shadow-green-200/50'
                        : 'bg-primary text-white hover:shadow-xl hover:shadow-primary/20 active:shadow-md'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {added ? (
                        <motion.span key="added" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          Added to Cart
                        </motion.span>
                      ) : (
                        <motion.span key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart — ₦{(displayPrice * quantity)?.toLocaleString()}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* WhatsApp */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsApp}
                  className="w-full h-[50px] border border-gray-200 rounded-lg flex items-center justify-center gap-3 text-[13px] font-semibold text-gray-600 hover:bg-[#f8f7f5] hover:border-gray-300 transition-all"
                >
                  <MessageCircle className="w-4.5 h-4.5 text-green-500" />
                  Order via WhatsApp
                </motion.button>
              </div>

              {/* Trust bar */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-[#f8f7f5] rounded-xl text-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Fast<br/>Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-[#f8f7f5] rounded-xl text-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Secure<br/>Payment</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-[#f8f7f5] rounded-xl text-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <RotateCcw className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Easy<br/>Returns</span>
                </div>
              </div>

              {/* Product meta details */}
              <div className="bg-[#f8f7f5] rounded-xl p-6 space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Product Details</p>
                {product.brand?.name && (
                  <div className="flex items-center justify-between py-2 border-b border-white/80">
                    <span className="text-[13px] text-gray-400 font-medium">Brand</span>
                    <span className="text-[13px] font-semibold text-primary">{product.brand.name}</span>
                  </div>
                )}
                {product.type && (
                  <div className="flex items-center justify-between py-2 border-b border-white/80">
                    <span className="text-[13px] text-gray-400 font-medium">Category</span>
                    <span className="text-[13px] font-semibold text-primary">{product.type}</span>
                  </div>
                )}
                {product.size?.label && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[13px] text-gray-400 font-medium">Size</span>
                    <span className="text-[13px] font-semibold text-primary">{product.size.label}</span>
                  </div>
                )}
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Back to products bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-8 flex items-center justify-between">
          <Link href="/products" className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
