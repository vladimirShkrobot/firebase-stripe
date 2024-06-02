import { createUserWithEmailAndPassword } from "firebase/auth";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
import { useUser } from "../../contexts/UserContext";

const SignUp: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    try {
      setError("");
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
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
        handleSubmit={handleSignUp}
        buttonText="sign up"
        isLoading={isLoading}
        error={error}
        setError={setError}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default SignUp;
