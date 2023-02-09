import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./navbar.css";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

const NavBar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Valorant Israel</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link href="#features">Features</Nav.Link> */}
          </Nav>
          <Nav>
            <NavDropdown title="Account" id="collasible-nav-dropdown">
              {user && (
                <NavDropdown.Item>
                  <span>{user.email}</span>
                  <br />
                  <NavLink
                    onClick={handleLogout}
                    className="nav__dropdown"
                    to="/"
                  >
                    Logout
                  </NavLink>
                </NavDropdown.Item>
              )}
              {!user && (
                <>
                  <NavDropdown.Item>
                    <NavLink className="nav__dropdown" to="/login">
                      Login
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <NavLink className="nav__dropdown" to="/register">
                      Register
                    </NavLink>
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
