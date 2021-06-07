import 'jest';      // Ref: https://jestjs.io/docs/en/expect#reference
import Color from "../src";


test("construction", () => {
  expect(new Color(0, 0, 0, 0).toCss()).toBe('#00000000');
  expect(new Color(1, 1, 1, 1).toCss()).toBe('#ffffffff');
  expect(new Color(0.5, 0.75, 0.25, 0.0625).toCss()).toBe('#80bf4010');
  expect(new Color(0.502, 0.753, 0.25, 0.0625).toCss()).toBe('#80c04010');
  expect(new Color(-1, -0.001, 1.0001, 2).toCss()).toBe('#0000ffff');
});

test("invalid color", () => {
  function t(p: any) { expect(Color.fromCss(p).toCss()).toBe('#00000000') }

  t('')
  t('tacos')
  t('x')
  t(123)
  t(null)
  t(undefined)
  t({ r: 123, g: 123, b: 123 })
});

test("named colors", () => {
  expect(Color.fromCss("transparent").toCss()).toBe('#00000000')
  expect(Color.fromCss("black").toCss()).toBe('#000000ff')
  expect(Color.fromCss("white").toCss()).toBe('#ffffffff')
});

test("from #RGB(A)", () => {
  function t(p: string, q: string) { expect(Color.fromCss(p).toCss()).toBe(q) }

  // full string
  t('#0000', '#00000000')
  t('#ffff', '#ffffffff')
  t('#1234', '#11223344')
  t('#edbc', '#eeddbbcc')

  // without alpha channel
  t('#000', '#000000ff')
  t('#fff', '#ffffffff')
  t('#123', '#112233ff')
  t('#edb', '#eeddbbff')
});

test("from #RRGGBB(AA)", () => {
  function t(p: string, q: string) { expect(Color.fromCss(p).toCss()).toBe(q) }

  // full string
  t('#00000000', '#00000000')
  t('#ffffffff', '#ffffffff')
  t('#80c04010', '#80c04010')
  t('#fe01c912', '#fe01c912')
  t('#0000ffff', '#0000ffff')

  // without alpha channel
  t('#000000', '#000000ff')
  t('#ffffff', '#ffffffff')
  t('#80c040', '#80c040ff')
  t('#fe01c9', '#fe01c9ff')
  t('#0000ff', '#0000ffff')
});

test("from rgb(r,g,b(,a))", () => {
  function t(r: number, g: number, b: number, a: number) {
    const target = new Color(r / 255, g / 255, b / 255, a / 255).toCss();
    const targetNoAlpha = new Color(r / 255, g / 255, b / 255, 1).toCss();

    expect(Color.fromCss(`rgb(${r},${g},${b},${a})`).toCss()).toBe(target)
    expect(Color.fromCss(`rgbA(${r},${g},${b},${a})`).toCss()).toBe(target)
    expect(Color.fromCss(`RGB(${r},${g},${b})`).toCss()).toBe(targetNoAlpha)
    expect(Color.fromCss(`rgb(${r * 100 / 255}%,${g * 100 / 255}%,${b * 100 / 255}%,${a * 100 / 255}%)`).toCss()).toBe(target)
    expect(Color.fromCss(`rgb(${r * 100 / 255}%,${g * 100 / 255}%,${b * 100 / 255}%)`).toCss()).toBe(targetNoAlpha)
  }

  t(0, 0, 0, 0)
  t(1, 2, 3, 4)
  t(255, 255, 255, 255)
  t(255, 254, 253, 252)
  t(179, 180, 181, 182)
});

