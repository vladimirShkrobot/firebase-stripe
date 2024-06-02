import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { UserProvider } from "./contexts/UserContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ApiProvider } from "./contexts/ApiContext";
import "./firebase";

function App() {
  const stripePromise = loadStripe(
    import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

  return (
    <UserProvider>
      <ApiProvider>
        <Elements stripe={stripePromise}>
          <RouterProvider router={router} />
        </Elements>
      </ApiProvider>
    </UserProvider>
  );
}

export default App;
