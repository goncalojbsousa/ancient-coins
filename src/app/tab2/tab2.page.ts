import { Component, OnInit, inject } from '@angular/core';

import { Coin } from '../models/coin.model';
import { AuthService } from '../services/auth.service';
import { CoinsService } from '../services/coins.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  private authService = inject(AuthService);
  private coinsService = inject(CoinsService);

  searchTerm = '';
  userCoins: Coin[] = [];

  async ngOnInit(): Promise<void> {
    await this.authService.init();

    const currentUser = await this.authService.getCurrentUser();

    this.userCoins = currentUser
      ? await this.coinsService.getCoinsByOwner(currentUser.id)
      : [];
  }

  get filteredCoins(): Coin[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return this.userCoins;
    }

    return this.userCoins.filter(coin =>
      coin.name.toLowerCase().includes(normalizedSearchTerm) ||
      coin.origin.toLowerCase().includes(normalizedSearchTerm)
    );
  }

  get collectionCountText(): string {
    const coinCount = this.userCoins.length;

    return coinCount === 1
      ? '1 moeda cadastrada'
      : `${coinCount} moedas cadastradas`;
  }

}
