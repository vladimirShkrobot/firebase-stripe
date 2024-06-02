import { AuthProvider, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

interface AuthFormProps {
  buttonText: string;
  isLoading: boolean;
  error: string;
  handleSubmit: (email: string, password: string) => void;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const AuthForm: FC<AuthFormProps> = ({
  buttonText,
  isLoading,
  error,
  handleSubmit,
  setError,
  setIsLoading,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { auth } = useUser();

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });

  const signInWithProvider = async (provider: AuthProvider) => {
    try {
      setError("");
      setIsLoading(true);
      await signInWithPopup(auth, provider);
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
      <div>
        <input
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="email"
        />
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="password"
        />
        <button onClick={() => handleSubmit(email, password)}>
          {buttonText}
        </button>
        <button onClick={() => signInWithProvider(googleProvider)}>
          sign in with google
        </button>
      </div>
      <div style={{ color: "red" }}>{error}</div>
      {isLoading && <div>...</div>}
    </div>
  );
};

export default AuthForm;
