/*
From: https://github.com/ipfs/js-ipfs/blob/master/examples/browser-create-react-app
*/

import Ipfs from "ipfs";
import React, { useEffect, useState } from "react";

let ipfs = null;

// Create a new Context, allowing any component to use the ipfs instance
export const IpfsContext = React.createContext();

export const useCreateIpfs = ({ commands }) => {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs));
  const [ipfsInitError, setIpfsInitError] = useState(null);

  useEffect(() => {
    // The fn to useEffect should not return anything other than a cleanup fn,
    // So it cannot be marked async, which causes it to return a promise,
    // Hence we delegate to a async fn rather than making the param an async fn.
    startIpfs();
    return function cleanup() {
      if (ipfs && ipfs.stop) {
        console.log("Stopping IPFS");
        ipfs.stop(err => {
          if (err) {
            console.log("stopping IPFS error", err);
            return 0;
          }
        });
        setIpfsReady(false);
      }
    };
  });

  async function startIpfs() {
    if (ipfs) {
      console.log("IPFS already started");
    } else if (window.ipfs && window.ipfs.enable) {
      console.log("Found window.ipfs");
      ipfs = await window.ipfs.enable({ commands });
    } else {
      try {
        console.time("IPFS Started");
        ipfs = await Ipfs.create();
        console.timeEnd("IPFS Started");
      } catch (error) {
        console.error("IPFS init error:", error);
        ipfs = null;
        setIpfsInitError(error);
      }
    }

    setIpfsReady(Boolean(ipfs));
  }

  return { ipfs, isIpfsReady, ipfsInitError };
};

/*
 * Pass the command you'd like to call on an ipfs instance.
 *
 * Uses setState to capture the response, so your component
 * will re-render when the result turns up.
 *
 */
export const useIpfs = (ipfs, cmd, opts) => {
  const [res, setRes] = useState(null);
  useEffect(() => {
    callIpfs(ipfs, cmd, opts, setRes);
  }, [ipfs, cmd, opts]);

  async function callIpfs(ipfs, cmd, opts, setRes) {
    if (!ipfs) return null;
    console.log(`Call ipfs.${cmd}`);
    console.log("ipfs", ipfs);
    const ipfsCmd = ipfs[cmd];
    console.log("ipfsCmd", ipfsCmd);
    const res = await ipfsCmd(opts);
    console.log(`Result ipfs.${cmd}`, res);
    setRes(res);
  }

  return res;
};
