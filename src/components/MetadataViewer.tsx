import { useEffect, useState } from "react";
import { useImages } from "../hooks/useImages";

export default function MetadataViewer() {
  const { currentImage } = useImages();
  const [metadata , setMetadata] = useState<any>(null);
  useEffect(() => {
    const image = currentImage
    if (!image) {
      setMetadata(null);
      return;
    }
    const json = JSON.parse(JSON.stringify(image?.metadata));
    setMetadata(json);
  }
  , [currentImage]);

  return (
    <div className="flex flex-col gap-2 w-full aspect-[1/2] bg-[#272727] overflow-scroll">
      {
        metadata ? (
          Object.entries(metadata).map(([key, value] : any) => {
            return (
              <div key={key} className="text-sm flex flex-row text-white gap-.5 font-mono" title={`${key}: ${value}`}>
                <strong className="text-xs">{key}:</strong>
                {
                  typeof value == "string" ? (
                    <p className="text-xs whitespace-nowrap">{value}</p>
                  ) : (
                    <select> 
                      {
                        value?.map((item : any) => {
                          return (
                            <option key={item} value={item} className="text-xs bg-custom-lighter-black whitespace-nowrap">	
                              {item}
                            </option>
                          )
                        })
                      }
                    </select>
                  )
                  
                  
                }

              </div>
            )
          }) 
        ) : (
          <div className="text-sm text-white">
            No metadata available
          </div>
        )
      }
    </div>
  )
}