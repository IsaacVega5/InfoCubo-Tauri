import numpy as np
import cv2
import math

def get_new_size(img, angle):
  size_reverse = np.array(img.shape[1::-1]) # swap x with y
  M = cv2.getRotationMatrix2D(tuple(size_reverse / 2.), angle, 1.)
  MM = np.absolute(M[:,:2])
  size_new = MM @ size_reverse
  return size_new.astype(int)
  
def rotate_matrix(img, angle):
  size_reverse = np.array(img.shape[1::-1]) # swap x with y
  M = cv2.getRotationMatrix2D(tuple(size_reverse / 2.), angle, 1.)
  MM = np.absolute(M[:,:2])
  size_new = MM @ size_reverse
  M[:,-1] += (size_new - size_reverse) / 2.
  return cv2.warpAffine(img, M, tuple(size_new.astype(int)))

def rotation_matrix(img, angle):
  size_reverse = np.array(img.shape[1::-1]) # swap x with y
  M = cv2.getRotationMatrix2D(tuple(size_reverse / 2.), angle, 1.)
  MM = np.absolute(M[:,:2])
  size_new = MM @ size_reverse
  M[:,-1] += (size_new - size_reverse) / 2.
  return M
 
def crop_matrix(img, points):
  a_point = min(points[0][0], points[1][0]), min(points[0][1], points[1][1])
  b_point = max(points[0][0], points[1][0]), max(points[0][1], points[1][1])
  
  return img[a_point[1]:b_point[1], a_point[0]:b_point[0]]

def get_crop_zone(points):
  """
    Calcula el area de la zona de recorte en base a una tupla de objetos con coordenadas
    
    points: [{x: x1, y: y1}, {x: x2, y: y2}]
  """
  left = math.floor(min(float(points[0]['x']), float(points[1]['x'])))
  top = math.floor(min(float(points[0]['y']), float(points[1]['y'])))
  right = math.floor(max(float(points[0]['x']), float(points[1]['x'])))
  bottom = math.floor(max(float(points[0]['y']), float(points[1]['y'])))
  
  return right - left, bottom - top