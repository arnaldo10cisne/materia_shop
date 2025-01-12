import React from "react";
import "./Layout.module.scss";
import { Header } from "../header/Header.tsx";
import { BlueBox } from "../BlueBox/BlueBox.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className="navbarContainer">
        <Header />
      </div>
      <BlueBox>{children}</BlueBox>
      {/* <div className="pageContainer">{children}</div> */}
    </div>
  );
};
