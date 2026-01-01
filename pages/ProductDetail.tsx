
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  MessageCircle, 
  Plus,
  X,
  Download
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { supabase, supabaseClient } from '../services/supabase';
import { Product, Review, User } from '../types';

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Review Form State
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    title: '',
    content: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadReviews = async () => {
    if (productId) {
      const { data: revs } = await supabase.getReviews(productId);
      if (revs) setReviews(revs);
    }
  };

  useEffect(() => {
    if (productId) {
      const loadProductData = async () => {
        const { data: prod } = await supabase.getProductById(productId);
        if (prod) setProduct(prod);
        await loadReviews();
        setLoading(false);
      };
      loadProductData();

      // Real-time reviews
      const channel = supabaseClient
        .channel(`reviews-${productId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews', filter: `productId=eq.${productId}` }, loadReviews)
        .subscribe();

      return () => {
        supabaseClient.removeChannel(channel);
      };
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0]
    });

    document.dispatchEvent(new CustomEvent('open-cart'));
  };

  const handleDownload = () => {
    if (product?.downloadUrl) {
      window.open(product.downloadUrl, '_blank');
    }
  };

  const handleWhatsAppChat = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hello Budget Lab! 👋\n\nI'm interested in the template: "${product.title}"\n\nCan you help me with some questions?`
    );
    // Sanitize phone number for wa.me link
    const cleanPhone = settings.contactPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setSubmittingReview(true);

    const { error } = await supabase.createReview({
      productId,
      author: newReview.author,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      verified: false,
      email: ''
    });

    if (!error) {
      setNewReview({ author: '', rating: 5, title: '', content: '' });
      setShowReviewForm(false);
      // loadReviews() is handled by real-time subscription
    }
    setSubmittingReview(false);
  };

  const isPaidUser = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const u = user as User;
    return !!u.is_paid;
  };

  if (loading) return <div className="p-40 text-center font-bold text-brand animate-pulse text-2xl">LAB LOADING...</div>;
  if (!product) return <div className="p-20 text-center font-bold">Product not found</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-xs font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Gallery - Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/3] bg-gray-50 rounded-[32px] overflow-hidden group">
              <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
              
              <button 
                onClick={() => setActiveImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button 
                onClick={() => setActiveImage(prev => (prev + 1) % product.images.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand ring-4 ring-brand/10' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Details - Right */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 text-left">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} />)}
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">{product.rating}/5 • {product.reviewCount} Happy Customers</span>
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{product.title}</h1>
              <p className="text-gray-500 leading-relaxed mb-8">{product.description}</p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="bg-brand/10 p-2 rounded-lg mr-3">
                    <Mail className="w-5 h-5 text-brand" />
                  </div>
                  Immediate delivery to your inbox
                </div>
                <ul className="space-y-3 px-2">
                  {product.features?.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                {isPaidUser() && product.downloadUrl ? (
                  <button 
                    onClick={handleDownload}
                    className="w-full bg-gray-900 text-white py-5 rounded-[20px] font-black text-xl hover:bg-black transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center group"
                  >
                    <Download className="w-6 h-6 mr-3 group-hover:translate-y-1 transition-transform" />
                    Download Template
                  </button>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-brand text-white py-5 rounded-[20px] font-black text-xl hover:bg-brand-dark transition-all transform hover:scale-[1.02] brand-shadow flex items-center justify-center group"
                  >
                    Get Access Now
                  </button>
                )}
                
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={handleWhatsAppChat}
                    className="flex-1 bg-green-500 text-white py-4 rounded-[20px] font-bold text-sm hover:bg-green-600 transition-all flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
                  </button>
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <ShieldCheck className="w-6 h-6 text-gray-400" />
                  </div>
                </div>

                {!isPaidUser() && (
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-4 px-8">
                    Direct download links are unlocked instantly for Paid Members.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-32 pt-24 border-t border-gray-100 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Customer Reviews</h2>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="font-bold text-gray-500">Based on customer reviews</span>
              </div>
            </div>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-white border-2 border-brand text-brand px-8 py-3 rounded-2xl font-black text-sm hover:bg-brand hover:text-white transition-all flex items-center justify-center space-x-2"
            >
              {showReviewForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-20 bg-gray-50 p-8 md:p-12 rounded-[40px] border border-gray-100 animate-in slide-in-from-top-4 duration-300">
              <h3 className="text-2xl font-black text-gray-900 mb-8">Tell us what you think</h3>
              <form onSubmit={handleSubmitReview} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={newReview.author}
                      onChange={e => setNewReview({...newReview, author: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none" 
                      placeholder="e.g. John Smith"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1,2,3,4,5].map(i => (
                        <button 
                          key={i} 
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: i})}
                          className={`p-1 transition-colors ${i <= newReview.rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'}`}
                        >
                          <Star className={`w-8 h-8 ${i <= newReview.rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Review Title</label>
                    <input 
                      required
                      type="text" 
                      value={newReview.title}
                      onChange={e => setNewReview({...newReview, title: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none" 
                      placeholder="e.g. Amazing template!"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Review Content</label>
                  <textarea 
                    required
                    rows={7}
                    value={newReview.content}
                    onChange={e => setNewReview({...newReview, content: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none resize-none flex-grow" 
                    placeholder="Share your experience with our template..."
                  />
                  <button 
                    disabled={submittingReview}
                    type="submit" 
                    className="mt-6 w-full bg-brand text-white py-4 rounded-2xl font-black text-lg shadow-lg brand-shadow hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {submittingReview ? <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Post Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand/10 ring-4 ring-brand/5 flex items-center justify-center font-black text-brand uppercase text-lg">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.author}</h4>
                    <div className="flex items-center text-[10px] text-green-500 font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verified User
                    </div>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-current' : 'text-gray-200'}`} />)}
                </div>
                <h5 className="font-bold text-gray-900 mb-3 text-lg leading-tight">"{review.title}"</h5>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{review.content}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.date}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-300 font-bold uppercase tracking-widest italic">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
