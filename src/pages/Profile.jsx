import { useEffect, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useAuth } from "../context/useAuth";

function Profile() {
  const { user, profile, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: "", address: "" });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: profile?.name || "",
        address: profile?.address || "",
      });
    }
  }, [user, profile]);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const result = await updateUserProfile({
      name: form.name,
      address: form.address,
    });

    setMessage(result.success ? "Profile updated successfully." : result.error || "Unable to update profile.");
    setIsSaving(false);
  };

  if (!user) {
    return <Alert variant="info">Please sign in to manage your profile.</Alert>;
  }

  return (
    <div className="mx-auto" style={{ maxWidth: "760px" }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-1">My Profile</h2>
          <p className="text-muted">Update your contact details and shipping address.</p>

          {message && <Alert variant={message.includes("success") ? "success" : "danger"}>{message}</Alert>}

          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control value={user.email || ""} disabled />
            </Form.Group>

            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="Add your name" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control as="textarea" rows={4} name="address" value={form.address} onChange={handleChange} placeholder="Add your address" />
            </Form.Group>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;
