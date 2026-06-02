import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

import { AncientCoinsSeedData, Coin } from '../models/ancient-coins.models';

const SEEDED_KEY = 'ancientcoins_seeded';
const SEED_DATA_URL = 'assets/data/seed-data.json';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private storage = inject(Storage);
  private storageReady: Promise<Storage> | null = null;

  constructor() {
    this.init();
  }

  async init(): Promise<Storage> {
    if (!this.storageReady) {
      this.storageReady = this.createStorage();
    }

    return this.storageReady;
  }

  async getData<T>(key: string, defaultValue: T): Promise<T> {
    const storage = await this.init();
    const data = await storage.get(key);

    if (data) {
      return data;
    }

    return defaultValue;
  }

  async setData<T>(key: string, value: T): Promise<void> {
    const storage = await this.init();
    await storage.set(key, value);
  }

  private async createStorage(): Promise<Storage> {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    const storage = await this.storage.create();

    await this.seedDatabase(storage);

    return storage;
  }

  private async seedDatabase(storage: Storage): Promise<void> {
    const alreadySeeded = await storage.get(SEEDED_KEY);
    const response = await fetch(SEED_DATA_URL);
    const seedData: AncientCoinsSeedData = await response.json();

    if (alreadySeeded) {
      const coins = (await storage.get('coins')) as Coin[] | null;

      if (!coins) {
        return;
      }

      const updatedCoins = coins.map((coin: Coin) => {
        const seedCoin = seedData.coins.find(item => item.id === coin.id);

        if ((!coin.photos || coin.photos.length === 0) && seedCoin && seedCoin.photos.length > 0) {
          return {
            ...coin,
            photos: seedCoin.photos,
          };
        }

        return coin;
      });

      if (JSON.stringify(updatedCoins) !== JSON.stringify(coins)) {
        await storage.set('coins', updatedCoins);
      }

      return;
    }

    await storage.set('users', seedData.users);
    await storage.set('coins', seedData.coins);
    await storage.set('conversations', seedData.conversations);
    await storage.set('reviews', seedData.reviews);
    await storage.set(SEEDED_KEY, true);
  }
}
