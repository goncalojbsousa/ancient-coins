import { Injectable, inject } from '@angular/core';

import { User } from '../models/ancient-coins.models';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private databaseService = inject(DatabaseService);
  private users: User[];

  constructor() {
    this.users = [];
    this.init();
  }

  async init(): Promise<void> {
    this.users = await this.databaseService.getData<User[]>('users', []);
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    const normalizedEmail = email.trim().toLowerCase();

    return this.users.find(user => user.email.toLowerCase() === normalizedEmail);
  }

  async insertUser(user: User): Promise<void> {
    if (!user.id) {
      user.id = Date.now();
    }

    this.users.push(user);
    await this.saveUsers();
  }

  async updateUser(user: User): Promise<void> {
    const index = this.users.findIndex(currentUser => currentUser.id === user.id);

    if (index >= 0) {
      this.users[index] = user;
      await this.saveUsers();
    }
  }

  private async saveUsers(): Promise<void> {
    await this.databaseService.setData('users', this.users);
  }
}
