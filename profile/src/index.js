import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import { ThemeProviderWrapper } from "./context/ThemeContext";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import { Analytics } from "@vercel/analytics/react"; // Import Vercel Analytics
import { SpeedInsights } from "@vercel/speed-insights/react"; // Import Speed Insights

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <Provider store={store}>
        <Router>
          <App />
          <Analytics /> {/* Add Vercel Analytics */}
          <SpeedInsights /> {/* Vercel Speed Insights for performance monitoring */}
        </Router>
      </Provider>
    </ThemeProviderWrapper>
  </React.StrictMode>
);
