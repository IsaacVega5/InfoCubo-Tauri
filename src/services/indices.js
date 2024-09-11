const BACKEND_URL = "http://localhost:8008/indices"

export async function getList() {
  const res = await fetch(`${BACKEND_URL}/list`)
  const json = await res.json()

  return json
}

export async function getIndices({indice, imagePath, outputPath, rotation, cutPoints}) {
  const res = await fetch(`${BACKEND_URL}/export/${indice}/?image_path="${imagePath}"&output_path=${outputPath}"&rotation=${rotation}&cut_points=${cutPoints}`)
  const json = await res.json()
  if (json.error) {
    throw new Error(json.error)
  }
  return json
}