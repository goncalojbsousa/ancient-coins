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
