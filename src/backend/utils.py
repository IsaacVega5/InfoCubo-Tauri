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
