import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Col, Form, Row } from "react-bootstrap";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
} from "../services/api";
import ErrorAlert from "./ErrorAlert";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";

function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const isShowingAllProducts = selectedCategory === "all";

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data;
    },
  });

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      const response =
        isShowingAllProducts
          ? await getProducts()
          : await getProductsByCategory(selectedCategory);

      return response.data;
    },
  });

  if (categoriesLoading || productsLoading) return <LoadingSpinner />;

  if (categoriesError || productsError) {
    return <ErrorAlert message="Failed to load products. Please try again." />;
  }

  return (
    <section className="catalog-section text-start">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">Shop the Collection</h2>
          <p className="catalog-subtitle mb-0">
            {isShowingAllProducts
              ? `Browse ${products.length} products across ${categories.length} categories.`
              : `Browse ${products.length} products.`}
          </p>
        </div>

        <Form.Group className="category-select">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All products</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      <Row className="g-4 mb-4">
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default ProductCatalog;
