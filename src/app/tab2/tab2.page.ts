import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Coin } from '../models/ancient-coins.models';
import { AuthService } from '../services/auth.service';
import { CoinsService } from '../services/coins.service';
import { CoinDetailModalComponent } from './coin-detail-modal/coin-detail-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  constructor(
    private authService: AuthService,
    private coinsService: CoinsService,
    private modalCtrl: ModalController
  ) {}

  searchTerm = '';
  userCoins: Coin[] = [];

  async ngOnInit(): Promise<void> {
    await this.authService.init();
    await this.coinsService.init();

    const currentUser = this.authService.getCurrentUser();
    this.userCoins = currentUser
      ? this.coinsService.getCoinsByOwner(currentUser.id)
      : [];
  }

  get filteredCoins(): Coin[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.userCoins;
    return this.userCoins.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.origin.toLowerCase().includes(term)
    );
  }

  get collectionCountText(): string {
    const n = this.userCoins.length;
    return n === 1 ? '1 moeda cadastrada' : `${n} moedas cadastradas`;
  }

  async openCoinDetail(coin: Coin): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CoinDetailModalComponent,
      componentProps: { coin },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
  }
}
