export type ChainKey = 'sepolia' | 'amoy';

export const CHAINS = {
  sepolia: {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!,
    hyperlaneDomain: 11155111,
    senderContract: '0xYourSenderContractAddress', // update later
  },
  amoy: {
    chainId: 80002,
    name: 'Polygon Amoy',
    rpcUrl: process.env.NEXT_PUBLIC_AMOY_RPC_URL!, // new env var
    hyperlaneDomain: 80002,
    receiverContract: '0xYourReceiverContractAddress', // update later
  },
};
