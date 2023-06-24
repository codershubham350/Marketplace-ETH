import { useEffect } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0x18504bcf2adce0aa90fd4e26bfda636dffa05f68e777f984cd7ac7bfb4a1bf20": true,
};

export const handler = (web3, provider) => () => {
  // const [account, setAccount] = useState(null);
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      return accounts[0];
    }
  );

  // useEffect(() => {
  //   const getAccount = async () => {
  //     const accounts = await web3.eth.getAccounts();
  //     setAccount(accounts[0]);
  //   };
  //   web3 && getAccount();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [web3]);

  useEffect(() => {
    provider &&
      provider.on("accountsChanged", (accounts) => mutate(accounts[0]) ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  // if (data) {
  //   console.log(web3.utils.keccak256(data));
  // }

  return {
    // account: {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
    // },
  };
};
