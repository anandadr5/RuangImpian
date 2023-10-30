import React, { useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  // Menghapus item dari keranjang
  const handleRemoveFromCart = (productId) => {
    dispatch(cartActions.removeItem(productId));
  };

  // Menghitung total harga keranjang
  const calculateTotalPrice = () => {
    return cart.cartItems.reduce((total, product) => {
      return total + product.totalPrice;
    }, 0);
  };

  // Mengubah kuantitas produk dalam keranjang
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      dispatch(cartActions.updateQuantity({ productId, newQuantity }));
    }
  };

  return (
    <Helmet title="Cart">
      <CommonSection title="Shopping Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cart.cartItems.length === 0 ? (
                <h2 className="fs-4">Keranjang kosong!</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.cartItems.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img src={product.image} alt={product.productName} />
                        </td>
                        <td>{product.productName}</td>
                        <td>Rp {product.price}</td>
                        <td>
                          <div>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  product.quantity - 1
                                )
                              }
                            >
                              -
                            </button>
                            <span>{product.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  product.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>
                          {/* Menghapus item dari keranjang saat ikon di klik */}
                          <motion.i
                            whileTap={{ scale: 1.2 }}
                            onClick={() => handleRemoveFromCart(product.id)}
                            className="ri-delete-bin-line"
                          ></motion.i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
            <Col lg="3">
              <div>
                <h6 className="d-flex align-items-center justify-content-between">
                  Total
                </h6>
                <span className="fs-4 fw-bold">Rp {calculateTotalPrice()}</span>
              </div>
              <div>
                {/* Tombol untuk melanjutkan berbelanja */}
                <button className="buy__btn" style={{ cursor: "pointer" }}>
                  <Link to="/shop">Lanjut berbelanja</Link>
                </button>
              </div>
              <div>
                {/* Tombol untuk checkout */}
                <button className="buy__btn">
                  <Link to="/history">Checkout</Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Cart;