test("from hsv(h,s,v(,a))", () => {
  function t(r: number, g: number, b: number, h: number, s: number, v: number) {
    const target = new Color(r / 255, g / 255, b / 255, 1).toCss();

    expect(Color.fromCss(`hsv(${h},${s},${v})`).toCss()).toBe(target)
    expect(Color.fromCss(`HSVA(${h},${s},${v},100%)`).toCss()).toBe(target)
  }

  t(0, 0, 0, 0, 0, 0)
  t(255, 255, 255, 0, 0, 100)
  t(255, 0, 0, 0, 100, 100)
  t(0, 255, 0, 120, 100, 100)
  t(0, 0, 255, 240, 100, 100)
  t(255, 255, 0, 60, 100, 100)
  t(0, 255, 255, 180, 100, 100)
  t(255, 0, 255, 300, 100, 100)
  t(191, 191, 191, 0, 0, 75)
  t(128, 128, 128, 0, 0, 50)
  t(128, 0, 0, 0, 100, 50)
  t(128, 128, 0, 60, 100, 50)
  t(0, 128, 0, 120, 100, 50)
  t(0, 0, 128, 240, 100, 50)
  t(18, 18, 18, 0, 0, 7.1)
});

test("from hsl(h,s,l(,a))", () => {
  function t(r: number, g: number, b: number, h: number, s: number, l: number) {
    const target = new Color(r / 255, g / 255, b / 255, 1).toCss();

    expect(Color.fromCss(`hsl(${h},${s},${l})`).toCss()).toBe(target)
    expect(Color.fromCss(`HSLA(${h},${s},${l},100%)`).toCss()).toBe(target)
  }

  t(0, 0, 0, 0, 0, 0)
  t(255, 255, 255, 0, 0, 100)
  t(255, 0, 0, 0, 100, 50)
  t(0, 255, 0, 120, 100, 50)
  t(0, 0, 255, 240, 100, 50)
  t(255, 255, 0, 60, 100, 50)
  t(0, 255, 255, 180, 100, 50)
  t(255, 0, 255, 300, 100, 50)
  t(191, 191, 191, 0, 0, 75)
  t(128, 128, 128, 0, 0, 50)
  t(128, 0, 0, 0, 100, 25)
  t(127, 128, 0, 60, 100, 25)   // Really 128 for red?  Or is that debatable anyway?
  t(0, 128, 0, 120, 100, 25)
  t(0, 0, 128, 240, 100, 25)
  t(18, 18, 18, 0, 0, 7.1)
});

test("brightness", () => {
  function t(css: string, b: number) {
    const c = Color.fromCss(css);
    expect(c.getBrightness()).toBeCloseTo(b, 2)
    expect(c.isLight()).toBe(c.getBrightness() >= 0.5)
  }

  t('#fff', 1)
  t('#000', 0)
  t('#7f7f7f', 0.5)
  t('#ff0000', 0.299)
  t('#00ff00', 0.587)
  t('#0000ff', 0.114)
});

test("luminance", () => {
  function t(c: string, b: number) {
    expect(Color.fromCss(c).getLuminance()).toBeCloseTo(b, 2)
  }

  t('#fff', 1)
  t('#000', 0)
  t('#7f7f7f', 0.2122)
  t('#ff0000', 0.2126)
  t('#00ff00', 0.7152)
  t('#0000ff', 0.0722)
});

test("contrast ratio", () => {
  function t(css1: string, css2: string, x: number) {
    const c1 = Color.fromCss(css1);
    const c2 = Color.fromCss(css2);
    expect(c1.getContrastRatio(c2)).toBeCloseTo(x, 2)
    expect(c2.getContrastRatio(c1)).toBeCloseTo(x, 2)
  }

  t('#fff', '#fff', 1);
  t('#000', '#000', 1);
  t('#fff', '#000', 21);
  t('#121212', '#000000', 1.12);
  t('#121212', '#ffffff', 18.73);
  t('#ff0000', '#0000ff', 2.15);
  t('#ff8080', '#0000ff', 3.54);
});

