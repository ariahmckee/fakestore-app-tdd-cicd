import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import ProductImage from "./ProductImage";
import RatingStars from "./RatingStars";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const rating = product.rating?.rate ?? "N/A";

  return (
    <Card className="h-100 shadow-sm product-card">
      <ProductImage
        src={product.image} // fakestoreapi.com version
        alt={product.title}
        className="p-3"
        style={{ height: "200px", objectFit: "contain" }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.title}</Card.Title>

        <p className="product-category">{product.category}</p>
        <p className="fw-semibold mb-2">${product.price.toFixed(2)}</p>
        <RatingStars rating={rating} />
        <Card.Text className="product-description">
          {product.description}
        </Card.Text>

        {/* flex-grow pushes button down */}
        <div className="mt-auto">
          <Button
            className="m-1"
            as={Link}
            to={`/products/${product.id}`}
            variant="primary"
          >
            View
          </Button>
          <Button className="m-1" onClick={() => dispatch(addToCart(product))}>
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
