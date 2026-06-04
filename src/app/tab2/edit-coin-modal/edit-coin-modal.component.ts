import { Component, Input, OnInit, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

import { Coin, CoinCondition } from '../../models/coin.model';
import { CoinsService } from '../../services/coins.service';

interface EditCoinModalResult {
  updatedCoin?: Coin;
}

const COIN_CONDITIONS: CoinCondition[] = ['Excelente', 'Muito Bom', 'Bom', 'Regular'];

@Component({
  selector: 'app-edit-coin-modal',
  templateUrl: './edit-coin-modal.component.html',
  styleUrls: ['./edit-coin-modal.component.scss'],
  standalone: false,
})
export class EditCoinModalComponent implements OnInit {
  private coinsService = inject(CoinsService);
  private formBuilder = inject(NonNullableFormBuilder);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);

  @Input() coin!: Coin;

  readonly coinConditions = COIN_CONDITIONS;
  formSubmitted = false;
  selectedPhotoFile?: File;
  selectedPhotoPreview = '';
  isSaving = false;

  editCoinForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    origin: ['', [Validators.required]],
    year: ['', [Validators.required]],
    material: ['', [Validators.required]],
    condition: ['Bom' as CoinCondition, [Validators.required]],
    description: ['', [Validators.required]],
    availableForSale: [false],
    price: [0],
    availableForTrade: [false],
    tradePreference: [''],
  }, {
    validators: this.marketFieldsValidator,
  });

  ngOnInit(): void {
    this.fillFormWithCoinData();
  }

  get name(): AbstractControl {
    return this.editCoinForm.controls.name;
  }

  get origin(): AbstractControl {
    return this.editCoinForm.controls.origin;
  }

  get year(): AbstractControl {
    return this.editCoinForm.controls.year;
  }

  get material(): AbstractControl {
    return this.editCoinForm.controls.material;
  }

  get description(): AbstractControl {
    return this.editCoinForm.controls.description;
  }

  get price(): AbstractControl {
    return this.editCoinForm.controls.price;
  }

  get tradePreference(): AbstractControl {
    return this.editCoinForm.controls.tradePreference;
  }

  get priceIsRequired(): boolean {
    return this.editCoinForm.hasError('priceRequired') && (this.price.touched || this.formSubmitted);
  }

  get tradePreferenceIsRequired(): boolean {
    return this.editCoinForm.hasError('tradePreferenceRequired') && (this.tradePreference.touched || this.formSubmitted);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.clearPhotoPreview();
    this.selectedPhotoFile = file;
    this.selectedPhotoPreview = URL.createObjectURL(file);
    input.value = '';
  }

  removeSelectedPhoto(): void {
    this.selectedPhotoFile = undefined;
    this.clearPhotoPreview();
  }

  async dismiss(result?: EditCoinModalResult): Promise<void> {
    await this.modalController.dismiss(result);
  }

  async submitEditCoinForm(): Promise<void> {
    this.formSubmitted = true;

    if (this.editCoinForm.invalid || this.isSaving) {
      this.editCoinForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    try {
      const uploadedPhotoUrl = this.selectedPhotoFile
        ? await this.coinsService.uploadCoinPhoto(this.selectedPhotoFile, this.coin.owner_id)
        : '';
      const coinToUpdate = this.createCoinFromForm(uploadedPhotoUrl);
      const updatedCoin = await this.coinsService.updateCoin(coinToUpdate);

      if (!updatedCoin) {
        throw new Error('Coin update failed');
      }

      await this.showOperationMessage('Moeda atualizada com sucesso.', 'success-toast');
      await this.dismiss({ updatedCoin });
    } catch {
      await this.showOperationMessage('Não foi possível atualizar a moeda. Tente novamente.', 'error-toast');
    } finally {
      this.isSaving = false;
    }
  }

  private fillFormWithCoinData(): void {
    this.editCoinForm.patchValue({
      name: this.coin.name,
      origin: this.coin.origin,
      year: this.coin.year,
      material: this.coin.material,
      condition: this.coin.condition,
      description: this.coin.description,
      availableForSale: this.coin.available_for_sale,
      price: this.coin.price ?? 0,
      availableForTrade: this.coin.available_for_trade,
      tradePreference: this.coin.trade_preference ?? '',
    });

    this.selectedPhotoPreview = this.coin.photos[0] ?? '';
  }

  private createCoinFromForm(uploadedPhotoUrl: string): Coin {
    const formValue = this.editCoinForm.getRawValue();
    const photos = uploadedPhotoUrl
      ? [uploadedPhotoUrl]
      : this.selectedPhotoPreview
        ? [this.selectedPhotoPreview]
        : [];

    return {
      ...this.coin,
      name: formValue.name.trim(),
      origin: formValue.origin.trim(),
      year: formValue.year.trim(),
      material: formValue.material.trim(),
      condition: formValue.condition,
      description: formValue.description.trim(),
      photos,
      available_for_sale: formValue.availableForSale,
      available_for_trade: formValue.availableForTrade,
      price: formValue.availableForSale ? Number(formValue.price) : null,
      trade_preference: formValue.availableForTrade ? formValue.tradePreference.trim() : null,
    };
  }

  private clearPhotoPreview(): void {
    if (this.selectedPhotoPreview && this.selectedPhotoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(this.selectedPhotoPreview);
    }

    this.selectedPhotoPreview = '';
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
