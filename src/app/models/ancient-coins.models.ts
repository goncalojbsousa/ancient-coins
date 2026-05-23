export type CoinCondition = 'Excelente' | 'Muito Bom' | 'Bom' | 'Regular';

export type ConversationStatus = 'aberta' | 'aceite' | 'concluida';

export interface User {
  id: number;
  name: string;
  location: string;
  rating: number;
  totalReviews: number;
}

export interface Coin {
  id: number;
  ownerId: number;
  name: string;
  origin: string;
  year: string;
  material: string;
  condition: CoinCondition;
  description: string;
  photos: string[];
  availableForSale: boolean;
  availableForTrade: boolean;
  price?: number;
  tradePreference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: number;
  coinId: number;
  buyerId: number;
  sellerId: number;
  status: ConversationStatus;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  conversationId: number;
  reviewerId: number;
  reviewedUserId: number;
  stars: number;
  comment: string;
  createdAt: string;
}

export interface AncientCoinsSeedData {
  users: User[];
  coins: Coin[];
  conversations: Conversation[];
  reviews: Review[];
}
