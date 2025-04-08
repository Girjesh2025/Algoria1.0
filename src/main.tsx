import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Get the root element
const rootElement = document.getElementById("root");

// Check if rootElement exists
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Create root and render App
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
