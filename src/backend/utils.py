import math
import numpy as np

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

def reshape_matrix(matriz, nuevo_ancho, nuevo_alto):
    # Obtiene las dimensiones originales
    alto_original, ancho_original = matriz.shape
    
    # Crea una nueva matriz para almacenar los datos redimensionados
    matriz_redimensionada = np.zeros((nuevo_alto, nuevo_ancho), dtype=matriz.dtype)
    
    # Calcula los factores de escala
    factor_y = alto_original / nuevo_alto
    factor_x = ancho_original / nuevo_ancho
    
    for i in range(nuevo_alto):
        for j in range(nuevo_ancho):
            # Encuentra las coordenadas correspondientes en la matriz original
            x_original = int(j * factor_x)
            y_original = int(i * factor_y)
            matriz_redimensionada[i, j] = matriz[y_original, x_original]
    
    return matriz_redimensionada

def get_new_size(image, ancho, alto):
  o_alto, o_ancho = image.shape
  n_alto, n_ancho = alto, ancho
  
  resize_ratio = min(n_alto/o_alto, n_ancho/o_ancho)
  new_width = int(o_ancho * resize_ratio)
  new_height = int(o_alto * resize_ratio)
  return new_width, new_height, resize_ratio