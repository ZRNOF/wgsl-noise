// This is a modified wgsl version from https://github.com/stegu/webgl-noise/blob/master/src/cellular2D.glsl
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
fn mod289v2f(x: vec2f)     -> vec2f { return x - floor(x / 289.0) * 289.0; }
fn mod7v3f(x: vec3f)       -> vec3f { return x - floor(x / 6.999999) * 6.999999; }
fn permute289v3f(x: vec3f) -> vec3f { return mod289v3f((34.0 * x + 10.0) * x); }

fn cellular2D(P: vec2f) -> vec2f {
  let K = 0.142857142857;
  let Ko = 0.428571428571;
  let jitter = 1.0;
  let Pi = mod289v2f(floor(P));
  let Pf = fract(P);
  let Oi = vec3f(-1.0, 0.0, 1.0);
  let Of = vec3f(-0.5, 0.5, 1.5);
  let px = permute289v3f(Pi.x + Oi);
  var p  = permute289v3f(px.x + Pi.y + Oi);
  var ox = vec3f(fract(p*K) - Ko);
  var oy = mod7v3f(floor(p*K))*K - Ko;
  var dx = vec3f(Pf.x + 0.5 + jitter*ox);
  var dy = vec3f(Pf.y - Of + jitter*oy);
  var d1 = vec3f(dx * dx + dy * dy);
  p = permute289v3f(px.y + Pi.y + Oi);
  ox = fract(p*K) - Ko;
  oy = mod7v3f(floor(p*K))*K - Ko;
  dx = Pf.x - 0.5 + jitter*ox;
  dy = Pf.y - Of + jitter*oy;
  var d2 = vec3f(dx * dx + dy * dy);
  p = permute289v3f(px.z + Pi.y + Oi);
  ox = fract(p*K) - Ko;
  oy = mod7v3f(floor(p*K))*K - Ko;
  dx = Pf.x - 1.5 + jitter*ox;
  dy = Pf.y - Of + jitter*oy;
  let d3 = vec3f(dx * dx + dy * dy);
  let d1a = min(d1, d2);
  d2 = max(d1, d2);
  d2 = min(d2, d3);
  d1 = min(d1a, d2);
  d2 = max(d1a, d2);
  d1 = select(d1.yxz, d1, (d1.x < d1.y));
  d1 = select(d1.zyx, d1, (d1.x < d1.z));
  d1 = vec3f( d1.x, min(d1.yz, d2.yz) );
  d1 = vec3f( d1.x, min(d1.y, d1.z), d1.z );
  d1 = vec3f( d1.x, min(d1.y, d2.x), d1.z );
  return sqrt(d1.xy);
}
