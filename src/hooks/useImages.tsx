import { useContext } from "react"
import { ImagesContext } from "../context/ImagesContext"

export const useImages = () => {
  const context = useContext(ImagesContext)
  if (!context) {
    throw new Error("useImages must be used within an ImagesProvider")
  }
  return context
}