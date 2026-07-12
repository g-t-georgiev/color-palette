import { interpolateRGB } from "../utils/color-helpers.js";

export default class ColorUtils {
  static generatePalette(start, end, count) {
    const palette = [];

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);

      palette.push({
        id: crypto.randomUUID(),
        position: t * 100,
        color: interpolateRGB(start, end, t)
      });
    }

    return palette;
  }
}