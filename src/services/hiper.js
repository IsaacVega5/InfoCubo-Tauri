
const BACKEND_URL = "http://localhost:8008/envi"

export let getPixelInfo = async ({path, x, y}) =>{
  let result = await fetch(`${BACKEND_URL}/pixel/?path="${path}"&x=${x}&y=${y}`)
  let json = await result.json()

  return {
    value: json.value ? json.value : null,
    coords: json.coords ? json.coords : null,
    error: json.error ? json.error : null
  }
}

export let getImgUrl = async ({path,channel=0,rotation=0}) =>{
  const response = await fetch(`${BACKEND_URL}/?path="${path}"&band=${channel}&rotation=${rotation}`)
  
  return {
    url: response.url,
    shape: response.headers.get('X-shape').split(',')
  }
}

export let getInfo = async ({path}) =>{
  const response = await fetch(`${BACKEND_URL}/info/?path="${path}"`)
  const json = await response.json()
  return json.shape
}

export let saveHiper = async ({imagePath, outputPath, rotation, cutPoints=[null, null], metadata=true}) =>{
  const response = await fetch(`${BACKEND_URL}/save/?image_path="${imagePath}"&output_path=${outputPath}"&rotation=${rotation}&cut_points=${cutPoints}&metadata=${metadata}`)
  const json = await response.json()
  return json
}

export let exportChannels = async ({imagePath, outputPath, rotation, cutPoints=[null, null], metadata = true, waves = true, channelRange = {min: 0, max: 0}}) =>{
  const response = await fetch(`${BACKEND_URL}/export/channels/?image_path="${imagePath}"&output_path=${outputPath}"&rotation=${rotation}&cut_points=${cutPoints}&metadata=${metadata}&waves=${waves}&channel_range=${JSON.stringify(channelRange)}`)
  const json = await response.json()
  return json
}

// export let exportIndices = async ({imagePath, outputPath, rotation, cutPoints=[null, null], waves = true}) =>{
//   const response = await fetch(`${BACKEND_URL}/export/?image_path="${imagePath}"&output_path=${outputPath}"&rotation=${rotation}&cut_points=${cutPoints}&waves=${waves}`)
//   const json = await response.json()
//   return json
// }