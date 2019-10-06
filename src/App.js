import React from "react";
import { useCreateIpfs, useIpfs, IpfsContext } from "./hooks/ipfs";
import { useCreateWeb3, web3Context } from "./hooks/web3";
import { Header } from "./comps";

/* 
Use a functional component for the top level so we can use Hooks
*/
const App = () => {
  // On App start, create ipfs node in browswer. Obtain the ID of the node
  // for verification.
  let { ipfs, ipfsInitError } = useCreateIpfs({ command: ["id"] });
  let nodeID = useIpfs(ipfs, "id");
  if (nodeID) {
    console.log("nodeID", nodeID["id"]);
  }

  let { web3 } = useCreateWeb3(true);
  if (web3) {
    console.log("App web3 address: ", web3.currentProvider.selectedAddress);
  }

  return (
    // A Context Provider allows consuming components to subscribe to changes
    <IpfsContext.Provider value={ipfs}>
      <web3Context.Provider value={web3}>
        <div className="App">
          <Header></Header>
        </div>
      </web3Context.Provider>
    </IpfsContext.Provider>
  );
};

export default App;
