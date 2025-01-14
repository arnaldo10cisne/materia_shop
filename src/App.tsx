import React from "react";
import styles from "./App.module.scss";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout.tsx";
import { Homepage } from "./pages/Homepage/Homepage.tsx";
import { Products } from "./pages/Products/Products.tsx";
import { Order } from "./pages/Order/Order.tsx";
import { UserSelection } from "./pages/UserSelection/UserSelection.tsx";
import classNames from "classnames";
import { Summary } from "./pages/Summary/Summary.tsx";
import { Results } from "./pages/Results/Results.tsx";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/store.ts";

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
  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser,
  );

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
