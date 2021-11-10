import React from "react";

import contract from "../contracts/gifcontenders.json";
import kp from "../keypair.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

const { SystemProgram } = web3;

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id form the IDL file.
const programID = new PublicKey(contract.metadata.address);

// Set our network to devent.
const network = clusterApiUrl("devnet");

// Control's how we want to acknowledge when a trasnaction is "done".
const opts = {
  preflightCommitment: "processed",
};

type GIF = {
  gifLink: string;
  userAddress: PublicKey;
};

export function useGifs(walletAddress: string) {
  const [gifs, setGifs] = React.useState<Array<GIF> | null>(null);

  const getProvider = () => {
    //@ts-ignore
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      //@ts-ignore
      opts.preflightCommitment
    );
    return provider;
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      //@ts-ignore
      const program = new Program(contract, programID, provider);
      console.log("ping");
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  const getGifList = async () => {
    try {
      const provider = getProvider();
      //@ts-ignore
      const program = new Program(contract, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Got the account", account);
      setGifs(account.gifList);
    } catch (error) {
      console.log("Error in getGifs: ", error);
      setGifs(null);
    }
  };

  const submitGif = async (url: string) => {
    try {
      const provider = getProvider();
      //@ts-ignore
      const program = new Program(contract, programID, provider);

      await program.rpc.addGif(url, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF sucesfully sent to program", url);

      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error);
    }
  };

  React.useEffect(() => {
    if (walletAddress) {
      getGifList();
    }
  }, [walletAddress]);

  return { gifs, setGifs, submitGif, createGifAccount };
}
