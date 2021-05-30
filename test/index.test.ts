import 'jest';      // Ref: https://jestjs.io/docs/en/expect#reference
import { Color } from "../src";


test("construction", () => {
  expect(new Color(0, 0, 0, 0).toCss()).toBe('#00000000');
  expect(new Color(1, 1, 1, 1).toCss()).toBe('#ffffffff');
  expect(new Color(0.5, 0.75, 0.25, 0.0625).toCss()).toBe('#80c04010');
  expect(new Color(-1, -0.001, 1.0001, 2).toCss()).toBe('#0000ffff');
});
