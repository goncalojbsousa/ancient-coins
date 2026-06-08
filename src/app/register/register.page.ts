import { Component } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

const DEFAULT_USER_LOCATION = 'Por definir';
const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  registerForm: FormGroup;
  feedbackMessage = '';

  constructor(
    private authService: AuthService,
    private formBuilder: NonNullableFormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_RULE)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordsMatchValidator,
    });
  }

  get name(): AbstractControl {
    return this.registerForm.controls['name'];
  }

  get email(): AbstractControl {
    return this.registerForm.controls['email'];
  }

  get password(): AbstractControl {
    return this.registerForm.controls['password'];
  }

  get confirmPassword(): AbstractControl {
    return this.registerForm.controls['confirmPassword'];
  }

  get passwordsDoNotMatch(): boolean {
    return this.registerForm.hasError('passwordsDoNotMatch') && this.confirmPassword.touched;
  }

  async submitRegisterForm(): Promise<void> {
    this.feedbackMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();
    const registeredUser = await this.authService.register({
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      password: formValue.password,
      location: DEFAULT_USER_LOCATION,
    });

    if (registeredUser) {
      await this.router.navigateByUrl('/login', { replaceUrl: true });
      return;
    }

    this.feedbackMessage = 'Não foi possível criar a conta. Confirme os dados e tente novamente.';
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword || password === confirmPassword) {
      return null;
    }

    return { passwordsDoNotMatch: true };
  }
}
