import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  errorMessage = '';

  async ngOnInit(): Promise<void> {
    await this.authService.init();

    if (this.authService.isAuthenticated()) {
      await this.router.navigateByUrl('/tabs/tab1');
    }
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
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
      await this.router.navigateByUrl('/tabs/tab1');
      return;
    }

    this.errorMessage = 'Dados inválidos. Confirme o e-mail e a palavra-passe.';
  }

}
