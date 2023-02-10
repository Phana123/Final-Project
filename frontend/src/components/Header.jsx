import { Container } from "react-bootstrap";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <>
      <Container className="bg-secondary bg-gradient p-3">
        <NavBar />
      </Container>
    </>
  );
};

export default Header;
