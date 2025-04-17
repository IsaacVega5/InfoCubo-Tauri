 /**
  * Constantes para eventos de WebSocket
  * @module websocketEvents
*/

export const wsEvents = {
  READ_IMAGE: 'read_image' as const,
  READ_IMAGE_PIXEL: 'read_image_pixel' as const,
  READ_IMAGE_AREA: 'read_image_area' as const,
  KILL_APP: 'kill_app' as const
} as const