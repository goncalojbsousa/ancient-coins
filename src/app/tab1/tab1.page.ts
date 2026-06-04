import { Component, OnInit, inject } from '@angular/core';

import { Coin } from '../models/coin.model';
import { AuthService } from '../services/auth.service';
import { MarketService } from '../services/market.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  private marketService = inject(MarketService);
  private authService = inject(AuthService);

  recentCoins: Coin[] = [];
  userName = '';

  async ngOnInit(): Promise<void> {
    await this.authService.init();

    this.recentCoins = await this.marketService.getRecentMarketCoins(2);
    this.userName = (await this.authService.getCurrentUser())?.name.split(' ')[0] ?? '';
  }
}
