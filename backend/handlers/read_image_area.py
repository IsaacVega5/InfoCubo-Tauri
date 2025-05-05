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
  
  min_y = min_y if min_y >= 0 else 0
  max_y = max_y if max_y < image.shape[0] else image.shape[0]
  min_x = min_x if min_x >= 0 else 0
  max_x = max_x if max_x < image.shape[1] else image.shape[1]
  
  image = image[min_y:max_y, min_x:max_x]
  mean_list, min_list, max_list = [], [], []
  for i in range(image.shape[2]):
    mean_list.append(float(np.mean(image[:,:,i])))
    min_list.append(float(np.min(image[:,:,i])))
    max_list.append(float(np.max(image[:,:,i])))
    
  return {
    'id' : str(uuid.uuid4()),
    'path': path,
    'rotation': rotation,
    'cords': {
      'x1': min_x,
      'y1': min_y,
      'x2': max_x,
      'y2': max_y
    },
    'data': {
      'mean': mean_list,
      'min': min_list,
      'max': max_list,
    }
  }
  