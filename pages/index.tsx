import React from "react";
import Head from "next/head";
import { useWallet } from "../hooks/useWallet";
import { useGifs } from "../hooks/useGifs";
import { WalletStatus } from "../types";
import "tailwindcss/tailwind.css";

const IndexPage = () => {
  const [url, setUrl] = React.useState("");
  const { status, connectWallet, walletAddress } = useWallet();
  const { gifs, submitGif, createGifAccount } = useGifs(walletAddress);

  const renderNotConnectedContainer = () => (
    <button
      className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 py-2 px-4 rounded-md"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const submitMyGif = () => {
    if (url) {
      submitGif(url);
      setUrl("");
    }
  };

  const renderConnectedContainer = () => (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center md:flex-row md:space-x-4 px-8 mt-4 mb-8 w-full">
        <input
          type="url"
          className="flex-grow h-10 rounded-lg bg-gray-900 text-white px-2 w-full md:w-auto"
          placeholder="Enter a GIF URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="mt-4 md:mt-0 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 py-2 px-4 rounded-md"
          onClick={submitMyGif}
        >
          Submit GIF
        </button>
      </div>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
        {gifs?.map((gif, index) => (
          <div className="m-2 flex flex-col" key={index}>
            <img src={gif.gifLink} alt={gif.gifLink} />
            <span className="w-full text-center">
              {gif.userAddress.toString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotPresent = () => (
    <>
      <span className="mb-4">You'll need a wallet before using the app!</span>
      <a
        href="https://phantom.app/"
        className="bg-indigo-500 py-2 px-4 rounded-md"
        target="_blank"
      >
        Get a Phantom Wallet 👻
      </a>
    </>
  );

  const initializeGame = () => {
    return (
      <button
        className="mt-4 md:mt-0 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 py-2 px-4 rounded-md"
        onClick={createGifAccount}
      >
        Do One-Time Initialization For GIF Program Account
      </button>
    );
  };

  const renderContent = () => {
    switch (status) {
      case WalletStatus.NOT_PRESENT:
        return renderNotPresent();
      case WalletStatus.DISCONNECTED:
      case WalletStatus.CONNECTING:
      case WalletStatus.ERROR:
        return renderNotConnectedContainer();
      case WalletStatus.CONNECTED:
        if (!gifs) {
          return initializeGame();
        }
        return renderConnectedContainer();
      default:
        return <h1>Loading...</h1>;
    }
  };
  return (
    <>
      <Head>
        <title>Gif Contenders</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="bg-gray-800 w-screen max-w-full min-h-screen text-white relative">
        <main className=" flex flex-col justify-center items-center py-8">
          <div className="flex flex-col flex-grow items-center">
            <h1 className="text-4xl uppercase text-center">
              Welcome to Gif Contenders
            </h1>
            <h4 className="text-lg my-2 text-center">
              Submit your gifs, collect votes and earn prices!
            </h4>
            <img
              src="https://media2.giphy.com/media/3orif16CqNrhgZwili/giphy.gif?cid=ecf05e47ilc1yss28g4m3f27zvmfcpxs80z8x6xr95twm3pr&rid=giphy.gif&ct=g"
              alt="winning gif"
              className="mt-2 mb-8 h-64 w-80"
            />
            {renderContent()}
          </div>
        </main>
        <footer className="fixed bottom-0 pb-5 pt-2 flex justify-center w-full bg-gray-800">
          <a
            href="https://twitter.com/NoxKlax"
            target="_blank"
            rel="noreferrer"
          >
            Built by Nox
          </a>
        </footer>
      </div>
    </>
  );
};

export default IndexPage;
