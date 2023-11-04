// This is a modified wgsl version from https://github.com/stegu/webgl-noise/blob/master/src/classicnoise2D.glsl
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

fn mod289v4f(x: vec4f)        -> vec4f { return x - floor(x / 289.0) * 289.0; }
fn permute289v4f(x: vec4f)    -> vec4f { return mod289v4f((34.0 * x + 10.0) * x); }
fn taylorInvSqrtv4f(r: vec4f) -> vec4f { return 1.79284291400159 - 0.85373472095314 * r; }
fn fadev2f(t: vec2f)          -> vec2f { return t*t*t*(t*(t*6.0 - 15.0) + 10.0); }

// Classic Perlin noise
fn cnoise2D(P: vec2f) -> f32 {
  var Pi = floor(P.xyxy) + vec4f(0.0, 0.0, 1.0, 1.0);
  let Pf = fract(P.xyxy) - vec4f(0.0, 0.0, 1.0, 1.0);
  Pi = mod289v4f(Pi);
  let ix = Pi.xzxz;
  let iy = Pi.yyww;
  let fx = Pf.xzxz;
  let fy = Pf.yyww;

  let i = permute289v4f(permute289v4f(ix) + iy);

  var gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  let gy = abs(gx) - 0.5 ;
  let tx = floor(gx + 0.5);
  gx = gx - tx;

  var g00 = vec2f(gx.x, gy.x);
  var g10 = vec2f(gx.y, gy.y);
  var g01 = vec2f(gx.z, gy.z);
  var g11 = vec2f(gx.w, gy.w);

  let norm = taylorInvSqrtv4f(vec4f(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  let n00 = dot(g00, vec2f(fx.x, fy.x));
  let n10 = dot(g10, vec2f(fx.y, fy.y));
  let n01 = dot(g01, vec2f(fx.z, fy.z));
  let n11 = dot(g11, vec2f(fx.w, fy.w));

  let fade_xy = fadev2f(Pf.xy);
  let n_x = mix(vec2f(n00, n01), vec2f(n10, n11), fade_xy.x);
  let n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Classic Perlin noise, periodic variant
fn pnoise2D(P: vec2f, rep: vec2f) -> f32 {
  var Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  let Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = Pi - floor(Pi / rep.xyxy) * rep.xyxy;
  Pi = mod289v4f(Pi);
  let ix = Pi.xzxz;
  let iy = Pi.yyww;
  let fx = Pf.xzxz;
  let fy = Pf.yyww;

  let i = permute289v4f(permute289v4f(ix) + iy);

  var gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  let gy = abs(gx) - 0.5 ;
  let tx = floor(gx + 0.5);
  gx = gx - tx;

  var g00 = vec2f(gx.x, gy.x);
  var g10 = vec2f(gx.y, gy.y);
  var g01 = vec2f(gx.z, gy.z);
  var g11 = vec2f(gx.w, gy.w);

  let norm = taylorInvSqrtv4f(vec4f(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  let n00 = dot(g00, vec2f(fx.x, fy.x));
  let n10 = dot(g10, vec2f(fx.y, fy.y));
  let n01 = dot(g01, vec2f(fx.z, fy.z));
  let n11 = dot(g11, vec2f(fx.w, fy.w));

  let fade_xy = fadev2f(Pf.xy);
  let n_x = mix(vec2f(n00, n01), vec2f(n10, n11), fade_xy.x);
  let n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}
