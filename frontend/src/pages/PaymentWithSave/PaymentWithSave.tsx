import { FC, FormEvent, useState } from "react";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useApi } from "../../contexts/ApiContext";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const PaymentWithSave: FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUser();
  const api = useApi();
  const [amount, setAmount] = useState("50");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !user?.email) {
      return;
    }

    const { clientSecret, customerId } = await api.billing.createSetupIntent(
      user.email
    );

    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement)!,
        billing_details: {
          email: user.email,
        },
      },
    });

    if (error) {
      console.error(error);
      return;
    }

    console.log("Setup successful:", setupIntent);

    await api.billing.savePaymentMethod(
      customerId,
      setupIntent.payment_method as string
    );

    navigate("/");
  };

  return (
    <CheckoutForm
      amount={amount}
      setAmount={setAmount}
      handleSubmit={handleSubmit}
    />
  );
};

export default PaymentWithSave;
