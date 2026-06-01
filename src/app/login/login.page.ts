import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class LoginPage implements OnInit {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: NonNullableFormBuilder,
  ) { }

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

    this.errorMessage = 'Email ou password inválidos.';
  }

}
