import React, { useState, useEffect } from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";

const NavBar = props => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserId(null);  
    navigate("/");  
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));

       
        if (decodedToken && decodedToken.id) {
          setUserId(decodedToken.id);
        }
      } catch (err) {
        console.error("Errore nella decodifica del token", err);
      }
    }
  }, []);  
  
  const isLoginOrRegisterPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/home">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <div className="d-flex gap-2">
          <Button
            as={Link}
            to="/new"
            className="blog-navbar-add-button bg-dark"
            size="lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
            </svg>
            Nuovo Articolo
          </Button>

          {userId && !isLoginOrRegisterPage && (
            <Button
              as={Link}
              to={`/authors/me`}
              className="blog-navbar-add-button bg-black"
              size="lg"
            >
              {isLoading ? "Caricamento..." : "Il mio profilo"}
            </Button>
          )}

          
          {isLoginOrRegisterPage && !userId && (
            <Button
              className="blog-navbar-add-button bg-primary"
              size="lg"
            >
              Benvenuto
            </Button>
          )}

         
          {userId && !isLoginOrRegisterPage && (
            <Button
              className="blog-navbar-add-button bg-danger"
              size="lg"
              onClick={handleLogout}
            >
              ESCI
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
