import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Form, Button, Alert, Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from './navbar';

const ForgotPassword = ({darkMode}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A password reset email has been sent to your email address.');
      setError('');
    } catch (error) {
      setError(error.message);
      setMessage('');
    }
  };

  return (
    <>
    <NavBar darkMode={darkMode} />
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center">Forgot Password</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handlePasswordReset}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Row className="mt-3">
              <Col className="d-flex justify-content-center">
                <Button variant="primary" type="submit" className="w-100 me-2">
                  Send Verification Email
                </Button>
                <Link to="/login">
                  <Button variant="secondary" className="w-100">
                    Back to Login
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
};

export default ForgotPassword;
