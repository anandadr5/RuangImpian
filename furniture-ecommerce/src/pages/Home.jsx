import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Helmet from "../components/Helmet/Helmet";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import heroImg from "../assets/images/hero-img.png";
import Services from "../services/Services";
import Clock from "../components/UI/Clock";
import counterImg from "../assets/images/counter-timer-img.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import useAuth from "../custom-hooks/useAuth";

const Home = () => {
  const year = new Date().getFullYear(); // Mendapatkan tahun saat ini
  const [topProducts, setTopProducts] = useState([]); // State untuk produk-produk dengan rating tertinggi
  const [recommendedProducts, setRecommendedProducts] = useState([]); // State untuk produk-produk yang direkomendasikan

  const dispatch = useDispatch(); // Membaca dispatcher Redux
  const navigate = useNavigate(); // Fungsi navigate dari react-router-dom

  // Menggunakan currentUser dari hook useAuth
  const { currentUser } = useAuth();

  // Status login pengguna
  const userIsLoggedIn = currentUser !== null;

  // Fungsi untuk mengacak urutan elemen dalam array
  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  useEffect(() => {
    const apiUrl = "https://65288efb931d71583df24b01.mockapi.io/trending";

    // Mengambil data produk dari API
    axios
      .get(apiUrl)
      .then((response) => {
        const sortedProducts = response.data.sort(
          (a, b) => b.avgRating - a.avgRating
        );

        const top3Products = sortedProducts.slice(0, 3);
        setTopProducts(top3Products);

        // Mengacak produk untuk "Direkomendasikan Untuk Anda"
        const shuffledProducts = shuffleArray(response.data);
        const random3Products = shuffledProducts.slice(0, 3); // Memilih 3 produk secara acak
        setRecommendedProducts(random3Products);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // Menambahkan produk ke keranjang
  const handleAddToCart = (product) => {
    if (!userIsLoggedIn) {
      // Jika pengguna belum login, tambahkan produk ke keranjang
      navigate("/login");
    } else {
      // Jika pengguna sudah login, tambahkan produk ke keranjang
      dispatch(cartActions.addItem(product)); // Menambahkan produk ke keranjang Redux
      toast.success(`${product.productName} ditambahkan ke keranjang.`);
    }
  };

  return (
    <Helmet title={"Home"}>
      <ToastContainer />
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <p className="hero__subtitle">Trending product in {year}</p>
                <h2>Beautify Your Home With Quality Furniture</h2>
                <p>
                  Transform your interior into a more minimalist and modern
                  space. With our furniture collection, you can create a
                  cleaner, more organized and up-to-date living environment.
                  Explore our products and make your interior simpler and more
                  contemporary.
                </p>

                <motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
                  <Link to="/shop">SHOP NOW</Link>
                </motion.button>
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="hero__img">
                <img src={heroImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Services />

      <section className="best__sales">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">BEST SALES</h2>
            </Col>
          </Row>
          <Row>
            {topProducts.map((product) => (
              <Col key={product.id} lg="4">
                <div className="product-card ">
                  <motion.img
                    whileTap={{ scale: 1.2 }}
                    src={product.imgUrl}
                    alt={product.productName}
                    onClick={() => navigate(`/shop/${product.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <h3>{product.productName}</h3>
                  <p>{product.shortDesc}</p>
                  <span>Rp {product.price}</span>
                  <p>
                    <i className="ri-star-fill"></i>
                    {product.avgRating}
                  </p>
                  <i
                    className="ri-add-circle-line"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleAddToCart(product)}
                  ></i>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="timer__count">
        <Container>
          <Row>
            <Col
              lg="6"
              md="12"
              className="count__down-col text-center"
              style={{ color: "black" }}
            >
              <div className="clock__top-content">
                <h4 className="fs-6 mb-2">Limited Offer</h4>
              </div>
              <Clock />
              <motion.button
                whileTap={{ scale: 1.2 }}
                className="buy__btn store__btn"
              >
                <Link to="/shop">Visit Store</Link>
              </motion.button>
            </Col>
            <Col lg="6" md="12" className="text-end counter__img">
              <img src={counterImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="new__arrivals">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">Recommended For You</h2>
            </Col>
          </Row>
          <Row>
            {recommendedProducts.map((product) => (
              <Col key={product.id} lg="4">
                <div className="product-card">
                  <motion.img
                    whileTap={{ scale: 1.2 }}
                    src={product.imgUrl}
                    alt={product.productName}
                    onClick={() => navigate(`/shop/${product.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <h3>{product.productName}</h3>
                  <p>{product.shortDesc}</p>
                  <span>Rp {product.price}</span>
                  <p>
                    <i className="ri-star-fill"></i>
                    {product.avgRating}
                  </p>
                  <i
                    className="ri-add-circle-line"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleAddToCart(product)}
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

export default Home;
