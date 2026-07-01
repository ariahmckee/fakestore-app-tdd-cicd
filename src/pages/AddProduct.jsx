import { useState } from "react";
import { addProduct } from "../services/api";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addProduct(form);
    navigate("/products");
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <Form.Control name="title" onChange={handleChange} placeholder="Title" />
      <Form.Control name="price" type="number" onChange={handleChange} placeholder="Price" />
      <Form.Control name="description" as="textarea" rows={4} onChange={handleChange} placeholder="Description" />
      <Form.Control name="category" onChange={handleChange} placeholder="Category" />
      <Button type="submit">Add Product</Button>
    </Form>
  );
}

export default AddProduct;