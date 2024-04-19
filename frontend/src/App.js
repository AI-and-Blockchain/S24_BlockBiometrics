import React, { useState } from 'react';
import './App.css';
import WalletImage from './wallet.jpg'; // Import the wallet image
import RegisterImage from './register.jpg'; // Import the register image
import AuthenticatedImage from './authenticated.jpg'; // Import the authenticated image

function App() {
  // State variables to track conditions
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle wallet connection
  const handleConnectWallet = () => {
    // Logic to connect wallet
    setIsWalletConnected(true);
  };

  // Function to handle registration
  const handleRegister = () => {
    // Logic to register, for example, submit the selected file
    if (selectedFile) {
      // Logic to submit the file for registration
      setIsRegistered(true);
    } else {
      // Handle error condition, maybe display a message to the user
      alert('Please select a file to register.');
    }
  };

  // Function to handle authentication
  const handleAuthenticate = () => {
    // Logic to authenticate, for example, submit the selected file
    if (selectedFile) {
      // Logic to submit the file for authentication
    } else {
      // Handle error condition, maybe display a message to the user
      alert('Please select a file to authenticate.');
    }
  };

  // Function to handle file selection
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle going back to the previous screen
  const handleGoBack = () => {
    setIsWalletConnected(false);
    setIsRegistered(false);
  };

  return (
    <div className="App">
      <header>
        <h1>BlockBiometrics</h1>
      </header>
      {/* Conditionally render screens based on conditions */}
      {!isWalletConnected && (
        <div>
          <h2>Connect Wallet</h2>
          {/* Display wallet image */}
          <div className="image-container">
            <img src={WalletImage} alt="Wallet" className="wallet-image" />
          </div>
          <button onClick={handleConnectWallet}>Connect</button>
        </div>
      )}

      {isWalletConnected && !isRegistered && (
        <div>
          <h2>Register</h2>
          {/* Display register image */}
          <div className="image-container">
            <img src={RegisterImage} alt="Register" className="register-image" />
          </div>
          <input type="file" accept="image/*" onChange={handleFileSelect} />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      )}

      {isWalletConnected && isRegistered && (
        <div>
          <h2>Authenticate</h2>
          {/* Display authenticated image */}
          <div className="image-container">
            <img src={AuthenticatedImage} alt="Authenticated" className="authenticated-image" />
          </div>
          <input type="file" accept="image/*" onChange={handleFileSelect} />
          <button onClick={handleAuthenticate}>Authenticate</button>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      )}
    </div>
  );
}

export default App;
