import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import "../bootstrap.min.css";

export function NavBar({ darkMode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileImage(userData.photo || "");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error, if necessary
    }
  };

  const handleBrandClick = () => {
    navigate('/MainPage');
  };

  return (
    <Navbar className={`navbar ${darkMode ? 'navbar-dark' : 'navbar-light'}`} expand="lg">
      <Container fluid className="d-flex align-items-center justify-content-between">
        <Navbar.Brand onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          <img 
            src='https://img.icons8.com/?size=100&id=44030&format=png&color=000000'
            alt="News Home Icon" 
            width="60" 
            height="54"
            title="Main Page"
            style={{ cursor: 'pointer' }} 
          />
        </Navbar.Brand>
        <h1 className={`navbar-header ${darkMode ? 'text-white' : 'text-dark'}`} style={{ fontSize: '1.5rem' }}>
        News4You
        </h1>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
          {location.pathname !== '/Home' && (
                  <LinkContainer to="/Home">
                    <Nav.Link className={`d-flex align-items-center ${darkMode ? 'text-white' : 'text-dark'}`}>
                      <img 
                        src={"https://img.icons8.com/?size=100&id=ndJssbHAnr7w&format=png&color=000000"}
                        alt="About" 
                        width="50" 
                        height="50"
                        title="About"
                        style={{ cursor: 'pointer' }}
                      />
                    </Nav.Link>
                  </LinkContainer>
                )}
            {!isLoggedIn ? (
              <>
                {location.pathname !== '/login' && (
                  <LinkContainer to="/login">
                    <Nav.Link className={`d-flex align-items-center ${darkMode ? 'text-white' : 'text-dark'}`}>
                      <img 
                        src="https://img.icons8.com/?size=100&id=48303&format=png&color=000000" 
                        alt="Login" 
                        width="50" 
                        height="50"
                        title="Login"
                        style={{ cursor: 'pointer' }}
                      />
                    </Nav.Link>
                  </LinkContainer>
                )}
                {location.pathname !== '/register' && (
                  <LinkContainer to="/register">
                    <Nav.Link className={`d-flex align-items-center ${darkMode ? 'text-white' : 'text-dark'}`}>
                      <img 
                        src="https://img.icons8.com/?size=100&id=zUTztu-cLYTs&format=png&color=000000" 
                        alt="Register" 
                        width="50" 
                        height="50"
                        title="Register"
                        style={{ cursor: 'pointer' }}
                      />
                    </Nav.Link>
                  </LinkContainer>
                )}
              </>
            ) : (
              <>
                {location.pathname !== '/profile' && (
                  <LinkContainer to="/profile">
                    <Nav.Link className={`d-flex align-items-center ${darkMode ? 'text-white' : 'text-dark'}`}>
                      <img 
                        src={profileImage || "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"}
                        alt="Profile" 
                        width="50" 
                        height="50"
                        title="Your Profile"
                        style={{ cursor: 'pointer' }}
                      />
                    </Nav.Link>
                  </LinkContainer>
                )}
                <LinkContainer to="/" onClick={handleLogout}>
                  <Nav.Link className={`d-flex align-items-center ${darkMode ? 'text-white' : 'text-dark'}`}>
                    <img 
                      src="https://img.icons8.com/?size=100&id=44001&format=png&color=000000" 
                      alt="Logout" 
                      width="50" 
                      height="50" 
                      title="Logout"
                      style={{ cursor: 'pointer' }}
                    />
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
