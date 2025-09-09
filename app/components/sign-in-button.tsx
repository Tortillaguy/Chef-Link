import {
  connectInjectedExtension,
  getInjectedExtensions,
  type InjectedExtension,
} from "polkadot-api/pjs-signer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppStore } from "~/lib/store";
import { shorthand } from "~/lib/util";
import { SELECTED_EXTENSION } from "~/lib/constants";

export const SignInButton = () => {
  const [extensions, setExtensions] = useState<string[]>();
  const [extension, setExtension] = useState<InjectedExtension | undefined>();
  const navigate = useNavigate();
  const account = useAppStore((store) => store.account);
  const setAccount = useAppStore((store) => store.setAccount);

  useEffect(() => {
    setExtensions(getInjectedExtensions());
  }, []);

  useEffect(() => {
    const wallet = window.localStorage.getItem(SELECTED_EXTENSION);
    if (!wallet) return;
    connectInjectedExtension(wallet).then(setExtension);
  }, []);

  useEffect(() => {
    if (!extension) return;
    const accounts = extension.getAccounts();
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [extension]);

  const onConnect = async () => {
    if (!extensions) return;
    const selectedExtension = await connectInjectedExtension(extensions[0]);

    setExtension(selectedExtension);
    window.localStorage.setItem(SELECTED_EXTENSION, extensions[0]);
  };

  const onDisconnect = () => {
    extension?.disconnect();
    setAccount(undefined);
  };

  const routeToProfile = () => navigate("/profile");

  return (
    <div className="flex gap-1 z-10">
      <button
        className="cursor-pointer"
        onClick={account ? routeToProfile : onConnect}
      >
        {account ? shorthand(account.address) : "Connect"}
      </button>
      {!!account && <button onClick={onDisconnect}>⏻</button>}
    </div>
  );
};
