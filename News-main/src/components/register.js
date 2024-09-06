import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db, storage } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Card, Container, Form, Button } from "react-bootstrap";
import NavBar from './navbar';
import { Helmet } from 'react-helmet';

function Register({ darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        let photoURL = "";
        if (image) {
          const storageRef = ref(storage, `profileImages/${user.uid}`);
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progress function (optional)
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.error("Image upload failed:", error);
              toast.error("Image upload failed!", { position: "bottom-center" });
            },
            async () => {
              try {
                photoURL = await getDownloadURL(uploadTask.snapshot.ref);
                await setDoc(doc(db, "Users", user.uid), {
                  email: user.email,
                  firstName: fname,
                  lastName: lname,
                  photo: photoURL
                });
                toast.success("User Registered Successfully!", { position: "top-center" });
              } catch (error) {
                console.error("Error getting download URL or setting document:", error);
                toast.error("Failed to register user!", { position: "bottom-center" });
              }
            }
          );
        } else {
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName: fname,
            lastName: lname,
            photo: photoURL
          });
          toast.success("User Registered Successfully!", { position: "top-center" });
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'];
    if (file && validImageTypes.includes(file.type)) {
      setImage(file);
      setImageError("");
    } else {
      setImage(null);
      setImageError("Please select a valid image file (jpeg, png, jpg, gif, bmp, webp).");
    }
  };

  return (
    <>
      <Helmet>
        <title>News4You - Register</title>
      </Helmet>
      <NavBar darkMode={darkMode} />
      <ToastContainer />
      <Container className={`d-flex justify-content-center align-items-center min-vh-100 ${darkMode ? 'dark-mode' : ''}`}>
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <Form onSubmit={handleRegister}>
              <h3 className="text-center">Sign Up</h3>

              <Form.Group className="mb-3">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  onChange={(e) => setFname(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  onChange={(e) => setLname(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Profile Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                />
                {imageError && <p className="text-danger">{imageError}</p>}
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Sign Up
              </Button>
              <p className="forgot-password text-right mt-3">
                Already registered <a href="/login">Login</a>
              </p>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Register;
