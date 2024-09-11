import { useState } from "react";
import "./App.css";
import ImageViewer from "./components/ImageViewer.jsx";
import LeftBar from "./components/LeftBar.jsx";
import ToolBar from "./components/ToolBar.jsx";
import OptionsDialogs from "./components/windows/Dialogs/OptionsDialogs.jsx";
import ExportOptions from "./components/windows/Dialogs/ExportOptions.jsx";

function App() {
  const [loader, setLoader] = useState(false)

  return (
    <div className="App">
      <LeftBar></LeftBar>
        <div className="body-container">
          <ToolBar setLoader={setLoader}/>
          <ImageViewer loader={loader} setLoader={setLoader}/>
        </div>
      <ExportOptions setLoader={setLoader}/>
      <OptionsDialogs />
    </div>
  );
}

export default App;
