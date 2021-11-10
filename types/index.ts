declare global {
  interface Window {
    solana: any;
  }
}
export {};

export enum WalletStatus {
  LOADING,
  NOT_PRESENT,
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  ERROR,
}
