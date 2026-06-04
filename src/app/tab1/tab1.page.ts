import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AddCoinModalComponent } from '../tab2/add-coin-modal/add-coin-modal.component';
import { Coin } from '../models/coin.model';
import { AuthService } from '../services/auth.service';
import { MarketService } from '../services/market.service';

interface AddCoinModalResult {
  createdCoin?: Coin;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  private marketService = inject(MarketService);
  private authService = inject(AuthService);
  private modalController = inject(ModalController);

  recentCoins: Coin[] = [];
  userName = '';

  async ngOnInit(): Promise<void> {
    await this.authService.init();
    await this.loadHomeData();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadHomeData();
  }

  private async loadHomeData(): Promise<void> {
    this.recentCoins = await this.marketService.getRecentMarketCoins(2);
    this.userName = (await this.authService.getCurrentUser())?.name.split(' ')[0] ?? '';
  }

  async openAddCoinModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddCoinModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<AddCoinModalResult>();

    if (data?.createdCoin) {
      this.recentCoins = await this.marketService.getRecentMarketCoins(2);
    }
  }
}
