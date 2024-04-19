import React, { useState, useEffect } from 'react';
import RegisterImage from '../img/register.jpg'; // Import the register image
import AuthenticatedImage from '../img/authenticated.jpg'; // Import the authenticated image
import detectEthereumProvider from "@metamask/detect-provider";

const MainScreen = () => {
  // State variables to track conditions
  const [isWalletConnected, setIsWalletConnected] = useState(null);
  const [wallet, setWallet] = useState({ accounts: [] });

  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const getProvider = async () => {
        const provider = await detectEthereumProvider({ silent: true });
        // console.log(provider);
        // transform provider to true or false
        setIsWalletConnected(Boolean(provider));
    };

    getProvider();
  }, []);

  const handleConnect = async () => {
    let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });                     
    setWallet({accounts});
  };   

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

  // Function to handle going back to the previous screen
  const handleGoBack = () => {
    setIsWalletConnected(false);
    setIsRegistered(false);
  };

  return (
    <div>
      <div>
          Injected provider is {isWalletConnected ? "connected": "not connected"}
          {!isWalletConnected && <p>Please connect your metamask wallet to interact with this system</p>}
      </div>

      <div>
        {isWalletConnected && (
          <button onClick={handleConnect}>Connect Metamask</button>
        )}
      </div>

      <div>
          {wallet.accounts.length > 0 && (
              <div>
                Wallet Accounts:
                <ul>
                  {wallet.accounts.map(elem => <li>{elem}</li>)}
                </ul>
              </div>
          )}
      </div>

      {isWalletConnected && !isRegistered && (
        <div>
          <h2>Register</h2>
          {/* Display register image */}
          <div className="image-container">
            <img src={RegisterImage} alt="Register" className="register-image" />
          </div>
          <input type="file" accept="image/*" onChange={handleFileSelect} />
          <button disabled={!selectedFile} onClick={handleRegister}>Register</button>
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
  )
}

export default MainScreen