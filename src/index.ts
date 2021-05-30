
// Global functions for speed
const round = Math.round

/**
 * Converts a number in `[0,1]` into a 2-digit hex string in the range `[0,255]`.  Clamps if outside that range.
 */
function h2(x: number): string {
  x = round(x * 256)
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
   * Returns a CSS color value representation, e.g. `#f03452ff`.
   */
  toCss(): string {
    return '#' + h2(this.r) + h2(this.g) + h2(this.b) + h2(this.a)
  }

}
