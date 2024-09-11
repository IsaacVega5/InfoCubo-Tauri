export const drawGrid = (ctx, width, height, cellSize = 50) => {
  ctx.strokeStyle = 'rgba(78, 191, 113)'; // Color de las líneas
  ctx.lineWidth = 2; // Ancho de las líneas

  ctx.setLineDash([30, 30])

  // Dibujar líneas verticales
  for (let x = cellSize; x < width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Dibujar líneas horizontales
  for (let y = cellSize; y < height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}