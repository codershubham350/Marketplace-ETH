import { useEffect } from "react";
import useSWR from "swr";

const NETWORKS = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  1337: "Ganache",
  11155111: "Sepolia Test Network",
  59140: "Linea Goerli Test Network",
};

const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID];

export const handler = (web3) => () => {
  const { data, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const chainId = await web3.eth.getChainId();

      if (!chainId) {
        throw new Error("Cannot retrieve network. Please refresh the browser.");
      }

      return NETWORKS[chainId];
    }
  );

  // useEffect(() => {
  //   provider &&
  //     provider.on("chainChanged", (netId) =>
  //       mutate(NETWORKS[parseInt(netId, 16)])
  //     );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [web3]);

  // useEffect(() => {
  //   const mutator = (chainId) => window.location.reload();
  //   provider?.on("chainChanged", mutator);

  //   return () => {
  //     provider?.removeListener("chainChanged", mutator);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [provider]);

  return {
    data,
    target: targetNetwork,
    isSupported: data === targetNetwork,
    ...rest,
  };
};
