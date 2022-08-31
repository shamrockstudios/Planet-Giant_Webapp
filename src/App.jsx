import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";
import { useMoralis } from "react-moralis";
import { AccountVerification } from "./components/Account";
import { ChainVerification } from "./components/Chains";
import CustomHeader from "components/Header/CustomHeader";
import Dashboard from "components/Content/Dashboard/Dashboard";
import Marketplace from "components/Content/Marketplace/Marketplace";
// import { useWindowWidthAndHeight } from "./hooks/useWindowWidthAndHeight";
import { Layout } from "antd";
import background from "./assets/background.jpg";

import "antd/dist/antd.css";
import "./style.css";
import { IS_PRODUCTION } from "constant/constant";

const { Footer } = Layout;

const styles = {
  layout: {
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
    overflow: "auto",
    fontFamily: "Sora, sans-serif",
  },
  wrapper: {
    position: "fixed",
    width: "100%",
    top: 0,
    marginBottom: "100px !important",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    color: "#041836",
    marginBlock: "60px 70px",
    padding: "10px",
    overflow: "auto",
    height: "75vh",
  },
  adminButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    color: "white",
    cursor: "pointer",
    borderRadius: "25px",
    width: "100px",
    height: "40px",
  },
  footer: {
    position: "fixed",
    textAlign: "center",
    width: "100%",
    bottom: "0",
    fontWeight: "800",
    backgroundColor: "transparent",
    color: "white",
  },
};
const App = () => {
  const { account, chainId, isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();
  // const [width] = useWindowWidthAndHeight();
  const [isSupportedChain, setIsSupportedChain] = useState();

  // const isMobile = width <= 768;

  useEffect(() => {
    if (chainId) {
      if (IS_PRODUCTION && chainId === "0x19") {
        setIsSupportedChain(true);
      } else if (!IS_PRODUCTION && chainId === "0x152") {
        setIsSupportedChain(true);
      } else setIsSupportedChain(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, IS_PRODUCTION]);

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({ provider: connectorId });
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={styles.layout}>
      <Router>
        <div style={styles.wrapper}>
          {chainId && !isSupportedChain && <ChainVerification />}
          <CustomHeader />

          <div style={styles.content}>
            <AccountVerification />

            {isAuthenticated && account && isSupportedChain && (
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/marketplace" element={<Marketplace isSupportedChain={isSupportedChain} />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/nonauthenticated" element={<>Please login using the "Authenticate" button</>} />
              </Routes>
            )}
          </div>
        </div>
      </Router>
      <Footer style={styles.footer}>
        <div style={{ display: "block" }}>
          Powered By{" "}
          <a href="https://www.superultra.io/" target="_blank" rel="noopener noreferrer" style={{ fontSize: "18px" }}>
            Super Ultra
          </a>
        </div>
      </Footer>
    </Layout>
  );
};

export default App;
