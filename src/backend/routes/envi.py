from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from services import hiper

router = APIRouter(
  prefix="/envi",
  tags=["envi"],
  responses={404: {"description": "Not found"}},
)

@router.get("/")
def read_envi(path, band, rotation=0, reshape=[None, None]):
  img, shape = hiper.read_envi(path, band, rotation, reshape)
  return StreamingResponse(img, media_type="image/png", headers={"X-shape": ",".join([str(i) for i in shape])})
  
@router.get("/info/")
def read_envi_info(path):
    info = hiper.read_envi_info(path)
    return info

@router.get("/pixel/")
def read_envi_pixel(path, x, y): 
  res = hiper.read_envi_pixel(path, x, y)
  return res

@router.get("/save/")
def save_envi(image_path, output_path, 
              rotation=0, cut_points=[None, None],
              metadata = True):
  try:
    res = hiper.save_envi(image_path, output_path, rotation, cut_points, metadata)
    return {
      "path": res
    }
  except Exception as e:
    return {
      "error": str(e)
    }

@router.get("/export/channels")
def export_channels(image_path, output_path, 
                    rotation=0, cut_points=[None, None], 
                    metadata = True, waves = True,
                    channel_range = {min: 0, max: 0}):
  try:
    res = hiper.export_channels(image_path, output_path, rotation, cut_points, metadata, waves, channel_range)
    return {
      "path": res
    }
  except Exception as e:
    return {
      "error": str(e)
    }
    
