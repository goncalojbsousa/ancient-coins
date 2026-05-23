import { Injectable, inject } from '@angular/core';

import { RegisterUser, User } from '../models/ancient-coins.models';
import { DatabaseService } from './database.service';
import { UsersService } from './users.service';

const CURRENT_USER_ID_KEY = 'current_user_id';
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,}$/;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private databaseService = inject(DatabaseService);
  private usersService = inject(UsersService);
  private currentUserId: number | null;

  constructor() {
    this.currentUserId = null;
    this.init();
  }

  async init(): Promise<void> {
    await this.usersService.init();
    this.currentUserId = await this.databaseService.getData<number | null>(CURRENT_USER_ID_KEY, null);
  }

  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }

  getCurrentUser(): User | undefined {
    if (this.currentUserId === null) {
      return undefined;
    }

    return this.usersService.getUserById(this.currentUserId);
  }

  isPasswordValid(password: string): boolean {
    return PASSWORD_RULE.test(password);
  }

  async login(email: string, password: string): Promise<User | undefined> {
    await this.usersService.init();

    const user = this.usersService.getUserByEmail(email);

    if (user && user.password === password) {
      this.currentUserId = user.id;
      await this.databaseService.setData(CURRENT_USER_ID_KEY, user.id);
      return user;
    }

    return undefined;
  }

  async logout(): Promise<void> {
    this.currentUserId = null;
    await this.databaseService.setData(CURRENT_USER_ID_KEY, null);
  }

  async register(registerUser: RegisterUser): Promise<User | undefined> {
    await this.usersService.init();

    const existingUser = this.usersService.getUserByEmail(registerUser.email);

    if (existingUser || !this.isPasswordValid(registerUser.password)) {
      return undefined;
    }

    const user: User = {
      id: Date.now(),
      name: registerUser.name,
      email: registerUser.email.trim().toLowerCase(),
      password: registerUser.password,
      location: registerUser.location,
      rating: 0,
      totalReviews: 0,
    };

    await this.usersService.insertUser(user);
    this.currentUserId = user.id;
    await this.databaseService.setData(CURRENT_USER_ID_KEY, user.id);

    return user;
  }
}
