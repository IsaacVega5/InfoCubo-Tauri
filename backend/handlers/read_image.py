import uuid
from spectral import get_rgb
import cv2
import spectral.io.envi as envi
from utils.helpers import get_metadata
import utils.transformation as tf
from cache import image_cache

async def read_image(path, band = 0, rotation = 0,request = None):
  metadata = get_metadata(path)
  
  image = envi.open(path, path.replace('.hdr', ''))
  
  try:
    image = image.read_band(band) if band != 'RGB' else get_rgb(image)
  except:
    return {
      'error': 'Error reading image'
    }
  
  image = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
  
  if rotation != 0:
    image = tf.rotate_matrix(image, float(rotation) *-1)
  
  image_id = str(path.replace('\\', '/').split('/')[-1].split('.')[0] + "&band=" + str(band) + "&rotation=" + str(rotation))
  
  # clean cache
  cache_keys = list(image_cache.keys())
  for key in cache_keys:
    if key.startswith(path.replace('\\', '/').split('/')[-1].split('.')[0]):
      del image_cache[key]
  
  image_cache[image_id] = cv2.imencode('.png', image)[1].tobytes()
  image_url = f"http://{request.host}/image/{image_id}"
  
  return {
    'url': image_url,
    'path': path,
    'band': band,
    'rotation': rotation,
    'metadata': metadata,
    'size': {
      'width': image.shape[1],
      'height': image.shape[0]
    }
  }
  