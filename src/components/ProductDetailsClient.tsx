'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { useToast } from '@/components/ToastProvider';
import { useUser } from '@clerk/nextjs';
import {
  ArrowLeft,
  ShoppingBag,
  Minus,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Heart,
  Star,
  Trash2,
  ChevronDown,
  Sparkles,
  Zap,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMembership } from '@/lib/membership-context';
import { useCustomization } from '@/lib/customization-context';
import { useRouter } from 'next/navigation';

interface ProductDetailsClientProps {
  product: any;
}

export default function ProductDetailsClient({ product: initialProduct }: ProductDetailsClientProps) {
  const { get } = useCustomization();
  const pdpBadge1 = get('section.pdp.badge1', 'Express 24h Dispatch');
  const pdpBadge2 = get('section.pdp.badge2', '100% Verified Genuine');
  const pdpBadge3 = get('section.pdp.badge3', '7-Day Sizing Exchange');
  const pdpBtnAddToCart = get('section.pdp.btnAddToCart', 'ADD TO BAG');
  const pdpBtnPass = get('section.pdp.btnPass', 'GET THE PASS');
  const pdpMetaTitle = get('section.pdp.specsTitle', 'Technical Specifications');
  const pdpReviewsTitle = get('section.pdp.reviewsTitle', 'Customer Reviews');
  const pdpRecentlyTitle = get('section.pdp.recentlyTitle', 'Recently Viewed Equipment');

  const { addToCart } = useCart();
  const { subscribe } = useMembership();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(initialProduct);
  const [selectedVariant, setSelectedVariant] = useState<any>(() => ({
    id: 'default',
    size: { name: initialProduct.size?.label || 'Standard' },
    price: initialProduct.price,
    promo_price: initialProduct.promoPrice
  }));
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Recently viewed state
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  const wishlisted = isWishlisted(initialProduct.id);

  useEffect(() => {
    // Notify Theme Studio parent frame if embedded in preview
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SHARERS_IFRAME_NAVIGATE', path: window.location.pathname }, '*');
    }
  }, []);

  useEffect(() => {
    setImageLoaded(false);
  }, [activeIndex]);

  // Track recently viewed
  useEffect(() => {
    try {
      const key = 'sharers-recently-viewed';
      const existing: any[] = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = existing.filter((p: any) => p.id !== initialProduct.id);
      const imgs = Array.isArray(initialProduct.images) ? initialProduct.images
        : typeof initialProduct.images === 'string' ? JSON.parse(initialProduct.images || '[]') : [];
      const next = [{ id: initialProduct.id, name: initialProduct.name, price: initialProduct.price, image: imgs[0] || '' }, ...filtered].slice(0, 6);
      localStorage.setItem(key, JSON.stringify(next));
      setRecentlyViewed(next.filter((p: any) => p.id !== initialProduct.id).slice(0, 4));
    } catch {}
  }, [initialProduct.id]);

  // Fetch reviews
  useEffect(() => {
    fetch(`/api/reviews?productId=${initialProduct.id}`)
      .then(r => r.json())
      .then(data => {
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
      })
      .catch(() => {});
  }, [initialProduct.id]);

  useEffect(() => {
    fetch(`/api/products/${initialProduct.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          const pr = data.product;
          setProduct(pr);
          setSelectedVariant((prev: any) => ({
            ...prev,
            size: { name: pr.size?.label || 'Standard' },
            price: pr.price,
            promo_price: pr.promoPrice
          }));
        }
      })
      .catch((err) => console.error("Background refresh error:", err));
  }, [initialProduct.id]);

  const getImages = () => {
    if (!product) return [];
    if (Array.isArray(product.images)) {
      return product.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
    }
    if (typeof product.images === 'string' && product.images.trim().length > 0) {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed)) {
          return parsed.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
        }
        if (typeof parsed === 'string' && parsed.trim().length > 0) {
          return [parsed.trim()];
        }
      } catch {
        return [product.images.trim()];
      }
    }
    return [];
  };

  const images = getImages();
  const activeImage = images[activeIndex] || '';
  const displayPrice = selectedVariant?.promo_price || selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.price || product.price;
  const hasDiscount = selectedVariant?.promo_price && selectedVariant.promo_price < selectedVariant.price;
  const discountPercent = hasDiscount ? Math.round((1 - selectedVariant.promo_price / selectedVariant.price) * 100) : 0;

  const handleAddToCart = () => {
    if (product.name?.toLowerCase().includes('membership') || product.categories?.some((c: any) => c.category?.name === 'Memberships')) {
      subscribe(30);
      router.push('/dashboard');
    } else {
      addToCart(product, selectedVariant, quantity);
      showToast('Added to Cart', 'success', product.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const handleInstantBuy = () => {
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) return;
    setSubmittingReview(true);
    setReviewError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: initialProduct.id, ...reviewForm })
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.error || 'Failed to submit review');
      } else {
        setReviewSuccess(true);
        setReviewForm({ rating: 5, comment: '' });
        fetch(`/api/reviews?productId=${initialProduct.id}`)
          .then(r => r.json())
          .then(d => { setReviews(d.reviews || []); setAvgRating(d.avgRating || 0); })
          .catch(() => {});
      }
    } catch {
      setReviewError('Network error. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setDeletingReviewId(reviewId);
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        setReviewSuccess(false);
        showToast('Review deleted', 'success');
        fetch(`/api/reviews?productId=${initialProduct.id}`)
          .then(r => r.json())
          .then(d => setAvgRating(d.avgRating || 0))
          .catch(() => {});
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete review', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const nextImage = () => setActiveIndex(i => (i + 1) % images.length);
  const prevImage = () => setActiveIndex(i => (i - 1 + images.length) % images.length);

  const isOutOfStock = product?.isActive === false || product?.inStock === false || (product?.stock !== undefined && product.stock <= 0);

  return (
    <div className="bg-white min-h-screen selection:bg-accent/20">

      {/* ── LUXURY MINIMAL BREADCRUMB ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-7 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-text-muted font-medium overflow-x-auto scrollbar-hide py-1">
          <Link 
            href="/" 
            className="hover:text-primary transition-colors whitespace-nowrap shrink-0 font-semibold tracking-wide"
          >
            Home
          </Link>

          <ChevronRight className="w-3 h-3 text-primary/30 shrink-0" />

          <Link 
            href="/products" 
            className="hover:text-primary transition-colors whitespace-nowrap shrink-0 tracking-wide"
          >
            Arsenal & Shop
          </Link>

          {product.brand?.name && (
            <>
              <ChevronRight className="w-3 h-3 text-primary/30 shrink-0" />
              <span className="hover:text-primary transition-colors whitespace-nowrap shrink-0 tracking-wide">
                {product.brand.name}
              </span>
            </>
          )}

          <ChevronRight className="w-3 h-3 text-primary/30 shrink-0" />

          <span className="text-primary font-bold truncate max-w-[180px] sm:max-w-[280px] md:max-w-[400px] shrink-0 tracking-wide">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ── MAIN ATELIER PRODUCT SHOWCASE ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 xl:gap-20">

          {/* ═══════════ LEFT: CINEMATIC GALLERY ═══════════ */}
          <div className="w-full lg:w-[58%] flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
            
            {/* Vertical / Horizontal Thumbnails Strip */}
            {images.length > 1 && (
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24 scrollbar-hide shrink-0 py-1 lg:py-0">
                {(images as string[]).map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-20 h-24 lg:w-full lg:h-28 rounded-xl overflow-hidden shrink-0 transition-all duration-300 border ${
                      activeIndex === idx
                        ? 'border-accent ring-2 ring-accent/40 shadow-md scale-[1.02]'
                        : 'border-primary/10 opacity-60 hover:opacity-100 hover:border-primary/30'
                    }`}
                  >
                    <Image src={img} alt="" fill unoptimized className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Spotlight Image Container */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-auto min-h-[380px] sm:min-h-[460px] lg:min-h-[640px] lg:flex-1 bg-secondary/30 rounded-2xl overflow-hidden border border-primary/10 group shadow-sm flex items-center justify-center">
              
              {/* Image Index Overlay Counter */}
              {images.length > 1 && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-[10px] font-mono font-black text-white uppercase tracking-widest shadow-sm">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>
              )}

              {/* Discount / Out of Stock / Bestseller Floating Badge */}
              <div className="absolute top-4 right-4 z-20 flex flex-row items-center gap-2">
                {isOutOfStock && (
                  <span className="px-3.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    OUT OF STOCK
                  </span>
                )}
                {hasDiscount && !isOutOfStock && (
                  <span className="px-3.5 py-1 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.isBestseller && (
                  <span className="px-3.5 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                    BESTSELLER
                  </span>
                )}
              </div>

              {/* Gallery Arrow Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-primary border border-primary/10 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-white shadow-md z-20 active:scale-95"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-primary border border-primary/10 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-white shadow-md z-20 active:scale-95"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Mobile Dot Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 lg:hidden bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                    {images.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Shimmer Pulse */}
              {!imageLoaded && activeImage && (
                <div className="absolute inset-0 bg-secondary/80 animate-pulse flex items-center justify-center z-10" />
              )}
              
              <AnimatePresence mode="wait">
                {activeImage ? (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={activeImage}
                      alt={product.name || 'Product Image'}
                      fill
                      unoptimized
                      className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      priority
                      onLoad={() => setImageLoaded(true)}
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-text-muted">
                    <Package className="w-12 h-12 mb-2 opacity-30 text-primary" />
                    <p className="text-xs font-black uppercase tracking-widest text-primary/60">No Image Asset Available</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ═══════════ RIGHT: LUXURY PRODUCT DETAILS ═══════════ */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-28 lg:self-start space-y-6">
            
            {/* Brand Kicker & Wishlist */}
            <div className="flex items-center justify-between border-b border-primary/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                  {product.brand?.name || 'SHARERS ARSENAL'}
                </span>
                <span className="text-primary/20">•</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  {product.type || 'Official Equipment'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(wishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist', 'success', product.name);
                }}
                className={`p-2.5 rounded-full border transition-all ${
                  wishlisted 
                    ? 'border-red-500 bg-red-50 text-red-500 shadow-sm' 
                    : 'border-primary/10 text-text-muted hover:text-primary hover:border-primary/30'
                }`}
                title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Product Name Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight leading-[1.05] uppercase font-heading">
                {product.name}
              </h1>

              {/* Star Rating Overview */}
              <div className="flex items-center gap-2.5 mt-3">
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(avgRating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-primary font-mono">
                  {avgRating > 0 ? avgRating.toFixed(1) : '5.0'}
                </span>
                <span className="text-text-muted/40">•</span>
                <a href="#reviews-section" className="text-xs font-bold text-text-muted hover:text-accent transition-colors underline underline-offset-4">
                  {reviews.length > 0 ? `${reviews.length} Verified Reviews` : 'First to Review'}
                </a>
              </div>
            </div>

            {/* Price Presentation */}
            <div className="p-4 bg-secondary/30 rounded-xl border border-primary/5 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-0.5">Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight tabular-nums">
                    ₦{displayPrice?.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm font-bold text-text-muted line-through tabular-nums">
                      ₦{originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {isOutOfStock ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200/80 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Out Of Stock
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock & Ready
                </span>
              )}
            </div>

            {/* Description Lead */}
            {product.description && (
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-normal">
                {product.description}
              </p>
            )}

            {/* Out of Stock Alert Notification Banner */}
            {isOutOfStock && (
              <div className="p-4 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-3 text-red-900 shadow-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-900">Item Currently Unavailable</p>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    This item is currently sold out. Save it to your Wishlist to stay updated or message support for restock notices.
                  </p>
                </div>
              </div>
            )}

            {/* Size / Spec Variant Selectors */}
            {product.size?.label && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">Select Specification</label>
                  <span className="text-[10px] font-bold text-accent">Standard Fit</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-lg border-2 border-accent bg-accent/5 text-primary text-xs font-black uppercase tracking-wider shadow-xs"
                  >
                    {product.size.label}
                  </button>
                </div>
              </div>
            )}

            {/* Action Area: Quantity & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                
                {/* Quantity Pill Counter */}
                <div className={`flex items-center justify-between border border-primary/15 bg-secondary/20 rounded-lg p-1 w-32 shrink-0 ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}>
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded flex items-center justify-center text-primary hover:bg-white transition-colors disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-primary font-mono">{quantity}</span>
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded flex items-center justify-center text-primary hover:bg-white transition-colors disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add To Bag Button */}
                <button
                  type="button"
                  onClick={isOutOfStock ? () => showToast('This item is currently out of stock.', 'error') : handleAddToCart}
                  disabled={isOutOfStock || added}
                  className={`flex-1 py-4 px-6 text-xs font-black uppercase tracking-[0.25em] flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                    isOutOfStock
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'
                      : added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-primary hover:bg-accent text-white hover:shadow-accent/25 active:scale-95 touch-manipulation cursor-pointer'
                  }`}
                  style={{ borderRadius: 'var(--radius-brand-none, 0px)' }}
                >
                  {isOutOfStock ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-neutral-500" />
                      <span>OUT OF STOCK</span>
                    </>
                  ) : added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.name.toLowerCase().includes('membership') ? pdpBtnPass : pdpBtnAddToCart}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Express 1-Click Buy Now */}
              {!isOutOfStock && (
                <button
                  type="button"
                  onClick={handleInstantBuy}
                  className="w-full py-3.5 px-6 rounded-lg border border-primary/20 bg-secondary/40 hover:bg-primary hover:text-white text-primary text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 touch-manipulation cursor-pointer active:scale-95"
                  style={{ borderRadius: 'var(--radius-brand-none, 0px)' }}
                >
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>Instant Checkout with KingsPay</span>
                </button>
              )}
            </div>

            {/* Three-Pillar Atelier Guarantee Bar */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-primary/5">
              <div className="p-3.5 rounded-xl bg-secondary/30 border border-primary/5 flex flex-col items-center text-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-wider leading-tight">{pdpBadge2}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-secondary/30 border border-primary/5 flex flex-col items-center text-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-wider leading-tight">{pdpBadge3}</span>
              </div>
            </div>

            {/* Interactive Luxury Accordions */}
            <div className="pt-4 border-t border-primary/5 space-y-2">
              
              {/* Accordion 1: Specs */}
              <div className="border border-primary/10 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                  className="w-full p-4 bg-secondary/20 flex items-center justify-between text-xs font-black uppercase tracking-wider text-primary hover:bg-secondary/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-accent" />
                    {pdpMetaTitle}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openAccordion === 'specs' ? 'rotate-180 text-accent' : 'text-text-muted'}`} />
                </button>
                {openAccordion === 'specs' && (
                  <div className="p-4 bg-white text-xs space-y-2.5 border-t border-primary/5">
                    {product.brand?.name && (
                      <div className="flex justify-between py-1 border-b border-primary/5">
                        <span className="text-text-muted uppercase font-bold text-[10px]">Brand / Atelier</span>
                        <span className="font-bold text-primary">{product.brand.name}</span>
                      </div>
                    )}
                    {product.type && (
                      <div className="flex justify-between py-1 border-b border-primary/5">
                        <span className="text-text-muted uppercase font-bold text-[10px]">Category</span>
                        <span className="font-bold text-primary">{product.type}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1">
                      <span className="text-text-muted uppercase font-bold text-[10px]">Stock Status</span>
                      <span className="font-bold text-emerald-600">Available • In Warehouse</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ── VERIFIED CUSTOMER REVIEWS SECTION ── */}
      <div id="reviews-section" className="border-t border-primary/10 bg-secondary/20 py-16 sm:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-primary/10 pb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent block mb-2">Verified Athlete Feedback</span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary uppercase font-heading">{pdpReviewsTitle}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-3xl font-black text-primary font-mono block leading-none">
                  {avgRating > 0 ? avgRating.toFixed(1) : '5.0'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1 block">
                  Based on {reviews.length} reviews
                </span>
              </div>
              <div className="flex text-amber-400 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews List (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-primary/5 text-center">
                  <Star className="w-8 h-8 mx-auto text-text-muted/30 mb-2" />
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="p-6 bg-white rounded-2xl border border-primary/5 shadow-xs space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-primary">{r.userName}</span>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-200/50 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                        {r.userEmail === user?.primaryEmailAddress?.emailAddress && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(r.id)}
                            disabled={deletingReviewId === r.id}
                            className="text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            title="Delete your review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex text-amber-400 gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-medium">{r.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form (Right 5 Cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 bg-white rounded-2xl border border-primary/10 shadow-xs space-y-5">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary block">Share Your Experience</span>
                
                {!isSignedIn ? (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-xs text-text-muted font-medium">Please sign in to submit a verified product review.</p>
                    <Link
                      href="/sign-in"
                      className="inline-block px-5 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-accent transition-colors"
                    >
                      Sign In to Review →
                    </Link>
                  </div>
                ) : reviewSuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-800">Review Submitted Successfully!</p>
                    <p className="text-[10px] text-emerald-600">Thank you for sharing your feedback with the community.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-1">Your Review</label>
                      <textarea
                        rows={4}
                        value={reviewForm.comment}
                        onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                        className="w-full p-3 bg-secondary/30 border border-primary/10 rounded-lg text-xs text-primary focus:outline-none focus:border-accent resize-none font-medium"
                        placeholder="Detail the quality, sizing, and performance..."
                      />
                    </div>

                    {reviewError && (
                      <p className="text-[10px] font-bold text-red-500">{reviewError}</p>
                    )}

                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={submittingReview || !reviewForm.comment.trim()}
                      className="w-full py-3.5 bg-primary hover:bg-accent text-white text-xs font-black uppercase tracking-[0.2em] rounded-lg transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Publishing Review...' : 'Publish Verified Review'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── RECENTLY VIEWED SHOWCASE ── */}
      {recentlyViewed.length > 0 && (
        <div className="border-t border-primary/10 py-16 sm:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent block mb-1">Discovered</span>
                <h3 className="text-2xl sm:text-3xl font-black text-primary uppercase font-heading">{pdpRecentlyTitle}</h3>
              </div>
              <Link href="/products" className="text-xs font-black uppercase tracking-wider text-primary hover:text-accent flex items-center gap-1">
                Explore All ↗
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="group block">
                  <div className="relative aspect-[4/5] bg-secondary/30 rounded-xl overflow-hidden mb-3 border border-primary/5">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <h4 className="text-xs font-black text-primary uppercase tracking-wide truncate group-hover:text-accent transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs font-black text-primary font-mono mt-0.5">
                    ₦{Number(p.price).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


