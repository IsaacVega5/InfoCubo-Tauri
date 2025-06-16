import ReactDOM from "react-dom/client";
import App from "./App";

import { Command } from '@tauri-apps/plugin-shell';
import { WebSocketProvider } from "./context/WebSocketContext";
import { ImagesProvider } from "./context/ImagesContext";
import { LoaderProvider } from "./context/LoaderContext";
import { ToolsBarProvider } from "./context/ToolsBarContext";
import { DisplayImagesProvider } from "./context/DisplayImageContex";
import { invoke } from "@tauri-apps/api/core";

const port = await invoke("free_port") as number;
async function execute_binary() {
    const command = Command.sidecar('../backend/dist/infocubo-backend', ["--port", port.toString()]);
    await command.execute();
}
execute_binary()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DisplayImagesProvider>
    <ToolsBarProvider>
      <LoaderProvider>
          <ImagesProvider>
            <WebSocketProvider url={`ws://localhost:${port}/ws`}>
              <App />
            </WebSocketProvider>
          </ImagesProvider>
      </LoaderProvider>
    </ToolsBarProvider>
  </DisplayImagesProvider>
);
