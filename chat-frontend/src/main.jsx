import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/ChatApplication">
        <div className="w-full min-h-screen overflow-x-hidden bg-[#0b1220]">
          <App />
        </div>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
