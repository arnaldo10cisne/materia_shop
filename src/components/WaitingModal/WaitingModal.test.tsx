import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { WaitingModal } from "./WaitingModal";
import { CHOCOBO_WALTZ } from "../../utils/constants";

jest.mock("../../utils/constants", () => ({
  CHOCOBO_WAITING: "mock-chocobo-waiting.png",
  CHOCOBO_WALTZ: {
    play: jest.fn(),
    pause: jest.fn(),
    currentTime: 0,
    volume: 1,
  },
}));

describe("WaitingModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the correct text", () => {
    render(<WaitingModal />);

    expect(
      screen.getByText("Your payment is being processed."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Our chocobos can hardly contain their excitement as they prepare/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the chocobo waiting image with the correct src", () => {
    render(<WaitingModal />);
    const chocoboImg = screen.getByAltText(
      "chocobo_waiting",
    ) as HTMLImageElement;
    expect(chocoboImg).toBeInTheDocument();
    expect(chocoboImg.src).toContain("mock-chocobo-waiting.png");
  });

  it("plays the chocobo waltz on mount and pauses/resets it on unmount", () => {
    const { unmount } = render(<WaitingModal />);

    expect(CHOCOBO_WALTZ.volume).toBe(0.2);
    expect(CHOCOBO_WALTZ.play).toHaveBeenCalledTimes(1);

    unmount();
    expect(CHOCOBO_WALTZ.pause).toHaveBeenCalledTimes(1);
    expect(CHOCOBO_WALTZ.currentTime).toBe(0);
  });

  it("catches and logs errors if play fails", () => {
    (CHOCOBO_WALTZ.play as jest.Mock).mockRejectedValueOnce(
      new Error("Test play error"),
    );
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(<WaitingModal />);

    expect(CHOCOBO_WALTZ.play).toHaveBeenCalledTimes(1);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error playing chocoboWaltz song:",
          expect.any(Error),
        );
        consoleErrorSpy.mockRestore();
        resolve();
      }, 0);
    });
  });
});
