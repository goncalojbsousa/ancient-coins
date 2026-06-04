import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subscription, debounceTime } from 'rxjs';

import { Coin } from '../../models/coin.model';
import { CoinsService } from '../../services/coins.service';
import { EditCoinModalComponent } from '../edit-coin-modal/edit-coin-modal.component';

interface CoinDetailModalResult {
  wasDeleted?: boolean;
  updatedCoin?: Coin;
}

interface EditCoinModalResult {
  updatedCoin?: Coin;
}

@Component({
  selector: 'app-coin-detail-modal',
  templateUrl: './coin-detail-modal.component.html',
  styleUrls: ['./coin-detail-modal.component.scss'],
  standalone: false,
})
export class CoinDetailModalComponent implements OnInit, OnDestroy {
  private alertController = inject(AlertController);
  private coinsService = inject(CoinsService);
  private formBuilder = inject(NonNullableFormBuilder);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);

  @Input() coin!: Coin;
  private updatedCoin?: Coin;
  private lastSavedMarketState = '';
  private marketFormSubscription?: Subscription;

  marketForm = this.formBuilder.group({
    availableForSale: [false],
    price: [0],
    availableForTrade: [false],
    tradePreference: [''],
  }, {
    validators: this.marketFieldsValidator,
  });

  ngOnInit(): void {
    this.fillMarketFormWithCoinData();
    this.lastSavedMarketState = this.getMarketState();
    this.watchMarketFormChanges();
  }

  ngOnDestroy(): void {
    this.marketFormSubscription?.unsubscribe();
  }

  get price(): AbstractControl {
    return this.marketForm.controls.price;
  }

  get tradePreference(): AbstractControl {
    return this.marketForm.controls.tradePreference;
  }

  get priceIsRequired(): boolean {
    return this.marketForm.controls.availableForSale.value && this.marketForm.hasError('priceRequired');
  }

  get tradePreferenceIsRequired(): boolean {
    return this.marketForm.controls.availableForTrade.value && this.marketForm.hasError('tradePreferenceRequired');
  }

  async dismiss(result?: CoinDetailModalResult): Promise<void> {
    await this.modalController.dismiss(result ?? this.getModalResult());
  }

  async confirmDeleteCoin(): Promise<void> {
    const deleteConfirmationAlert = await this.alertController.create({
      cssClass: 'ancient-confirm-alert',
      header: 'Eliminar moeda',
      message: 'Esta moeda será removida da sua coleção. Pretende continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'confirm-cancel-button',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'confirm-delete-button',
          handler: async () => {
            await this.deleteCoin();
          },
        },
      ],
    });

    await deleteConfirmationAlert.present();
  }

  async openEditCoinModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: EditCoinModalComponent,
      componentProps: { coin: this.coin },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss<EditCoinModalResult>();

    if (data?.updatedCoin) {
      this.coin = data.updatedCoin;
      this.updatedCoin = data.updatedCoin;
      this.fillMarketFormWithCoinData();
      this.lastSavedMarketState = this.getMarketState();
    }
  }

  private watchMarketFormChanges(): void {
    this.marketFormSubscription = this.marketForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => {
        void this.updateMarketAvailability();
      });
  }

  private async updateMarketAvailability(): Promise<void> {
    try {
      if (this.marketForm.invalid || this.getMarketState() === this.lastSavedMarketState) {
        return;
      }

      const coinToUpdate = this.createCoinWithMarketData();
      const updatedCoin = await this.coinsService.updateCoin(coinToUpdate);

      if (!updatedCoin) {
        throw new Error('Coin market update failed');
      }

      this.coin = updatedCoin;
      this.updatedCoin = updatedCoin;
      this.fillMarketFormWithCoinData();
      this.lastSavedMarketState = this.getMarketState();
      await this.showOperationMessage('Estado da moeda atualizado.', 'success-toast');
    } catch {
      await this.showOperationMessage('Não foi possível atualizar o estado da moeda.', 'error-toast');
    }
  }

  private async deleteCoin(): Promise<void> {
    try {
      await this.coinsService.deleteCoin(this.coin.id);
      await this.showOperationMessage('Moeda eliminada com sucesso.', 'success-toast');
      await this.dismiss({ wasDeleted: true });
    } catch {
      await this.showOperationMessage('Não foi possível eliminar a moeda. Tente novamente.', 'error-toast');
    }
  }

  private fillMarketFormWithCoinData(): void {
    this.marketForm.patchValue({
      availableForSale: this.coin.available_for_sale,
      price: this.coin.price ?? 0,
      availableForTrade: this.coin.available_for_trade,
      tradePreference: this.coin.trade_preference ?? '',
    }, {
      emitEvent: false,
    });
  }

  private createCoinWithMarketData(): Coin {
    const formValue = this.marketForm.getRawValue();

    return {
      ...this.coin,
      available_for_sale: formValue.availableForSale,
      available_for_trade: formValue.availableForTrade,
      price: formValue.availableForSale ? Number(formValue.price) : null,
      trade_preference: formValue.availableForTrade ? formValue.tradePreference.trim() : null,
    };
  }

  private marketFieldsValidator(control: AbstractControl): ValidationErrors | null {
    const availableForSale = control.get('availableForSale')?.value;
    const price = Number(control.get('price')?.value);
    const availableForTrade = control.get('availableForTrade')?.value;
    const tradePreference = String(control.get('tradePreference')?.value ?? '').trim();
    const validationErrors: ValidationErrors = {};
    const hasValidPrice = Number.isFinite(price) && price > 0;

    if (availableForSale && !hasValidPrice) {
      validationErrors['priceRequired'] = true;
    }

    if (availableForTrade && !tradePreference) {
      validationErrors['tradePreferenceRequired'] = true;
    }

    return Object.keys(validationErrors).length > 0 ? validationErrors : null;
  }

  private getMarketState(): string {
    const formValue = this.marketForm.getRawValue();

    return JSON.stringify({
      availableForSale: formValue.availableForSale,
      price: formValue.availableForSale ? Number(formValue.price) : null,
      availableForTrade: formValue.availableForTrade,
      tradePreference: formValue.availableForTrade ? formValue.tradePreference.trim() : null,
    });
  }

  private getModalResult(): CoinDetailModalResult | undefined {
    return this.updatedCoin ? { updatedCoin: this.updatedCoin } : undefined;
  }

  private async showOperationMessage(message: string, cssClass: string): Promise<void> {
    const operationToast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      cssClass,
    });

    await operationToast.present();
  }
}
