export interface ICard {
  brand: string;
  checks: {
    address_line1_check: null;
    address_postal_code_check: null;
    cvc_check: string;
  };
  country: string;
  display_brand: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  generated_from: null;
  last4: string;
  networks: { available: unknown[]; preferred: null };
  three_d_secure_usage: { supported: boolean };
  wallet: null;
}
