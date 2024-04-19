import React, { useState } from 'react';
import RegisterImage from '../img/register.jpg'; // Import the register image
import AuthenticatedImage from '../img/authenticated.jpg'; // Import the authenticated image

const VisitorScreen = ({ handleGoBack }) => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Function to handle registration
    const handleRegister = () => {
        // Logic to register, for example, submit the selected file
        if (selectedFile) {
            // Logic to submit the file for registration
            setIsRegistered(true);
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
        } else {
            // Alert the user to upload a file
            alert('Please upload a file.');
        }
    };

    // Function to handle file selection
    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
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

            {isRegistered && (
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
        </div>
    )
}

export default VisitorScreen;
