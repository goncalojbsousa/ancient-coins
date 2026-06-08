import { Component } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
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
  readonly coinConditions = COIN_CONDITIONS;
  formSubmitted = false;
  selectedPhotoFile?: File;
  selectedPhotoPreview = '';
  isSaving = false;
  addCoinForm: FormGroup;

  constructor(
    private authService: AuthService,
    private coinsService: CoinsService,
    private formBuilder: NonNullableFormBuilder,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.addCoinForm = this.formBuilder.group({
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

  get availableForTrade(): AbstractControl {
    return this.addCoinForm.controls['availableForTrade'];
  }

  get price(): AbstractControl {
    return this.addCoinForm.controls['price'];
  }

  get tradePreference(): AbstractControl {
    return this.addCoinForm.controls['tradePreference'];
  }

  get priceIsRequired(): boolean {
    return this.addCoinForm.hasError('priceRequired') && (this.price.touched || this.formSubmitted);
  }

  get tradePreferenceIsRequired(): boolean {
    return this.addCoinForm.hasError('tradePreferenceRequired') && (this.tradePreference.touched || this.formSubmitted);
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

  async dismiss(result?: AddCoinModalResult): Promise<void> {
    await this.modalController.dismiss(result);
  }

  async submitCoinForm(): Promise<void> {
    this.formSubmitted = true;

    if (this.addCoinForm.invalid || this.isSaving) {
      this.addCoinForm.markAllAsTouched();
      return;
    }

    const currentUser = await this.authService.getCurrentUser();

    if (!currentUser) {
      await this.showOperationMessage('Inicie sessão para adicionar moedas.', 'error-toast');
      return;
    }

    this.isSaving = true;

    try {
      const uploadedPhotoUrl = this.selectedPhotoFile
        ? await this.coinsService.uploadCoinPhoto(this.selectedPhotoFile, currentUser.id)
        : '';
      const newCoin = this.createCoinFromForm(currentUser.id, uploadedPhotoUrl);
      const createdCoin = await this.coinsService.insertCoin(newCoin);
      await this.showOperationMessage('Moeda adicionada com sucesso.', 'success-toast');
      await this.dismiss({ createdCoin });
    } catch {
      await this.showOperationMessage('Não foi possível adicionar a moeda. Tente novamente.', 'error-toast');
    } finally {
      this.isSaving = false;
    }
  }

  private createCoinFromForm(ownerId: number, uploadedPhotoUrl: string): Coin {
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
      photos: uploadedPhotoUrl ? [uploadedPhotoUrl] : [],
      available_for_sale: formValue.availableForSale,
      available_for_trade: formValue.availableForTrade,
      price: formValue.availableForSale ? Number(formValue.price) : null,
      trade_preference: formValue.availableForTrade ? formValue.tradePreference.trim() : null,
      created_at: '',
      updated_at: '',
    };
  }

  private clearPhotoPreview(): void {
    if (this.selectedPhotoPreview) {
      URL.revokeObjectURL(this.selectedPhotoPreview);
      this.selectedPhotoPreview = '';
    }
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
