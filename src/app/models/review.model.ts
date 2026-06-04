export interface Review {
  id: number;
  conversation_id: number;
  reviewer_id: number;
  reviewed_user_id: number;
  stars: number;
  comment: string;
  created_at: string;
}
