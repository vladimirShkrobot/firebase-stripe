import { ICard } from "./ICard";

export interface IPaymentMethod {
  allow_redisplay: string;
  billing_details: { address: unknown; email: string; name: null; phone: null };
  card: ICard;
  created: number;
  customer: string;
  id: string;
  livemode: boolean;
  metadata: object;
  object: string;
  type: string;
}
