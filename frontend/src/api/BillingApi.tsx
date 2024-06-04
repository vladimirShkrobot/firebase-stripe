import { IPaymentMethod } from "../models/IPaymentMethod";
import { IProduct } from "../models/IProduct";
import AbstractApi from "./AbstractApi";

export default class BillingApi extends AbstractApi {
  createPaymentIntent = (
    id: string,
    amount: string
  ): Promise<{ clientSecret: string }> => {
    return this.client.post(`/create-payment-intent`, {
      paymentMethodId: id,
      amount,
    });
  };

  createSetupIntent = (
    email: string
  ): Promise<{ clientSecret: string; customerId: string }> => {
    return this.client.post("/create-setup-intent", {
      email,
    });
  };

  savePaymentMethod = (
    customerId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean }> => {
    return this.client.post("/save-payment-method", {
      customerId,
      paymentMethodId,
    });
  };

  getPaymentMethods = (
    email: string
  ): Promise<{
    paymentMethods: IPaymentMethod[];
    defaultPaymentMethodId: string;
  }> => {
    return this.client.get("/get-payment-methods", { params: { email } });
  };

  getProducts = (email: string): Promise<IProduct[]> => {
    return this.client.get("/products", { params: { email } });
  };

  subscribe = (
    email: string,
    paymentMethodId: string,
    priceId: string
  ): Promise<{
    subscriptionId: string;
    customerId: string;
    paymentMethodId: string;
    status: string;
  }> => {
    return this.client.post("/subscribe", {
      email,
      paymentMethodId,
      priceId,
    });
  };
}
