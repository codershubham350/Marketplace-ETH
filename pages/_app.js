import "@styles/globals.css";
const NoOp = ({ children }) => <>{children}</>;
function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ?? NoOp;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
