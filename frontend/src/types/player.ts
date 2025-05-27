export interface PlayerDTO {
  id: number;
  name: string;
  hand: string[];
  is_dealer: boolean;
  is_busted: boolean;
  is_turn: boolean;
  has_blackjack: boolean;
  balance: number;
  current_bet: number;
  has_placed_bet: boolean;
  hand_value: number;
}
