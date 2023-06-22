/* eslint-disable react-hooks/rules-of-hooks */
import { handler as createUseAccount } from "./useAccount";

// const DEFAULT_HOOKS = {
//   useAccount: () => ({ account: null }),
// };

export const setupHooks = (...deps) => {
  // if (!web3) {
  //   return DEFAULT_HOOKS;
  // }
  return {
    useAccount: createUseAccount(...deps),
  };
};
