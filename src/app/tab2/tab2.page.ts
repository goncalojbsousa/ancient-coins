import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Coin } from '../models/coin.model';
import { AuthService } from '../services/auth.service';
import { CoinsService } from '../services/coins.service';
import { AddCoinModalComponent } from './add-coin-modal/add-coin-modal.component';
import { CoinDetailModalComponent } from './coin-detail-modal/coin-detail-modal.component';

interface CoinDetailModalResult {
  wasDeleted?: boolean;
  updatedCoin?: Coin;
}

interface AddCoinModalResult {
  createdCoin?: Coin;
}

type CollectionFilter = 'Todas' | 'À Venda' | 'Para Troca' | 'Não listadas';

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
  activeFilter: CollectionFilter = 'Todas';
  userCoins: Coin[] = [];

  async ngOnInit(): Promise<void> {
    await this.authService.init();
    await this.loadUserCoins();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadUserCoins();
  }

  private async loadUserCoins(): Promise<void> {
    const currentUser = await this.authService.getCurrentUser();

    this.userCoins = currentUser
      ? await this.coinsService.getCoinsByOwner(currentUser.id)
      : [];
  }

  get filteredCoins(): Coin[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    return this.userCoins.filter(coin =>
      this.matchesSearch(coin, normalizedSearchTerm) &&
      this.matchesFilter(coin)
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

    if (data?.updatedCoin) {
      await this.loadUserCoins();
    }
  }

  async openAddCoinModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddCoinModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<AddCoinModalResult>();

    if (data?.createdCoin) {
      this.userCoins = [data.createdCoin, ...this.userCoins];
    }
  }

  private matchesSearch(coin: Coin, searchTerm: string): boolean {
    if (!searchTerm) {
      return true;
    }

    return coin.name.toLowerCase().includes(searchTerm) ||
      coin.origin.toLowerCase().includes(searchTerm);
  }

  private matchesFilter(coin: Coin): boolean {
    if (this.activeFilter === 'À Venda') {
      return coin.available_for_sale;
    }

    if (this.activeFilter === 'Para Troca') {
      return coin.available_for_trade;
    }

    if (this.activeFilter === 'Não listadas') {
      return !coin.available_for_sale && !coin.available_for_trade;
    }

    return true;
  }
}
