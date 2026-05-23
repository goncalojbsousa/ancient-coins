import { Injectable, inject } from '@angular/core';

import { Coin } from '../models/ancient-coins.models';
import { CoinsService } from './coins.service';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private coinsService = inject(CoinsService);

  async init(): Promise<void> {
    await this.coinsService.init();
  }

  getMarketCoins(): Coin[] {
    return this.coinsService
      .getCoins()
      .filter(coin => coin.availableForSale || coin.availableForTrade);
  }

  getCoinsForSale(): Coin[] {
    return this.getMarketCoins().filter(coin => coin.availableForSale);
  }

  getCoinsForTrade(): Coin[] {
    return this.getMarketCoins().filter(coin => coin.availableForTrade);
  }

  searchMarket(term: string): Coin[] {
    const searchTerm = term.trim().toLowerCase();

    return this.getMarketCoins().filter(coin =>
      coin.name.toLowerCase().includes(searchTerm) ||
      coin.origin.toLowerCase().includes(searchTerm) ||
      coin.material.toLowerCase().includes(searchTerm) ||
      coin.description.toLowerCase().includes(searchTerm)
    );
  }

  sortByNewest(coins: Coin[]): Coin[] {
    return [...coins].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  sortByPrice(coins: Coin[]): Coin[] {
    return [...coins].sort((a, b) => (a.price || 0) - (b.price || 0));
  }
}
