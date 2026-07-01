import { Modal, Button, Form, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import ErrorAlert from "./ErrorAlert";

function LoginModal({ show, onHide }) {
  const { login, register } = useAuth();
  const inputRef = useRef(null);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", address: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) inputRef.current?.focus();
  }, [show]);

  const resetForm = () => {
    setError("");
    setForm({ email: "", password: "", name: "", address: "" });
    setMode("login");
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result =
      mode === "register"
        ? await register(form.email, form.password, {
            name: form.name,
            address: form.address,
          })
        : await login(form.email, form.password);

    if (!result.success) {
      setError(result.error);
    } else {
      handleClose();
    }

    setIsSubmitting(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === "login" ? "Sign in" : "Create account"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ToggleButtonGroup type="radio" name="auth-mode" value={mode} onChange={setMode} className="mb-3">
          <ToggleButton id="login-mode" value="login" variant="outline-primary">
            Login
          </ToggleButton>
          <ToggleButton id="register-mode" value="register" variant="outline-primary">
            Register
          </ToggleButton>
        </ToggleButtonGroup>

        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <Form.Control ref={inputRef} type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Form.Control type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />

          {mode === "register" && (
            <>
              <Form.Control placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <Form.Control as="textarea" rows={3} placeholder="Shipping address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
            </>
          )}

          <div className="d-flex justify-content-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </Button>
          </div>
        </Form>

        {error && <ErrorAlert message={error} />}
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
