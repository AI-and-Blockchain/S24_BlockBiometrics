import React, { useState } from 'react';
import RegisterImage from '../img/register.jpg'; // Import the register image
import AuthenticatedImage from '../img/authenticated.jpg'; // Import the authenticated image
import HomeImage from '../img/home.jpg'; // Import the home image
import DownloadImage from '../img/download.jpg'; // Import the download image

const VisitorScreen = ({ handleGoBack }) => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAccessed, setIsAccessed] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Function to handle registration
    const handleRegister = () => {
        // Logic to register, for example, submit the selected file
        if (selectedFile) {
            // Logic to submit the file
            fetch("http://localhost:5000/register")
                .then(() => setIsRegistered(true))
                .catch((err) => setIsRegistered(true));
        } else {
            // Alert the user to upload a file
            alert('Please upload a file.');
        }
    };

    // Function to handle authentication
    const handleAuthenticate = () => {
        // Logic to authenticate, for example, submit the selected file
        if (selectedFile) {
            // Logic to submit the file for authentication
            fetch("http://localhost:5000/request")
                .then(() => setIsAuthenticated(true))
                .catch((err) => setIsAuthenticated(true));
        } else {
            // Alert the user to upload a file
            alert('Please upload a file.');
        }
    };

    // Function to handle file selection
    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to handle access home
    const handleAccess = () => {
        fetch("http://localhost:5000/request")
            .then(() => setIsAccessed(true))
            .catch((err) => setIsAccessed(true));
    };

    return (
        <div>
            {!isRegistered && (
                <div>
                    <h2>Register</h2>
                    {/* Display register image */}
                    <div className="image-container">
                        <img src={RegisterImage} alt="Register" className="register-image" />
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileSelect} />
                    <button disabled={!selectedFile} onClick={handleRegister}>Register</button>
                    <div style={{ marginTop: '10px' }}> {/* Add margin-top */}
                        <button onClick={handleGoBack}>Go Back</button>
                    </div>
                </div>
            )}

            {isRegistered && !isAuthenticated && (
                <div>
                    <h2>Authenticate</h2>
                    {/* Display authenticated image */}
                    <div className="image-container">
                        <img src={AuthenticatedImage} alt="Authenticated" className="authenticated-image" />
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileSelect} />
                    <button onClick={handleAuthenticate}>Authenticate</button>
                    <div style={{ marginTop: '10px' }}> {/* Add margin-top */}
                        <button onClick={handleGoBack}>Go Back</button>
                    </div>
                </div>
            )}

            {isRegistered && isAuthenticated && !isAccessed && (
                <div>
                    <h2>Access</h2>
                    <div className="image-container">
                        <img src={HomeImage} alt="Home" className="home-image" />
                    </div>
                    <button onClick={handleAccess}>Access</button>
                    <div style={{ marginTop: '10px' }}> {/* Add margin-top */}
                        <button onClick={handleGoBack}>Go Back</button>
                    </div>
                </div>
            )}

            {isRegistered && isAuthenticated && isAccessed && (
                <div>
                    <h2>Home</h2>
                    <div className="image-container">
                        <img src={DownloadImage} alt="Download" className="download-image" />
                    </div>
                    <button onClick={handleGoBack}>Go Back</button>
                </div>
            )}
        </div>
    );
};

export default VisitorScreen;
