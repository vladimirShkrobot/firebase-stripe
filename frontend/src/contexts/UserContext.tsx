import { Auth, User as FirebaseUser, getAuth, signOut } from "firebase/auth";
import { FC, ReactNode, createContext, useContext } from "react";
import { useFirebaseAuthState } from "../hooks/useFirebaseAuthState";
import { useFirebaseAccessToken } from "../hooks/useFirebaseAccessToken";

interface UserContext {
  user: FirebaseUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  auth: Auth;
  userToken: string | null;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const auth = getAuth();
  const [user, isLoading] = useFirebaseAuthState(auth);
  const userToken = useFirebaseAccessToken(auth);

  const context: UserContext = {
    user,
    isLoading,
    signOut: async () => {
      await signOut(auth);
    },
    auth,
    userToken,
  };

  if (
    isLoading &&
    window.location.pathname !== "/sign-in" &&
    window.location.pathname !== "/sign-up"
  ) {
    return <div>Loading profile...</div>;
  }

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("no user context provided");
  }
  return context;
};
