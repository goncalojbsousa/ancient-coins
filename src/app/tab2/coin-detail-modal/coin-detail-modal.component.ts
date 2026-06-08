import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

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
export class CoinDetailModalComponent implements OnInit {
  @Input() coin!: Coin;

  marketForm: FormGroup;
  isSavingMarket = false;
  private updatedCoin?: Coin;

  constructor(
    private alertController: AlertController,
    private coinsService: CoinsService,
    private formBuilder: NonNullableFormBuilder,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.marketForm = this.formBuilder.group({
      availableForSale: [false],
      price: [0],
      availableForTrade: [false],
      tradePreference: [''],
    }, {
      validators: this.marketFieldsValidator,
    });
  }

  ngOnInit(): void {
    this.fillMarketFormWithCoinData();
  }

  get price(): AbstractControl {
    return this.marketForm.controls['price'];
  }

  get tradePreference(): AbstractControl {
    return this.marketForm.controls['tradePreference'];
  }

  get availableForSale(): AbstractControl {
    return this.marketForm.controls['availableForSale'];
  }

  get availableForTrade(): AbstractControl {
    return this.marketForm.controls['availableForTrade'];
  }

  get priceIsRequired(): boolean {
    return this.marketForm.hasError('priceRequired') && (this.price.touched || this.availableForSale.touched);
  }

  get tradePreferenceIsRequired(): boolean {
    return this.marketForm.hasError('tradePreferenceRequired') && (this.tradePreference.touched || this.availableForTrade.touched);
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
    }
  }

  async saveMarketData(): Promise<void> {
    if (this.marketForm.invalid || this.isSavingMarket) {
      this.marketForm.markAllAsTouched();
      return;
    }

    this.isSavingMarket = true;

    try {
      const updatedCoin = await this.coinsService.updateCoin(this.createCoinWithMarketData());

      if (!updatedCoin) {
        throw new Error('Coin market update failed');
      }

      this.coin = updatedCoin;
      this.updatedCoin = updatedCoin;
      this.fillMarketFormWithCoinData();
      await this.showOperationMessage('Estado da moeda atualizado.', 'success-toast');
    } catch {
      await this.showOperationMessage('Não foi possível atualizar o estado da moeda.', 'error-toast');
    } finally {
      this.isSavingMarket = false;
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
    let errors: ValidationErrors | null = null;

    if (availableForSale && (!Number.isFinite(price) || price <= 0)) {
      errors = { ...(errors ?? {}), priceRequired: true };
    }

    if (availableForTrade && !tradePreference) {
      errors = { ...(errors ?? {}), tradePreferenceRequired: true };
    }

    return errors;
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
