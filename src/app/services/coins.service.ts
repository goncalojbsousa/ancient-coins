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

  async updateCoin(coin: Coin): Promise<Coin | undefined> {
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

  async publishForSale(id: number, price: number): Promise<void> {
    const coin = await this.getCoinById(id);

    if (coin) {
      coin.available_for_sale = true;
      coin.price = price;
      await this.updateCoin(coin);
    }
  }

  async publishForTrade(id: number, trade_preference: string): Promise<void> {
    const coin = await this.getCoinById(id);

    if (coin) {
      coin.available_for_trade = true;
      coin.trade_preference = trade_preference;
      await this.updateCoin(coin);
    }
  }

  async removeFromMarket(id: number): Promise<void> {
    const coin = await this.getCoinById(id);

    if (coin) {
      coin.available_for_sale = false;
      coin.available_for_trade = false;
      coin.price = null;
      coin.trade_preference = null;
      await this.updateCoin(coin);
    }
  }
}
