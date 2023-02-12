import { Container } from "react-bootstrap";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <>
      <Container fluid className="card bg-dark bg-gradient p-3">
        <NavBar />
      </Container>
    </>
  );
};

export default Header;
