import { Auth, User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const useFirebaseAuthState = (auth: Auth): [User | null, boolean] => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setIsLoading(false);
      setUser(user);
    });
  }, []);

  return [user, isLoading];
};
