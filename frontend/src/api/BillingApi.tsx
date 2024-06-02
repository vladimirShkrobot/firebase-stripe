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
}
