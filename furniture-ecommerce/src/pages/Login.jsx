import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.config";
import { toast } from "react-toastify";

import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState(""); // State untuk menyimpan alamat email pengguna
  const [password, setPassword] = useState(""); // State untuk menyimpan kata sandir pengguna
  const [loading, setLoading] = useState(false); // State untuk mengelola status loading saat proses loading

  const navigate = useNavigate();

  // Fungsi untuk menangani tindakan login
  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Melakukan proses login dengan Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      setLoading(false);

      // Menampilkan pesan sukses dan mengarahkan pengguna ke halaman home
      toast.success("Login berhasil!");
      navigate("/home");
    } catch (error) {
      setLoading(false);

      // Menampilkan pesan kesalahan jika login gagal
      toast.error(error.message);
    }
  };

  return (
    <Helmet title="Login">
      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading...</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Login</h3>

                <Form className="auth__form" onSubmit={signIn}>
                  <FormGroup className="form__group">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>

                  <button type="submit" className="buy__btn auth__btn">
                    Login
                  </button>
                  <p>
                    Belum punya akun? <Link to="/signup">Daftar</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
