# InfoCubo
InfoCubo es una aplicación simple que permite calcular indices de imágenes hiper espectrales y exportar sus bandas, además de rotarlas y cortarlas con un editor integrado.

## Instalación
Basta con descargar el archivo .exe o .msi de https://github.com/IsaacVega5/InfoCubo-Tauri/releases, instalarlo y ejecutarlo dando permisos a fastApi, ya que InfoCubo utiliza un servidor de python para procesar las imágenes.

## Uso

### Cálculo de índices
De forma simplificada esta es la forma de utilizar esta aplicación:
  1. Haz click en `Nueva Imagen`.
  2. Seleccionar el archivo .hdr de la imagen que deseas procesar, ten en cuenta que la imagen debe estar en el mismo directorio y no debe tener ninguna extensión.
  3. Rotar y recortar la imagen como se desee utilizando las herramientas de la barra superior.
  4. Hacer click en `Exportar` en la parte superior derecha.
  5. Seleccionar la forma de exportación, seleccionar la ruta de exportación y hacer click en `Exportar`.

#### Alternativas de exportación
Actualmente hay tres formatos de exportación:
  1. **Hiper espectral (.hdr)**: Permite guardar la imagen rotada y recortada como una imagen con formato .hdr, se podrán conservar los metadatos o eliminar.
  2. **Exportar capas (.tif)**: Exportar diferentes capas o bandas de la imagen en formato .tif, en donde se puede seleccionar si conservar los metadatos ( Se creara un archivo .txt con la información de los metadatos), registrar ondas (En donde junto con el numero de la capa se registraran las ondas correspondientes, si es que se encuentran en los metadatos de la imagen) y seleccionar el rango de ondas que se desea exportar. Se creara una carpeta en donde se guardarán las imágenes.
  3. **Exportar indices**: Permite calcular diferentes indices de la imagen hiper espectral (si se marco y roto la imagen los indices también estarán rotados y cortados) y guardarlos en formato .tif, se pueden seleccionar los que se desea exportar. Se creara una carpeta en donde se guardarán las imágenes.

#### Indices 
Los valores que se obtendrán son los siguientes:
* NDVI
* PRI
* SAVI
* MCARI
* WBI
* RDVI
* EVI
* ARI2
* CRI2

## Autor
- [Isaac Vega Salgado - IsaacVega5](https://github.com/IsaacVega5)
