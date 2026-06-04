export type CoinCondition = 'Excelente' | 'Muito Bom' | 'Bom' | 'Regular';

export type ConversationStatus = 'aberta' | 'aceite' | 'concluida';

export interface User {
  id: number;
  auth_id: string;
  name: string;
  email: string;
  location: string;
  rating: number;
  total_reviews: number;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  location: string;
}

export interface Coin {
  id: number;
  owner_id: number;
  name: string;
  origin: string;
  year: string;
  material: string;
  condition: CoinCondition;
  description: string;
  photos: string[];
  available_for_sale: boolean;
  available_for_trade: boolean;
  price?: number | null;
  trade_preference?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  text: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  coin_id: number;
  buyer_id: number;
  seller_id: number;
  status: ConversationStatus;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  conversation_id: number;
  reviewer_id: number;
  reviewed_user_id: number;
  stars: number;
  comment: string;
  created_at: string;
}

