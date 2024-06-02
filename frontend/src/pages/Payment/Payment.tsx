import { FC, FormEvent, useState } from "react";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useApi } from "../../contexts/ApiContext";

const Payment: FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const api = useApi();
  const [amount, setAmount] = useState("50");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      throw new Error("cant find payment element");
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      return console.error(error);
    }

    console.log(paymentMethod);
    // Отправьте paymentMethod.id на ваш сервер для завершения платежа
    const { clientSecret } = await api.billing.createPaymentIntent(
      paymentMethod.id,
      amount
    );

    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name",
          },
        },
      });

    if (confirmError) {
      console.error(confirmError);
      return;
    }

    console.log("Payment successful:", paymentIntent);
  };

  return (
    <CheckoutForm
      amount={amount}
      setAmount={setAmount}
      handleSubmit={handleSubmit}
    />
  );
};

export default Payment;
