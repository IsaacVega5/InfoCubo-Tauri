import subprocess
import PyInstaller.__main__
import PyInstaller.config

def get_rustc_host():
    try:
        # Ejecutar el comando y capturar la salida
        output = subprocess.check_output(["rustc", "-Vv"], text=True)
        
        # Buscar la línea que contiene 'host:'
        for line in output.splitlines():
            if line.startswith("host:"):
                # Extraer el valor después de 'host:'
                return line.split(":", 1)[1].strip()
        
        return None
    except subprocess.CalledProcessError:
        raise RuntimeError("Error al ejecutar 'rustc -Vv'\nCodificación de error: " + str(subprocess.CalledProcessError.returncode))

PyInstaller.__main__.run([
    'backend/main.py',
    '--name', f'infocubo-backend-{get_rustc_host()}',
    '--workpath', './backend/build',
    '--distpath', './backend/dist',
    '--clean',
    '--onefile',
])