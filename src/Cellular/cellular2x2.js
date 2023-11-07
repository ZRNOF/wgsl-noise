export const cellular2x2 = `
  // This is a modified wgsl version from https://github.com/stegu/webgl-noise/blob/master/src/cellular2x2.glsl
  // 
  // Author: Stefan Gustavson (stefan.gustavson@liu.se)
  // GitHub: https://github.com/stegu/webgl-noise
  // Original License:
  //   MIT License
  //   Copyright (C) 2011 Stefan Gustavson
  //   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  //   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  //   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  //
  // This modification is also licensed under the MIT License.
  //
  // MIT License
  // Copyright © 2023 Zaron Chen (Ported to WGSL)
  // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  // The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  fn mod289v2f(x: vec2f)     -> vec2f { return x - floor(x / 289.0) * 289.0; }
  fn mod289v4f(x: vec4f)     -> vec4f { return x - floor(x / 289.0) * 289.0; }
  fn mod7v4f(x: vec4f)       -> vec4f { return x - floor(x / 6.999999) * 6.999999; }
  fn permute289v4f(x: vec4f) -> vec4f { return mod289v4f((34.0 * x + 10.0) * x); }

  fn cellular2x2(P: vec2f) -> vec2f {
    let K = 0.142857142857;
    let K2 = 0.0714285714285;
    let jitter = 0.8;
    let Pi = mod289v2f(floor(P));
    let Pf = fract(P);
    let Pfx = Pf.x + vec4f(-0.5, -1.5, -0.5, -1.5);
    let Pfy = Pf.y + vec4f(-0.5, -0.5, -1.5, -1.5);
    var p = permute289v4f(Pi.x + vec4f(0.0, 1.0, 0.0, 1.0));
    p = permute289v4f(p + Pi.y + vec4f(0.0, 0.0, 1.0, 1.0));
    let ox = mod7v4f(p)*K+K2;
    let oy = mod7v4f(floor(p*K))*K+K2;
    let dx = Pfx + jitter*ox;
    let dy = Pfy + jitter*oy;
    var d = dx * dx + dy * dy;

    d = select(d.yxzw, d.xyzw, (d.x < d.y));
    d = select(d.zyxw, d.xyzw, (d.x < d.z));
    d = select(d.wyzx, d.xyzw, (d.x < d.w));
    d.y = min(d.y, d.z);
    d.y = min(d.y, d.w);
    return sqrt(d.xy);
  }
`
