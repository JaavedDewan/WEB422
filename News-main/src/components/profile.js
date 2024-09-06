import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, query, collection, getDocs, deleteDoc, writeBatch, updateDoc } from 'firebase/firestore';
import { Container, Table, Button, Row, Col, Card, Pagination, ToggleButton } from 'react-bootstrap';
import { toast } from 'react-toastify';
import "../bootstrap.min.css";
import NavBar from './navbar';
import { Helmet } from 'react-helmet';
import { useAuth } from './AuthProvider';

const Profile = () => {
  const [articleHistory, setArticleHistory] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [userData, setUserData] = useState({ firstName: '', lastName: '' });
  const [darkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFavoritePage, setCurrentFavoritePage] = useState(1); // New state for favorite pagination
  const [articlesPerPage] = useState(5);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    
    if (!currentUser) {
      navigate('/login');  // Redirect to login if the user is not signed in
      return;
    }
    const fetchArticleHistory = async () => {
      try {
        if (currentUser) {
          const q = query(collection(db, 'Users', currentUser.uid, 'articleHistory'));
          const querySnapshot = await getDocs(q);
          const history = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate
              ? data.timestamp.toDate()
              : new Date(data.timestamp);
              history.push({ ...data, id: doc.id, timestamp, favorite: data.favorite || false });
          });
          console.log('Fetched article history:', history);
          setArticleHistory(history);
        } else {
          setArticleHistory([]);
        }
      } catch (error) {
        console.error('Error fetching article history:', error);
        toast.error('Error fetching article history', { position: 'bottom-center' });
      }
    };

    const fetchUserProfile = async () => {
      try {
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || ''
            });
            setProfileImage(userData.photo || "");
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchArticleHistory();
    fetchUserProfile();
  }, [currentUser]);

  const filteredArticles = articleHistory;
  const favoriteArticles = articleHistory.filter(article => article.favorite);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const indexOfLastFavorite = currentFavoritePage * articlesPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - articlesPerPage;
  const currentFavoriteArticles = favoriteArticles.slice(indexOfFirstFavorite, indexOfLastFavorite);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateFavorite = (pageNumber) => setCurrentFavoritePage(pageNumber); // New pagination handler for favorites

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const totalFavoritePages = Math.ceil(favoriteArticles.length / articlesPerPage); // Total pages for favorites

  const handleDeleteArticleHistory = async (id) => {
    try {
      if (currentUser) {
        const docRef = doc(db, 'Users', currentUser.uid, 'articleHistory', id);
        await deleteDoc(docRef);
        setArticleHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
        toast.success('Article history item deleted successfully!', { position: 'top-center' });
      } else {
        toast.warn('No current user found for deletion', { position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Error deleting article history item:', error);
      toast.error('Error deleting article history item', { position: 'bottom-center' });
    }
  };

  const handleClearArticleHistory = async () => {
    try {
      if (currentUser) {
        const batch = writeBatch(db);
        const q = query(collection(db, 'Users', currentUser.uid, 'articleHistory'));
        const querySnapshot = await getDocs(q);
  
        // Collect all document references to delete, excluding favorites
        const docsToDelete = querySnapshot.docs
          .filter(doc => !doc.data().favorite)
          .map(doc => doc.ref);
  
        // Perform the batch delete operation
        docsToDelete.forEach(docRef => batch.delete(docRef));
        await batch.commit();
  
        // Update the local state to keep only the favorite articles
        setArticleHistory(prevHistory => {
          // Filter out only the favorites, which were already in the state
          const remainingFavorites = prevHistory.filter(item => item.favorite);
          return remainingFavorites;
        });
  
        toast.success('Article history cleared, favorites preserved!', { position: 'top-center' });
      } else {
        toast.warn('No current user found for clearing history', { position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Error clearing article history:', error);
      toast.error('Error clearing article history', { position: 'bottom-center' });
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); 
      toast.success('Logged out successfully!', { position: 'top-center' });
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out', { position: 'bottom-center' });
    }
  };

  const handleEditProfile = () => {
    navigate('/editprofile');
  };

  const handleFavoriteToggle = async (id, isFavorite) => {
    try {
      if (currentUser) {
        const docRef = doc(db, 'Users', currentUser.uid, 'articleHistory', id);
        await updateDoc(docRef, { favorite: !isFavorite });
        setArticleHistory((prevHistory) =>
          prevHistory.map((item) =>
            item.id === id ? { ...item, favorite: !isFavorite } : item
          )
        );
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Error updating favorite status', { position: 'bottom-center' });
    }
  };

  return (
    <>
      <Helmet>
        <title>NewsTop3 - My Profile</title>
      </Helmet>
      <NavBar darkMode={darkMode} />
      <Container className={`mt-5 ${darkMode ? 'dark-mode' : ''}`}>
        <Row className="mb-4 justify-content-center">
          <Col md={4} className="text-center">
            <Card className={`text-${darkMode ? 'light' : 'dark'}`}>
              <Card.Body>
                <div className="mb-3">
                  <img
                    src={profileImage || "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"}
                    alt="Profile"
                    width="100"
                    height="100"
                    className="rounded-circle"
                  />
                </div>
                <Card.Title>
                  {userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : "User Name"}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{currentUser?.email || "Email"}</Card.Subtitle>
                <Button variant="secondary" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h3 className={`text-${darkMode ? 'light' : 'dark'}`}>Article History</h3>
        {currentUser && (
          articleHistory.length === 0 ? (
            <div>
              <p className={`text-${darkMode ? 'light' : 'dark'}`}>No article history available.</p>
              <Button variant="primary" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <>
              <Table striped bordered hover className={darkMode ? 'table-dark' : ''}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Favorite</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentArticles.map((item, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstArticle + index + 1}</td>
                      <td>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      </td>
                      <td>{new Date(item.timestamp).toLocaleString()}</td>
                      <td>
                        <Button
                          variant={item.favorite ? 'success' : 'outline-success'}
                          onClick={() => handleFavoriteToggle(item.id, item.favorite)}
                        >
                          {item.favorite ? '★' : '☆'}
                        </Button>
                      </td>
                      <td>
                        <Button variant="danger" onClick={() => handleDeleteArticleHistory(item.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Row className="mt-3 justify-content-center">
                <Col xs="auto" className="mx-2">
                  <Button variant="warning" onClick={handleClearArticleHistory}>
                    Clear All Article History
                  </Button>
                </Col>
              </Row>
              <Pagination className="justify-content-center mt-3">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )
        )}
      </Container>
    </>
  );
};

export default Profile;
