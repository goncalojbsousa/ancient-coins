import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';
import { MarketService } from '../services/market.service';
import { AddCoinModalComponent } from '../tab2/add-coin-modal/add-coin-modal.component';
import { Coin } from '../models/coin.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  recentCoins: Coin[] = [];
  userName = '';

  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private modalController: ModalController,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.init();
    await this.loadHomeData();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadHomeData();
  }

  async loadHomeData(): Promise<void> {
    const currentUser = await this.authService.getCurrentUser();

    this.recentCoins = await this.marketService.getRecentMarketCoins(2);
    this.userName = currentUser ? currentUser.name.split(' ')[0] : '';
  }

  async openAddCoinModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddCoinModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();

    const result = await modal.onWillDismiss();

    if (result.data?.createdCoin) {
      await this.loadHomeData();
    }
  }

  async openMarketCoin(coin: Coin): Promise<void> {
    localStorage.setItem('selectedMarketCoinId', String(coin.id));
    await this.router.navigateByUrl('/tabs/tab3');
  }
}
