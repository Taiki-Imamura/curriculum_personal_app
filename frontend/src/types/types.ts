export type User = {
  id: number;
  name: string;
};

export type Participant = {
  user_id: number;
  user_name: string;
  share_amount: number;
  share_rate: number;
  paid_amount: number;
};

export type Payment = {
  id: number;
  title: string;
  amount: number;
  paid_at: string;
  payer_name: string;
  participants: Participant[];
};

export type Debt = {
  from: string;
  to: string;
  amount: number;
};
