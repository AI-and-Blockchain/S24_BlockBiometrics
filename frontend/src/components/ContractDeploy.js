import React, {useState} from 'react'

const ContractDeploy = ({handleGoBack}) => {

  const [isDeployed, setIsDeployed] = useState(false);

  const onClick = () => {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("Deploy contract");
    setIsDeployed(true);
  }

  return (
    <div>
        <div>
            {!isDeployed 
                ? <button onClick={onClick}>Deploy Contract</button>
                : "The contract has been deployed"}
        </div>
        <button onClick={handleGoBack}>Go Back</button>
    </div>
  )
}

export default ContractDeploy