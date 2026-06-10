import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.authService.init();

    if (this.authService.isAuthenticated()) {
      await this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    }
  }

  get email(): AbstractControl {
    return this.loginForm.controls['email'];
  }

  get password(): AbstractControl {
    return this.loginForm.controls['password'];
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    const user = await this.authService.login(email, password);

    if (user) {
      await this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      return;
    }

    this.errorMessage = 'Dados inválidos. Confirme o e-mail e a palavra-passe.';
  }

}
