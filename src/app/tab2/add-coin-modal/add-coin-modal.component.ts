import { Component, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

import { Coin, CoinCondition } from '../../models/coin.model';
import { AuthService } from '../../services/auth.service';
import { CoinsService } from '../../services/coins.service';

interface AddCoinModalResult {
  createdCoin?: Coin;
}

const COIN_CONDITIONS: CoinCondition[] = ['Excelente', 'Muito Bom', 'Bom', 'Regular'];

@Component({
  selector: 'app-add-coin-modal',
  templateUrl: './add-coin-modal.component.html',
  styleUrls: ['./add-coin-modal.component.scss'],
  standalone: false,
})
export class AddCoinModalComponent {
  private authService = inject(AuthService);
  private coinsService = inject(CoinsService);
  private formBuilder = inject(NonNullableFormBuilder);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);

  readonly coinConditions = COIN_CONDITIONS;
  formSubmitted = false;

  addCoinForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    origin: ['', [Validators.required]],
    year: ['', [Validators.required]],
    material: ['', [Validators.required]],
    condition: ['Bom' as CoinCondition, [Validators.required]],
    description: ['', [Validators.required]],
    photoUrl: [''],
    availableForSale: [false],
    price: [0],
    availableForTrade: [false],
    tradePreference: [''],
  }, {
    validators: this.marketFieldsValidator,
  });

  get name(): AbstractControl {
    return this.addCoinForm.controls.name;
  }

  get origin(): AbstractControl {
    return this.addCoinForm.controls.origin;
  }

  get year(): AbstractControl {
    return this.addCoinForm.controls.year;
  }

  get material(): AbstractControl {
    return this.addCoinForm.controls.material;
  }

  get description(): AbstractControl {
    return this.addCoinForm.controls.description;
  }

  get price(): AbstractControl {
    return this.addCoinForm.controls.price;
  }

  get tradePreference(): AbstractControl {
    return this.addCoinForm.controls.tradePreference;
  }

  get priceIsRequired(): boolean {
    return this.addCoinForm.hasError('priceRequired') && (this.price.touched || this.formSubmitted);
  }

  get tradePreferenceIsRequired(): boolean {
    return this.addCoinForm.hasError('tradePreferenceRequired') && (this.tradePreference.touched || this.formSubmitted);
  }

  async dismiss(result?: AddCoinModalResult): Promise<void> {
    await this.modalController.dismiss(result);
  }

  async submitCoinForm(): Promise<void> {
    this.formSubmitted = true;

    if (this.addCoinForm.invalid) {
      this.addCoinForm.markAllAsTouched();
      return;
    }

    const currentUser = await this.authService.getCurrentUser();

    if (!currentUser) {
      await this.showOperationMessage('Inicie sessão para adicionar moedas.', 'error-toast');
      return;
    }

    const newCoin = this.createCoinFromForm(currentUser.id);

    try {
      const createdCoin = await this.coinsService.insertCoin(newCoin);
      await this.showOperationMessage('Moeda adicionada com sucesso.', 'success-toast');
      await this.dismiss({ createdCoin });
    } catch {
      await this.showOperationMessage('Não foi possível adicionar a moeda. Tente novamente.', 'error-toast');
    }
  }

  private createCoinFromForm(ownerId: number): Coin {
    const formValue = this.addCoinForm.getRawValue();

    return {
      id: 0,
      owner_id: ownerId,
      name: formValue.name.trim(),
      origin: formValue.origin.trim(),
      year: formValue.year.trim(),
      material: formValue.material.trim(),
      condition: formValue.condition,
      description: formValue.description.trim(),
      photos: this.getPhotoUrls(formValue.photoUrl),
      available_for_sale: formValue.availableForSale,
      available_for_trade: formValue.availableForTrade,
      price: formValue.availableForSale ? Number(formValue.price) : null,
      trade_preference: formValue.availableForTrade ? formValue.tradePreference.trim() : null,
      created_at: '',
      updated_at: '',
    };
  }

  private getPhotoUrls(photoUrl: string): string[] {
    const normalizedPhotoUrl = photoUrl.trim();

    return normalizedPhotoUrl ? [normalizedPhotoUrl] : [];
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
