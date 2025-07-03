"use client";

import { useState } from "react";
import { ChainKey, CHAINS } from "./utils/chains";
import { ethers } from "ethers";

export default function Home() {
  const [fromChain, setFromChain] = useState<ChainKey>("sepolia");
  const [toChain, setToChain] = useState<ChainKey>("amoy");
  const [message, setMessage] = useState<string>("");
const [txHash, setTxHash] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

    const handleSend = async () => {
    try {
      setLoading(true);
      setTxHash(null);

      const from = CHAINS[fromChain];
      const provider = new ethers.JsonRpcProvider(from.rpcUrl);

      const wallet = new ethers.Wallet(
        process.env.NEXT_PUBLIC_PRIVATE_KEY as string,
        provider
      );

      if (!("senderContract" in from)) {
        throw new Error(`Selected 'from' chain does not have a senderContract`);
      }
      const senderContract = new ethers.Contract(
        from.senderContract,
      //  SenderABI,
      "",
        wallet
      );

      const tx = await senderContract.sendMessage(
        CHAINS[toChain].hyperlaneDomain,
        message
      );

      setTxHash(tx.hash);
      await tx.wait();
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed. Check console.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen w-screen p-4">
      <div className="flex flex-col justify-center gap-4">
        <input
          placeholder="Write a message..."
          className="border border-violet-500 rounded-lg focus:outline-none px-2 py-1"
          onChange={handleChange}
          value={message}
          name="message"
        />
        <div className="my-4">
          <span>From: </span>
          <select
            value={fromChain}
            onChange={(e) => setFromChain(e.target.value as ChainKey)}
            className=" bg-violet-500 rounded-lg  text-white p-1"
          >
            {Object.entries(CHAINS).map(([key, chain]) => (
              <option key={key} value={key}>
                {chain.name}
              </option>
            ))}
          </select>

          <span className="ml-4">To: </span>
          <select
            value={toChain}
            onChange={(e) => setToChain(e.target.value as ChainKey)}
            className=" bg-violet-500 rounded-lg  text-white p-1"
          >
            {Object.entries(CHAINS).map(([key, chain]) => (
              <option key={key} value={key}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleSend} className="bg-violet-500 px-2 py-1 rounded-lg text-white shadow">
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {txHash && (
          <div className="text-green-600 mt-2">
            ✅ Sent! Tx hash:{" "}
            <a
              href={`https://amoy.polygonscan.com/tx/${txHash}`}
              target="_blank"
              className="underline"
            >
              {txHash.slice(0, 10)}...
            </a>
          </div>
        )}

    </div>
  );
}
