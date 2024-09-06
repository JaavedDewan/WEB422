import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import NavBar from './navbar';
import "../bootstrap.min.css";
import { toast } from 'react-toastify';
import { useAuth } from './AuthProvider';
import { fetchBreakingNews, searchArticles } from '../api/api';
import { Helmet } from 'react-helmet';
import Paginate from './Pagination';
import '../App.css'; // Import your CSS file

function MainPage() {
  const [breakingNews, setBreakingNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [breakingNewsPage, setBreakingNewsPage] = useState(0);
  const [searchResultsPage, setSearchResultsPage] = useState(0);
  const [expandedArticleId, setExpandedArticleId] = useState(null); // Track expanded article
  const itemsPerPage = 4; // Number of articles per page
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getBreakingNews = async () => {
      try {
        const articles = await fetchBreakingNews();
        setBreakingNews(articles);
      } catch (error) {
        console.error('Error fetching breaking news:', error);
      }
    };
    getBreakingNews();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const articles = await searchArticles(searchQuery);
      setSearchResults(articles);
      setSearchResultsPage(0); // Reset to first page on new search
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast.error('Error fetching search results', { position: 'bottom-center' });
    }
  };

  const handleSaveToHistory = async (article) => {
    if (currentUser) {
      if (!article.link) {
        console.error('Article link is missing.');
        toast.error('Article link is missing', { position: 'bottom-center' });
        return;
      }

      const newHistoryItem = {
        title: article.title,
        url: article.link,
        timestamp: new Date().toISOString(),
      };
      const batch = writeBatch(db);
      const docRef = doc(collection(db, 'Users', currentUser.uid, 'articleHistory'));
      batch.set(docRef, newHistoryItem);
      try {
        await batch.commit();
        toast.success('Article added to history!', { position: 'top-center' });
        window.open(article.link, '_blank');
      } catch (error) {
        console.error('Error saving article to history:', error);
        toast.error('Error saving article to history', { position: 'bottom-center' });
      }
    } else {
      navigate('/login'); // Redirect to login if user is not authenticated
    }
  };

  const getPaginatedData = (data, page) => {
    const startIndex = page * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const truncateDescription = (description, wordLimit) => {
    if (!description) return ''; // Return an empty string if description is null or undefined
  
    const words = description.split(' ');
    if (words.length <= wordLimit) return description;
  
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const handleToggleDescription = (id) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  return (
    <div>
      <Helmet>
        <title>News4You - Search</title> {/* Set the page title */}
      </Helmet>
      <NavBar />
      <Container className="mt-5">
        <h2>Search News</h2>
        <Form onSubmit={handleSearch}>
          <Form.Group controlId="searchQuery">
            <Form.Label>Search for articles</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter search query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">Search</Button>
        </Form>
        <h2 className="mt-5">Search Results</h2>
        {searchResults.length > 0 && (
          <>
            <Row className="g-4">
              {getPaginatedData(searchResults, searchResultsPage).map((article, index) => (
                <Col key={index} md={3} className="d-flex">
                  <Card className="custom-card">
                    <Card.Img
                      variant="top"
                      src={article.image_url || 'https://cdn.pixabay.com/photo/2013/07/12/19/16/newspaper-154444_1280.png'}
                      onError={(e) => {
                        e.target.src = 'https://cdn.pixabay.com/photo/2013/07/12/19/16/newspaper-154444_1280.png'; // Fallback to placeholder if image fails to load
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{article.title}</Card.Title>
                      <Card.Text className="flex-grow-1">
                        {expandedArticleId === article.title
                          ? article.description
                          : truncateDescription(article.description, 50)}
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => handleSaveToHistory(article)}
                      >
                        Read More
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Paginate
              currentPage={searchResultsPage}
              totalPages={Math.ceil(searchResults.length / itemsPerPage)}
              onPageChange={setSearchResultsPage}
            />
          </>
        )}
        <h2 className="mt-5">Breaking News</h2>
        {breakingNews.length > 0 && (
          <>
            <Row className="g-4">
              {getPaginatedData(breakingNews, breakingNewsPage).map((article, index) => (
                <Col key={index} md={3} className="d-flex">
                  <Card className="custom-card">
                    <Card.Img
                      variant="top"
                      src={article.image_url || 'https://cdn.pixabay.com/photo/2013/07/12/19/16/newspaper-154444_1280.png'}
                      onError={(e) => {
                        e.target.src = 'https://cdn.pixabay.com/photo/2013/07/12/19/16/newspaper-154444_1280.png'; // Fallback to placeholder if image fails to load
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{article.title}</Card.Title>
                      <Card.Text className="flex-grow-1">
                        {expandedArticleId === article.title
                          ? article.description
                          : truncateDescription(article.description, 50)}
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => handleSaveToHistory(article)}
                      >
                        Read More
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Paginate
              currentPage={breakingNewsPage}
              totalPages={Math.ceil(breakingNews.length / itemsPerPage)}
              onPageChange={setBreakingNewsPage}
            />
          </>
        )}
      </Container>
    </div>
  );
}

export default MainPage;
