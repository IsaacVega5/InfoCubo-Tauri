import spectral.io.envi as envi
import numpy as np
import cv2
from io import BytesIO
from PIL import Image
import math, time, json
import services.transformation as tf
import os
import pandas as pd
import utils as ut

def read_envi(path, band, rotation=0):
  path = path.replace('"', "")
  image = path.replace('.hdr', "")
  file = path
  image = envi.open(file, image)
  
  if int(band) > image.shape[2]:
    return "error"
  
  banda = image.read_band(int(band))
  
  banda = cv2.normalize(banda, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
  if rotation != 0:
    banda = tf.rotate_matrix(banda, float(rotation) *-1)

  img = Image.fromarray(banda)
  buffered = BytesIO()
  img.save(buffered, format="PNG")
  buffered.seek(0)
  return buffered, (banda.shape[0], banda.shape[1], image.shape[2])

def read_envi_info(path):
  path = path.replace('"', "")
  image = path.replace('.hdr', "")
  file = path
  image = envi.open(file, image)
  
  return{
    "shape" : image.shape,
  }

def read_envi_pixel(path, x, y):
  path = path.replace('"', "")
  image = path.replace('.hdr', "")
  file = path
  image = envi.open(file, image)
  int_x = math.floor(float(x))
  int_y = math.floor(float(y))
  
  if 0 > int_y or int_y > image.shape[0] or 0 > int_x or int_x > image.shape[1]:
    return{
      "error" : "Out of bounds"
    }
  
  pixel = image.read_pixel(int_y, int_x)
  info = [ float(i) for i in pixel ]
  
  return {
    "coords" : [int_x, int_y],
    "value" : info
  }

  
def save_envi(image_path, output_path, rotation=0, cut_points=[None, None], metadata = True):
  path = image_path.replace('"', "")
  output_path = output_path.replace('"', "")
  image = path.replace('.hdr', "")
  image = envi.open(path, image)
  cut_points = json.loads(cut_points)
  metadata = hdr_info_file(path) if str(metadata).lower() == 'true' else {}
  metadata['creation'] = time.ctime()
  metadata['software'] = 'InfoCubo'

  test = np.zeros((image.shape[0], image.shape[1]))
  if cut_points[1] != None and cut_points[1] != 'null':
    zone = tf.get_crop_zone(cut_points)
    test_shape = (zone[0], zone[1], image.shape[2])
  else:
    test_shape = tf.get_new_size(test, float(rotation))
  shape = (test_shape[1], test_shape[0], image.shape[2])
  del test, test_shape
  img = envi.create_image(
    hdr_file = output_path,
    shape = shape,
    metadata = metadata,
    ext = '',
    dtype=image.dtype,
    force = True
  )
  
  mm = img.open_memmap(writable=True)
  for i in range(image.shape[2]):
    channel = image.read_band(i)
    if float(rotation) != 0:
      channel = tf.rotate_matrix(channel, float(rotation) *-1)
    if cut_points[1] != None and cut_points[1] != 'null':
      points = [(math.floor(float(cut_points[0]['x'])), math.floor(float(cut_points[0]['y']))), 
                (math.floor(float(cut_points[1]['x'])), math.floor(float(cut_points[1]['y'])))]
      channel = tf.crop_matrix(channel, points)
    mm[:, :, i] = channel
    
  return output_path

def export_channels(image_path, output_path, rotation=0, cut_points=[None, None], metadata = True, waves = True, channel_range = False):
  path = image_path.replace('"', "")
  output_path = output_path.replace('"', "")
  image = path.replace('.hdr', "")
  image = envi.open(path, image)
  cut_points = json.loads(cut_points)
  wavelength = [] if 'wavelength' not in image.metadata else image.metadata['wavelength']
  channel_range = json.loads(channel_range) if channel_range != False else {'min': 0, 'max': image.shape[2]-1}
  
  #Crear directorio si no existe
  if not os.path.exists(output_path):
    os.makedirs(output_path)
  
  if str(metadata).lower() == 'true':
    metadata = hdr_info_file(path)
    metadata['creation'] = time.ctime()
    metadata['software'] = 'InfoCubo'
    metadata['wavelength'] = wavelength
    
    text = ""
    for key, value in metadata.items():
      text += key + ": " + str(value) + "\n"
    
    ut.create_txt(output_path, '/metadata.txt', text)
  
  for i in range(image.shape[2]):
    if channel_range['min'] > i or i > channel_range['max']:
      continue
    channel = image.read_band(i)
    if float(rotation) != 0:
      channel = tf.rotate_matrix(channel, float(rotation) *-1)
    if cut_points[1] != None and cut_points[1] != 'null':
      points = [(math.floor(float(cut_points[0]['x'])), math.floor(float(cut_points[0]['y']))), 
                (math.floor(float(cut_points[1]['x'])), math.floor(float(cut_points[1]['y'])))]
      channel = tf.crop_matrix(channel, points)
    
    img = Image.fromarray(channel)
    name = output_path + '/' + str(i) 
    name = name if str(waves).lower() == 'false' or len(wavelength) < image.shape[2] else name + '_' + wavelength[i]
    img.save(name + '.tif')
    
  return output_path

def hdr_info_file(path):
  file = open(path, 'r')
  lines = file.readlines()

  metadata = {}
  past_key = ''
  for line in lines:
    line = line.strip()
    if line == 'ENVI': continue
    if '=' in line:
      key, value = line.split('=')
      metadata[key.strip()] = value.strip()
      past_key = key.strip()
    else:
      metadata[past_key] += line

  metadata['description'] = metadata['description'].replace('{', '').replace('}', '')
  file.close()
  return metadata