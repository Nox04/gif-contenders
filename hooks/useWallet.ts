import React from "react";
import { WalletStatus } from "../types";

export function useWallet() {
  const [status, setStatus] = React.useState<WalletStatus>(
    WalletStatus.LOADING
  );
  const [walletAddress, setWalletAddress] = React.useState(null);
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          setStatus(WalletStatus.DISCONNECTED);
          const response = await solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
          setStatus(WalletStatus.CONNECTED);
        }
      } else {
        setStatus(WalletStatus.NOT_PRESENT);
      }
    } catch (error) {
      setStatus(WalletStatus.ERROR);
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
      setStatus(WalletStatus.CONNECTED);
    }
  };

  React.useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    onLoad();
  }, []);

  return { connectWallet, status, walletAddress };
}
