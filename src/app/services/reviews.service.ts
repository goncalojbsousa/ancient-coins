import { Injectable } from '@angular/core';

import { Review } from '../models/review.model';
import { getSupabase } from './supabase.client';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private supabaseClient = getSupabase();

  
  async getReviewsByReviewer(reviewerId: number): Promise<Review[]> {
    const { data, error } = await this.supabaseClient
      .from('reviews')
      .select('*')
      .eq('reviewer_id', reviewerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Review[];
  }


  async insertReview(review: Omit<Review, 'id'>): Promise<Review> {
    const { data, error } = await this.supabaseClient
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Review;
  }


  async updateReview(review: Review): Promise<Review> {
    const { data, error } = await this.supabaseClient
      .from('reviews')
      .update({
        stars: review.stars,
        comment: review.comment,
      })
      .eq('id', review.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Review;
  }
}
