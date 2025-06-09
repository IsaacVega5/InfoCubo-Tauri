import math


def concat_list(list):
  string = ""
  for i in list:
    string += i
  return string

def create_txt(path,name, text):
  file = open(path + name, "w")
  file.write(text)
  file.close()

def extract_hdr(path):
  path = path.replace('"', "")
  image = path.replace('.hdr', "")
  return path, image

def cut_points_to_array(cut_points):
  points = [(math.floor(float(cut_points[0]['x'])), math.floor(float(cut_points[0]['y']))), 
            (math.floor(float(cut_points[1]['x'])), math.floor(float(cut_points[1]['y'])))]
  return points


def get_new_size(image, container):
  o_alto, o_ancho = image
  n_alto, n_ancho = container
  
  resize_ratio = min(n_alto/o_alto, n_ancho/o_ancho)
  new_width = int(o_ancho * resize_ratio)
  new_height = int(o_alto * resize_ratio)
  return new_width, new_height, resize_ratio

def get_metadata(path):
  file = open(path, 'r')
  lines = file.readlines()

  metadata = {}
  past_key = ''
  for line in lines:
    line = line.strip()
    if line == 'ENVI': 
      continue
    if '=' in line:
      list_line = line.split('=')
      key = list_line[0].strip()
      value = '='.join(list_line[1:])
      metadata[key.strip()] = value.strip()
      past_key = key.strip()
    else:
      metadata[past_key] += line

  if metadata.get('description') is not None:
    metadata['description'] = metadata['description'].replace('{', '').replace('}', '')
  file.close()
  return metadata