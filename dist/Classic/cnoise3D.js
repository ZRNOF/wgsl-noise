export const cnoise3D = `
  // This is a modified wgsl version from https://github.com/stegu/webgl-noise/blob/master/src/classicnoise3D.glsl
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

  // Classic Perlin noise
  fn cnoise3D(P: vec3f) -> f32 {
    var Pi0 = floor(P);
    var Pi1 = Pi0 + vec3f(1.0);
    Pi0 = mod289v3f(Pi0);
    Pi1 = mod289v3f(Pi1);
    let Pf0 = fract(P);
    let Pf1 = Pf0 - vec3f(1.0);
    let ix = vec4f(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    let iy = vec4f(Pi0.yy, Pi1.yy);
    let iz0 = Pi0.zzzz;
    let iz1 = Pi1.zzzz;

    let ixy = permute289v4f(permute289v4f(ix) + iy);
    let ixy0 = permute289v4f(ixy + iz0);
    let ixy1 = permute289v4f(ixy + iz1);

    var gx0 = ixy0 * (1.0 / 7.0);
    var gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    let gz0 = vec4f(0.5) - abs(gx0) - abs(gy0);
    let sz0 = step(gz0, vec4f(0.0));
    gx0 -= sz0 * (step(vec4f(0.0), gx0) - 0.5);
    gy0 -= sz0 * (step(vec4f(0.0), gy0) - 0.5);

    var gx1 = ixy1 * (1.0 / 7.0);
    var gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    let gz1 = vec4f(0.5) - abs(gx1) - abs(gy1);
    let sz1 = step(gz1, vec4f(0.0));
    gx1 -= sz1 * (step(vec4f(0.0), gx1) - 0.5);
    gy1 -= sz1 * (step(vec4f(0.0), gy1) - 0.5);

    var g000 = vec3f(gx0.x, gy0.x, gz0.x);
    var g100 = vec3f(gx0.y, gy0.y, gz0.y);
    var g010 = vec3f(gx0.z, gy0.z, gz0.z);
    var g110 = vec3f(gx0.w, gy0.w, gz0.w);
    var g001 = vec3f(gx1.x, gy1.x, gz1.x);
    var g101 = vec3f(gx1.y, gy1.y, gz1.y);
    var g011 = vec3f(gx1.z, gy1.z, gz1.z);
    var g111 = vec3f(gx1.w, gy1.w, gz1.w);

    let norm0 = taylorInvSqrtv4f(vec4f(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    let norm1 = taylorInvSqrtv4f(vec4f(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    let n000 = dot(g000, Pf0);
    let n100 = dot(g100, vec3f(Pf1.x, Pf0.yz));
    let n010 = dot(g010, vec3f(Pf0.x, Pf1.y, Pf0.z));
    let n110 = dot(g110, vec3f(Pf1.xy, Pf0.z));
    let n001 = dot(g001, vec3f(Pf0.xy, Pf1.z));
    let n101 = dot(g101, vec3f(Pf1.x, Pf0.y, Pf1.z));
    let n011 = dot(g011, vec3f(Pf0.x, Pf1.yz));
    let n111 = dot(g111, Pf1);

    let fade_xyz = fadev3f(Pf0);
    let n_z = mix(vec4f(n000, n100, n010, n110), vec4f(n001, n101, n011, n111), fade_xyz.z);
    let n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    let n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  // Classic Perlin noise, periodic variant
  fn pnoise3D(P: vec3f, rep: vec3f) -> f32 {
    var Pi0 = floor(P) - floor(floor(P) / rep) * rep;
    var Pi1 = (Pi0 + 1.0) - floor((Pi0 + 1.0) / rep) * rep;
    Pi0 = mod289v3f(Pi0);
    Pi1 = mod289v3f(Pi1);
    let Pf0 = fract(P);
    let Pf1 = Pf0 - vec3f(1.0);
    let ix = vec4f(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    let iy = vec4f(Pi0.yy, Pi1.yy);
    let iz0 = Pi0.zzzz;
    let iz1 = Pi1.zzzz;

    let ixy = permute289v4f(permute289v4f(ix) + iy);
    let ixy0 = permute289v4f(ixy + iz0);
    let ixy1 = permute289v4f(ixy + iz1);

    var gx0 = ixy0 * (1.0 / 7.0);
    var gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    let gz0 = vec4f(0.5) - abs(gx0) - abs(gy0);
    let sz0 = step(gz0, vec4f(0.0));
    gx0 -= sz0 * (step(vec4f(0.0), gx0) - 0.5);
    gy0 -= sz0 * (step(vec4f(0.0), gy0) - 0.5);

    var gx1 = ixy1 * (1.0 / 7.0);
    var gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    let gz1 = vec4f(0.5) - abs(gx1) - abs(gy1);
    let sz1 = step(gz1, vec4f(0.0));
    gx1 -= sz1 * (step(vec4f(0.0), gx1) - 0.5);
    gy1 -= sz1 * (step(vec4f(0.0), gy1) - 0.5);

    var g000 = vec3f(gx0.x, gy0.x, gz0.x);
    var g100 = vec3f(gx0.y, gy0.y, gz0.y);
    var g010 = vec3f(gx0.z, gy0.z, gz0.z);
    var g110 = vec3f(gx0.w, gy0.w, gz0.w);
    var g001 = vec3f(gx1.x, gy1.x, gz1.x);
    var g101 = vec3f(gx1.y, gy1.y, gz1.y);
    var g011 = vec3f(gx1.z, gy1.z, gz1.z);
    var g111 = vec3f(gx1.w, gy1.w, gz1.w);

    let norm0 = taylorInvSqrtv4f(vec4f(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    let norm1 = taylorInvSqrtv4f(vec4f(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    let n000 = dot(g000, Pf0);
    let n100 = dot(g100, vec3f(Pf1.x, Pf0.yz));
    let n010 = dot(g010, vec3f(Pf0.x, Pf1.y, Pf0.z));
    let n110 = dot(g110, vec3f(Pf1.xy, Pf0.z));
    let n001 = dot(g001, vec3f(Pf0.xy, Pf1.z));
    let n101 = dot(g101, vec3f(Pf1.x, Pf0.y, Pf1.z));
    let n011 = dot(g011, vec3f(Pf0.x, Pf1.yz));
    let n111 = dot(g111, Pf1);

    let fade_xyz = fadev3f(Pf0);
    let n_z = mix(vec4f(n000, n100, n010, n110), vec4f(n001, n101, n011, n111), fade_xyz.z);
    let n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    let n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }
`
