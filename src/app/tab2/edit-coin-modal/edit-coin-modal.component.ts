import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

import { Coin, CoinCondition } from '../../models/coin.model';
import { CoinsService } from '../../services/coins.service';

@Component({
  selector: 'app-edit-coin-modal',
  templateUrl: './edit-coin-modal.component.html',
  styleUrls: ['./edit-coin-modal.component.scss'],
  standalone: false,
})
export class EditCoinModalComponent implements OnInit {
  @Input() coin!: Coin;

  selectedPhoto?: File;
  photoPreviewUrl = '';
  isSavingCoin = false;
  editCoinForm: FormGroup;

  constructor(
    private coinsService: CoinsService,
    private formBuilder: NonNullableFormBuilder,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.editCoinForm = this.formBuilder.group({
      name: ['', Validators.required],
      origin: ['', Validators.required],
      year: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.min(1),
        Validators.max(new Date().getFullYear())
      ]],
      material: ['', Validators.required],
      condition: ['Bom' as CoinCondition, Validators.required],
      description: ['', Validators.required],
      availableForSale: [false],
      price: [0],
      availableForTrade: [false],
      tradePreference: ['']
    }, {
      validators: this.marketFieldsValidator
    });
  }

  ngOnInit(): void {
    this.fillFormWithCurrentCoin();
  }

  get name(): AbstractControl {
    return this.editCoinForm.controls['name'];
  }

  get origin(): AbstractControl {
    return this.editCoinForm.controls['origin'];
  }

  get year(): AbstractControl {
    return this.editCoinForm.controls['year'];
  }

  get material(): AbstractControl {
    return this.editCoinForm.controls['material'];
  }

  get description(): AbstractControl {
    return this.editCoinForm.controls['description'];
  }

  get availableForSale(): AbstractControl {
    return this.editCoinForm.controls['availableForSale'];
  }

  get price(): AbstractControl {
    return this.editCoinForm.controls['price'];
  }

  get availableForTrade(): AbstractControl {
    return this.editCoinForm.controls['availableForTrade'];
  }

  get tradePreference(): AbstractControl {
    return this.editCoinForm.controls['tradePreference'];
  }

  onPhotoSelected(selectedFile?: File): void {
    if (!selectedFile) {
      return;
    }

    this.clearPhotoPreview();
    this.selectedPhoto = selectedFile;
    // Cria um URL temporario da imagem para preview.
    this.photoPreviewUrl = URL.createObjectURL(selectedFile);
  }

  removeSelectedPhoto(): void {
    this.selectedPhoto = undefined;
    this.clearPhotoPreview();
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  async updateCoin(): Promise<void> {
    if (this.editCoinForm.invalid || this.isSavingCoin) {
      this.editCoinForm.markAllAsTouched();
      return;
    }

    this.isSavingCoin = true;

    try {
      const photoUrl = this.selectedPhoto
        ? await this.coinsService.uploadCoinPhoto(this.selectedPhoto, this.coin.owner_id)
        : '';
      const coinToUpdate = this.buildCoinFromForm(photoUrl);
      await this.coinsService.updateCoin(coinToUpdate);

      await this.showToastMessage('Moeda atualizada com sucesso.', 'success-toast');
      await this.closeModal();
    } catch {
      await this.showToastMessage('Não foi possível atualizar a moeda. Tente novamente.', 'error-toast');
    } finally {
      this.isSavingCoin = false;
    }
  }

  private fillFormWithCurrentCoin(): void {
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

    this.photoPreviewUrl = this.coin.photos[0] ?? '';
  }

  private buildCoinFromForm(photoUrl: string): Coin {
    const coinFormData = this.editCoinForm.getRawValue();
    const coinPhotos = photoUrl
      ? [photoUrl]
      : this.photoPreviewUrl
        ? [this.photoPreviewUrl]
        : [];

    return {
      ...this.coin,
      name: coinFormData.name.trim(),
      origin: coinFormData.origin.trim(),
      year: coinFormData.year.trim(),
      material: coinFormData.material.trim(),
      condition: coinFormData.condition,
      description: coinFormData.description.trim(),
      photos: coinPhotos,
      available_for_sale: coinFormData.availableForSale,
      available_for_trade: coinFormData.availableForTrade,
      price: coinFormData.availableForSale ? Number(coinFormData.price) : null,
      trade_preference: coinFormData.availableForTrade ? coinFormData.tradePreference.trim() : null,
    };
  }

  private clearPhotoPreview(): void {
    if (this.photoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }

    this.photoPreviewUrl = '';
  }

  private marketFieldsValidator(form: AbstractControl): ValidationErrors | null {
    const availableForSale = form.get('availableForSale')?.value;
    const salePrice = Number(form.get('price')?.value);
    const availableForTrade = form.get('availableForTrade')?.value;
    const tradePreference = form.get('tradePreference')?.value.trim();
    const validationErrors: ValidationErrors = {};

    // Os campos do mercado so sao obrigatorios quando a opcao correspondente esta ativa.
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
