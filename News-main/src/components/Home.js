import React from 'react';
import NavBar from './navbar'; // Adjust the path if necessary
import { Helmet } from 'react-helmet';

const Home = ({ darkMode }) => {
    return (
        <div className={`home ${darkMode ? 'dark-mode' : ''}`}>
            <Helmet>
                <title>News4You - Home</title> {/* Set the page title */}
            </Helmet>
            <NavBar darkMode={darkMode} /> {/* Include the NavBar here */}
            <div className="description">
                <h2>About News4You</h2>
                <p>
                    Welcome to News4You, your go-to source for the latest news and updates. 
                    Our platform provides you with personalized news articles tailored to your interests. 
                    Join us today to stay informed and connected!
                </p>
                <footer>
                    Created by Jaaved Dewan & Vu Duc Thuan Tran
                    <br></br>
                    WEB422 - Shahdad Shariatmadari
                    <br></br>
                    A Newsdata.io Project
                </footer>
            </div>
        </div>
    );
};

export default Home;