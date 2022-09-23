import { useStytch } from "@stytch/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const CryptoWallets = () => {
  const stytch = useStytch();

  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const missingEthWallet = !window.ethereum;

  useEffect(() => {
    if (missingEthWallet) {
      setError(
        "Please install an ethereum chrome extension, such as Metamask, to test this feature."
      );
    }
  }, [missingEthWallet]);

  const authenticateCryptoWallet = useCallback(async () => {
    setError("");
    /* Request user's address */
    const [crypto_wallet_address] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setStatus("Requesting challenge to sign from Stytch...");

    /* Ask Stytch to generate a challenge for the user */
    const { challenge } = await stytch.cryptoWallets.authenticateStart({
      crypto_wallet_address,
      crypto_wallet_type: "ethereum",
    });
    setStatus("Asking user to sign challenge...");

    /* Ask the user to sign the challenge */
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [challenge, crypto_wallet_address],
    });
    setStatus("Authenticating...");

    /* Send the signature back to Stytch for validation */
    await stytch.cryptoWallets.authenticate({
      crypto_wallet_address,
      crypto_wallet_type: "ethereum",
      signature,
      session_duration_minutes: 60,
    });
    setStatus("Authentication successful!");
  }, [stytch]);

  const authenticateWithErrorHandling = useCallback(() => {
    authenticateCryptoWallet().catch(setError);
  }, [authenticateCryptoWallet]);

  return (
    <div className="container">
      <div className="column">
        <h1>Crypto Wallets</h1>
        Crypto wallets allow users to hold digital assets, like cryptocurrencies
        and NFTs, and easily cryptographically authenticate themselves on a
        blockchain. Our Crypto wallets product allows your users to seamlessly
        authenticate to your application via MetaMask or any other Ethereum
        based crypto wallet.
        <br />
        <br />
        {!missingEthWallet && (
          <>
            <button
              disabled={missingEthWallet}
              onClick={authenticateWithErrorHandling}
            >
              Authenticate with Crypto Wallet.
            </button>
          </>
        )}
        <br />
        {status}
        <br />
        {error && (
          <>
            <br />
            <pre>{String(error)}</pre>
          </>
        )}
        <Link to={"/home"}>{"<-Back"}</Link>
      </div>
    </div>
  );
};
