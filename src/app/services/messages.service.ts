import { Injectable } from '@angular/core';

import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { getSupabase } from './supabase.client';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private supabaseClient = getSupabase();


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

    return data ? data as Conversation : undefined;
  }


  async startNegotiation(coin_id: number, buyer_id: number, seller_id: number, text: string): Promise<Conversation> {
    const { data, error } = await this.supabaseClient
      .from('conversations')
      .select('*')
      .eq('coin_id', coin_id)
      .eq('buyer_id', buyer_id)
      .eq('seller_id', seller_id)
      .eq('status', 'aberta')
      .maybeSingle();

    if (error) {
      throw error;
    }

    // Se ja existe uma negociacao aberta, apenas abre essa conversa.
    if (data) {
      return data as Conversation;
    }

    // Se nao existe, cria uma nova conversa com a primeira mensagem do comprador automaticamente.
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

    const { data: newConversation, error: insertError } = await this.supabaseClient
      .from('conversations')
      .insert(conversation)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return newConversation as Conversation;
  }


  async insertMessage(conversation_id: number, sender_id: number, text: string): Promise<void> {
    const conversation = await this.getConversationById(conversation_id);

    if (!conversation) {
      return;
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const message: Message = {
      id: lastMessage ? lastMessage.id + 1 : 1,
      sender_id,
      text,
      created_at: new Date().toISOString(),
    };

    conversation.messages.push(message);
    conversation.updated_at = message.created_at;
    await this.updateConversation(conversation);
  }


  private async updateConversation(conversation: Conversation): Promise<void> {
    const { error } = await this.supabaseClient
      .from('conversations')
      .update({
        status: conversation.status,
        messages: conversation.messages,
        updated_at: conversation.updated_at,
      })
      .eq('id', conversation.id);

    if (error) {
      throw error;
    }
  }

}
