import React, { useContext } from "react";
import { IpfsContext, useIpfs } from "../hooks/ipfs";
import { web3Context } from "../hooks/web3";

// Simple component showing how children can consume context.
export const Header = () => {
  let ipfs = useContext(IpfsContext);
  const nodeID = useIpfs(ipfs, "id");
  if (nodeID) {
    console.log("Header nodeID", nodeID["id"]);
  }

  let web3 = useContext(web3Context);
  if (web3) {
    console.log("Header web3 address: ", web3.currentProvider.selectedAddress);
  }
  return (
    <header className="App-header">
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      Learn React
    </header>
  );
};
