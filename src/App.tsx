import { useEffect } from "react";
import styles from "./App.module.scss";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Homepage } from "./pages/Homepage/Homepage";
import { Products } from "./pages/Products/Products";
import { Order } from "./pages/Order/Order";
import { UserSelection } from "./pages/UserSelection/UserSelection";
import classNames from "classnames";
import { Summary } from "./pages/Summary/Summary";
import { Results } from "./pages/Results/Results";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { setUser } from "./store/userReducer";
import { addOrUpdateCartItem } from "./store/cartReducer";
import { setCreditCard } from "./store/creditCardReducer";

interface ProtectedRouteProps {
  condition: boolean;
  redirectTo: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  condition,
  redirectTo,
  children,
}) => {
  return condition ? children : <Navigate to={redirectTo} replace />;
};

export function App() {
  const dispatch = useDispatch();
  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser,
  );

  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch(setUser(JSON.parse(localStorage.getItem("user") as string)));
    }
    if (localStorage.getItem("cart")) {
      JSON.parse(localStorage.getItem("cart") as string).forEach((cartItem) => {
        dispatch(addOrUpdateCartItem(cartItem));
      });
    }
    if (localStorage.getItem("creditCard")) {
      dispatch(
        setCreditCard(JSON.parse(localStorage.getItem("creditCard") as string)),
      );
    }
  }, [dispatch]);

  return (
    <div className={classNames(styles.App)}>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/users" element={<UserSelection />} />

          <Route
            path="/products"
            element={
              <ProtectedRoute condition={selectedUser != null} redirectTo="/">
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute condition={selectedUser != null} redirectTo="/">
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute condition={selectedUser != null} redirectTo="/">
                <Summary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute condition={selectedUser != null} redirectTo="/">
                <Results />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </div>
  );
}
