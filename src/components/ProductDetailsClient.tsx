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
  ShoppingCart,
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
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMembership } from '@/lib/membership-context';
import { useRouter } from 'next/navigation';

interface ProductDetailsClientProps {
  product: any;
}

export default function ProductDetailsClient({ product: initialProduct }: ProductDetailsClientProps) {
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

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)

  // Recently viewed state
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])

  const wishlisted = isWishlisted(initialProduct.id)

  useEffect(() => {
    // Reset image loaded state on variant or image change
    setImageLoaded(false);
  }, [activeIndex]);

  // Track recently viewed
  useEffect(() => {
    try {
      const key = 'sharers-recently-viewed'
      const existing: any[] = JSON.parse(localStorage.getItem(key) || '[]')
      const filtered = existing.filter((p: any) => p.id !== initialProduct.id)
      const imgs = Array.isArray(initialProduct.images) ? initialProduct.images
        : typeof initialProduct.images === 'string' ? JSON.parse(initialProduct.images || '[]') : []
      const next = [{ id: initialProduct.id, name: initialProduct.name, price: initialProduct.price, image: imgs[0] || '' }, ...filtered].slice(0, 6)
      localStorage.setItem(key, JSON.stringify(next))
      setRecentlyViewed(next.filter((p: any) => p.id !== initialProduct.id).slice(0, 4))
    } catch {}
  }, [initialProduct.id])

  // Fetch reviews
  useEffect(() => {
    fetch(`/api/reviews?productId=${initialProduct.id}`)
      .then(r => r.json())
      .then(data => {
        setReviews(data.reviews || [])
        setAvgRating(data.avgRating || 0)
      })
      .catch(() => {})
  }, [initialProduct.id])

  useEffect(() => {
    // Background SWR revalidation
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
    if (Array.isArray(product.images)) return product.images;
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
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
    if (product.name.toLowerCase().includes('membership') || product.categories?.some((c: any) => c.category.name === 'Memberships')) {
      subscribe(30);
      router.push('/dashboard');
    } else {
      addToCart(product, selectedVariant, quantity);
      showToast('Added to Cart', 'success', product.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) return
    setSubmittingReview(true)
    setReviewError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: initialProduct.id, ...reviewForm })
      })
      const data = await res.json()
      if (!res.ok) {
        setReviewError(data.error || 'Failed to submit review')
      } else {
        setReviewSuccess(true)
        setReviewForm({ rating: 5, comment: '' })
        // Re-fetch reviews
        fetch(`/api/reviews?productId=${initialProduct.id}`)
          .then(r => r.json())
          .then(d => { setReviews(d.reviews || []); setAvgRating(d.avgRating || 0) })
          .catch(() => {})
      }
    } catch {
      setReviewError('Network error. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setDeletingReviewId(reviewId);
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        setReviewSuccess(false); // Reset form so they can review again
        showToast('Review deleted', 'success');
        
        // Refresh average rating
        fetch(`/api/reviews?productId=${initialProduct.id}`)
          .then(r => r.json())
          .then(d => setAvgRating(d.avgRating || 0))
          .catch(() => {})
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete review', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setDeletingReviewId(null);
    }
  }

  const nextImage = () => setActiveIndex(i => (i + 1) % images.length);
  const prevImage = () => setActiveIndex(i => (i - 1 + images.length) % images.length);

  return (
    <div className="bg-white min-h-screen selection:bg-accent/10">

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-8 sm:pt-16 pb-4">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-gray-400 font-medium"
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
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">

          {/* ═══════════ LEFT: IMAGE GALLERY ═══════════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[60%] flex flex-col-reverse lg:flex-row gap-4 lg:gap-6"
          >
            {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
            {images.length > 1 && (
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-28 scrollbar-hide shrink-0 pb-2 lg:pb-0">
                {(images as string[]).map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-[80px] h-[100px] lg:w-full lg:h-[120px] flex-shrink-0 transition-all duration-300 ${
                      activeIndex === idx
                        ? 'ring-1 ring-black border border-black'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover mix-blend-multiply bg-[#f5f5f5]" sizes="120px" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Container */}
            <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[700px] flex-1 bg-[#ececec] group cursor-crosshair">
              {/* Shimmer Placeholder */}
              {!imageLoaded && activeImage && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10" />
              )}
              
              <AnimatePresence mode="wait">
                {activeImage ? (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={activeImage}
                      alt={product.name}
                      fill
                      className={`object-cover mix-blend-multiply transition-opacity duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      onLoad={() => setImageLoaded(true)}
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#ececec]">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No Image Found</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ═══════════ RIGHT: PRODUCT INFO ═══════════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[40%] lg:sticky lg:top-32 lg:self-start py-4"
          >
            <div className="space-y-6">

              {/* Breadcrumbs inside Right Column */}
              <div className="text-sm text-gray-500 mb-6 flex gap-1">
                <span>Home /</span>
                <span>{product.brand?.name || 'Shop'} /</span>
                <span className="text-gray-800">{product.name}</span>
              </div>

              {/* Labels */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hasDiscount && (
                  <span className="bg-[#f0f0f0] text-gray-800 text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-[#f0f0f0] text-gray-800 text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                    BESTSELLER
                  </span>
                )}
              </div>

              {/* Title & Wishlist */}
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight uppercase">
                  {product.name}
                </h1>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="mt-1 flex-shrink-0"
                >
                  <Heart className={`w-6 h-6 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-900 hover:text-gray-600'}`} />
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-lg font-bold text-gray-900">
                  ₦{displayPrice?.toLocaleString()} NGN
                </span>
                {hasDiscount && (
                  <span className="text-sm font-bold text-red-600 line-through">
                    ₦{originalPrice?.toLocaleString()} NGN
                  </span>
                )}
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex text-black text-xs gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.round(avgRating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500 underline cursor-pointer hover:text-gray-900">
                  {reviews.length} Reviews
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-2">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size Select (Faux Dropdown styling) */}
              {product.size?.label && (
                <div className="pt-4">
                  <div className="w-full border border-gray-300 px-4 py-3 text-sm flex justify-between items-center cursor-pointer hover:border-gray-900 transition-colors">
                    <span className="font-bold">{product.size.label}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              )}

              {/* Add to Cart Area */}
              <div className="flex gap-4 pt-6">
                {/* Quantity */}
                <div className="flex border border-gray-300 w-28 shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 flex items-center justify-center text-gray-600 hover:text-black">
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex-1 flex items-center justify-center text-sm font-bold">
                    {quantity}
                  </div>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 flex items-center justify-center text-gray-600 hover:text-black">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 flex items-center justify-center text-sm font-bold uppercase tracking-widest transition-colors ${
                    added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {added ? 'ADDED TO BAG' : 'ADD TO BAG'}
                </button>
              </div>


              {/* Trust bar */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-[#f8f7f5] rounded-xl text-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider leading-tight">Fast<br/>Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-[#f8f7f5] rounded-xl text-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider leading-tight">Secure<br/>Payment</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-[#f8f7f5] rounded-xl text-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <RotateCcw className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider leading-tight">Easy<br/>Returns</span>
                </div>
              </div>

              {/* Product meta details */}
              <div className="bg-[#f8f7f5] rounded-xl p-6 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Product Details</p>
                {product.brand?.name && (
                  <div className="flex items-center justify-between py-2 border-b border-white/80">
                    <span className="text-sm text-gray-400 font-medium">Brand</span>
                    <span className="text-sm font-semibold text-primary">{product.brand.name}</span>
                  </div>
                )}
                {product.type && (
                  <div className="flex items-center justify-between py-2 border-b border-white/80">
                    <span className="text-sm text-gray-400 font-medium">Category</span>
                    <span className="text-sm font-semibold text-primary">{product.type}</span>
                  </div>
                )}
                {product.size?.label && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-400 font-medium">Size</span>
                    <span className="text-sm font-semibold text-primary">{product.size.label}</span>
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
          <Link href="/products" className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
          <button
            onClick={() => { toggleWishlist(initialProduct.id); showToast(wishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist', 'success', initialProduct.name) }}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {wishlisted ? 'Wishlisted' : 'Save'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-100 bg-secondary/20">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-16">
          <div className="flex items-end gap-6 mb-12">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-2">Customer Reviews</p>
              <h3 className="text-4xl font-black text-primary">{avgRating > 0 ? avgRating.toFixed(1) : 'No reviews yet'}</h3>
              {avgRating > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-xs text-text-muted ml-2 font-medium">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-sm text-text-muted">Be the first to review this product!</p>
              ) : (
                reviews.map(r => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-b border-gray-100 pb-6 relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-primary uppercase tracking-widest">{r.userName}</span>
                      <div className="flex items-center gap-4">
                        {r.userEmail === user?.primaryEmailAddress?.emailAddress && (
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            disabled={deletingReviewId === r.id}
                            className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            title="Delete your review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-xs text-text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Review Form */}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6">Write a Review</p>
              {!isSignedIn ? (
                <div className="bg-white border border-gray-100 p-6 text-center">
                  <p className="text-sm text-text-muted mb-4">Sign in to leave a review</p>
                  <Link href="/sign-in" className="text-xs font-black uppercase tracking-widest text-accent hover:text-primary transition-colors">
                    Sign In →
                  </Link>
                </div>
              ) : reviewSuccess ? (
                <div className="bg-green-50 border border-green-100 p-6 text-center">
                  <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-black text-green-700">Review submitted! Thank you.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Star Picker */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Your Rating</p>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button type="button" key={s} onClick={() => setReviewForm(f => ({ ...f, rating: s }))} className="transition-transform hover:scale-110 focus:outline-none">
                          <Star className={`w-7 h-7 ${s <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Your Review</p>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      placeholder="What did you think of this product?"
                      rows={4}
                      className="w-full border border-gray-200 p-4 text-sm font-medium text-primary placeholder:text-gray-300 focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  {reviewError && <p className="text-xs text-red-500 font-medium">{reviewError}</p>}

                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || !reviewForm.comment.trim()}
                    className="w-full bg-primary text-white py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-16">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-10">Recently Viewed</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentlyViewed.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="group">
                  <div className="relative aspect-square bg-secondary/50 overflow-hidden mb-4">
                    {p.image && <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  </div>
                  <p className="text-sm font-black text-primary uppercase tracking-wide truncate group-hover:text-accent transition-colors">{p.name}</p>
                  <p className="text-sm text-text-muted font-medium">₦{Number(p.price).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


