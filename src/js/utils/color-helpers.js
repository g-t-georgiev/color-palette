export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);

  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255
  };
}

export function rgbToHex({ r, g, b }) {
  const hex = [r, g, b]
    .map(v => Math.round(v).toString(16).padStart(2, "0"))
    .join("");

  return "#" + hex;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function interpolateRGB(a, b, t) {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);

  return rgbToHex({
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t)
  });
}