
import { createClient } from '@supabase/supabase-js';
import { Product, Review, Order, User } from '../types';

const supabaseUrl = 'https://uqgkgttqicrtbisfquml.supabase.co';
const supabaseKey = 'sb_publishable_JoQT5ulGAbPP5A9hOI5Wuw_kKwk150t';

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

export const supabase = {
  async login(email: string, pass: string) {
    try {
      const { data: user, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) return { data: null, error: `Database error: ${error.message}` };
      if (!user) return { data: null, error: 'Account not found. Please register first.' };
      if (user.password !== pass) return { data: null, error: 'Incorrect password.' };

      return { data: user, error: null };
    } catch (err: any) {
      return { data: null, error: 'An unexpected login error occurred.' };
    }
  },

  async register(userData: { email: string; name: string; phone?: string; password: string }) {
    try {
      const { data: existing } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('email', userData.email)
        .maybeSingle();

      if (existing) return { data: null, error: 'An account with this email already exists.' };

      const { data, error } = await supabaseClient
        .from('profiles')
        .insert({
          email: userData.email,
          name: userData.name,
          phone: userData.phone || null,
          password: userData.password,
          role: 'user',
          is_paid: false,
          payment_expiry: null
        })
        .select()
        .limit(1);
      
      if (error) return { data: null, error: error.message };
      return { data: data ? data[0] : null, error: null };
    } catch (err: any) {
      return { data: null, error: 'A system error occurred during registration.' };
    }
  },

  async updateProfile(email: string, updates: Partial<User>) {
    const { data, error } = await supabaseClient
      .from('profiles')
      .update(updates)
      .eq('email', email)
      .select()
      .single();
    return { data, error };
  },

  async getProducts() {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    const mapped = data?.map(p => ({
      ...p,
      originalPrice: p.original_price,
      reviewCount: p.review_count,
      downloadUrl: p.download_url
    }));

    return { data: mapped as Product[], error };
  },

  async getProductById(id: string) {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      data.originalPrice = data.original_price;
      data.reviewCount = data.review_count;
      data.downloadUrl = data.download_url;
    }

    return { data: data as Product, error };
  },

  async addProduct(product: Product) {
    const { data, error } = await supabaseClient
      .from('products')
      .insert([{
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        original_price: product.originalPrice,
        rating: product.rating,
        review_count: product.reviewCount,
        images: product.images,
        description: product.description,
        features: product.features,
        download_url: product.downloadUrl
      }])
      .select()
      .single();
    return { data: data as Product, error };
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const payload: any = { ...updates };
    if (updates.originalPrice !== undefined) {
      payload.original_price = updates.originalPrice;
      delete payload.originalPrice;
    }
    if (updates.reviewCount !== undefined) {
      payload.review_count = updates.reviewCount;
      delete payload.reviewCount;
    }
    if (updates.downloadUrl !== undefined) {
      payload.download_url = updates.downloadUrl;
      delete payload.downloadUrl;
    }
    
    const { data, error } = await supabaseClient
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Product, error };
  },

  async deleteProduct(id: string) {
    const { error } = await supabaseClient.from('products').delete().eq('id', id);
    return { error };
  },

  async getReviews(productId: string) {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    return { data: data as Review[], error };
  },

  async createReview(review: Omit<Review, 'id' | 'date'>) {
    const { data, error } = await supabaseClient
      .from('reviews')
      .insert([{
        product_id: review.productId,
        author: review.author,
        rating: review.rating,
        title: review.title,
        content: review.content,
        verified: review.verified,
        email: review.email,
        date: 'Just now'
      }])
      .select()
      .single();
    return { data: data as Review, error };
  },

  async getAllReviews() {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Review[], error };
  },

  async deleteReview(id: string) {
    const { error } = await supabaseClient.from('reviews').delete().eq('id', id);
    return { error };
  },

  async getProfiles() {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async deleteProfile(email: string) {
    const { error } = await supabaseClient.from('profiles').delete().eq('email', email);
    return { error };
  },

  async getSettings() {
    const { data, error } = await supabaseClient
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) {
      return { 
        data: {
          contactEmail: data.contact_email,
          contactPhone: data.contact_phone,
          adsensePublisherId: data.adsense_publisher_id,
          adsenseSlot1: data.adsense_slot_1,
          adsenseSlot2: data.adsense_slot_2,
          paymentPrice: data.payment_price
        }, 
        error 
      };
    }
    return { data, error };
  },

  async updateSettings(updates: any) {
    const { data, error } = await supabaseClient
      .from('settings')
      .upsert({ 
        id: 1,
        contact_email: updates.contactEmail,
        contact_phone: updates.contactPhone,
        adsense_publisher_id: updates.adsensePublisherId,
        adsense_slot_1: updates.adsenseSlot1,
        adsense_slot_2: updates.adsenseSlot2,
        payment_price: updates.paymentPrice
      })
      .select()
      .single();
    
    if (data) {
      return { 
        data: {
          contactEmail: data.contact_email,
          contactPhone: data.contact_phone,
          adsensePublisherId: data.adsense_publisher_id,
          adsenseSlot1: data.adsense_slot_1,
          adsenseSlot2: data.adsense_slot_2,
          paymentPrice: data.payment_price
        }, 
        error 
      };
    }
    return { data, error };
  }
};
