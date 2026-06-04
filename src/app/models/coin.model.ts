export type CoinCondition = 'Excelente' | 'Muito Bom' | 'Bom' | 'Regular';

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
