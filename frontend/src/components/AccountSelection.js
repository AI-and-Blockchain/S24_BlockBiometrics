import React, { useState, useEffect } from 'react';
import detectEthereumProvider from "@metamask/detect-provider";

const AccountSelection = ({setAccount}) => {
  // State variables to track conditions
  const [isWalletConnected, setIsWalletConnected] = useState(null);
  const [wallet, setWallet] = useState({ accounts: [] });

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

                {wallet.accounts.map(elem => 
                    <div>
                        <button onClick={() => setAccount(elem)}>
                            {elem}
                        </button>
                    </div>)}
              </div>
          )}
      </div>
    </div>
  )
}

export default AccountSelection