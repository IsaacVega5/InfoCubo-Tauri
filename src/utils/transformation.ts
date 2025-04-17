
/**
 * Given an image size and a new size, returns the new size that fits the image
 * in the new size maintaining the aspect ratio, and the resize ratio.
 * @param {{image_size: [number, number], new_size : [number, number]}} args
 * @returns {[number, number, number]}
 */
export function get_new_size ({imageSize, newSize}: {imageSize: [number, number], newSize : [number, number]}) {
  const [o_ancho, o_alto] = imageSize
  const [n_ancho, n_alto] = newSize

  const resize_ratio = Math.min(n_alto/o_alto, n_ancho/o_ancho)
  const new_width = Math.floor(o_ancho * resize_ratio)
  const new_height = Math.floor(o_alto * resize_ratio)
  return {
    width: new_width,
    height: new_height,
    ratio: resize_ratio
  }
}