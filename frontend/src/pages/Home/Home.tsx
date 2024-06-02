import { FC } from "react";
import { useUser } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import withProtectedRoute from "../../HOCs/withProtectedRoute";

const Home: FC = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in");
  };

  return (
    <div>
      <h1>Homa Page</h1>
      <button onClick={handleSignOut}>log out from {user?.email}</button>
      <div style={{ display: 'flex', justifyContent: "space-around" }}>
        <Link to={"/payment"}>Payment</Link>
        <Link to={"/payment-with-save"}>Payment with save</Link>
      </div>
    </div>
  );
};

export default withProtectedRoute(Home);
