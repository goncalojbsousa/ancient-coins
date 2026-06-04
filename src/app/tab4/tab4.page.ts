import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ViewWillEnter, ViewWillLeave } from '@ionic/angular';

import { Coin } from '../models/coin.model';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ChatStorageService } from '../services/chat-storage.service';
import { CoinsService } from '../services/coins.service';
import { MessagesService } from '../services/messages.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements ViewWillEnter, ViewWillLeave, OnDestroy {
  @ViewChild(IonContent) content?: IonContent;

  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private chatStorageService = inject(ChatStorageService);
  private coinsService = inject(CoinsService);
  private messagesService = inject(MessagesService);
  private router = inject(Router);
  private usersService = inject(UsersService);

  conversations: Conversation[] = [];
  coins: Coin[] = [];
  reviews: Review[] = [];
  users: User[] = [];
  currentUser?: User;
  selectedConversation?: Conversation;
  searchTerm = '';
  newMessage = '';
  errorMessage = '';
  isLoading = false;
  showReviewForm = false;
  reviewStars = 5;
  reviewComment = '';
  private readMessageIds: Record<number, number> = {};
  private refreshTimer?: ReturnType<typeof setInterval>;

  async ionViewWillEnter(): Promise<void> {
    await this.loadConversations();
    this.startAutoRefresh();
  }

  ionViewWillLeave(): void {
    this.stopAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  async loadConversations(showLoading = true): Promise<void> {
    if (showLoading) {
      this.isLoading = true;
    }

    this.errorMessage = '';
    const selectedConversationId = this.selectedConversation?.id;
    const selectedMessageCount = this.selectedConversation?.messages.length ?? 0;

    try {
      await this.authService.init();
      this.currentUser = await this.authService.getCurrentUser();

      if (!this.currentUser) {
        this.conversations = [];
        return;
      }

      this.conversations = await this.messagesService.getConversationsByUser(this.currentUser.id);
      await this.loadReadMessageIds();
      this.reviews = await this.loadUserReviews(this.currentUser.id);
      this.users = await this.usersService.getUsers();
      await this.loadConversationCoins();
      await this.selectConversationFromRoute();

      if (selectedConversationId) {
        const updatedConversation = this.conversations.find(
          conversation => conversation.id === selectedConversationId
        );
        this.selectedConversation = updatedConversation;

        if (updatedConversation && updatedConversation.messages.length !== selectedMessageCount) {
          await this.markConversationAsRead(updatedConversation);
          setTimeout(() => this.content?.scrollToBottom(250), 100);
        }
      }
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Não foi possível carregar as mensagens.';
    } finally {
      if (showLoading) {
        this.isLoading = false;
      }
    }
  }

  get filteredConversations(): Conversation[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return this.conversations;
    }

    return this.conversations.filter(conversation => {
      const user = this.getOtherUser(conversation);
      const coin = this.getCoin(conversation);
      const lastMessage = this.getLastMessage(conversation);

      return (
        user?.name.toLowerCase().includes(normalizedSearchTerm) ||
        coin?.name.toLowerCase().includes(normalizedSearchTerm) ||
        lastMessage?.text.toLowerCase().includes(normalizedSearchTerm)
      );
    });
  }

  async selectConversation(conversation: Conversation): Promise<void> {
    await this.router.navigate(['/tabs/tab4'], {
      queryParams: { conversationId: conversation.id },
    });
    this.selectedConversation = conversation;
    this.showReviewForm = false;
    this.reviewComment = '';
    await this.markConversationAsRead(conversation);
    setTimeout(() => this.content?.scrollToBottom(250), 100);
  }

  async closeConversation(): Promise<void> {
    await this.router.navigate(['/tabs/tab4'], {
      queryParams: {},
    });
    this.selectedConversation = undefined;
    this.closeReviewForm();
    this.newMessage = '';
  }

  openReviewForm(): void {
    if (!this.selectedConversation) {
      return;
    }

    const review = this.getReviewForConversation(this.selectedConversation);
    this.reviewStars = review?.stars ?? 5;
    this.reviewComment = review?.comment ?? '';
    this.showReviewForm = true;
    this.stopAutoRefresh();
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
    this.startAutoRefresh();
  }

  async sendMessage(): Promise<void> {
    const text = this.newMessage.trim();

    if (!text || !this.currentUser || !this.selectedConversation) {
      return;
    }

    const conversationId = this.selectedConversation.id;

    await this.messagesService.insertMessage(conversationId, this.currentUser.id, text);
    this.newMessage = '';
    await this.loadConversations(false);

    const updatedConversation = await this.messagesService.getConversationById(conversationId);
    this.selectedConversation = updatedConversation;

    if (updatedConversation) {
      await this.markConversationAsRead(updatedConversation);
    }

    setTimeout(() => this.content?.scrollToBottom(250), 100);
  }

  async submitReview(): Promise<void> {
    if (
      !this.currentUser ||
      !this.selectedConversation ||
      !this.reviewComment.trim()
    ) {
      return;
    }

    const otherUser = this.getOtherUser(this.selectedConversation);

    if (!otherUser) {
      return;
    }

    const conversationId = this.selectedConversation.id;
    const reviewerId = this.currentUser.id;
    const reviewedUserId = otherUser.id;
    const stars = this.reviewStars;
    const comment = this.reviewComment.trim();

    this.showReviewForm = false;

    await this.messagesService.insertReview(
      conversationId,
      reviewerId,
      reviewedUserId,
      stars,
      comment
    );

    this.reviewComment = '';
    await this.loadConversations(false);
    this.startAutoRefresh();
  }

  getOtherUser(conversation: Conversation): User | undefined {
    const otherUserId = conversation.buyer_id === this.currentUser?.id
      ? conversation.seller_id
      : conversation.buyer_id;

    return this.users.find(user => user.id === otherUserId);
  }

  getCoin(conversation: Conversation): Coin | undefined {
    return this.coins.find(coin => coin.id === conversation.coin_id);
  }

  getLastMessage(conversation: Conversation): Message | undefined {
    return conversation.messages[conversation.messages.length - 1];
  }

  getConversationDate(conversation: Conversation): string {
    return new Date(conversation.updated_at).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
    });
  }

  getMessageTime(message: Message): string {
    return new Date(message.created_at).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getInitials(name?: string): string {
    if (!name) {
      return '?';
    }

    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  hasUnreadMessage(conversation: Conversation): boolean {
    return this.getUnreadMessageCount(conversation) > 0;
  }

  getUnreadMessageCount(conversation: Conversation): number {
    const lastReadMessageId = this.readMessageIds[conversation.id] ?? 0;

    return conversation.messages.filter(message =>
      message.sender_id !== this.currentUser?.id &&
      message.id > lastReadMessageId
    ).length;
  }

  isMyMessage(message: Message): boolean {
    return message.sender_id === this.currentUser?.id;
  }

  hasReviewedConversation(conversation: Conversation): boolean {
    return this.getReviewForConversation(conversation) !== undefined;
  }

  getReviewForConversation(conversation: Conversation): Review | undefined {
    return this.reviews.find(review =>
      review !== undefined &&
      review !== null &&
      review.conversation_id === conversation.id &&
      review.reviewer_id === this.currentUser?.id
    );
  }

  private async loadConversationCoins(): Promise<void> {
    const coinIds = [...new Set(this.conversations.map(conversation => conversation.coin_id))];
    const coins = await Promise.all(
      coinIds.map(coinId => this.coinsService.getCoinById(coinId))
    );

    this.coins = coins.filter((coin): coin is Coin => coin !== undefined);
  }

  private async loadUserReviews(userId: number): Promise<Review[]> {
    const reviews = await Promise.all(
      this.conversations.map(conversation =>
        this.messagesService.getReviewByConversationAndReviewer(conversation.id, userId)
      )
    );

    return reviews.filter((review): review is Review => review !== undefined && review !== null);
  }

  private async loadReadMessageIds(): Promise<void> {
    if (!this.currentUser) {
      this.readMessageIds = {};
      return;
    }

    this.readMessageIds = await this.chatStorageService.getReadMessageIds(this.currentUser.id);
  }

  private async markConversationAsRead(conversation: Conversation): Promise<void> {
    const lastMessage = this.getLastMessage(conversation);

    if (!this.currentUser || !lastMessage) {
      return;
    }

    this.readMessageIds = await this.chatStorageService.setLastReadMessageId(
      this.currentUser.id,
      conversation.id,
      lastMessage.id
    );
  }

  private async selectConversationFromRoute(): Promise<void> {
    const conversationIdParam = this.activatedRoute.snapshot.queryParamMap.get('conversationId');

    if (!conversationIdParam || this.selectedConversation) {
      return;
    }

    const conversationId = Number(conversationIdParam);
    const conversation = this.conversations.find(item => item.id === conversationId);

    if (conversation) {
      this.selectedConversation = conversation;
      await this.markConversationAsRead(conversation);
      setTimeout(() => this.content?.scrollToBottom(250), 100);
    }
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();

    this.refreshTimer = setInterval(async () => {
      if (!this.isLoading) {
        await this.loadConversations(false);
      }
    }, 3000);
  }

  private stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }
}
