async def kill_app(websocket):
    """
    Simula la muerte de la aplicación
    """
        # Forzar cierre de la aplicación
    import os
    os._exit(1)