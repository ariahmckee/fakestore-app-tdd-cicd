import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "./ProductCard";
import { renderWithProviders } from "../test/testUtils";

const product = {
  id: 7,
  title: "Canvas Backpack",
  price: 42.5,
  description: "A sturdy daily backpack with plenty of room.",
  category: "bags",
  image: "https://example.com/backpack.jpg",
  rating: {
    rate: 4.6,
    count: 120,
  },
};

describe("ProductCard", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the product details and actions", () => {
    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText("bags")).toBeInTheDocument();
    expect(screen.getByText("$42.50")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View" })).toHaveAttribute(
      "href",
      "/products/7",
    );
    expect(screen.getByRole("button", { name: "Add to Cart" })).toBeInTheDocument();
  });

  it("adds the product to cart state when Add to Cart is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ProductCard product={product} />);

    await user.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(store.getState().cart.items).toEqual([
      expect.objectContaining({
        id: product.id,
        title: product.title,
        quantity: 1,
      }),
    ]);
    expect(store.getState().cart.showToast).toBe(true);
  });
});
