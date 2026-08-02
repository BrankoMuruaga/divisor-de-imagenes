export function drawOverlapMarks(ctx, tile) {
  if (tile.overlapPx <= 0) return;

  const lineWidth = Math.max(1, tile.destWidth * 0.0005);

  const offset = lineWidth;

  ctx.save();

  ctx.globalCompositeOperation = "difference";
  ctx.strokeStyle = "white";

  ctx.lineWidth = lineWidth;
  ctx.setLineDash([]);
  ctx.beginPath();

  if (tile.hasRightOverlap) {
    // Se suma el offset hacia la derecha
    const x = tile.destWidth - tile.overlapPx + offset;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, tile.destHeight);
  }

  if (tile.hasBottomOverlap) {
    // Se suma el offset hacia abajo
    const y = tile.destHeight - tile.overlapPx + offset;
    ctx.moveTo(0, y);
    ctx.lineTo(tile.destWidth, y);
  }

  ctx.stroke();
  ctx.restore();
}
