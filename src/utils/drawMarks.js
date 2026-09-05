export function drawOverlapMarks(ctx, tile) {
  if (tile.overlapPx <= 0) return;

  const lineWidth = Math.max(1, tile.destWidth * 0.0008);
  const offset = lineWidth;

  ctx.save();
  ctx.globalCompositeOperation = "difference";
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([lineWidth * 4, lineWidth * 2]);
  ctx.beginPath();

  if (tile.hasRightOverlap) {
    const x = tile.destWidth - tile.overlapPx + offset;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, tile.destHeight);
  }

  if (tile.hasBottomOverlap) {
    const y = tile.destHeight - tile.overlapPx + offset;
    ctx.moveTo(0, y);
    ctx.lineTo(tile.destWidth, y);
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * Dibuja marcas de corte profesionales (esquinas en ángulo) en jsPDF
 */
export function drawPdfCropMarks(pdf, x, y, width, height, length = 4, gap = 1) {
  pdf.saveGraphicsState();
  pdf.setLineWidth(0.2);
  pdf.setDrawColor(80, 80, 80);

  const x2 = x + width;
  const y2 = y + height;

  // Esquina Superior Izquierda
  pdf.line(x - gap - length, y, x - gap, y);
  pdf.line(x, y - gap - length, x, y - gap);

  // Esquina Superior Derecha
  pdf.line(x2 + gap, y, x2 + gap + length, y);
  pdf.line(x2, y - gap - length, x2, y - gap);

  // Esquina Inferior Izquierda
  pdf.line(x - gap - length, y2, x - gap, y2);
  pdf.line(x, y2 + gap, x, y2 + gap + length);

  // Esquina Inferior Derecha
  pdf.line(x2 + gap, y2, x2 + gap + length, y2);
  pdf.line(x2, y2 + gap, x2, y2 + gap + length);

  pdf.restoreGraphicsState();
}

/**
 * Dibuja marcas de corte profesionales en Canvas (para ZIP)
 */
export function drawCanvasCropMarks(ctx, x, y, width, height, length = 15, gap = 4) {
  ctx.save();
  ctx.strokeStyle = "rgba(100, 100, 100, 0.9)";
  ctx.lineWidth = Math.max(1, ctx.canvas.width * 0.0006);

  const x2 = x + width;
  const y2 = y + height;

  ctx.beginPath();
  // Superior Izquierda
  ctx.moveTo(x - gap - length, y);
  ctx.lineTo(x - gap, y);
  ctx.moveTo(x, y - gap - length);
  ctx.lineTo(x, y - gap);

  // Superior Derecha
  ctx.moveTo(x2 + gap, y);
  ctx.lineTo(x2 + gap + length, y);
  ctx.moveTo(x2, y - gap - length);
  ctx.lineTo(x2, y - gap);

  // Inferior Izquierda
  ctx.moveTo(x - gap - length, y2);
  ctx.lineTo(x - gap, y2);
  ctx.moveTo(x, y2 + gap);
  ctx.lineTo(x, y2 + gap + length);

  // Inferior Derecha
  ctx.moveTo(x2 + gap, y2);
  ctx.lineTo(x2 + gap + length, y2);
  ctx.moveTo(x2, y2 + gap);
  ctx.lineTo(x2, y2 + gap + length);

  ctx.stroke();
  ctx.restore();
}

