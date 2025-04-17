import ReactDOM from "react-dom/client";
import App from "./App";

import { Command } from '@tauri-apps/plugin-shell';
import { WebSocketProvider } from "./context/WebSocketContext";
import { ImagesProvider } from "./context/ImagesContext";
import { LoaderProvider } from "./context/LoaderContext";
import { ToolsBarProvider } from "./context/ToolsBarContext";

async function execute_binary() {
  const command = Command.sidecar('../backend/dist/infocubo-backend');
  await command.execute();
}
execute_binary();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ToolsBarProvider>
    <LoaderProvider>
        <ImagesProvider>
          <WebSocketProvider url="ws://localhost:8765/ws">
            <App />
          </WebSocketProvider>
        </ImagesProvider>
    </LoaderProvider>
  </ToolsBarProvider>
);
