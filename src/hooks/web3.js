import Web3 from "web3";
import { ERROR } from "../errorCodes";
import React, { useEffect } from "react";

let web3 = null;

export const web3Context = React.createContext();

export const useCreateWeb3 = connectRequest => {
  useEffect(() => {
    getWeb3(connectRequest);
  });

  return { web3 };
};

// param: connectRequest: true if metamask should ask for connection
async function getWeb3(connectRequest) {
  if (web3) {
    console.log("web3 already hooked up");
  } else {
    // Modern dapp browsers...
    if (window.ethereum) {
      console.log("Modern dapp browser detected");
      //console.log("window.ethereum", window.ethereum);
      // are they logged in?
      if (await window.ethereum._metamask.isUnlocked()) {
        console.log("user logged in to metamask");
        web3 = new Web3(window.ethereum);
        //console.log("web3 instance", web3);
        // did they already approve this app for metamask use?
        if (await window.ethereum._metamask.isApproved()) {
          console.log("Already approved browser");
          //web3 = window.web3;
        }
        // are they requesting a metamask connection?
        else if (connectRequest) {
          web3 = await askForPermission(web3);
        } else {
          // don't have cached approval and not requesting one
          web3 = ERROR.UNKNOWN;
        }
      } else {
        console.log("Not logged in to Metamask");
        web3 = ERROR.METAMASK_NO_LOGIN;
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log("Legacy dapp browser detected");
      web3 = new Web3(web3.currentProvider);
    } else {
      console.log("No dapp browser abilities. trying infura");
      web3 = new Web3(
        // get provider from infura
        new Web3.providers.HttpProvider(
          "https://rinkeby.infura.io/v3/0144fd7a7423401caa4b4479b5e26ba2"
        )
      );
    }
  }
}

const askForPermission = async web3 => {
  //console.log("askForPermission web3", web3);
  // only ask for permission if logged into metamask, otherwise
  // the enable promise will hang
  console.log("web3 trying to enable");
  try {
    // TODO: accounts obtained here, dont need to obtain later
    let addr = await window.ethereum.enable();
    console.log("web3 connection accepted: addr", addr);
    console.log("web3 connection accepted: window.web3", web3);
    return web3;
  } catch (error) {
    // user denied access
    console.log("web3 connection denied", error);
    return ERROR.DENIED_ACCESS;
  }
};
