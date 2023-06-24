/* eslint-disable react-hooks/rules-of-hooks */
import { handler as createAccountHook } from "./useAccount";
import { handler as createNetworkHook } from "./useNetwork";

// const DEFAULT_HOOKS = {
//   useAccount: () => ({ account: null }),
// };

export const setupHooks = (...deps) => {
  //console.log("setting up hooks!!!");
  // if (!web3) {
  //   return DEFAULT_HOOKS;
  // }
  return {
    useAccount: createAccountHook(...deps),
    useNetwork: createNetworkHook(...deps),
  };
};
