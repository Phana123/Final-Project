import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Button } from "react-bootstrap";
import { Container } from "react-bootstrap";

const NavBar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  return (
    <>
      <Container>
        <nav>
          <img src="./images/logo.png" className="navbar_img" alt="" />
        </nav>
        <nav>
          {""}

          <NavLink to="/">
            <Button variant="outline-light"> Home</Button>
          </NavLink>

          <NavLink to="/about">
            {" "}
            <Button variant="outline-light">About</Button>
          </NavLink>

          {!isLoggedIn && (
            <NavLink to="/register">
              {" "}
              <Button variant="outline-light">Register</Button>
            </NavLink>
          )}
          {!isLoggedIn && (
            <NavLink to="/login">
              {" "}
              <Button variant="outline-light">Login</Button>
            </NavLink>
          )}
          {isLoggedIn && (
            <Button onClick={logout} variant="outline-light">
              Logout
            </Button>
          )}
        </nav>
      </Container>
    </>
  );
};

export default NavBar;

// npm i bootstrap sass formik yup react-router-dom react-icons
// npm i react-modal sweetalert2 react-bootstrap react-toastify react-loader-spinner axios
