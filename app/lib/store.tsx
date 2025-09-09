import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer";
import { create } from "zustand";

interface AppStore {
  account?: InjectedPolkadotAccount;
  setAccount: (account?: InjectedPolkadotAccount) => void;
}
export const useAppStore = create<AppStore>((set) => ({
  setAccount: (account) => set({ account }),
}));
