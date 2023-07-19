import { useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button } from "@components/ui/common";

const WalletBar = () => {
  const { requireInstall } = useWeb3();
  const { account, network } = useWalletInfo();

  return (
    <>
      <section className="text-white bg-indigo-600 rounded-lg">
        <div className="p-8">
          <h1 className="xs:text-xl text-base break-words italic">
            Hello, {account.data}
          </h1>
          <h2 className="subtitle mb-5 xs:text-base text-sm">
            I hope you are having a great day!
          </h2>
          <div className="flex justify-between items-center">
            <div className="sm:flex sm:justify-center lg:justify-start">
              <Button variant="white" className="mr-2 text-sm xs:text-lg p-2">
                {" "}
                Learn how to purchase
              </Button>
            </div>
            <div>
              {network.hasInitialResponse && !network.isSupported && (
                <div className="bg-red-400 p-4 rounded-lg">
                  <div>Connected to Wrong Network</div>
                  <div>
                    Connect to: {``}{" "}
                    <strong className="text-2xl">{network?.target}</strong>
                  </div>
                </div>
              )}
              {requireInstall && (
                <div className="bg-yellow-500 p-4 rounded-lg">
                  Cannot connect to Network. Please install Metamask.
                </div>
              )}
              {network.data && (
                <div>
                  <span>Currently on </span>
                  <strong className="text-2xl">{network.data}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WalletBar;
