import ColorUtils from "./ColorUtils.js";

export default class ColorService {
  generate(start, end, count) {
    return ColorUtils.generatePalette(start, end, count);
  }
}