import uuid
from spectral import get_rgb
import spectral.io.envi as envi
from utils.helpers import get_metadata
import utils.transformation as tf

async def read_image_pixel(path, rotation = 0, x=0, y=0, request = None):
  image = envi.open(path, path.replace('.hdr', ''))
  
  try:
    image = image.load()
  except:
    return {
      'error': 'Error reading image'
    }
  
  if rotation != 0:
    image = tf.rotate_matrix(image, float(rotation) *-1)
  
  pixel = image[y,x].tolist()
  
  return {
    'id' : str(uuid.uuid4()),
    'path': path,
    'rotation': rotation,
    'data': pixel,
    'x': x,
    'y': y
  }
  
  
  