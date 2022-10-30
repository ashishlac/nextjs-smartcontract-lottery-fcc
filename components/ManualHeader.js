import React from "react";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function Header() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3 } = useMoralis();
    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window != "undefined" && window.localStorage.getItem("connected")) {
            enableWeb3();
        }
    }, [isWeb3Enabled]);
    // isWeb3Enabled ? isWeb3Enabled() : 
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`);
            if (account == null) {
                if (typeof window != "undefined") {
                    window.localStorage.removeItem("connected");
                    deactivateWeb3();
                    console.log("null account found");
                }
            }
        });
    }, []);

    return (<div>
        {account ? (<div>Connected to {account.slice(0, 6)}.....{account.slice(account.length - 3)}</div>) :
            (<button onClick={async () => {
                await enableWeb3();
                if (typeof window != "undefined") {
                    window.localStorage.setItem("connected", "injected");

                }
            }}>connect</button>)}</div>);
};