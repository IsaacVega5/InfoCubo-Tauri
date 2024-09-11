import numpy as np

def ndvi(r450, r550):
  return (r450 - r550) / (r450 + r550)

def pri(r550, r570):
  return (r550 - r570) / (r550 + r570)

def savi(r670, r840):
  return ((r840 - r670) / (r840 + r670 + 0.5)) * (1 + 0.5)

def mcari(r550, r670, r700):
  return ((r700 - r670) - (0.2 * (r700 - r550))) * (r700 / r670)

def wbi(r900, r950):
  return np.where(r950 != 0, r900 / r950, 0)

def rdvi(r670, r840):
  return (r840 - r670) / np.square(r840 + r670)

def evi(r450, r670, r840):
  return 2.5 * ( (r840 - r670) / r840 + 6 * r670 - 7.5 * r450 + 1)

def ari2(r550, r700, r840):
  return r840 * ((1 / r550) - ( 1 / r700))

def cri2(r550, r700):
  return (1 / r550) - (1 / r700)