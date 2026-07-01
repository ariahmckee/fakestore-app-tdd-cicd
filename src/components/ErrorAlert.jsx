import { Alert } from "react-bootstrap";

function ErrorAlert({ message }) {
  return <Alert variant="danger">{message}</Alert>;
}

export default ErrorAlert;