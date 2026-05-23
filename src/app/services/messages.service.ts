import { Injectable, inject } from '@angular/core';

import { Conversation, Message, Review } from '../models/ancient-coins.models';
import { DatabaseService } from './database.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private databaseService = inject(DatabaseService);
  private usersService = inject(UsersService);
  private conversations: Conversation[];
  private reviews: Review[];

  constructor() {
    this.conversations = [];
    this.reviews = [];
    this.init();
  }

  async init(): Promise<void> {
    this.conversations = await this.databaseService.getData<Conversation[]>('conversations', []);
    this.reviews = await this.databaseService.getData<Review[]>('reviews', []);
  }

  getConversations(): Conversation[] {
    return this.conversations;
  }

  getConversationsByUser(userId: number): Conversation[] {
    return this.conversations.filter(conversation =>
      conversation.buyerId === userId || conversation.sellerId === userId
    );
  }

  getConversationById(id: number): Conversation | undefined {
    return this.conversations.find(conversation => conversation.id === id);
  }

  getReviewsByUser(userId: number): Review[] {
    return this.reviews.filter(review => review.reviewedUserId === userId);
  }

  async startNegotiation(
    coinId: number,
    buyerId: number,
    sellerId: number,
    text: string
  ): Promise<Conversation> {
    const existingConversation = this.conversations.find(conversation =>
      conversation.coinId === coinId &&
      conversation.buyerId === buyerId &&
      conversation.sellerId === sellerId &&
      conversation.status === 'aberta'
    );

    if (existingConversation) {
      await this.insertMessage(existingConversation.id, buyerId, text);
      return existingConversation;
    }

    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: Date.now(),
      coinId,
      buyerId,
      sellerId,
      status: 'aberta',
      messages: [
        {
          id: Date.now() + 1,
          senderId: buyerId,
          text,
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.conversations.push(conversation);
    await this.saveConversations();

    return conversation;
  }

  async insertMessage(conversationId: number, senderId: number, text: string): Promise<void> {
    const conversation = this.getConversationById(conversationId);

    if (conversation) {
      const message: Message = {
        id: Date.now(),
        senderId,
        text,
        createdAt: new Date().toISOString(),
      };

      conversation.messages.push(message);
      conversation.updatedAt = message.createdAt;
      await this.saveConversations();
    }
  }

  async acceptNegotiation(conversationId: number): Promise<void> {
    const conversation = this.getConversationById(conversationId);

    if (conversation) {
      conversation.status = 'aceite';
      conversation.updatedAt = new Date().toISOString();
      await this.saveConversations();
    }
  }

  async insertReview(
    conversationId: number,
    reviewerId: number,
    reviewedUserId: number,
    stars: number,
    comment: string
  ): Promise<void> {
    const review: Review = {
      id: Date.now(),
      conversationId,
      reviewerId,
      reviewedUserId,
      stars,
      comment,
      createdAt: new Date().toISOString(),
    };

    this.reviews.push(review);
    await this.databaseService.setData('reviews', this.reviews);
    await this.updateUserRating(reviewedUserId);
  }

  private async updateUserRating(userId: number): Promise<void> {
    const user = this.usersService.getUserById(userId);
    const userReviews = this.getReviewsByUser(userId);

    if (user && userReviews.length > 0) {
      const totalStars = userReviews.reduce((total, review) => total + review.stars, 0);
      user.rating = Number((totalStars / userReviews.length).toFixed(1));
      user.totalReviews = userReviews.length;
      await this.usersService.updateUser(user);
    }
  }

  private async saveConversations(): Promise<void> {
    await this.databaseService.setData('conversations', this.conversations);
  }
}
