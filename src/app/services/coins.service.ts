import { Injectable, inject } from '@angular/core';

import { Coin } from '../models/ancient-coins.models';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class CoinsService {
  private databaseService = inject(DatabaseService);
  private coins: Coin[];

  constructor() {
    this.coins = [];
    this.init();
  }

  async init(): Promise<void> {
    this.coins = await this.databaseService.getData<Coin[]>('coins', []);
  }

  getCoins(): Coin[] {
    return this.coins;
  }

  getCoinById(id: number): Coin | undefined {
    return this.coins.find(coin => coin.id === id);
  }

  getCoinsByOwner(ownerId: number): Coin[] {
    return this.coins.filter(coin => coin.ownerId === ownerId);
  }

  searchCoinsByOwner(ownerId: number, term: string): Coin[] {
    const searchTerm = term.trim().toLowerCase();

    return this.coins.filter(coin =>
      coin.ownerId === ownerId &&
      (
        coin.name.toLowerCase().includes(searchTerm) ||
        coin.origin.toLowerCase().includes(searchTerm) ||
        coin.material.toLowerCase().includes(searchTerm)
      )
    );
  }

  async insertCoin(coin: Coin): Promise<void> {
    if (!coin.id) {
      coin.id = Date.now();
    }

    const now = new Date().toISOString();
    coin.createdAt = now;
    coin.updatedAt = now;

    this.coins.push(coin);
    await this.saveCoins();
  }

  async updateCoin(coin: Coin): Promise<void> {
    const index = this.coins.findIndex(currentCoin => currentCoin.id === coin.id);

    if (index >= 0) {
      coin.updatedAt = new Date().toISOString();
      this.coins[index] = coin;
      await this.saveCoins();
    }
  }

  async deleteCoin(id: number): Promise<void> {
    const index = this.coins.findIndex(coin => coin.id === id);

    if (index >= 0) {
      this.coins.splice(index, 1);
      await this.saveCoins();
    }
  }

  async publishForSale(id: number, price: number): Promise<void> {
    const coin = this.getCoinById(id);

    if (coin) {
      coin.availableForSale = true;
      coin.price = price;
      await this.updateCoin(coin);
    }
  }

  async publishForTrade(id: number, tradePreference: string): Promise<void> {
    const coin = this.getCoinById(id);

    if (coin) {
      coin.availableForTrade = true;
      coin.tradePreference = tradePreference;
      await this.updateCoin(coin);
    }
  }

  async removeFromMarket(id: number): Promise<void> {
    const coin = this.getCoinById(id);

    if (coin) {
      coin.availableForSale = false;
      coin.availableForTrade = false;
      coin.price = undefined;
      coin.tradePreference = undefined;
      await this.updateCoin(coin);
    }
  }

  private async saveCoins(): Promise<void> {
    await this.databaseService.setData('coins', this.coins);
  }
}
