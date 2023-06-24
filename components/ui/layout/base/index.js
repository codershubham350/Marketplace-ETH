import { NavBar, Footer } from "@components/ui/common";
import { Web3Provider } from "@components/providers";

const BaseLayout = ({ children }) => {
  return (
    <>
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
