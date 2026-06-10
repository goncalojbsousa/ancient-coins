import { Injectable } from '@angular/core';

import { Coin } from '../models/coin.model';
import { getSupabase } from './supabase.client';

@Injectable({
  providedIn: 'root',
})
export class CoinsService {
  private supabaseClient = getSupabase();


  async getCoins(): Promise<Coin[]> {
    const { data, error } = await this.supabaseClient
      .from('coins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Coin[];
  }


  async getCoinById(id: number): Promise<Coin | undefined> {
    const { data, error } = await this.supabaseClient
      .from('coins')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Coin | undefined;
  }


  async getCoinsByOwner(owner_id: number): Promise<Coin[]> {
    const { data, error } = await this.supabaseClient
      .from('coins')
      .select('*')
      .eq('owner_id', owner_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Coin[];
  }


  async insertCoin(coin: Coin): Promise<Coin> {
    const now = new Date().toISOString();
    coin.created_at = now;
    coin.updated_at = now;
    const { id, ...coinData } = coin;

    const { data, error } = await this.supabaseClient
      .from('coins')
      .insert(coinData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Coin;
  }


  async uploadCoinPhoto(file: File, ownerId: number): Promise<string> {
    // Cria um nome unico: data + sequencia aleatoria + extensao original.
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExtension}`;
    const filePath = `${ownerId}/${fileName}`;

    // Envia a imagem para o bucket coin-images do Supabase Storage.
    const { error } = await this.supabaseClient.storage
      .from('coin-images')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // Devolve o URL publico 
    const { data } = this.supabaseClient.storage
      .from('coin-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }


  async updateCoin(coin: Coin): Promise<Coin> {
    coin.updated_at = new Date().toISOString();
    const { id, ...coinData } = coin;

    const { data, error } = await this.supabaseClient
      .from('coins')
      .update(coinData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Coin;
  }


  async deleteCoin(id: number): Promise<void> {
    const { error } = await this.supabaseClient
      .from('coins')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }


}
