import { useContext, useState } from "react";
import { Route, Routes, Router } from "react-router-dom";
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
import GatherDetails from "./components/gathers/GatherDetails";
import { GatherContext } from "./context/GatherContext";
import "./styles/app/app.css";
function App() {
  const { isLoggedIn, isAdminState, isModerator, isManager } =
    useContext(AuthContext);

  return (
    <>
      <div
        style={{ backgroundColor: "rgb(251, 251, 251)" }}
        className="container-fluid my_app"
      >
        <Container fluid className="w-100 text-center">
          <Header />
          <div className="app-container card bg-dark mt-1 p-4 ">
            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              {isLoggedIn && (isAdminState || isModerator || isManager) && (
                <Route path="/gather/create" element={<GatherAdd />} />
              )}
              {!isLoggedIn && <Route path="/login" element={<Login />} />}
              {!isLoggedIn && <Route path="/register" element={<Register />} />}

              {isLoggedIn && <Route path="/profile" element={<Profile />} />}
              <Route
                path="/gather/details/:gatherId"
                element={<GatherDetails />}
              />
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
