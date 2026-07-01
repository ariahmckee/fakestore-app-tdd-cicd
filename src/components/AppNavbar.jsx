import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/useAuth";
import LoginModal from "./LoginModal";

function AppNavbar() {
  const [expanded, setExpanded] = useState(false);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  const { user, profile, isAdmin, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleHomeClick = () => {
    setExpanded(false);
    window.dispatchEvent(new Event("reset-home"));
  };

  const handleCloseMenu = () => setExpanded(false);

  const handleLogout = async () => {
    await logout();
    handleCloseMenu();
  };

  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "Account";

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      fixed="top"
      className="bg-body"
    >
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" onClick={handleHomeClick}>
          FakeStore
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2 ms-auto d-lg-none">
          <Nav.Link as={Link} to="/cart" className="text-nowrap">
            Cart ({cartCount})
          </Nav.Link>

          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <Nav className="text-center ms-3">
            <Nav.Link as={Link} to="/" onClick={handleHomeClick}>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/products" onClick={handleCloseMenu}>
              Products
            </Nav.Link>

            {isAdmin && (
              <Nav.Link as={Link} to="/add-product" onClick={handleCloseMenu}>
                Add Product
              </Nav.Link>
            )}
          </Nav>

          <div className="d-none d-lg-flex align-items-center gap-3 ms-auto">
            <Nav.Link as={Link} to="/cart" className="text-nowrap">
              Cart ({cartCount})
            </Nav.Link>

            {!user ? (
              <Button size="sm" onClick={() => setShowModal(true)}>
                Login
              </Button>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="primary"
                  size="sm"
                  id="account-menu-toggle"
                  className="rounded"
                >
                  {displayName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile" onClick={handleCloseMenu}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders" onClick={handleCloseMenu}>
                    Order History
                  </Dropdown.Item>
                  {isAdmin && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/add-product" onClick={handleCloseMenu}>
                        Add Product
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          <div className="d-lg-none text-center mt-3">
            {!user ? (
              <Nav.Link
                onClick={() => {
                  setShowModal(true);
                  handleCloseMenu();
                }}
              >
                Login
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/profile" onClick={handleCloseMenu}>
                  Profile
                </Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/add-product" onClick={handleCloseMenu}>
                    Add Product
                  </Nav.Link>
                )}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </div>
        </Navbar.Collapse>

        <LoginModal show={showModal} onHide={() => setShowModal(false)} />
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
