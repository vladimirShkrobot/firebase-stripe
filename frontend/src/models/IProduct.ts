import { IPrice } from "./IPrice";

export interface IProduct {
  active: boolean;
  attributes: string[];
  created: number;
  default_price: string;
  description: string;
  id: string;
  images: string[];
  livemode: boolean;
  metadata: Record<string, string>;
  name: string;
  object: string;
  package_dimensions: null;
  prices: IPrice[];
  shippable: null;
  statement_descriptor: string | null;
  tax_code: string | null;
  type: string;
  unit_label: string | null;
  updated: number;
  url: string | null;
}
