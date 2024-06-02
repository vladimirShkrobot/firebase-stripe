import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import Payment from "../pages/Payment/Payment";
import PaymentWithSave from "../pages/PaymentWithSave/PaymentWithSave";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/payment-with-save",
    element: <PaymentWithSave />,
  },
]);
