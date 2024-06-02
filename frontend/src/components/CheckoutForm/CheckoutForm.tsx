import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { FC, FormEvent } from "react";

interface CheckoutFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  amount: string;
  setAmount: (amount: string) => void;
}

const CheckoutForm: FC<CheckoutFormProps> = ({
  handleSubmit,
  setAmount,
  amount,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="amount"
        style={{ marginBottom: "20px" }}
        type="number"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
      <div>
        <CardNumberElement />
        <CardExpiryElement />
        <CardCvcElement />
      </div>
      <button type="submit">Оплатить</button>
    </form>
  );
};

export default CheckoutForm;
