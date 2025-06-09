import json
import traceback

from aiohttp import web
from cache import image_cache
from handlers import kill_app, read_image, read_image_area, read_image_pixel

app = web.Application()

routes = web.RouteTableDef()
# Sirve archivos estáticos (HTTP)
@routes.get('/image/{image_id}')
async def image_get(request):
  image_id = request.match_info['image_id']
  if image_id in image_cache:
    return web.Response(
      body=image_cache[image_id],
      content_type='image/png'
    )
  return web.Response(status=404)


# Mapeo de eventos a handlers
event_handlers = {
  'read_image': read_image,
  'read_image_pixel': read_image_pixel,
  'read_image_area': read_image_area,
  'kill_app': kill_app
}

async def websocket_handler(request):
  try:
    ws = web.WebSocketResponse()
    await ws.prepare(request) 
    print("WebSocket connection established")
    async for msg in ws:
        json_data = json.loads(msg.data)
        fcn = json_data.get('fcn')
        args = json_data.get('args')
        handler = event_handlers.get(fcn)
        if handler:
          response = await handler(*args.values(), request = request)
          await ws.send_json({
            'fcn': fcn,
            'response': response,
          })
        else:
          await ws.send_json({"error": "Function not found"})
          print(f"Function {fcn} not found")
          
  except ConnectionResetError:
        print("Cliente se desconectó abruptamente")
  except Exception as e:
        print(f"Error inesperado: {e}")
        print(traceback.format_exc())
  finally:
        if ws:
            await ws.close()
  return ws

app.add_routes(routes)
app.router.add_get('/ws', websocket_handler)

web.run_app(app, port=8765)