import { render, screen } from "@testing-library/react";
import RatingStars from "./RatingStars";

describe("RatingStars", () => {
  it("renders the numeric rating with an accessible label", () => {
    render(<RatingStars rating={4.3} />);

    expect(screen.getByLabelText("Rating: 4.3 out of 5")).toBeInTheDocument();
    expect(screen.getByText("4.3")).toBeInTheDocument();
  });

  it("renders unavailable text when the rating is not numeric", () => {
    render(<RatingStars rating="N/A" />);

    expect(screen.getByText("Rating unavailable")).toBeInTheDocument();
  });
});
