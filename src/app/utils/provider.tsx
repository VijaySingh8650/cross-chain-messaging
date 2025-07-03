'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';

import {
  WagmiProvider,
  createConfig,
  http,
} from 'wagmi';

import {
  walletConnect,
  metaMask,
  coinbaseWallet,
} from 'wagmi/connectors';

import {
    Chain,
  sepolia,
} from 'wagmi/chains';

export const amoy: Chain = {
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_AMOY_RPC_URL!],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_AMOY_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: 'OKLink',
      url: 'https://www.oklink.com/amoy',
    },
  },
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const chains: readonly [Chain, ...Chain[]] = [sepolia, amoy];
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";

const config = createConfig({
  connectors: [
    walletConnect({ projectId, showQrModal: true }),
    metaMask(),
    coinbaseWallet({ appName: 'Crosschain Messenger' }),
  ],
  chains,
  transports: {
    [sepolia.id]: http(),
    [amoy.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
