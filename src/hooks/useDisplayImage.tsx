import { useContext } from "react";
import { DisplayImageContext } from "../context/DisplayImageContex";

export const useDisplayImage = () => {
  const context = useContext(DisplayImageContext);
  if (!context) {
    throw new Error("useDisplayImage must be used within a DisplayImageProvider");
  }
  return context
}