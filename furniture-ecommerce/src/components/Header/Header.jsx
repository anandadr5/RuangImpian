import React, { useRef, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/header.css";
import { motion } from "framer-motion";
import logo from "../../assets/images/ri-logo.png";
import userIcon from "../../assets/images/user-icon.png";
import { Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import "firebase/auth";
import { auth } from "../../pages/firebase.config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";

const nav__links = [
  {
    path: "home",
    display: "Home",
  },
  {
    path: "shop",
    display: "Shop",
  },
  {
    path: "cart",
    display: "Cart",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const stickyHeaderFunc = () => {
    if (headerRef.current) {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", stickyHeaderFunc);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
    });

    return () => {
      window.removeEventListener("scroll", stickyHeaderFunc);
      unsubscribe();
    };
  }, []);

  const menuToggle = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle("active__menu");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout berhasil");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <header className="header" ref={headerRef}>
      <div></div>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={logo} alt="logo" />
              <div>
                <h1>RuangImpian</h1>
              </div>
            </div>

            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__icons">
              {userLoggedIn ? (
                // Tampilkan tombol "Logout" jika pengguna sudah login
                <div
                  className="logout"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <span>Logout</span>
                </div>
              ) : (
                // Tampilkan tombol "Login" dan "Signup" jika pengguna belum login
                <>
                  <div
                    className="login"
                    onClick={handleLogin}
                    style={{ cursor: "pointer" }}
                  >
                    <span>Login</span>
                  </div>
                  <div
                    className="signup"
                    onClick={handleSignup}
                    style={{ cursor: "pointer" }}
                  >
                    <span>Signup</span>
                  </div>
                </>
              )}
              <NavLink to="/cart">
                <span className="cart__icon">
                  <i className="ri-shopping-cart-line"></i>
                  <span className="badge">{totalQuantity}</span>
                </span>
              </NavLink>

              <div className="profile">
                <motion.img whileTap={{ scale: 1.2 }} src={userIcon} alt="" />
              </div>

              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
