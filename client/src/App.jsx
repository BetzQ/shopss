import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { NotFound } from "./components/NotFound";
import Seller from "./pages/Seller";
import TransactionHistory from "./pages/TransactionHistory";
import ChangePassword from "./pages/ChangePassword";
import ChangeBackground from "./pages/ChangeBackground";
import { useEffect, useState } from "react";

export const BASE_URL = "https://cc2tzj5n-3000.asse.devtunnels.ms";
// eslint-disable-next-line react/prop-types
const RedBackgroundWrapper = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState("");
  useEffect(() => {
    // Fungsi untuk memanggil API
    const fetchBackground = async () => {
      try {
        const response = await fetch(`${BASE_URL}/background`);
        const data = await response.json();
        if (data.length > 0) {
          setBackgroundImage(
            `url(${BASE_URL}/public/background/${data[0].imageUrl})`
          );
        }
      } catch (error) {
        console.error("Error fetching background:", error);
      }
    };

    fetchBackground();
  }, []);

  return (
    <div style={{ background: backgroundImage, minHeight: "100vh" }}>
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={
            <RedBackgroundWrapper>
              <Home />
            </RedBackgroundWrapper>
          }
        />
        <Route
          path="/seller"
          element={
            <RedBackgroundWrapper>
              <Seller />
            </RedBackgroundWrapper>
          }
        />
        <Route
          path="/transaction-history"
          element={
            <RedBackgroundWrapper>
              <TransactionHistory />
            </RedBackgroundWrapper>
          }
        />
        <Route
          path="/change-background"
          element={
            <RedBackgroundWrapper>
              <ChangeBackground />
            </RedBackgroundWrapper>
          }
        />
        <Route
          path="/change-password"
          element={
            <RedBackgroundWrapper>
              <ChangePassword />
            </RedBackgroundWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
