import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "../components/ProductCard";
import Cart from "../pages/Cart";
import { renderWithProviders } from "./testUtils";

vi.mock("../context/useAuth", () => ({
  useAuth: () => ({
    user: null,
    profile: null,
  }),
}));

const product = {
  id: 12,
  title: "Trail Jacket",
  price: 89.99,
  description: "A lightweight jacket for cool weather.",
  category: "outerwear",
  image: "https://example.com/jacket.jpg",
  rating: {
    rate: 4.8,
    count: 86,
  },
};

describe("cart integration", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("updates the cart UI when a product is added", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <ProductCard product={product} />
        <Cart />
      </>,
    );

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(screen.getAllByText(product.title)).toHaveLength(2);
    expect(screen.getByText("Total Products: 1")).toBeInTheDocument();
    expect(screen.getByText("Total: $89.99")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Checkout" })).toBeInTheDocument();
  });
});
