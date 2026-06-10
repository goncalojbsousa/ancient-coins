import { Component } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

import { Coin, CoinCondition } from '../../models/coin.model';
import { AuthService } from '../../services/auth.service';
import { CoinsService } from '../../services/coins.service';

@Component({
  selector: 'app-add-coin-modal',
  templateUrl: './add-coin-modal.component.html',
  styleUrls: ['./add-coin-modal.component.scss'],
  standalone: false,
})
export class AddCoinModalComponent {
  selectedPhoto?: File;
  photoPreviewUrl = '';
  isSavingCoin = false;
  addCoinForm: FormGroup;

  constructor(
    private authService: AuthService,
    private coinsService: CoinsService,
    private formBuilder: NonNullableFormBuilder,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.addCoinForm = this.formBuilder.group({
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

  get name(): AbstractControl {
    return this.addCoinForm.controls['name'];
  }

  get origin(): AbstractControl {
    return this.addCoinForm.controls['origin'];
  }

  get year(): AbstractControl {
    return this.addCoinForm.controls['year'];
  }

  get material(): AbstractControl {
    return this.addCoinForm.controls['material'];
  }

  get description(): AbstractControl {
    return this.addCoinForm.controls['description'];
  }

  get availableForSale(): AbstractControl {
    return this.addCoinForm.controls['availableForSale'];
  }

  get price(): AbstractControl {
    return this.addCoinForm.controls['price'];
  }

  get availableForTrade(): AbstractControl {
    return this.addCoinForm.controls['availableForTrade'];
  }

  get tradePreference(): AbstractControl {
    return this.addCoinForm.controls['tradePreference'];
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

  async closeModal(createdCoin?: Coin): Promise<void> {
    await this.modalController.dismiss(createdCoin ? { createdCoin } : undefined);
  }

  async addCoin(): Promise<void> {
    if (this.addCoinForm.invalid || this.isSavingCoin) {
      this.addCoinForm.markAllAsTouched();
      return;
    }

    const currentUser = await this.authService.getCurrentUser();

    if (!currentUser) {
      await this.showToastMessage('Inicie sessão para adicionar moedas.', 'error-toast');
      return;
    }

    this.isSavingCoin = true;

    try {
      const photoUrl = this.selectedPhoto
        ? await this.coinsService.uploadCoinPhoto(this.selectedPhoto, currentUser.id)
        : '';
      const coinToCreate = this.buildCoinFromForm(currentUser.id, photoUrl);
      const createdCoin = await this.coinsService.insertCoin(coinToCreate);
      await this.showToastMessage('Moeda adicionada com sucesso.', 'success-toast');
      await this.closeModal(createdCoin);
    } catch {
      await this.showToastMessage('Não foi possível adicionar a moeda. Tente novamente.', 'error-toast');
    } finally {
      this.isSavingCoin = false;
    }
  }

  private buildCoinFromForm(ownerId: number, photoUrl: string): Coin {
    const coinFormData = this.addCoinForm.getRawValue();

    return {
      id: 0,
      owner_id: ownerId,
      name: coinFormData.name.trim(),
      origin: coinFormData.origin.trim(),
      year: coinFormData.year.trim(),
      material: coinFormData.material.trim(),
      condition: coinFormData.condition,
      description: coinFormData.description.trim(),
      photos: photoUrl ? [photoUrl] : [],
      available_for_sale: coinFormData.availableForSale,
      available_for_trade: coinFormData.availableForTrade,
      price: coinFormData.availableForSale ? Number(coinFormData.price) : null,
      trade_preference: coinFormData.availableForTrade ? coinFormData.tradePreference.trim() : null,
      created_at: '',
      updated_at: '',
    };
  }

  private clearPhotoPreview(): void {
    if (this.photoPreviewUrl) {
      // Liberta da memoria o URL temporario usado para mostrar a imagem local.
      URL.revokeObjectURL(this.photoPreviewUrl);
      this.photoPreviewUrl = '';
    }
  }

  private marketFieldsValidator(form: AbstractControl): ValidationErrors | null {
    const availableForSale = form.get('availableForSale')?.value;
    const salePrice = Number(form.get('price')?.value);
    const availableForTrade = form.get('availableForTrade')?.value;
    const tradePreference = form.get('tradePreference')?.value.trim();
    const validationErrors: ValidationErrors = {};

    // O preço so e obrigatorio quando a moeda esta disponivel para venda.
    if (availableForSale && salePrice <= 0) {
      validationErrors['priceRequired'] = true;
    }

    // A preferência sa e obrigatoria quando a moeda esta disponivel para troca.
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
