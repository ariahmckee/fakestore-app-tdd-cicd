import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/api";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/useAuth";
import { addToCart } from "../store/cartSlice";
import ProductImage from "../components/ProductImage";

function ProductDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const result = await getProduct(id);
      setProduct(result.data);
    };

    loadProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <p className="d-flex">
        <span className="badge bg-secondary">{product.category}</span>
      </p>
      <h2 className="mb-3">{product.title}</h2>

      <ProductImage
        src={product.image}
        alt={product.title}
        style={{ height: "300px", objectFit: "contain" }}
      />

      <p className="mt-3">{product.description}</p>
      <p>
        <strong>${Number(product.price).toFixed(2)}</strong>
      </p>

      <div className="d-flex gap-2 mb-3">
        <Button onClick={() => dispatch(addToCart(product))}>Add to Cart</Button>

        {isAdmin && <Button onClick={() => navigate(`/edit-product/${id}`)}>Edit</Button>}
      </div>
    </div>
  );
}

export default ProductDetails;
