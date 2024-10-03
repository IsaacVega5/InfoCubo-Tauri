import spectral.io.envi as envi
from services import formulas as fm
from constants import WAVES

class HiperImg:
  def __init__(self, path):
    self.hdr_path = path.replace('"', "")
    self.image_path = self.hdr_path.replace('.hdr', "")
    self.img = envi.open(self.hdr_path, self.image_path)
    self.indices = {
      'ndvi': self.get_envi(),
      'pri': self.get_pri(),
      'savi': self.get_savi(),
      'mcari': self.get_mcari(),
      'wbi': self.get_wbi(),
      'rdvi': self.get_rdvi(),
      'evi': self.get_evi(),
      'ari2': self.get_ari2(),
      'cri2': self.get_cri2()
    }
    
  def get_shape(self):
    return self.img.shape

  def get_metadata(self):
    file = open(self.path, 'r')
    lines = file.readlines()

    metadata = {}
    past_key = ''
    for line in lines:
      line = line.strip()
      if line == 'ENVI': continue
      if '=' in line:
        list_line = line.split('=')
        key = list_line[0].strip()
        value = '='.join(list_line[1:])
        metadata[key.strip()] = value.strip()
        past_key = key.strip()
      else:
        metadata[past_key] += line

    metadata['description'] = metadata['description'].replace('{', '').replace('}', '')
    file.close()
    return metadata
  
  def get_band(self, band):
    index = WAVES[band]
    return self.img.read_band(index)
  
  def get_envi(self):
    return fm.ndvi(self.get_band('r450'), self.get_band('r550'))
  
  def get_pri(self):
    return fm.pri(self.get_band('r550'), self.get_band('r570'))
  
  def get_savi(self):
    return fm.savi(self.get_band('r670'), self.get_band('r840'))

  def get_mcari(self):
    return fm.mcari(self.get_band('r550'), self.get_band('r670'), self.get_band('r700'))
  
  def get_wbi(self):
    return fm.wbi(self.get_band('r900'), self.get_band('r950'))
  
  def get_rdvi(self):
    return fm.rdvi(self.get_band('r670'), self.get_band('r840'))
  
  def get_evi(self):
    return fm.evi(self.get_band('r450'), self.get_band('r670'), self.get_band('r840'))
  
  def get_ari2(self):
    return fm.ari2(self.get_band('r550'), self.get_band('r700'), self.get_band('r840'))
  
  def get_cri2(self):
    return fm.cri2(self.get_band('r550'), self.get_band('r700'))