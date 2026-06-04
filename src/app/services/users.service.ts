import { Injectable } from '@angular/core';

import { User } from '../models/user.model';
import { getSupabase } from './supabase.client';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private supabaseClient = getSupabase();

  async getUsers(): Promise<User[]> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data as User[];
  }

  async getUserById(id: number): Promise<User | undefined> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as User | undefined;
  }

  async getUserByAuthId(auth_id: string): Promise<User | undefined> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('auth_id', auth_id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as User | undefined;
  }

  async updateUser(user: User): Promise<User> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .update({
        name: user.name,
        email: user.email,
        location: user.location,
        rating: user.rating,
        total_reviews: user.total_reviews,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as User;
  }
}
