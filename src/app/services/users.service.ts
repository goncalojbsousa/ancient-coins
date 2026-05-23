import { Injectable, inject } from '@angular/core';

import { User } from '../models/ancient-coins.models';
import { DatabaseService } from './database.service';

const CURRENT_USER_ID = 1;

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

  getCurrentUser(): User | undefined {
    return this.getUserById(CURRENT_USER_ID);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  async updateUser(user: User): Promise<void> {
    const index = this.users.findIndex(currentUser => currentUser.id === user.id);

    if (index >= 0) {
      this.users[index] = user;
      await this.databaseService.setData('users', this.users);
    }
  }
}
