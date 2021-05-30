
// Global regular expressions
const RE_THREE_DIGIT = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])?\b/i;
const RE_SIX_DIGIT = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?\b/i;
const RE_LONGFORM = /\b(rgb|hs[vl])a?\s*\(\s*([\.\d]+\%?)\s*,\s*([\.\d]+\%?)\s*,\s*([\.\d]+\%?)\s*(?:,\s*([\.\d]+\%?))?\s*\)/i;

// Global functions for speed
const round = Math.round
const pow = Math.pow
const min = Math.min
const max = Math.max
const sqrt = Math.sqrt

// Returns the squared difference between two numbers
function sqdiff(a: number, b: number): number {
  const d = a - b;
  return d * d;
}

// Parse string hex digits into a number
function fromHex(s: string): number {
  return parseInt(s, 16);
}

// Parse a number, converting from `[0,maximum]` to `[0,1]`, or as a percentage if that is the trailing character
function fromNumber(s: string, maximum: number): number {

  // Compute an initial [0,1] value
  let x;
  if (s.endsWith('%')) x = parseFloat(s) / 100;
  else x = parseFloat(s) / maximum;

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

export default class Color {

  /**
   * Create a new, mutable color object, given color channels in the range `[0,1]`.
   * Typically it's easier to use a static method to create a color.
   */
  constructor(public r: number, public g: number, public b: number, public a: number) {
    // nothing else to do
  }

  /**
   * Reads a color from a CSS string, or returns `null` if the color is invalid.
   * Supports 'transparent' but no other written colors.
   */
  static fromCss(s: string): Color {
    let m: RegExpMatchArray | null;
    const c = NAMED_COLORS[s];
    if (c) return c.clone();
    if (m = s.match(RE_SIX_DIGIT)) {
      return new Color(fromHex(m[1]) / 255, fromHex(m[2]) / 255, fromHex(m[3]) / 255, m[4] ? fromHex(m[4]) / 255 : 1)
    }
    if (m = s.match(RE_THREE_DIGIT)) {
      return new Color(fromHex(m[1] + m[1]) / 255, fromHex(m[2] + m[2]) / 255, fromHex(m[3] + m[3]) / 255, m[4] ? fromHex(m[4] + m[4]) / 255 : 1)
    }
    if (m = s.match(RE_LONGFORM)) {
      const a = m[5] ? fromNumber(m[5], 255) : 1;
      switch (m[1].toLowerCase()) {
        case 'rgb': return new Color(fromNumber(m[2], 255), fromNumber(m[3], 255), fromNumber(m[4], 255), a);
        case 'hsv': return Color.fromHSV(fromNumber(m[2], 360), fromNumber(m[3], 100), fromNumber(m[4], 100), a);
        case 'hsl': return Color.fromHSL(fromNumber(m[2], 360), fromNumber(m[3], 100), fromNumber(m[4], 100), a);
        /* istanbul ignore next */
        default: return new Color(0, 0, 0, 0);    // unknown format, but regex largely prevents this from happening!
      }
    }
    return NAMED_COLORS.transparent.clone();
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
   * Converting from HSL color space, all numbers in `[0,1]`.
   */
  static fromHSL(h: number, s: number, l: number, a: number): Color {
    var r, g, b;

    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    if (s === 0) {
      r = g = b = l; // achromatic
    }
    else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return new Color(r, g, b, a);
  }

  /**
   * Returns a copy of this color object.  Useful because they are mutable.
   */
  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * Returns a CSS color value representation, e.g. `#f03452ff`.
   */
  toCss(): string {
    return '#' + h2(this.r) + h2(this.g) + h2(this.b) + h2(this.a)
  }

  /**
   * Gets the perceived brightness of the color, in `[0,1]`, as defined by
   * http://www.w3.org/TR/AERT#color-contrast
   */
  getBrightness(): number {
    return this.r * 0.299 + this.g * 0.587 + this.b * 0.114;
  }

  /**
   * Gets the distance between this color and another as `[0,1]` where `0` is identical and `1` is the distance from white to black,
   * weighted by human's perception of color differences.
   */
  getPerceptualDistance(c: Color): number {
    return sqrt(sqdiff(this.r, c.r) * 0.299 + sqdiff(this.g, c.g) * 0.587 + sqdiff(this.b, c.b) * 0.114);
  }

  /**
   * Gets the luminance of the color, in `[0,1]`, as defined by
   * http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   */
  getLuminance(): number {
    const RsRGB = this.r, GsRGB = this.g, BsRGB = this.b;
    var R, G, B;

    if (RsRGB <= 0.03928) { R = RsRGB / 12.92; } else { R = pow(((RsRGB + 0.055) / 1.055), 2.4); }
    if (GsRGB <= 0.03928) { G = GsRGB / 12.92; } else { G = pow(((GsRGB + 0.055) / 1.055), 2.4); }
    if (BsRGB <= 0.03928) { B = BsRGB / 12.92; } else { B = pow(((BsRGB + 0.055) / 1.055), 2.4); }
    return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
  }

  /**
   * True if this color's brightness is above `0.5`.  Generally "light" background colors should receive
   * dark foreground (e.g. text) colors, and vice versa.
   */
  isLight(): boolean {
    return this.getBrightness() >= 0.5;
  }

  /**
   * Computes the Contrast Ratio (i.e. readability) between this color and another, as defined by
   * http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
   */
  getContrastRatio(c: Color): number {
    const l1 = this.getLuminance();
    const l2 = c.getLuminance();
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05);
  }

  /**
   * Mixes another color into this color and return in-place.  The resulting color is `p` the new color,
   * and `1-p` the existing color, with `p` in `[0,1]`.
   */
  mix(c: Color, p: number): this {
    if (p <= 0) return this;   // not mixing any of p, actually
    if (p >= 1) p = 1;    // totally the other color
    this.r += (c.r - this.r) * p;
    this.g += (c.g - this.g) * p;
    this.b += (c.b - this.b) * p;
    this.a += (c.a - this.a) * p;
    return this;
  }

  /**
   * Brighten and return in-place, by an amount in `[0,1]`, where `0` does not change the color,
   * and `1` makes the color completely white.  Does not alter the opacity.
   */
  brighten(x: number): this {
    return this.mix(new Color(1, 1, 1, this.a), x);
  }

  /**
   * Darken and return in-place, by an amount in `[0,1]`, where `0` does not change the color,
   * and `1` makes the color completely black.  Does not alter the opacity.
   */
  darken(x: number): this {
    return this.mix(new Color(0, 0, 0, this.a), x);
  }

}

// Color name table -- just some basics, not the full set of HTML colors that no one uses
const NAMED_COLORS: Record<string, Color> = {
  "transparent": new Color(0, 0, 0, 0),
  "white": new Color(1, 1, 1, 1),
  "black": new Color(0, 0, 0, 1),
}
