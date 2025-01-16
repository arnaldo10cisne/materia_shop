import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { CharacterPortrait } from "./CharacterPortrait";
import { UserModel } from "../../utils/models";

describe("CharacterPortrait Component", () => {
  const mockCharacter: UserModel = {
    id: "1",
    name: "Cloud Strife",
    portrait: "cloud.png",
    email: "cloud@example.com",
  };

  test("renders 'No Character Selected' if character is null", () => {
    render(<CharacterPortrait character={null} />);

    expect(screen.getByText("No Character Selected")).toBeInTheDocument();
  });

  test("renders character portrait and no name when showName=false", () => {
    render(<CharacterPortrait character={mockCharacter} showName={false} />);

    expect(screen.queryByText("No Character Selected")).not.toBeInTheDocument();

    const portraitImage = screen.getByAltText(
      `${mockCharacter.name} portrait`,
    ) as HTMLImageElement;
    expect(portraitImage).toBeInTheDocument();
    expect(portraitImage.src).toContain(mockCharacter.portrait);

    expect(screen.queryByText(mockCharacter.name)).not.toBeInTheDocument();
  });

  test("renders character portrait and name when showName=true", () => {
    render(<CharacterPortrait character={mockCharacter} showName={true} />);

    const nameElement = screen.getByText(mockCharacter.name);
    expect(nameElement).toBeInTheDocument();

    const portraitImage = screen.getByAltText(
      `${mockCharacter.name} portrait`,
    ) as HTMLImageElement;
    expect(portraitImage).toBeInTheDocument();
    expect(portraitImage.src).toContain(mockCharacter.portrait);
  });
});
