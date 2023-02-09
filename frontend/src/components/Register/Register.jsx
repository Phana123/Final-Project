import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useSignUp } from "../../hooks/useSignUp";

const Register = () => {
  const [userNameInput, setUserNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rememberInput, setRememberInput] = useState(false);
  const { signup, error, isLoading } = useSignUp();

  const navigate = useNavigate();

  useEffect(() => {}, []);
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    await signup(userNameInput, emailInput, passwordInput);
  };

  // const url = `http://localhost:3001/api/auth/signup`;
  // await fetch(url, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     username: userNameInput,
  //     email: emailInput,
  //     password: passwordInput,
  //   }),
  // })
  //   .then((res) => {
  //     if (res.ok) {
  //       toast.success(
  //         `Account ${userNameInput} created successfully, please log in!`,
  //         {
  //           position: toast.POSITION.TOP_RIGHT,
  //         }
  //       );
  //       setTimeout(() => {
  //         navigate("/login");
  //       }, 3500);
  //     } else {
  //       throw new Error(
  //         `One or tow of the fields not match the requirements`
  //       );
  //     }
  //   })
  //   .catch((error) => {
  //     toast.error(error.message, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   });

  return (
    <>
      <Form
        onSubmit={onSubmitHandler}
        className="card p-4 mt-2 card text-center"
      >
        <h1 className="display-2 mb-5 p-2">Register</h1>
        <Form.Group className="card mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUserNameInput(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="card mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
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
          <Form.Check
            type="checkbox"
            className="h4"
            label="Remember Me !"
            onChange={(e) => setRememberInput(!rememberInput)}
          />
        </Form.Group>
        <Button type="submit" disabled={isLoading} variant="primary">
          Submit
        </Button>
        {error && <div className="error"> {error} </div>}
        <NavLink style={{ textDecoration: "none", color: "white" }} to="/login">
          <Button className="w-50 mt-2" variant="success">
            Login
          </Button>
        </NavLink>
      </Form>
      <ToastContainer />
    </>
  );
};

export default Register;
