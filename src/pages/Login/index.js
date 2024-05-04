import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Modal,
  Row,
  Form,
  Alert,
} from "react-bootstrap";
import { supabase } from "../../utils/supabase";
import { useNavigate, useNavigation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onActionClick = () => {
    navigate("/signUp");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: dataUser, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (dataUser.user) {
        window.location.href = '/reservations'
      }
      if (error) {
        console.log(error);
        setError("Invalid login credentials");
      }
    } catch (error) {
      // console.log(error)
    }
  };

  return (
    <div className="login">
      {error && (
        <Alert variant="danger" onClose={() => setError(false)} dismissible>
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail" className="mb-4">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>
        <div style={{ width: "100%" }}>
          <Button variant="primary" type="submit" style={{ margin: "5px" }}>
            Sign In
          </Button>
          <Button
            variant="primary"
            type="submit"
            style={{ margin: "5px" }}
            onClick={() => onActionClick()}
          >
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
