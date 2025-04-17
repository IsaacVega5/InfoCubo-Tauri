import { useContext } from "react";
import { ToolsBarContext } from "../context/ToolsBarContext";

export default function useToolBar() {
  const context = useContext(ToolsBarContext);
  if (!context) {
    throw new Error("useToolBar must be used within a ToolsBarProvider");
  }  
  return context
}