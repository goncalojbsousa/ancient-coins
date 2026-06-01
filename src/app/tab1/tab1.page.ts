import { Component, OnInit } from '@angular/core';

import { Coin } from '../models/ancient-coins.models';
import { MarketService } from '../services/market.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  recentCoins: Coin[] = [];

  constructor(private marketService: MarketService) {}

  async ngOnInit(): Promise<void> {
    await this.marketService.init();

    this.recentCoins = this.marketService
      .sortByNewest(this.marketService.getMarketCoins())
      .slice(0, 2);
  }

}
