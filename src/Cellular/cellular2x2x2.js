export const cellular2x2x2 = `
  // This is a modified wgsl version from https://github.com/stegu/webgl-noise/blob/master/src/cellular2x2x2.glsl
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

  fn mod289v3f(x: vec3f)     -> vec3f { return x - floor(x / 289.0) * 289.0; }
  fn mod289v4f(x: vec4f)     -> vec4f { return x - floor(x / 289.0) * 289.0; }
  fn mod7v4f(x: vec4f)       -> vec4f { return x - floor(x / 7.0) * 7.0; }
  fn permute289v3f(x: vec3f) -> vec3f { return mod289v3f((34.0 * x + 10.0) * x); }
  fn permute289v4f(x: vec4f) -> vec4f { return mod289v4f((34.0 * x + 10.0) * x); }

  fn cellular2x2x2(P: vec3f) -> vec2f {
    let K = 0.142857142857;
    let Ko = 0.428571428571;
    let K2 = 0.020408163265306;
    let Kz = 0.166666666667;
    let Kzo = 0.416666666667;
    let jitter = 0.8;
    let Pi = mod289v3f(floor(P));
    let Pf = fract(P);
    let Pfx = Pf.x + vec4f(0.0, -1.0, 0.0, -1.0);
    let Pfy = Pf.y + vec4f(0.0, 0.0, -1.0, -1.0);
    var p = permute289v4f(Pi.x + vec4f(0.0, 1.0, 0.0, 1.0));
    p = permute289v4f(p + Pi.y + vec4f(0.0, 0.0, 1.0, 1.0));
    let p1 = permute289v4f(p + Pi.z);
    let p2 = permute289v4f(p + Pi.z + vec4(1.0));
    let ox1 = fract(p1*K) - Ko;
    let oy1 = mod7v4f(floor(p1*K))*K - Ko;
    let oz1 = floor(p1*K2)*Kz - Kzo;
    let ox2 = fract(p2*K) - Ko;
    let oy2 = mod7v4f(floor(p2*K))*K - Ko;
    let oz2 = floor(p2*K2)*Kz - Kzo;
    let dx1 = Pfx + jitter*ox1;
    let dy1 = Pfy + jitter*oy1;
    let dz1 = Pf.z + jitter*oz1;
    let dx2 = Pfx + jitter*ox2;
    let dy2 = Pfy + jitter*oy2;
    let dz2 = Pf.z - 1.0 + jitter*oz2;
    let d1 = dx1 * dx1 + dy1 * dy1 + dz1 * dz1;
    var d2 = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;

    var d = min(d1, d2);
    d2 = max(d1, d2);
    d = select(d.yxzw, d.xyzw, (d.x < d.y));
    d = select(d.zyxw, d.xyzw, (d.x < d.z));
    d = select(d.wyzx, d.xyzw, (d.x < d.w));
    d = vec4f(d.x, min(d.yzw, d2.yzw));
    d.y = min(d.y, d.z);
    d.y = min(d.y, d.w);
    d.y = min(d.y, d2.x);
    return sqrt(d.xy);
  }
`
