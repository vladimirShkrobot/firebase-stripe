import { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default (WrappedComponent: ComponentType) => {
  const HocComponent = ({ ...props }) => {
    const { user } = useUser();
    const location = useLocation();

    if (!user) {
      return <Navigate replace to={"/sign-in"} state={{ from: location }} />;
    }

    return <WrappedComponent {...props} />;
  };

  return HocComponent;
};
