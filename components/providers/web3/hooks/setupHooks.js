/* eslint-disable react-hooks/rules-of-hooks */
import { handler as createAccountHook } from "./useAccount";
import { handler as createNetworkHook } from "./useNetwork";
import { handler as createOwnedCoursesHook } from "./useOwnedCourses";
import { handler as createOwnedCourseHook } from "./useOwnedCourse";

// const DEFAULT_HOOKS = {
//   useAccount: () => ({ account: null }),
// };

export const setupHooks = ({ web3, provider, contract }) => {
  //console.log("setting up hooks!!!");
  // if (!web3) {
  //   return DEFAULT_HOOKS;
  // }
  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3, provider),
    useOwnedCourses: createOwnedCoursesHook(web3, contract),
    useOwnedCourse: createOwnedCourseHook(web3, contract),
  };
};

// export const setupHooks = (...deps) => {
//   //console.log("setting up hooks!!!");
//   // if (!web3) {
//   //   return DEFAULT_HOOKS;
//   // }
//   return {
//     useAccount: createAccountHook(...deps),
//     useNetwork: createNetworkHook(...deps),
//     useOwnedCourses: createOwnedCoursesHook(...deps),
//   };
// };
