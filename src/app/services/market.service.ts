import { Injectable, inject } from '@angular/core';

import { Coin } from '../models/coin.model';
import { CoinsService } from './coins.service';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private coinsService = inject(CoinsService);

  async getMarketCoins(): Promise<Coin[]> {
    const coins = await this.coinsService.getCoins();
    return coins.filter(coin => coin.available_for_sale || coin.available_for_trade);
  }

  async getCoinsForSale(): Promise<Coin[]> {
    const coins = await this.getMarketCoins();
    return coins.filter(coin => coin.available_for_sale);
  }

  async getCoinsForTrade(): Promise<Coin[]> {
    const coins = await this.getMarketCoins();
    return coins.filter(coin => coin.available_for_trade);
  }

  async searchMarket(term: string): Promise<Coin[]> {
    const searchTerm = term.trim().toLowerCase();
    const coins = await this.getMarketCoins();

    return coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm) ||
      coin.origin.toLowerCase().includes(searchTerm) ||
      coin.material.toLowerCase().includes(searchTerm) ||
      coin.description.toLowerCase().includes(searchTerm)
    );
  }

  sortByNewest(coins: Coin[]): Coin[] {
    return [...coins].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  sortByPrice(coins: Coin[]): Coin[] {
    return [...coins].sort((a, b) => (a.price || 0) - (b.price || 0));
  }

  async getRecentMarketCoins(limit = 2): Promise<Coin[]> {
    const coins = await this.getMarketCoins();
    return this.sortByNewest(coins).slice(0, limit);
  }
}
