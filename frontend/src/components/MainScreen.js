import React, { useState} from 'react';
import AccountSelection from './AccountSelection';
import UserTypeSelection from './UserTypeSelection';
import ContractDeploy from './ContractDeploy';
import VisitorScreen from './VisitorScreen';

const MainScreen = () => {
  const [account, setAccount] = useState(null)
  const [userType, setUserType] = useState(null)

  return (
    <div>

      {account === null && <AccountSelection setAccount={setAccount}/> }

      {account && userType === null && 
        <UserTypeSelection setUserType={setUserType} handleGoBack={() => setAccount(null)}/>
      }

      {userType === "H" && <ContractDeploy handleGoBack={() => setUserType(null)}/>}

      {userType === "V" && <VisitorScreen handleGoBack={() => setUserType(null)}/>}
    </div>
  )
}

export default MainScreen