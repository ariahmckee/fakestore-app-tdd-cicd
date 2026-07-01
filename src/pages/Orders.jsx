import { useEffect, useState } from "react";
import { Alert, Badge, Card, ListGroup } from "react-bootstrap";
import { useAuth } from "../context/useAuth";
import { getOrdersByUser } from "../services/api";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const result = await getOrdersByUser(user.uid);
      setOrders(result.data || []);
      setLoading(false);
    };

    loadOrders();
  }, [user?.uid]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Pending";

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString();
    }

    return new Date(timestamp).toLocaleString();
  };

  if (!user) {
    return <Alert variant="info">Please sign in to view your order history.</Alert>;
  }

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  return (
    <div className="mx-auto" style={{ maxWidth: "860px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Order History</h2>
          <p className="text-muted mb-0">A record of your recent purchases.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Alert variant="light" className="border">You have not placed any orders yet.</Alert>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                <div>
                  <h5 className="mb-1">Order #{order.id.slice(0, 8)}</h5>
                  <p className="text-muted mb-0">{formatDate(order.createdAt)}</p>
                </div>
                <Badge bg="success" className="text-capitalize">
                  {order.status || "placed"}
                </Badge>
              </div>

              <div className="d-flex flex-wrap gap-3 text-muted small mb-3">
                <span>{(order.items || []).length} item(s)</span>
                <span>Total: ${Number(order.total || 0).toFixed(2)}</span>
              </div>

              <ListGroup variant="flush">
                {(order.items || []).map((item) => (
                  <ListGroup.Item key={`${order.id}-${item.id}`} className="px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{item.title}</span>
                      <span className="text-muted">× {item.quantity}</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default Orders;
