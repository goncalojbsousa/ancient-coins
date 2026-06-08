import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
  providedIn: 'root',
})
export class ChatStorageService {
  private storage = inject(Storage);
  private storageReady = false;


  async init(): Promise<void> {
    if (this.storageReady) {
      return;
    }

    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    this.storageReady = true;
  }


  async getReadMessageIds(userId: number): Promise<Record<number, number>> {
    await this.init();

    const readMessageIds = await this.storage.get(this.getReadStorageKey(userId));
    return readMessageIds ?? {};
  }


  async setLastReadMessageId(
    userId: number,
    conversationId: number,
    messageId: number
  ): Promise<Record<number, number>> {
    const readMessageIds = await this.getReadMessageIds(userId);
    readMessageIds[conversationId] = messageId;
    await this.storage.set(this.getReadStorageKey(userId), readMessageIds);

    return readMessageIds;
  }

  
  private getReadStorageKey(userId: number): string {
    return `readMessages.${userId}`;
  }
}
