import React, { useEffect, useState } from "react";
import { Container, FormGroup } from "reactstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Pengguna masuk
        setUser(authUser);
      } else {
        // Pengguna keluar
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <div className="profile-container">
        <h1 className="profile-title text-center">Profil Pengguna</h1>
        <div className="profile-content">
          <FormGroup>
            <label htmlFor="username">Username: </label>
            <p>Nanda Lemon</p>
          </FormGroup>
          <FormGroup>
            <label htmlFor="email">Email: </label>
            <p>
              {user
                ? user.email || "pengguna@example.com"
                : "pengguna@example.com"}
            </p>
          </FormGroup>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
