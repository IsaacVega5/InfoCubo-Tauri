import { event } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { lazy, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import ImageCanvas from "./components/ImageCanvas.tsx";
import { ImageTabs } from "./components/ImageTabs.tsx";
import LeftBar from "./components/LeftBar.tsx";
import ToolsBar from "./components/ToolsBar.tsx";
import { useWebSocket } from "./hooks/useWebSocket";
import { useLoader } from "./hooks/useLoader.tsx";
import { wsEvents } from "./constants/wsEvents.tsx";
import Loader from "./components/Loader.tsx";
import useToolBar from "./hooks/useToolBar.tsx";

const DropFile = lazy(() => import('./components/DropFile.tsx'));
// const Loader = lazy(() => import('./components/Loader.tsx'));

function App() {
  const { loadingProcess } = useLoader()
  const ws = useWebSocket()
  const appWindow = getCurrentWindow()
  const [showDropFile, setShowDropFile] = useState(false)
  const { addPixelData } = useToolBar()
  const { subscribe, unsubscribe } = useWebSocket()
  const { addProcess, removeProcess } = useLoader()

  appWindow.listen(event.TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
    ws.sendMessage(wsEvents.KILL_APP)
    await appWindow.destroy()
  })

  listen(event.TauriEvent.DRAG_ENTER, () => setShowDropFile(true))
  listen(event.TauriEvent.DRAG_LEAVE, () => setShowDropFile(false))
  

  useEffect(() => {
    const dropEvent = listen(event.TauriEvent.DRAG_DROP, (event : event.Event<any>) => {
      setShowDropFile(false)
      
      const paths = event.payload.paths
      paths.forEach((path: string) => {
        if (path.endsWith('.hdr')) {
          ws.sendMessage('read_image', {
            'path': path,
            'band': 'RGB',
            'rotation': 0
          })
        } else {
          console.error('Unsupported file type:', path)
          toast.error('Unsupported file type (.hdr only)', {
            duration: 3000,
          })
        }    
      })

      addProcess(wsEvents.READ_IMAGE)
      
    })

    return () => {
      dropEvent.then((dropEvent) => dropEvent())
    }
  }, [ws])

  useEffect(() => {
    subscribe(wsEvents.READ_IMAGE_PIXEL, (data:any) => {
      addPixelData(data.id, data.path, data.data, {x: data.x, y: data.y}, data.rotation)
      removeProcess(wsEvents.READ_IMAGE_PIXEL)
      
    })

    return () => {
      unsubscribe(wsEvents.READ_IMAGE_PIXEL, () => {})
    }
  }, [])

  return (
    <main className="h-screen w-full flex">
      <LeftBar/>
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: '#222222',
          color: 'white',
          width: 'fit-content'
        }
      }}/>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <ImageTabs/>
        <ToolsBar/>
        <ImageCanvas/>
      </div>

      {showDropFile && <DropFile/>}
      
      {loadingProcess.length > 0 && <Loader/>}
    </main>
  );
}

export default App;
