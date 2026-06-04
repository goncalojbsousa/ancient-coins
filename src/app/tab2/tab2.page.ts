import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Coin } from '../models/coin.model';
import { AuthService } from '../services/auth.service';
import { CoinsService } from '../services/coins.service';
import { CoinDetailModalComponent } from './coin-detail-modal/coin-detail-modal.component';

interface CoinDetailModalResult {
  wasDeleted: boolean;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  private authService = inject(AuthService);
  private coinsService = inject(CoinsService);
  private modalController = inject(ModalController);

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

    return coinCount === 1 ? '1 moeda registada' : `${coinCount} moedas registadas`;
  }

  async openCoinDetail(coin: Coin): Promise<void> {
    const modal = await this.modalController.create({
      component: CoinDetailModalComponent,
      componentProps: { coin },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<CoinDetailModalResult>();

    if (data?.wasDeleted) {
      this.userCoins = this.userCoins.filter(userCoin => userCoin.id !== coin.id);
    }
  }
}
