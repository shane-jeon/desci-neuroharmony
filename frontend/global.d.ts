// global.d.ts
import { MetaMaskInpageProvider } from "@metamask/providers"; // If you want more specific typing

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider; // For more accurate MetaMask typing
  }
}
