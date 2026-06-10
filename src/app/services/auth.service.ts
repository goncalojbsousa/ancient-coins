import { Injectable } from '@angular/core';

import { RegisterUser, User } from '../models/user.model';
import { getSupabase } from './supabase.client';
import { UsersService } from './users.service';

const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabaseClient = getSupabase();
  private currentUserId: number | null = null;


  constructor(
    private usersService: UsersService
  ) { }


  async init(): Promise<void> {
    const { data, error } = await this.supabaseClient.auth.getSession();

    if (error || !data.session?.user) {
      this.currentUserId = null;
      return;
    }

    const user = await this.usersService.getUserByAuthId(data.session.user.id);
    this.currentUserId = user?.id ?? null;
  }


  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }


  async getCurrentUser(): Promise<User | undefined> {
    if (this.currentUserId === null) {
      return undefined;
    }

    return this.usersService.getUserById(this.currentUserId);
  }


  isPasswordValid(password: string): boolean {
    return PASSWORD_RULE.test(password);
  }


  async login(email: string, password: string): Promise<User | undefined> {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      return undefined;
    }

    const user = await this.usersService.getUserByAuthId(data.user.id);
    this.currentUserId = user?.id ?? null;

    return user;
  }


  async logout(): Promise<void> {
    await this.supabaseClient.auth.signOut();
    this.currentUserId = null;
  }


  async register(registerUser: RegisterUser): Promise<User | undefined> {
    if (!this.isPasswordValid(registerUser.password)) {
      return undefined;
    }

    const normalizedEmail = registerUser.email.trim().toLowerCase();
    const { data, error } = await this.supabaseClient.auth.signUp({
      email: normalizedEmail,
      password: registerUser.password,
      options: {
        data: {
          name: registerUser.name,
          location: registerUser.location,
        },
      },
    });

    if (error || !data.user) {
      return undefined;
    }

    const user = await this.usersService.getUserByAuthId(data.user.id);
    this.currentUserId = user?.id ?? null;

    return user;
  }
}
