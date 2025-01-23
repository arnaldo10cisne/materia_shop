import "./Layout.module.scss";
import { Header } from "../header/Header";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className="navbarContainer">
        <Header />
      </div>
      {children}
    </div>
  );
};
