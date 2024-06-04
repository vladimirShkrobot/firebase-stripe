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
import { useFetching } from "../../hooks/useFetching";

const Subscription: FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUser();
  const api = useApi();
  const [amount, setAmount] = useState("50");
  const { data: products } = useFetching(() =>
    api.billing.getProducts(user?.email!)
  );
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !user?.email) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)!,
      billing_details: { email: user.email },
    });

    if (error) {
      console.error(error);
      return;
    }

		console.log(paymentMethod.id)
    const response = await api.billing.subscribe(
      user.email,
      paymentMethod.id,
      products![0].prices![0].id
    );

    navigate("/");
  };
  return (
    <div>
      <div style={{ marginBottom: "50px" }}>
        {products?.map((product) => (
          <div
            key={product.id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              style={{ height: "50px", width: "50px" }}
              src={product.images[0]}
            />
            <div>
              <div>
                <span>{product.name}</span>
                {" | "}
                <span>{product.description}</span>
              </div>
              <span>
                {(product.prices[0].unit_amount / 100).toFixed(2)}{" "}
                {product.prices[0].currency}
              </span>
            </div>
          </div>
        ))}
      </div>
      <CheckoutForm
        amount={amount}
        setAmount={setAmount}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Subscription;
