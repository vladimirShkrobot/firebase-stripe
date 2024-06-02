import { Auth, onIdTokenChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const useFirebaseAccessToken = (auth: Auth) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (user) {
        const accessToken = await user.getIdToken();
        setAccessToken(accessToken);
      } else {
        setAccessToken(null);
      }
    });
  }, []);

  return accessToken;
};
