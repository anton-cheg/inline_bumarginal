export interface UserPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface UserEntity {
  user_id: number;
  first_name: string;
  last_name?: string;
  duel_rate: number;
  total_answers: number;
  correct_answers: number;
}
