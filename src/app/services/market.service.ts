import { Injectable } from '@angular/core';

import { Coin } from '../models/coin.model';
import { CoinsService } from './coins.service';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  constructor(
    private coinsService: CoinsService
  ) { }


  async getMarketCoins(): Promise<Coin[]> {
    const coins = await this.coinsService.getCoins();
    return coins.filter(coin => coin.available_for_sale || coin.available_for_trade);
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
