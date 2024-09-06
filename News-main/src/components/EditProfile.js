import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { db, storage } from './firebase'; // Make sure to import storage
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary functions for file uploads
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "../bootstrap.min.css";
import NavBar from './navbar';
import { Helmet } from 'react-helmet';

const EditProfile = () => {
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', photo: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const { currentUser } = useAuth();
  const [darkMode] = useState(false); // Ensure this state is managed correctly
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'Users', currentUser.uid));
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
          } else {
            console.warn('User document does not exist');
          }
        } else {
          console.warn('No current user found');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        let photoURL = profileData.photo;
        if (selectedFile) {
          const storageRef = ref(storage, `profile_images/${currentUser.uid}/${selectedFile.name}`);
          await uploadBytes(storageRef, selectedFile);
          photoURL = await getDownloadURL(storageRef);
        }

        const userRef = doc(db, 'Users', currentUser.uid);
        await updateDoc(userRef, { ...profileData, photo: photoURL });
        toast.success('Profile updated successfully!', { position: 'top-center' });
        navigate('/profile'); // Redirect to profile page after update
      } else {
        console.warn('No current user found for updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile', { position: 'bottom-center' });
    }
  };

  return (
    <>
      <Helmet>
        <title>NewsTop3 - Edit Profile</title> {/* Set the page title */}
      </Helmet>
      <NavBar darkMode={darkMode} />
      <Container className={`mt-5 ${darkMode ? 'dark-mode' : ''}`}>
        <h3 className={`text-${darkMode ? 'light' : 'dark'}`}>Edit Profile</h3>
        <Form onSubmit={handleProfileUpdate}>
          <Form.Group as={Row} className="mb-3" controlId="formFirstName">
            <Form.Label column sm="2">First Name</Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formLastName">
            <Form.Label column sm="2">Last Name</Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formEmail">
            <Form.Label column sm="2">Email</Form.Label>
            <Col sm="10">
              <Form.Control
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                disabled // Email should be non-editable in most cases
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPhoto">
            <Form.Label column sm="2">Profile Photo</Form.Label>
            <Col sm="10">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Col>
          </Form.Group>
          <Row className="mt-3 justify-content-center">
            <Col xs="auto" className="mx-2">
              <Button type="submit" variant="primary">
                Update Profile
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default EditProfile;
