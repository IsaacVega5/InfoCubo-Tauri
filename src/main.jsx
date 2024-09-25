import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from 'react-hot-toast';
import { HiperImgProvider } from "./context/hiperImg.jsx";
import { ToolsProvider } from "./context/tools.jsx";
import { OptionDialogProvider } from "./context/OptionDialog.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HiperImgProvider>
    <ToolsProvider>
      <OptionDialogProvider>
        <App />
        <Toaster position="bottom-center" toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          }
        }}/>
      </OptionDialogProvider>
    </ToolsProvider>
  </HiperImgProvider>
);
