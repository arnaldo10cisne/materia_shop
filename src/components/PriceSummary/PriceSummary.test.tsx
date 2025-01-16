import React from "react";
import { render, screen } from "@testing-library/react";
import { PriceSummary } from "./PriceSummary";
import { CartItem, ProductModel, MateriaTypes } from "../../utils/models";

const sampleProduct1: ProductModel = {
  id: "p1",
  name: "Fire Materia",
  description: "Casts Fire spells",
  picture: "/images/fire.png",
  price: 100,
  stock_amount: 10,
  materia_type: MateriaTypes.MAGIC,
};

const sampleProduct2: ProductModel = {
  id: "p2",
  name: "Ice Materia",
  description: "Casts Ice spells",
  picture: "/images/ice.png",
  price: 200,
  stock_amount: 5,
  materia_type: MateriaTypes.MAGIC,
};

describe("PriceSummary Component", () => {
  test("renders without crashing and displays 'Price Summary' title", () => {
    render(
      <PriceSummary cart={[]} addCcFee={false} includeDeliveryFee={false} />,
    );

    expect(screen.getByText("Price Summary")).toBeInTheDocument();

    expect(screen.getByText("Shopping Cart:")).toBeInTheDocument();
    expect(screen.getByText("Order Total:")).toBeInTheDocument();
  });

  test("displays correct cart total when cart has items", () => {
    const cart: CartItem[] = [
      { product: sampleProduct1, amount: 3, total_price: 300 },
      { product: sampleProduct2, amount: 1, total_price: 200 },
    ];
    render(
      <PriceSummary cart={cart} addCcFee={false} includeDeliveryFee={false} />,
    );

    expect(screen.getAllByText("500 Gil")).toHaveLength(2);
  });

  test("does not show credit card fee row when addCcFee is false", () => {
    const cart: CartItem[] = [
      { product: sampleProduct1, amount: 1, total_price: 100 },
    ];
    render(
      <PriceSummary cart={cart} addCcFee={false} includeDeliveryFee={false} />,
    );

    expect(screen.getAllByText("100 Gil")).toHaveLength(2);

    const ccFeeLabel = screen.queryByText("Credit Card Fee:");
    expect(ccFeeLabel).toBeNull();
  });

  test("shows credit card fee row and correct fee calculation when addCcFee is true", () => {
    const cart: CartItem[] = [
      { product: sampleProduct1, amount: 1, total_price: 100 },
    ];
    render(
      <PriceSummary cart={cart} addCcFee={true} includeDeliveryFee={false} />,
    );

    expect(screen.getByText("100 Gil")).toBeInTheDocument();

    expect(screen.getByText("Credit Card Fee:")).toBeInTheDocument();

    expect(screen.getByText("14 Gil")).toBeInTheDocument();

    expect(screen.getByText("114 Gil")).toBeInTheDocument();
  });

  test("does not show delivery fee row when includeDeliveryFee is false", () => {
    const cart: CartItem[] = [
      { product: sampleProduct1, amount: 2, total_price: 200 },
    ];
    render(
      <PriceSummary cart={cart} addCcFee={false} includeDeliveryFee={false} />,
    );

    // Should not see 'Delivery Fee:' text
    const deliveryFeeLabel = screen.queryByText("Delivery Fee:");
    expect(deliveryFeeLabel).toBeNull();

    expect(screen.getAllByText("200 Gil")).toHaveLength(2);
  });

  test("shows delivery fee row and correct final total when includeDeliveryFee is true", () => {
    const cart: CartItem[] = [
      { product: sampleProduct1, amount: 2, total_price: 200 },
    ];
    render(
      <PriceSummary cart={cart} addCcFee={false} includeDeliveryFee={true} />,
    );

    expect(screen.getByText("200 Gil")).toBeInTheDocument();

    expect(screen.getByText("Delivery Fee:")).toBeInTheDocument();
    expect(screen.getByText("750 Gil")).toBeInTheDocument();

    expect(screen.getByText("950 Gil")).toBeInTheDocument();
  });

  test("displays correct final total with both credit card fee and delivery fee", () => {
    const cart: CartItem[] = [
      { product: sampleProduct1, amount: 3, total_price: 300 },
    ];
    render(
      <PriceSummary cart={cart} addCcFee={true} includeDeliveryFee={true} />,
    );

    expect(screen.getByText("300 Gil")).toBeInTheDocument();

    expect(screen.getByText("42 Gil")).toBeInTheDocument();

    expect(screen.getByText("750 Gil")).toBeInTheDocument();

    expect(screen.getByText("1092 Gil")).toBeInTheDocument();
  });
});
