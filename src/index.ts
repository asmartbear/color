
// Global regular expressions
const RE_THREE_DIGIT = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])?\b/;
const RE_SIX_DIGIT = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?\b/;
const RE_RGB = /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\s*\)/;

// Global functions for speed
const round = Math.round

// Parse string hex digits into a number
function fromHex(s: string): number {
  return parseInt(s, 16);
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
    if (m = s.match(RE_RGB)) {
      return new Color(parseFloat(m[1]) / 255, parseFloat(m[2]) / 255, parseFloat(m[3]) / 255, m[4] ? parseFloat(m[4]) / 255 : 1)
    }
    // Don't know
    return new Color(0, 0, 0, 0);
  }

  /**
   * Returns a CSS color value representation, e.g. `#f03452ff`.
   */
  toCss(): string {
    return '#' + h2(this.r) + h2(this.g) + h2(this.b) + h2(this.a)
  }

}
