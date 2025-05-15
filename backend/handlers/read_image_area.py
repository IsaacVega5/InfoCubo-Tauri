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
  
  # min_y = min(area['y1'], area['y2'])
  # max_y = max(area['y1'], area['y2'])
  # min_x = min(area['x1'], area['x2'])
  # max_x = max(area['x1'], area['x2'])
  print(area)
  for coord in area.keys():
    if area[coord] < 0: area[coord] = 0
    if coord[0] == 'x':
      if area[coord] > image.shape[1]: area[coord] = image.shape[1]
    elif coord[0] == 'y':
      if area[coord] > image.shape[0]: area[coord] = image.shape[0]
  
  min_y = min(area['y1'], area['y2'])
  max_y = max(area['y1'], area['y2'])
  min_x = min(area['x1'], area['x2'])
  max_x = max(area['x1'], area['x2'])
 
  print(min_y, max_y, min_x, max_x)
  print(image.shape[0], image.shape[1])
  if min_y == max_y or min_x == max_x:
    return {
      'error': 'Invalid area'
    }
  
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
    'coords': {
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
  