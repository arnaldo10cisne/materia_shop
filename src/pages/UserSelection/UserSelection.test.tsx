import React from "react";
import { render } from "../../utils/test-utils/custom-render.tsx";
import { UserSelection } from "./UserSelection.tsx";

describe("UserSelection", () => {
  test("renders UserSelection component without crashing", () => {
    render(<UserSelection />);
  });
});
