import { Col, Container, Row } from "react-bootstrap";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { SiTiktok } from "react-icons/si";

const Footer = () => {
  return (
    <>
      <Container>
        <Row className="bg-dark text-white p-2 mt-1">
          <Col className="text-center">
            <h3>Contact Info</h3>
            <p>Link1</p>
            <p>Link2</p>
            <p>Link3</p>
          </Col>
          <Col className="text-center">
            <h3>Useful Links</h3>
            <p>Link1</p>
            <p>Link2</p>
            <p>Link3</p>
          </Col>
          <Col className="text-center">
            <h3>Social Media</h3>
            <p>
              <FaFacebook size="23" />
            </p>
            <p>
              <BsInstagram size="23" />
            </p>
            <p>
              <SiTiktok size="23" />
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Footer;
