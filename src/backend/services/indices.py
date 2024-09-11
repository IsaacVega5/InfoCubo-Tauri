from services import formulas as fm
from services import transformation as tf
import utils as ut
from classes.HiperImg import HiperImg
import json
from PIL import Image

indices = [
  {
    'name': 'ndvi',
    'formula': fm.ndvi,
    'params': ['r450', 'r550']
  },{
    'name': 'pri',
    'formula': fm.pri,
    'params': ['r550', 'r570']
  },{
    'name': 'savi',
    'formula': fm.savi,
    'params': ['r670', 'r840']
  },{
    'name': 'mcari',
    'formula': fm.mcari,
    'params': ['r550', 'r670', 'r700']
  },{
    'name': 'wbi',
    'formula': fm.wbi,
    'params': ['r900', 'r950']
  },{
    'name': 'rdvi',
    'formula': fm.rdvi,
    'params': ['r670', 'r840']
  },{
    'name': 'evi',
    'formula': fm.evi,
    'params': ['r450', 'r670', 'r840']
  },{
    'name': 'ari2',
    'formula': fm.ari2,
    'params': ['r550', 'r700', 'r840']
  },{
    'name': 'cri2',
    'formula': fm.cri2,
    'params': ['r550', 'r700']
  }
]
  
def get_indice(indice, image_path, output_path, rotation=0, cut_points=[None, None]):
  hiperImg = HiperImg(image_path)
  output_path = output_path.replace('"', "")
  cut_points = json.loads(cut_points)
  # cut_points = ut.cut_points_to_array(json.loads(cut_points)) if cut_points != [None, None] else [None, None]
  
  if indice in hiperImg.indices:
    try:
      matrix = hiperImg.indices[indice]
      matrix = tf.rotate_matrix(matrix, float(rotation) *-1) if float(rotation) != 0 else matrix
      if cut_points[1] != None and cut_points[1] != 'null':
        cut_points = ut.cut_points_to_array(cut_points)
        matrix = tf.crop_matrix(matrix, cut_points)
      matrix = Image.fromarray(matrix)
      matrix.save(output_path)
      return output_path
    except Exception as e:
      return {'error': str(e)}
  else:
    return {'error': 'Formula no encontrada'}