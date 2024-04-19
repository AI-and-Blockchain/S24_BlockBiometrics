import React, { useState, useEffect } from 'react';
import detectEthereumProvider from "@metamask/detect-provider";

const AccountSelection = ({ setAccount }) => {
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
    setWallet({ accounts });
  };

  return (
    <div>
      <div>
        <p>Injected provider is {isWalletConnected ? "connected" : "not connected"}</p>
        {!isWalletConnected && <p>Please connect your Metamask wallet to interact with this system</p>}
      </div>

      <div style={{ marginTop: '20px' }}>
        {isWalletConnected && (
          <button onClick={handleConnect}>Connect Metamask</button>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        {wallet.accounts.length > 0 && (
          <div>
            <p>Wallet Accounts:</p>
            {wallet.accounts.map(elem => (
              <div key={elem}>
                <button onClick={() => setAccount(elem)}>
                  {elem}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSelection;
