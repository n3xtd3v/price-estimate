import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import DataProvider from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);
