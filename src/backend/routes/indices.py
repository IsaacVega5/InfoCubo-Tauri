from fastapi import APIRouter
from services import indices as ind

router = APIRouter(
  prefix="/indices",
  tags=["indices"],
  responses={404: {"description": "Not found"}},
)

@router.get("/list")
def read_indices():
  indices = [item['name'] for item in ind.indices]
  return indices

@router.get("/export/{indice}")
def export_ndvi(indice, image_path, output_path, rotation=0, cut_points=[None, None]):
  return ind.get_indice(indice, image_path, output_path, rotation, cut_points)