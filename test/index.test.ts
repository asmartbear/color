import 'jest';      // Ref: https://jestjs.io/docs/en/expect#reference
import { Color } from "../src";


test("construction", () => {
  expect(new Color(0, 0, 0, 0).toCss()).toBe('#00000000');
  expect(new Color(1, 1, 1, 1).toCss()).toBe('#ffffffff');
  expect(new Color(0.5, 0.75, 0.25, 0.0625).toCss()).toBe('#80bf4010');
  expect(new Color(0.502, 0.753, 0.25, 0.0625).toCss()).toBe('#80c04010');
  expect(new Color(-1, -0.001, 1.0001, 2).toCss()).toBe('#0000ffff');
});

test("invalid color", () => {
  function t(p: string) { expect(Color.fromCss(p).toCss()).toBe('#00000000') }

  t('')
  t('tacos')
  t('x')
});

test("named color", () => {
  expect(Color.fromCss("transparent").toCss()).toBe('#00000000')
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
  function t(c: string, b: number) {
    expect(Color.fromCss(c).getBrightness()).toBeCloseTo(b, 2)
  }

  t('#fff', 1)
  t('#000', 0)
  t('#7f7f7f', 0.5)
  t('#ff0000', 0.299)
  t('#00ff00', 0.587)
  t('#0000ff', 0.114)
});
