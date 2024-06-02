import { signInWithEmailAndPassword } from "firebase/auth";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
import { useUser } from "../../contexts/UserContext";

const SignIn: FC = () => {
  const navigate = useNavigate();
  const { auth } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError("");
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message as string;
      setIsLoading(false);
      setError(errorMessage);
      console.log(errorCode, errorMessage);
    }
  };

  return (
    <div>
      <h1>Sign in</h1>
      <AuthForm
        handleSubmit={handleSignIn}
        buttonText="sign in"
        isLoading={isLoading}
        error={error}
        setError={setError}
        setIsLoading={setIsLoading}
      />
      <button onClick={() => navigate("/sign-up")}>don't hava account yet?</button>
    </div>
  );
};

export default SignIn;
