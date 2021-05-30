
// Global regular expressions
const RE_THREE_DIGIT = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])?\b/;
const RE_SIX_DIGIT = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?\b/;
const RE_LONGFORM = /\b(rgb|hsv)\s*\(\s*([\.\d]+\%?)\s*,\s*([\.\d]+\%?)\s*,\s*([\.\d]+\%?)\s*(?:,\s*([\.\d]+\%?))?\s*\)/;

// Global functions for speed
const round = Math.round

// Parse string hex digits into a number
function fromHex(s: string): number {
  return parseInt(s, 16);
}

// Parse a number, converting from `[0,max]` to `[0,1]`, or as a percentage if that is the trailing character
function fromNumber(s: string, max: number): number {

  // Compute an initial [0,1] value
  let x;
  if (s.endsWith('%')) x = parseFloat(s) / 100;
  else x = parseFloat(s) / max;

  // Clamp and slight round-off at the extremities, which are important values for color algorithms
  return x < 0.00001 ? 0 : x > 0.99999 ? 1 : x;
}

/**
 * Converts a number in `[0,1]` into a 2-digit hex string in the range `[0,255]`.  Clamps if outside that range.
 */
function h2(x: number): string {
  x = round(x * 255)
  if (x < 0) return '00'
  if (x < 16) return '0' + x.toString(16)
  if (x < 255) return x.toString(16)
  return 'ff'
}

export class Color {

  /**
   * Create a new, mutable color object, given color channels in the range `[0,1]`.
   * Typically it's easier to use a static method to create a color.
   */
  constructor(private r: number, private g: number, private b: number, private a: number) {
    // nothing else to do
  }

  /**
   * Reads a color from a CSS string, or returns `null` if the color is invalid.
   * Supports 'transparent' but no other written colors.
   */
  static fromCss(s: string): Color {
    let m: RegExpMatchArray | null;
    if (s === "transparent") return new Color(0, 0, 0, 0);
    if (m = s.match(RE_SIX_DIGIT)) {
      return new Color(fromHex(m[1]) / 255, fromHex(m[2]) / 255, fromHex(m[3]) / 255, m[4] ? fromHex(m[4]) / 255 : 1)
    }
    if (m = s.match(RE_THREE_DIGIT)) {
      return new Color(fromHex(m[1] + m[1]) / 255, fromHex(m[2] + m[2]) / 255, fromHex(m[3] + m[3]) / 255, m[4] ? fromHex(m[4] + m[4]) / 255 : 1)
    }
    if (m = s.match(RE_LONGFORM)) {
      const a = m[5] ? fromNumber(m[5], 255) : 1;
      switch (m[1]) {
        case 'rgb': return new Color(fromNumber(m[2], 255), fromNumber(m[3], 255), fromNumber(m[4], 255), a);
        case 'hsv': return Color.fromHSV(fromNumber(m[2], 360), fromNumber(m[3], 100), fromNumber(m[4], 100), a);
        default: return new Color(0, 0, 0, 0);    // unknown format
      }
    }
    // Don't know
    return new Color(0, 0, 0, 0);
  }

  /**
   * Converting from HSV color space, all numbers in `[0,1]`.
   */
  static fromHSV(h: number, s: number, v: number, a: number): Color {
    h = h * 6;
    const i = Math.floor(h),
      f = h - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s),
      mod = i % 6,
      r = [v, q, p, p, t, v][mod],
      g = [t, v, v, q, p, p][mod],
      b = [p, p, t, v, v, q][mod];

    return new Color(r, g, b, a);
  }

  /**
   * Returns a CSS color value representation, e.g. `#f03452ff`.
   */
  toCss(): string {
    return '#' + h2(this.r) + h2(this.g) + h2(this.b) + h2(this.a)
  }

}
