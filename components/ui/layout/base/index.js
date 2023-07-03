/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { NavBar, Footer } from "@components/ui/common";
import { Web3Provider } from "@components/providers";
// import Script from "next/script";

const BaseLayout = ({ children }) => {
  return (
    <>
      {/* <Script src="/js/truffle-contract.js" strategy="beforeInteractive" /> */}
      <Web3Provider>
        <div className="max-w-7xl mx-auto px-4">
          <NavBar />
          <div className="fit">{children}</div>
        </div>
        <Footer />
      </Web3Provider>
    </>
  );
};

export default BaseLayout;
