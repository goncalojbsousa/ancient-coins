import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors
} from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { Coin } from '../../models/coin.model';
import { CoinsService } from '../../services/coins.service';
import { EditCoinModalComponent } from '../edit-coin-modal/edit-coin-modal.component';

@Component({
  selector: 'app-coin-detail-modal',
  templateUrl: './coin-detail-modal.component.html',
  styleUrls: ['./coin-detail-modal.component.scss'],
  standalone: false,
})
export class CoinDetailModalComponent implements OnInit {
  @Input() coin!: Coin;

  marketplaceForm: FormGroup;
  isSavingMarketplace = false;

  constructor(
    private alertController: AlertController,
    private coinsService: CoinsService,
    private formBuilder: NonNullableFormBuilder,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.marketplaceForm = this.formBuilder.group({
      availableForSale: [false],
      price: [0],
      availableForTrade: [false],
      tradePreference: ['']
    }, {
      validators: this.marketFieldsValidator
    });
  }

  ngOnInit(): void {
    this.fillMarketplaceForm();
  }

  get availableForSale(): AbstractControl {
    return this.marketplaceForm.controls['availableForSale'];
  }

  get price(): AbstractControl {
    return this.marketplaceForm.controls['price'];
  }

  get availableForTrade(): AbstractControl {
    return this.marketplaceForm.controls['availableForTrade'];
  }

  get tradePreference(): AbstractControl {
    return this.marketplaceForm.controls['tradePreference'];
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  async confirmCoinDeletion(): Promise<void> {
    const confirmationAlert = await this.alertController.create({
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
            await this.deleteCurrentCoin();
          },
        },
      ],
    });

    await confirmationAlert.present();
  }

  async openCoinEditModal(): Promise<void> {
    const editCoinModal = await this.modalController.create({
      component: EditCoinModalComponent,
      componentProps: { coin: this.coin },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await editCoinModal.present();
    await editCoinModal.onWillDismiss();

    // Volta a buscar a moeda para apresentar os dados guardados pelo modal de edição.
    const updatedCoin = await this.coinsService.getCoinById(this.coin.id);

    if (updatedCoin) {
      this.coin = updatedCoin;
      this.fillMarketplaceForm();
    }
  }

  async saveMarketplaceSettings(): Promise<void> {
    if (this.marketplaceForm.invalid || this.isSavingMarketplace) {
      this.marketplaceForm.markAllAsTouched();
      return;
    }

    this.isSavingMarketplace = true;

    try {
      const updatedCoin = await this.coinsService.updateCoin(this.buildCoinWithMarketplaceData());

      this.coin = updatedCoin;
      this.fillMarketplaceForm();
      await this.showToastMessage('Estado da moeda atualizado.', 'success-toast');
    } catch {
      await this.showToastMessage('Não foi possível atualizar o estado da moeda.', 'error-toast');
    } finally {
      this.isSavingMarketplace = false;
    }
  }

  private async deleteCurrentCoin(): Promise<void> {
    try {
      await this.coinsService.deleteCoin(this.coin.id);
      await this.showToastMessage('Moeda eliminada com sucesso.', 'success-toast');
      await this.closeModal();
    } catch {
      await this.showToastMessage('Não foi possível eliminar a moeda. Tente novamente.', 'error-toast');
    }
  }

  private fillMarketplaceForm(): void {
    this.marketplaceForm.patchValue({
      availableForSale: this.coin.available_for_sale,
      price: this.coin.price ?? 0,
      availableForTrade: this.coin.available_for_trade,
      tradePreference: this.coin.trade_preference ?? '',
    });
  }

  private buildCoinWithMarketplaceData(): Coin {
    const marketplaceFormData = this.marketplaceForm.getRawValue();

    return {
      ...this.coin,
      available_for_sale: marketplaceFormData.availableForSale,
      available_for_trade: marketplaceFormData.availableForTrade,
      price: marketplaceFormData.availableForSale ? Number(marketplaceFormData.price) : null,
      trade_preference: marketplaceFormData.availableForTrade
        ? marketplaceFormData.tradePreference.trim()
        : null,
    };
  }

  private marketFieldsValidator(form: AbstractControl): ValidationErrors | null {
    const availableForSale = form.get('availableForSale')?.value;
    const salePrice = Number(form.get('price')?.value);
    const availableForTrade = form.get('availableForTrade')?.value;
    const tradePreference = form.get('tradePreference')?.value.trim();
    const validationErrors: ValidationErrors = {};

    // Os campos do marketplace so sao obrigatorios quando a opcao correspondente esta ativa.
    if (availableForSale && salePrice <= 0) {
      validationErrors['priceRequired'] = true;
    }

    if (availableForTrade && !tradePreference) {
      validationErrors['tradePreferenceRequired'] = true;
    }

    return Object.keys(validationErrors).length ? validationErrors : null;
  }

  private async showToastMessage(message: string, cssClass: string): Promise<void> {
    const toastMessage = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      cssClass,
    });

    await toastMessage.present();
  }
}
