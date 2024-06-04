import { FC, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import withProtectedRoute from "../../HOCs/withProtectedRoute";
import { useFetching } from "../../hooks/useFetching";
import { useApi } from "../../contexts/ApiContext";

const Home: FC = () => {
  const { user, signOut } = useUser();
  const api = useApi();
  const navigate = useNavigate();
  const { data, loading } = useFetching(() =>
    api.billing.getPaymentMethods(user!.email!)
  );

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in");
  };

  return (
    <div>
      <h1>Homa Page</h1>
      <button onClick={handleSignOut}>log out from {user?.email}</button>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Link to={"/subscription"}>Subscription</Link>
        <Link to={"/payment"}>Payment</Link>
        <Link to={"/payment-with-save"}>Payment with save</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data?.paymentMethods.map(({ card, id }) => (
            <li
              style={{
                border: "1px solid black",
                borderRadius: "15px",
                marginTop: "5px",
                marginBottom: "5px",
              }}
              key={id}
            >
              **** **** **** {card.last4} {card.display_brand}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default withProtectedRoute(Home);
