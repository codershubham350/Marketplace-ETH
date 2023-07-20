import { useEffect } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0x18504bcf2adce0aa90fd4e26bfda636dffa05f68e777f984cd7ac7bfb4a1bf20": true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error(
          "Cannot retrieve an account. Please refresh the browser."
        );
      }
      return account;
    }
  );

  useEffect(() => {
    const mutator = (accounts) => mutate(accounts[0]) ?? null;
    provider?.on("accountsChanged", mutator);

    // console.log(provider);

    return () => {
      provider?.removeListener("accountsChanged", mutator);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  return {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};
