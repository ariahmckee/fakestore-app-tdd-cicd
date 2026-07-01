import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { getProduct, updateProduct, deleteProduct } from "../services/api";
import DeleteModal from "../components/DeleteModal";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const result = await getProduct(id);
      if (result?.data) {
        setForm({
          title: result.data.title || "",
          price: result.data.price ? Number(result.data.price).toFixed(2) : "",
          description: result.data.description || "",
          category: result.data.category || "",
        });
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateProduct(id, form);
    navigate(`/products/${id}`);
  };

  const handleDelete = async () => {
    await deleteProduct(id);
    navigate("/products");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Product</h2>

      <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-3">
        <Form.Control name="title" value={form.title} onChange={handleChange} placeholder="Title" />

        <Form.Control name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" />

        <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={handleChange} placeholder="Description" />

        <Form.Control name="category" value={form.category} onChange={handleChange} placeholder="Category" />

        <div className="d-flex gap-2 mt-3">
          <Button type="submit">Save Changes</Button>

          <Button variant="secondary" onClick={() => navigate(`/products/${id}`)}>
            Cancel
          </Button>

          <Button variant="danger" onClick={() => setShowModal(true)}>
            Delete
          </Button>

          <DeleteModal show={showModal} onHide={() => setShowModal(false)} onConfirm={handleDelete} />
        </div>
      </Form>
    </div>
  );
}

export default EditProduct;
