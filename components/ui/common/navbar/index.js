import { useWeb3 } from "@components/providers";
import Link from "next/link";
import Button from "@components/ui/common/button";
import { useAccount } from "@components/hooks/web3/useAccount";
import { useRouter } from "next/router";

const NavBar = () => {
  const { connect, isLoading, isWeb3Loaded } = useWeb3();
  const { account } = useAccount();
  const { pathname } = useRouter();
  //const { account } = useAccount()();
  // const _useAccount = useAccount(web3);
  // const { account } = _useAccount();

  return (
    <>
      <section>
        <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
          <nav className="relative" aria-label="Global">
            <div className="flex justify-between items-center">
              <div>
                <Link
                  href="/"
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                >
                  Home
                </Link>
                <Link
                  href="/marketplace"
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                >
                  Marketplace
                </Link>
                <Link
                  href="/"
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                >
                  Blogs
                </Link>
              </div>
              <div>
                <Link
                  href="/"
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900"
                >
                  Wishlist
                </Link>
                {isLoading ? (
                  <Button disabled={true} onClick={connect}>
                    Loading...
                  </Button>
                ) : isWeb3Loaded ? (
                  account?.data ? (
                    <Button hoverable={false} className="cursor-default">
                      Hi There {account.isAdmin && "Admin"}
                    </Button>
                  ) : (
                    <Button onClick={connect}>Connect</Button>
                  )
                ) : (
                  <Button
                    // onClick={() => router.push("https://metamask.io/download/")}
                    onClick={() =>
                      window.open("https://metamask.io/download/", "_blank")
                    }
                  >
                    Install Metamask
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </div>
        {account?.data && !pathname.includes("/marketplace") && (
          <div className="flex justify-end pt-1 sm:px-6 lg:px-8">
            <div className="text-white bg-indigo-600 rounded-md p-2">
              {account?.data}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default NavBar;
