import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

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

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private coinsService = inject(CoinsService);
  private modalController = inject(ModalController);
  private routeParamsSubscription?: Subscription;

  navigationSource = '';
  searchTerm = '';
  userCoins: Coin[] = [];

  async ngOnInit(): Promise<void> {
    await this.authService.init();
    this.watchRouteParams();
    await this.loadUserCoins();
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
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

  private watchRouteParams(): void {
    this.routeParamsSubscription = this.activatedRoute.queryParamMap.subscribe(params => {
      const routeOrigin = params.get('origem');

      this.navigationSource = routeOrigin ?? '';
    });
  }
}