test("mix", () => {
  function t(css1: string, css2: string, p: number, cssResult: string) {
    const c1 = Color.fromCss(css1);
    const c2 = Color.fromCss(css2);
    expect(c1.mix(c2, p).toCss()).toBe(cssResult)
  }

  for (const css of ['#000000ff', '#ffffff00', '#c3512f45']) {
    t(css, css, 1.2, css);
    t(css, css, 1, css);
    t(css, css, 0.5, css);
    t(css, css, 0, css);
    t(css, css, -0.2, css);
  }
  t('#fff', '#000', 0, '#ffffffff')
  t('#fff', '#000', 1, '#000000ff')
  t('#fff', '#000', 0.5, '#808080ff')
  t('#fff', '#000', 0.75, '#404040ff')
  t('#fff', '#000', 0.25, '#bfbfbfff')
  t('#c0804020', '#4020ff40', 1, '#4020ff40')
  t('#c0804020', '#4020ff40', 0, '#c0804020')
  t('#c0804020', '#4020ff40', 0.5, '#8050a030')
  t('#c0804020', '#4020ff40', 0.75, '#6038cf38')
});

test("brighten", () => {
  function t(css: string, p: number, cssResult: string) {
    expect(Color.fromCss(css).brighten(p).toCss()).toBe(cssResult)
  }

  t('#c0804020', 0, '#c0804020')
  t('#c0804020', 1, '#ffffff20')
  t('#c0804020', 0.5, '#e0c0a020')
});

test("darken", () => {
  function t(css: string, p: number, cssResult: string) {
    expect(Color.fromCss(css).darken(p).toCss()).toBe(cssResult)
  }

  t('#c0804020', 0, '#c0804020')
  t('#c0804020', 1, '#00000020')
  t('#c0804020', 0.5, '#60402020')
});

test("hueShift", () => {
  function t(css: string, p: number, cssResult: string) {
    expect(Color.fromCss(css).hueShift(p).toCss()).toBe(cssResult)
  }

  t('#ff000000', 0, '#ff000000')
  t('#ff000000', 1 / 3, '#00ff0000')
  t('#ff000000', -2 / 3, '#00ff0000')
  t('#ff000000', 2 / 3, '#0000ff00')
  t('#ff000000', -1 / 3, '#0000ff00')
  t('#ff000000', 3 / 3, '#ff000000')
  t('#00ff0000', 0.1, '#00ff9900')

  // sixths
  const colors = ['#ff000000', '#ffff0000', '#00ff0000', '#00ffff00', '#0000ff00', '#ff00ff00'];
  const unitShift = 1 / colors.length;
  for (let k = 0; k < colors.length; ++k) {
    for (let j = 0; j < colors.length; ++j) {
      t(colors[k], unitShift * (j - k), colors[j])
      t(colors[k], unitShift * (j - k) + 1, colors[j])
      t(colors[k], unitShift * (j - k) + 2, colors[j])
      t(colors[k], unitShift * (j - k) - 1, colors[j])
      t(colors[k], unitShift * (j - k) - 2, colors[j])
    }
  }

  // achromatic doesn't change
  for (const c of ['#000000ff', '#ffffffff', '#121212ff']) {
    t(c, 0, c)
    t(c, 0.01, c)
    t(c, 0.1, c)
    t(c, 0.5, c)
    t(c, 1, c)
    t(c, -1 / 3, c)
  }
});

test("distance", () => {
  function t(css1: string, css2: string, x: number) {
    const c1 = Color.fromCss(css1);
    const c2 = Color.fromCss(css2);
    expect(c1.getPerceptualDistance(c2)).toBeCloseTo(x, 2)
    expect(c2.getPerceptualDistance(c1)).toBeCloseTo(x, 2)
  }

  t('#000', '#000', 0)
  t('#fff', '#fff', 0)
  t('#000', '#fff', 1)
  t('#808080', '#fff', 0.5)
  t('#808080', '#000', 0.5)
  t('#ff0000', '#000', 0.55)
  t('#00ff00', '#000', 0.77)
  t('#0000ff', '#000', 0.34)
  t('#ff0000', '#0000ff', 0.64)
  t('#ff0000', '#00ff00', 0.94)
});
