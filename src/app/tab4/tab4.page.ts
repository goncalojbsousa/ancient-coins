import { Component, OnDestroy, ViewChild } from '@angular/core';
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
import { ReviewsService } from '../services/reviews.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements ViewWillEnter, ViewWillLeave, OnDestroy {
  @ViewChild(IonContent) content?: IonContent;

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


  // Guarda o id da ultima mensagem lida em cada conversa. { 2: 10 } significa que, na conversa 2, a mensagem 10 ja foi lida.
  private readMessageIds: Record<number, number> = {};


  // Guarda o temporizador que atualiza as conversas de tres em tres segundos.
  private refreshTimer?: ReturnType<typeof setInterval>;


  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private chatStorageService: ChatStorageService,
    private coinsService: CoinsService,
    private messagesService: MessagesService,
    private reviewsService: ReviewsService,
    private router: Router,
    private usersService: UsersService
  ) { }


  async ionViewWillEnter(): Promise<void> {
    await this.loadPage();
    this.startAutoRefresh();
  }


  ionViewWillLeave(): void {
    this.stopAutoRefresh();
  }


  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }


  // Carrega os dados gerais apenas quando o utilizador entra na pagina.
  async loadPage(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.init();
      this.currentUser = await this.authService.getCurrentUser();

      // Limpa as conversas se nao existe um utilizador autenticado.
      if (!this.currentUser) {
        this.conversations = [];
        return;
      }

      // Carregar dados dos services
      this.coins = await this.coinsService.getCoins();
      this.reviews = await this.reviewsService.getReviewsByReviewer(this.currentUser.id);
      this.users = await this.usersService.getUsers();
      this.readMessageIds = await this.chatStorageService.getReadMessageIds(this.currentUser.id);

      await this.loadConversations();

    } catch (error) {
      console.error(error);
      this.errorMessage = 'Não foi possível carregar as mensagens.';
    } finally {
      this.isLoading = false;
    }
  }


  // Carrega as conversas do utilizador.
  async loadConversations(): Promise<void> {
    if (!this.currentUser) {
      return;
    }

    // Contas as mensagens antes de carregar novas.
    const previousMessageCount = this.selectedConversation?.messages.length;

    this.conversations = await this.messagesService.getConversationsByUser(this.currentUser.id);

    // Mantem a conversa aberta durante a atualizacao automatica.
    // Ao entrar na pagina pela primeira vez, o id e lido do URL.
    const conversationId = this.selectedConversation?.id || Number(
      this.activatedRoute.snapshot.queryParamMap.get('conversationId')
    );

    if (!conversationId) {
      this.selectedConversation = undefined;
      return;
    }

    this.selectedConversation = this.conversations.find(
      conversation => conversation.id === conversationId
    );

    if (!this.selectedConversation) {
      return;
    }

    await this.markConversationAsRead(this.selectedConversation);

    // roda para o fim se existirem mensagens novas
    if (this.selectedConversation.messages.length !== previousMessageCount) {
      this.scrollToLastMessage();
    }
  }


  get filteredConversations(): Conversation[] {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      return this.conversations;
    }

    return this.conversations.filter(conversation => {
      const user = this.getOtherUser(conversation);
      const coin = this.getCoin(conversation);
      const lastMessage = this.getLastMessage(conversation);

      return (
        user?.name.toLowerCase().includes(search) ||
        coin?.name.toLowerCase().includes(search) ||
        lastMessage?.text.toLowerCase().includes(search)
      );
    });
  }


  async selectConversation(conversation: Conversation): Promise<void> {
    this.selectedConversation = conversation;

    // navega para a conversa
    await this.router.navigate(['/tabs/tab4'], {
      queryParams: { conversationId: conversation.id }
    });

    await this.markConversationAsRead(conversation);
    this.scrollToLastMessage();
  }

  async closeConversation(): Promise<void> {
    this.selectedConversation = undefined;
    this.newMessage = '';

    // Volta para a tab de mensagens
    await this.router.navigate(['/tabs/tab4']);
  }

  async sendMessage(): Promise<void> {
    const text = this.newMessage.trim();

    if (!text || !this.currentUser || !this.selectedConversation) {
      return;
    }

    await this.messagesService.insertMessage(
      this.selectedConversation.id,
      this.currentUser.id,
      text
    );

    this.newMessage = '';
    await this.loadConversations();
  }

  // Abre o formulario
  openReviewForm(): void {
    if (!this.selectedConversation) {
      return;
    }

    const review = this.getConversationReview(this.selectedConversation);
    this.reviewStars = review?.stars ?? 5;
    this.reviewComment = review?.comment ?? '';
    this.showReviewForm = true;
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
  }

  async submitReview(): Promise<void> {
    if (!this.currentUser || !this.selectedConversation || !this.reviewComment.trim()) {
      return;
    }

    const otherUser = this.getOtherUser(this.selectedConversation);

    if (!otherUser) {
      return;
    }

    const review = this.getConversationReview(this.selectedConversation);
    const comment = this.reviewComment.trim();

    if (review) {
      review.stars = this.reviewStars;
      review.comment = comment;
      await this.reviewsService.updateReview(review);
    } else {
      await this.reviewsService.insertReview({
        conversation_id: this.selectedConversation.id,
        reviewer_id: this.currentUser.id,
        reviewed_user_id: otherUser.id,
        stars: this.reviewStars,
        comment,
        created_at: new Date().toISOString(),
      });
    }

    this.showReviewForm = false;
    this.reviewComment = '';
    this.reviews = await this.reviewsService.getReviewsByReviewer(this.currentUser.id);
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

  getUnreadMessageCount(conversation: Conversation): number {
    const lastReadMessageId = this.readMessageIds[conversation.id] ?? 0;

    // Conta todas as mensagens recebidas desde a ultima mensagem lida. 
    return conversation.messages.filter(message =>
      message.sender_id !== this.currentUser?.id &&
      message.id > lastReadMessageId
    ).length;
  }

  isMyMessage(message: Message): boolean {
    return message.sender_id === this.currentUser?.id;
  }

  getConversationReview(conversation: Conversation): Review | undefined {
    return this.reviews.find(review =>
      review.conversation_id === conversation.id &&
      review.reviewer_id === this.currentUser?.id
    );
  }

  private async markConversationAsRead(conversation: Conversation): Promise<void> {
    const lastMessage = this.getLastMessage(conversation);

    if (!this.currentUser || !lastMessage) {
      return;
    }

    // O Ionic Storage guarda no dispositivo a ultima mensagem lida.
    this.readMessageIds = await this.chatStorageService.setLastReadMessageId(this.currentUser.id, conversation.id, lastMessage.id);
  }

  private scrollToLastMessage(): void {
    this.content?.scrollToBottom(250)
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();

    // Consulta novas mensagens de tres em tres segundos.
    this.refreshTimer = setInterval(() => {
      this.loadConversations().catch(error => {
        console.error(error);
        this.errorMessage = 'Não foi possível atualizar as mensagens.';
      });
    }, 3000);
  }

  private stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }
}
