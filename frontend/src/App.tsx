import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import AuthContext from "./context/AuthContext";
import About from "./routes/About";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Header from "./components/Header";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import Profile from "./routes/Profile";

function App() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <>
      <div
        style={{ backgroundColor: "rgb(251, 251, 251)" }}
        className="container-fluid"
      >
        <Container className="w-100 text-center">
          <Header />
          <div className="container bg-secondary mt-1 p-4 text-white">
            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              {!isLoggedIn && <Route path="/login" element={<Login />} />}
              {!isLoggedIn && <Route path="/register" element={<Register />} />}

              {isLoggedIn && <Route path="/profile" element={<Profile />} />}
            </Routes>
            {/* Routes */}
          </div>
          <Footer />
        </Container>
      </div>
    </>
  );
}

export default App;
