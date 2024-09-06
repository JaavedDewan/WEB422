import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { Card, Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavBar from './navbar'; // Adjust the path as necessary
import { Helmet } from 'react-helmet';

function Login({ darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      window.location.href = "/MainPage";
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("A password reset link has been sent to your email", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.code);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    
    <>
      <Helmet>
        <title>News4You - Login</title> {/* Set the page title */}
      </Helmet>
      <NavBar darkMode={darkMode} />
      <Container className={`d-flex justify-content-center align-items-center min-vh-100 ${darkMode ? 'dark-mode' : ''}`}>
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <h3 className="text-center">Login</h3>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Submit
              </Button>
              <Row className="mt-3 d-flex justify-content-between">
                <Col className="text-left">
                  <p className="forgot-password">
                    <strong>New user?</strong> <Link to="/register">Register Here</Link>
                  </p>
                </Col>
              </Row>
              <Link to="/ForgotPassword">Forgot Password?</Link>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Login;
