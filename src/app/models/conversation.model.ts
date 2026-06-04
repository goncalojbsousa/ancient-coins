import { Message } from './message.model';

export type ConversationStatus = 'aberta' | 'aceite' | 'concluida';

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
