import uuid
from spectral import get_rgb
import spectral.io.envi as envi
from utils.helpers import get_metadata
import utils.transformation as tf
import numpy as np

async def read_image_area(path, rotation = 0, area = {'x1': 0, 'y1': 0, 'x2': 0, 'y2': 0}, request = None):
  image = envi.open(path, path.replace('.hdr', ''))
  
  try:
    image = image.load()
  except:
    return {
      'error': 'Error reading image'
    }
  
  if rotation != 0:
    image = tf.rotate_matrix(image, float(rotation) *-1)
  
  min_y = min(area['y1'], area['y2'])
  max_y = max(area['y1'], area['y2'])
  min_x = min(area['x1'], area['x2'])
  max_x = max(area['x1'], area['x2'])
  
  image = image[min_y:max_y, min_x:max_x].tolist()
  print(len(image[0][0]))
  mean, min, max = [], [], []
  for i in range(len(image[0][0])):
    mean.append(np.mean(image[0][0][i]))
    min.append(np.min(image[0][0][i]))
    max.append(np.max(image[0][0][i]))
    
  return {
    'id' : str(uuid.uuid4()),
    'path': path,
    'rotation': rotation,
    'cords': {
      'x1': min_x,
      'y1': min_y,
      'x2': max_x,
      'y2': max_y
    }
  }
  