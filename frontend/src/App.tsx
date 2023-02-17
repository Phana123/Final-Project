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
import GatherAdd from "./components/gathers/GatherAdd";

function App() {
  const { isLoggedIn, isAdminState, isModerator } = useContext(AuthContext);
  return (
    <>
      <div
        style={{ backgroundColor: "rgb(251, 251, 251)" }}
        className="container-fluid"
      >
        <Container fluid className="w-100 text-center">
          <Header />
          <div className="app-container card bg-dark mt-1 p-4 ">
            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              {isLoggedIn && (isAdminState || isModerator) && (
                <Route path="/gather/create" element={<GatherAdd />} />
              )}
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
