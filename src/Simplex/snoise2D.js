export const snoise2D = `
  // This is a modified wgsl version from https://github.com/ashima/webgl-noise/blob/master/src/noise2D.glsl
  // 
  // Author: Ian McEwan, Ashima Arts
  // GitHub: https://github.com/ashima/webgl-noise
  //         https://github.com/stegu/webgl-noise
  // Original License:
  //   MIT License
  //   Copyright (C) 2011 Ashima Arts
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
  fn mod289v3f(x: vec3f)     -> vec3f { return x - floor(x / 289.0) * 289.0; }
  fn permute289v3f(x: vec3f) -> vec3f { return mod289v3f(((x*34.0)+10.0)*x); }

  fn snoise2D(v: vec2f) -> f32 {
    let C = vec4f(0.211324865405187,
                  0.366025403784439,
                 -0.577350269189626,
                  0.024390243902439);

    var i  = floor(v + dot(v, C.yy));
    let x0 = v - i + dot(i, C.xx);

    let i1 = select(vec2f(0.0, 1.0), vec2f(1.0, 0.0), (x0.x > x0.y));
    
    var x12 = x0.xyxy + C.xxzz;
    x12 = vec4f(x12.xy - i1, x12.zw);

    i = mod289v2f(i);
    let p = permute289v3f( permute289v3f( i.y + vec3f(0.0, i1.y, 1.0))
                          + i.x + vec3f(0.0, i1.x, 1.0));

    var m = max(0.5 - vec3f(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3f(0.0));
    m = m*m;
    m = m*m;

    let x = 2.0 * fract(p * C.www) - 1.0;
    let h = abs(x) - 0.5;
    let ox = floor(x + 0.5);
    let a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    let g = vec3f((a0.x * x0.x + h.x * x0.y), (a0.yz * x12.xz + h.yz * x12.yw));
    return 130.0 * dot(m, g);
  }
`
