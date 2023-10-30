import React, { useState, useEffect } from "react";

import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "../custom-hooks/useAuth";

const ProductDetails = () => {
  const [tab, setTab] = useState("desc"); // State untuk mengelola tab desc dan reviews
  const { id } = useParams(); // State untuk mendapatkan parameter ID dari URL
  const [product, setProduct] = useState(null); // State untuk data produk
  const [reviews, setReviews] = useState([]); // State untuk data ulasan produk
  const [relatedProduct, setRelatedProduct] = useState([]); // State untuk produk related

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Menggunakan currentUser dari hook useAuth
  const { currentUser } = useAuth();

  // Status login pengguna
  const userIsLoggedIn = currentUser !== null;

  // Mengambil data produk dari API
  useEffect(() => {
    axios
      .get(`https://65288efb931d71583df24b01.mockapi.io/trending/${id}`)
      .then((response) => {
        setProduct(response.data);
        if (response.data.reviews) {
          setReviews(response.data.reviews);
        }
      })
      .catch((error) => {
        console.error("error fetching product:", error);
      });

    // Mengambil data produk related dari API
    axios
      .get("https://65288efb931d71583df24b01.mockapi.io/trending")
      .then((response) => {
        setRelatedProduct(response.data);
      })
      .catch((error) => {
        console.error("error fetching related products:", error);
      });
  }, [id]);

  if (!product) {
    return null;
  }

  // Fungsi untuk menambahkan produk ke keranjang
  const handleAddToCart = (product) => {
    if (!userIsLoggedIn) {
      // Jika pengguna belum login, arahkan ke halaman login.
      navigate("/login");
    } else {
      // Jika pengguna sudah login, tambahkan produk ke keranjang.
      dispatch(cartActions.addItem(product));
      toast.success(`${product.productName} ditambahkan ke keranjang.`);
    }
  };

  return (
    <Helmet title={product.productName}>
      <CommonSection />

      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <img src={product.imgUrl} alt={product.productName} />
            </Col>

            <Col lg="6">
              <div className="product__details">
                <h2>{product.productName}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    <span>
                      <i className="ri-star-fill"></i>
                      {product.avgRating}
                    </span>
                  </div>
                </div>
                <span className="product__price">Rp {product.price}</span>
                <p className="mt-3">{product.shortDesc}</p>

                <motion.button
                  whileTap={{ scale: 1.2 }}
                  className="buy__btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Reviews ({product.reviews.length})
                </h6>
              </div>
              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p>{product.description}</p>
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrapper">
                    <ul>
                      {reviews.map((item, index) => (
                        <li key={index} className="mb-4">
                          <h6>{item.user}</h6>
                          <span>{item.rating ? item.rating : "N/A"}</span>
                          <p>{item.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Col>

            <Col lg="12" className="mt-5 mb-5">
              <h1 className="related__title text-center">
                KAMU MUNGKIN JUGA SUKA
              </h1>
            </Col>
          </Row>
          <Row>
            {relatedProduct
              .filter((relatedProduct) => relatedProduct.id !== id)
              .slice(0, 6)
              .map((relatedProduct) => (
                <Col lg="4" key={relatedProduct.id}>
                  <div className="related__products">
                    <motion.img
                      whileTap={{ scale: 1.2 }}
                      src={relatedProduct.imgUrl}
                      alt={relatedProduct.productName}
                      onClick={() => navigate(`/shop/${relatedProduct.id}`)}
                      style={{ cursor: "pointer" }}
                    />
                    <h6>{relatedProduct.productName}</h6>
                    <span>Rp {relatedProduct.price}</span>
                    <p>
                      <i className="ri-star-fill"></i>
                      {product.avgRating}
                    </p>
                    <i
                      className="ri-add-circle-line"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAddToCart(relatedProduct)}
                    ></i>
                  </div>
                </Col>
              ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
