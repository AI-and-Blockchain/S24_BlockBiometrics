import React, { useState} from 'react';
import RegisterImage from '../img/register.jpg'; // Import the register image
import AuthenticatedImage from '../img/authenticated.jpg'; // Import the authenticated image
import AccountSelection from './AccountSelection';
import UserTypeSelection from './UserTypeSelection';
import ContractDeploy from './ContractDeploy';

const MainScreen = () => {
  const [account, setAccount] = useState(null)
  const [userType, setUserType] = useState(null)

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

  // Function to handle going back to the previous screen
  const handleGoBack = () => {
    setUserType(null);
  };

  return (
    <div>

      {account === null && <AccountSelection setAccount={setAccount}/> }

      {account && userType === null && 
        <UserTypeSelection setUserType={setUserType} handleGoBack={() => setAccount(null)}/>
      }

      {userType === "H" && <ContractDeploy handleGoBack={() => setUserType(null)}/>}

      {userType === "V" && !isRegistered && (
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

      {userType === "V" && isRegistered && (
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