import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import { ThemeProviderWrapper } from "./context/ThemeContext";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </ThemeProviderWrapper>
  </React.StrictMode>
);
