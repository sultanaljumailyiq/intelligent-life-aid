import React from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { initPWAUpdate } from "./sw-register";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
initPWAUpdate();
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
