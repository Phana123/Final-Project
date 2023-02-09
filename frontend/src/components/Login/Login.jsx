import React, { useState } from "react";
import { Button, Form, Toast } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const [userNameInput, setUserNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();
  const { login, error, isLoading } = useLogin();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    await login(userNameInput, passwordInput);

    //   await fetch(url, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       username: userNameInput,
    //       password: passwordInput,
    //     }),
    //   })
    //     .then((res) => {
    //       if (res.ok) {
    //         toast.success(`${userNameInput}, You logged in successfully!`, {
    //           position: toast.POSITION.TOP_RIGHT,
    //         });
    //         setTimeout(() => {
    //           navigate("/");
    //         }, 3500);
    //       } else {
    //         throw new Error(`Invalid username or password`);
    //       }
    //     })
    //     .catch((error) => {
    //       toast.error(error.message);
    //     });
  };
  return (
    <>
      <Form
        onSubmit={onSubmitHandler}
        className="card p-4 mt-2 card text-center"
      >
        <h1 className="display-2 mb-5 p-2">Login</h1>
        <Form.Group className="card mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUserNameInput(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="card mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPasswordInput(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" className="h4" label="Remember Me !" />
        </Form.Group>
        <Button
          type="submit"
          disabled={isLoading}
          className=""
          variant="primary"
        >
          Submit
        </Button>
        {error && <div className="error">{error}</div>}
        <NavLink
          style={{ textDecoration: "none", color: "white" }}
          to="/register"
        >
          <Button className="w-50 mt-2" variant="success">
            Register
          </Button>
        </NavLink>
      </Form>
      <ToastContainer />
    </>
  );
};

export default Login;
