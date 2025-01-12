import React from "react";
import styles from "./App.module.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout.tsx";
import { Homepage } from "./pages/Homepage/Homepage.tsx";
import { Products } from "./pages/Products/Products.tsx";
import { Order } from "./pages/Order/Order.tsx";
import { UserSelection } from "./pages/UserSelection/UserSelection.tsx";
import classNames from "classnames";

// Create a client
const queryClient = new QueryClient();

export function App() {
  return (
    <div className={classNames(styles.App)}>
      app1
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/users" element={<UserSelection />} />
              <Route path="/products" element={<Products />} />
              <Route path="/order" element={<Order />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}
