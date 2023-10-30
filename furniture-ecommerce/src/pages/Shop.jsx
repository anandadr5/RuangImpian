import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { cartActions } from "../redux/slices/cartSlice";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";
import swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import useAuth from "../custom-hooks/useAuth";

import "../styles/shop.css";

const Shop = () => {
  const [trendingData, setTrendingData] = useState([]); // State untuk menyimpan data produk API
  const [filteredProducts, setFilteredProducts] = useState([]); // State untuk menampilkan produk setelah difilter
  const [selectedCategory, setSelectedCategory] = useState("all"); // State untuk kategori produk
  const [sortOrder, setSortOrder] = useState("all"); // State untuk mengurutkan harga produk ascending descending
  const [searchText, setSearchText] = useState(""); // State untuk pencarian productName

  const dispatch = useDispatch();

  // Menggunakan currentUser dari hook useAuth
  const { currentUser } = useAuth();

  // Status login pengguna
  const userIsLoggedIn = currentUser !== null;

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

  const navigate = useNavigate(); // Menggunakan useNavigate dari react-router-dom untuk navigasi halaman

  // Mengambil data produk saat komponen dimuat
  useEffect(() => {
    axios
      .get("https://65288efb931d71583df24b01.mockapi.io/trending")
      .then((response) => {
        setTrendingData(response.data);
        setFilteredProducts(response.data); // Mengisi data produk ke filter produk
      })
      .catch((error) => {
        console.error("error fetching data:", error);
      });
  }, []);

  // Mengatur ulang daftar produk yang ditampilkan berdasarkan kategori yang dipilih
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(trendingData); // Menampilkan semua produk kategori "all" dipilih
    } else {
      const filtered = trendingData.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, trendingData]);

  // Mengatur ulang daftar produk yang ditampilkan berdasarkan urutan ascending descending
  useEffect(() => {
    const sortedProducts = [...filteredProducts];
    sortedProducts.sort((a, b) => {
      if (sortOrder === "all") {
        return a.price - b.price; // Mengurutkan produk berdasarkan harga terendah
      } else {
        return b.price - a.price; // Mengurutkan produk berdasarkan harga tertinggi
      }
    });
    setFilteredProducts(sortedProducts);
  }, [sortOrder]);

  // Mengubah pilihan kategori yang digunakan untuk memfilter produk
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Mengubah urutan produk ascending descending
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Mengubah state pencarian saat input teks pencarian berubah
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Menampilkan produk berdasarkan kata kunci pencarian
  const handleSearchIconClick = () => {
    const filteredBySearch = trendingData.filter((product) =>
      product.productName.toLowerCase().includes(searchText.toLowerCase())
    );

    if (filteredBySearch.length === 0) {
      swal.fire("Produk tidak ditemukan"); // Menampilkan swal jika produk tidak ditemukan
    } else {
      setFilteredProducts(filteredBySearch);
    }
  };

  // Menampilkan semua produk
  const showAllProducts = () => {
    setSelectedCategory("all");
    setSortOrder("all");
    setSearchText("");
    setFilteredProducts(trendingData);
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Products" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="3">
              <div className="filter__widget">
                <select
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <option>Filter By Category</option>
                  <option value="chair">Armchairs</option>
                  <option value="sofa">Modern Sofa</option>
                  <option value="bed">Bed Frame</option>
                  <option value="chests">Chests</option>
                </select>
                <button onClick={showAllProducts}>Show All Products</button>
              </div>
            </Col>
            <Col lg="3" md="3">
              <div className="filter__widget">
                <select onChange={handleSortChange} value={sortOrder}>
                  <option>Sort By</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={handleSearch}
                />
                <span onClick={handleSearchIconClick}>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            {filteredProducts.map((product) => (
              <Col lg="4" md="6" key={product.id}>
                <div className="product__item">
                  <motion.img
                    whileTap={{ scale: 1.2 }}
                    src={product.imgUrl}
                    alt={product.productName}
                    onClick={() => navigate(`/shop/${product.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <h4>{product.productName}</h4>
                  <p>{product.shortDesc}</p>
                  <span>Rp {product.price}</span>
                  <p>
                    <i className="ri-star-fill"></i>
                    {product.avgRating}
                  </p>
                  <i
                    className="ri-add-circle-line"
                    onClick={() => handleAddToCart(product)}
                    style={{ cursor: "pointer" }}
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

export default Shop;
