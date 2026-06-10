import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Coin } from '../models/coin.model';
import { AuthService } from '../services/auth.service';
import { CoinsService } from '../services/coins.service';
import { AddCoinModalComponent } from './add-coin-modal/add-coin-modal.component';
import { CoinDetailModalComponent } from './coin-detail-modal/coin-detail-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  searchTerm = '';
  activeFilter = 'Todas';
  userCoins: Coin[] = [];

  constructor(
    private authService: AuthService,
    private coinsService: CoinsService,
    private modalController: ModalController
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.init();
    await this.loadUserCoins();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadUserCoins();
  }

  async loadUserCoins(): Promise<void> {
    const currentUser = await this.authService.getCurrentUser();

    if (currentUser) {
      this.userCoins = await this.coinsService.getCoinsByOwner(currentUser.id);
    } else {
      this.userCoins = [];
    }
  }

  get filteredCoins(): Coin[] {
    let coins = this.userCoins;
    const search = this.searchTerm.trim().toLowerCase();

    if (search) {
      coins = coins.filter(coin =>
        coin.name.toLowerCase().includes(search) ||
        coin.origin.toLowerCase().includes(search)
      );
    }

    if (this.activeFilter === 'À Venda') {
      coins = coins.filter(coin => coin.available_for_sale);
    }

    if (this.activeFilter === 'Para Troca') {
      coins = coins.filter(coin => coin.available_for_trade);
    }

    if (this.activeFilter === 'Não listadas') {
      coins = coins.filter(coin => !coin.available_for_sale && !coin.available_for_trade);
    }

    return coins;
  }

  get collectionCountText(): string {
    if (this.userCoins.length === 1) {
      return '1 moeda registada';
    }

    return `${this.userCoins.length} moedas registadas`;
  }

  async openCoinDetail(coin: Coin): Promise<void> {
    const modal = await this.modalController.create({
      component: CoinDetailModalComponent,
      componentProps: { coin },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();
    await modal.onWillDismiss();
    await this.loadUserCoins();
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
      await this.loadUserCoins();
    }
  }
}
