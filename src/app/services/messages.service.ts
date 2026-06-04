import { Injectable } from '@angular/core';

import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { Review } from '../models/review.model';
import { getSupabase } from './supabase.client';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private supabaseClient = getSupabase();

  async getConversations(): Promise<Conversation[]> {
    const { data, error } = await this.supabaseClient
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Conversation[];
  }

  async getConversationsByUser(userId: number): Promise<Conversation[]> {
    const { data, error } = await this.supabaseClient
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Conversation[];
  }

  async getConversationById(id: number): Promise<Conversation | undefined> {
    const { data, error } = await this.supabaseClient
      .from('conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Conversation | undefined;
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    const { data, error } = await this.supabaseClient
      .from('reviews')
      .select('*')
      .eq('reviewed_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Review[];
  }

  async getReviewByConversationAndReviewer(
    conversationId: number,
    reviewerId: number
  ): Promise<Review | undefined> {
    const { data, error } = await this.supabaseClient
      .from('reviews')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('reviewer_id', reviewerId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? data as Review : undefined;
  }

  async startNegotiation(
    coin_id: number,
    buyer_id: number,
    seller_id: number,
    text: string
  ): Promise<Conversation> {
    const { data: existingConversationData, error: existingConversationError } = await this.supabaseClient
      .from('conversations')
      .select('*')
      .eq('coin_id', coin_id)
      .eq('buyer_id', buyer_id)
      .eq('seller_id', seller_id)
      .eq('status', 'aberta')
      .maybeSingle();

    if (existingConversationError) {
      throw existingConversationError;
    }

    const existingConversation = existingConversationData
      ? existingConversationData as Conversation
      : undefined;

    if (existingConversation) {
      await this.insertMessage(existingConversation.id, buyer_id, text);
      return existingConversation;
    }

    const now = new Date().toISOString();
    const conversation: Omit<Conversation, 'id'> = {
      coin_id,
      buyer_id,
      seller_id,
      status: 'aberta',
      messages: [
        {
          id: 1,
          sender_id: buyer_id,
          text,
          created_at: now,
        },
      ],
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await this.supabaseClient
      .from('conversations')
      .insert(this.conversationToSupabase(conversation))
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Conversation;
  }

  async insertMessage(conversation_id: number, sender_id: number, text: string): Promise<void> {
    const conversation = await this.getConversationById(conversation_id);

    if (conversation) {
      const message: Message = {
        id: this.getNextMessageId(conversation),
        sender_id,
        text,
        created_at: new Date().toISOString(),
      };

      conversation.messages.push(message);
      conversation.updated_at = message.created_at;
      await this.updateConversation(conversation);
    }
  }

  async acceptNegotiation(conversation_id: number): Promise<void> {
    const conversation = await this.getConversationById(conversation_id);

    if (conversation) {
      conversation.status = 'aceite';
      conversation.updated_at = new Date().toISOString();
      await this.updateConversation(conversation);
    }
  }

  async insertReview(
    conversation_id: number,
    reviewer_id: number,
    reviewed_user_id: number,
    stars: number,
    comment: string
  ): Promise<void> {
    const existingReview = await this.getReviewByConversationAndReviewer(
      conversation_id,
      reviewer_id
    );

    if (existingReview) {
      const { data, error } = await this.supabaseClient
        .from('reviews')
        .update({
          stars,
          comment,
        })
        .eq('id', existingReview.id)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Nao foi possivel atualizar a avaliacao.');
      }

      return;
    }

    const review: Omit<Review, 'id'> = {
      conversation_id,
      reviewer_id,
      reviewed_user_id,
      stars,
      comment,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabaseClient
      .from('reviews')
      .insert(this.reviewToSupabase(review))
      .select()
      .single();

    if (error) {
      throw error;
    }

  }

  private async updateConversation(conversation: Conversation): Promise<void> {
    const { error } = await this.supabaseClient
      .from('conversations')
      .update(this.conversationToSupabase(conversation))
      .eq('id', conversation.id);

    if (error) {
      throw error;
    }
  }

  private getNextMessageId(conversation: Conversation): number {
    const lastMessageId = conversation.messages.reduce(
      (lastId, message) => Math.max(lastId, message.id),
      0
    );

    return lastMessageId + 1;
  }

  private conversationToSupabase(conversation: Conversation | Omit<Conversation, 'id'>): any {
    const conversationData: any = {
      coin_id: conversation.coin_id,
      buyer_id: conversation.buyer_id,
      seller_id: conversation.seller_id,
      status: conversation.status,
      messages: conversation.messages.map(message => ({
        id: message.id,
        sender_id: message.sender_id,
        text: message.text,
        created_at: message.created_at,
      })),
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
    };

    if ('id' in conversation) {
      conversationData.id = conversation.id;
    }

    return conversationData;
  }

  private reviewToSupabase(review: Review | Omit<Review, 'id'>): any {
    const reviewData: any = {
      conversation_id: review.conversation_id,
      reviewer_id: review.reviewer_id,
      reviewed_user_id: review.reviewed_user_id,
      stars: review.stars,
      comment: review.comment,
      created_at: review.created_at,
    };

    if ('id' in review) {
      reviewData.id = review.id;
    }

    return reviewData;
  }
}
