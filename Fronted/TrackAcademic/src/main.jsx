import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { UserProvider } from "./provider/UserProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider> {}
        <App />
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>
);