import { Homepage } from "./Homepage";
import { render } from "../../utils/test-utils/custom-render";
import { screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userReducer from "../../store/userReducer";
import { RootState } from "../../store/store";

describe("Homepage", () => {
  const renderWithStore = (initialState: any) => {
    const store = configureStore<Partial<RootState>>({
      reducer: { user: userReducer },
      preloadedState: initialState,
    });

    return render(
      <Provider store={store}>
        <Homepage />
      </Provider>,
    );
  };

  test("renders Homepage component without crashing", () => {
    render(<Homepage />);
  });

  test("BUY MATERIA button is enabled if a character is selected", () => {
    renderWithStore({ user: { selectedUser: { name: "Cloud Strife" } } });
    expect(screen.getByText("Cloud Strife")).toBeInTheDocument();
    const buyMateriaButton = screen.getByText("Buy Materia");
    expect(buyMateriaButton).toBeEnabled();
  });

  test("BUY MATERIA button is disabled if no character is selected", () => {
    renderWithStore({ user: { selectedUser: null } });
    const buyMateriaButton = screen.getByText("Buy Materia");
    expect(buyMateriaButton).toHaveClass("OptionTextDisabled");
  });
});
