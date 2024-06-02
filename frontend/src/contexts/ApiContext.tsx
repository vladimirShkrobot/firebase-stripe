import { ReactNode, createContext, useContext } from "react";
import { useUser } from "./UserContext";
import BillingApi from "../api/BillingApi";

interface ApiContext {
  billing: BillingApi;
}

const ApiContext = createContext<ApiContext | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { userToken } = useUser();
  const context: ApiContext = {
    billing: new BillingApi(userToken),
  };

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("no api context provided");
  }
  return context;
};
