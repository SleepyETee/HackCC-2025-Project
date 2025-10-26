export type ViewState = {
  // base world rectangle (your logical graph space)
  base: { xMin: number; xMax: number; yMin: number; yMax: number };
  zoom: number;          // 0.6 ... 2.5
  cx: number; cy: number; // current view center in world units
};

// Given canvas CSS size (W,H), compute current visible rect in world space
export function getRect(v: ViewState, W: number, H: number) {
  const bw = v.base.xMax - v.base.xMin;
  const bh = v.base.yMax - v.base.yMin;
  const vw = bw / v.zoom;
  const vh = bh / v.zoom;
  return { xMin: v.cx - vw/2, xMax: v.cx + vw/2, yMin: v.cy - vh/2, yMax: v.cy + vh/2 };
}

// Converters (world <-> screen CSS pixels)
export function toSx(v: ViewState, W: number, x: number) {
  const r = getRect(v, W, 0);
  return ((x - r.xMin) / (r.xMax - r.xMin)) * W;
}

export function toSy(v: ViewState, H: number, y: number) {
  const r = getRect(v, 0, H);
  return H - ((y - r.yMin) / (r.yMax - r.yMin)) * H;
}

export function toX(v: ViewState, W: number, sx: number) {
  const r = getRect(v, W, 0);
  return (sx / W) * (r.xMax - r.xMin) + r.xMin;
}

export function toY(v: ViewState, H: number, sy: number) {
  const r = getRect(v, 0, H);
  return r.yMax - (sy / H) * (r.yMax - r.yMin);
}

// Zoom around a world point (wx, wy)
export function zoomAround(v: ViewState, factor: number, wx: number, wy: number): ViewState {
  const nz = Math.min(2.5, Math.max(0.6, v.zoom * factor));
  if (nz === v.zoom) return v;
  const bw = v.base.xMax - v.base.xMin;
  const bh = v.base.yMax - v.base.yMin;

  // old rect
  const vwOld = bw / v.zoom;
  const vhOld = bh / v.zoom;

  // new rect
  const vwNew = bw / nz;
  const vhNew = bh / nz;

  // keep (wx,wy) fixed on screen: adjust center so that point stays under cursor
  const cx = wx - (wx - (v.cx - vwOld/2)) * (vwNew / vwOld) + vwNew/2;
  const cy = wy - (wy - (v.cy - vhOld/2)) * (vhNew / vhOld) + vhNew/2;

  return { ...v, zoom: nz, cx, cy };
}

// Pan by screen pixels converted to world units
export function panByPixels(v: ViewState, W: number, H: number, dxPx: number, dyPx: number): ViewState {
  const r = getRect(v, W, H);
  const dxWorld = dxPx / W * (r.xMax - r.xMin);
  const dyWorld = -dyPx / H * (r.yMax - r.yMin);
  return { ...v, cx: v.cx + dxWorld, cy: v.cy + dyWorld };
}

// Reset view to show entire base area
export function resetView(v: ViewState): ViewState {
  const bw = v.base.xMax - v.base.xMin;
  const bh = v.base.yMax - v.base.yMin;
  return {
    ...v,
    zoom: 1.0,
    cx: v.base.xMin + bw / 2,
    cy: v.base.yMin + bh / 2
  };
}

// Fit view to show all points with padding
export function fitToData(v: ViewState, points: Array<{x: number, y: number}>, padding: number = 1.0): ViewState {
  if (points.length === 0) return v;
  
  let minX = points[0].x, maxX = points[0].x;
  let minY = points[0].y, maxY = points[0].y;
  
  points.forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });
  
  const bw = v.base.xMax - v.base.xMin;
  const bh = v.base.yMax - v.base.yMin;
  const dataW = maxX - minX;
  const dataH = maxY - minY;
  
  const zoomX = bw / (dataW + padding * 2);
  const zoomY = bh / (dataH + padding * 2);
  const zoom = Math.min(zoomX, zoomY, 2.5);
  
  return {
    ...v,
    zoom,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2
  };
}
