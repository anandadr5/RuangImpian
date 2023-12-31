import React from "react";
import "../styles/history.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";

const History = () => {
  const cart = useSelector((state) => state.cart);

  return (
    <Helmet title="History">
      <CommonSection title="Purchase History" />
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cart.checkoutHistory.length === 0 ? (
                <h2 className="fs-4">No purchase history yet!</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Qty</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.checkoutHistory.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img src={product.image} alt={product.productName} />
                        </td>
                        <td>{product.productName}</td>
                        <td>Rp {product.price}</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
            <Col lg="3">
              <div>
                <h6 className="d-flex align-items-center justify-content-between">
                  Total Price
                </h6>
                <span className="fs-4 fw-bold">
                  Rp{" "}
                  {cart.checkoutHistory.reduce((total, product) => {
                    return total + product.totalPrice;
                  }, 0)}
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default History;
