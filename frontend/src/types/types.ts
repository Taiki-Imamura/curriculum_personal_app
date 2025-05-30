import type { SelectChangeEvent } from '@mui/material';

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
  is_payer: boolean;
};

export interface Payment {
  id: string;
  group_id: string;
  title: string;
  amount: number;
  date: string;
  created_by: string;
  payers: Payer[];
  payees: Payee[];
  participants: Participant[];
  paid_at: string;
  paypay_links: LinkItem[];
}

export interface Payer {
  user_id: string;
  amount: number;
}

export interface Payee {
  user_id: string;
  amount: number;
}

export type LinkItem = {
  paypay_link: string;
  display_on_list: boolean;
};

export type Debt = {
  from: string;
  to: string;
  amount: number;
};

export type { SelectChangeEvent };
