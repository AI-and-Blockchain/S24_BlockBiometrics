import React from 'react';

const UserTypeSelection = ({ setUserType, handleGoBack }) => {
  return (
    <div>
      <div>
        <h2>Are you a homeowner or a visitor?</h2>
        <button style={{ marginRight: '10px' }} onClick={() => setUserType("H")}>Homeowner</button>
        <button onClick={() => setUserType("V")}>Visitor</button>
      </div>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

export default UserTypeSelection;
