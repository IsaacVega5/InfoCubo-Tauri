import PyInstaller.__main__
import PyInstaller.config

PyInstaller.__main__.run([
    'backend/main.py',
    '--name', 'infocubo-backend-x86_64-pc-windows-msvc',
    '--workpath', './backend/build',
    '--distpath', './backend/dist',
    '--clean',
    '--onefile',
])