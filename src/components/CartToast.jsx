import { Toast, ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setShowToast } from "../store/cartSlice";

function CartToast() {
  const dispatch = useDispatch();
  const showToast = useSelector((state) => state.cart.showToast);

  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast
        show={showToast}
        onClose={() => dispatch(setShowToast(false))}
        delay={2000}
        autohide
      >
        <Toast.Body>Added to cart 🛒</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default CartToast;
