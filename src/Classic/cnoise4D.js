const cnoise4D = `
  // This is a modified wgsl version from https://github.com/stegu/webgl-noise/blob/master/src/classicnoise4D.glsl
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
  fn fadev4f(t: vec4f)          -> vec4f { return t*t*t*(t*(t*6.0 - 15.0) + 10.0); }

  // Classic Perlin noise
  fn cnoise4D(P: vec4f) -> f32 {
    var Pi0 = floor(P);
    var Pi1 = Pi0 + 1.0;
    Pi0 = mod289v4f(Pi0);
    Pi1 = mod289v4f(Pi1);
    let Pf0 = fract(P);
    let Pf1 = Pf0 - 1.0;
    let ix = vec4f(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    let iy = vec4f(Pi0.yy, Pi1.yy);
    let iz0 = Pi0.zzzz;
    let iz1 = Pi1.zzzz;
    let iw0 = Pi0.wwww;
    let iw1 = Pi1.wwww;

    let ixy = permute289v4f(permute289v4f(ix) + iy);
    let ixy0 = permute289v4f(ixy + iz0);
    let ixy1 = permute289v4f(ixy + iz1);
    let ixy00 = permute289v4f(ixy0 + iw0);
    let ixy01 = permute289v4f(ixy0 + iw1);
    let ixy10 = permute289v4f(ixy1 + iw0);
    let ixy11 = permute289v4f(ixy1 + iw1);

    var gx00 = ixy00 * (1.0 / 7.0);
    var gy00 = floor(gx00) * (1.0 / 7.0);
    var gz00 = floor(gy00) * (1.0 / 6.0);
    gx00 = fract(gx00) - 0.5;
    gy00 = fract(gy00) - 0.5;
    gz00 = fract(gz00) - 0.5;
    let gw00 = vec4f(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
    let sw00 = step(gw00, vec4f(0.0));
    gx00 -= sw00 * (step(vec4f(0.0), gx00) - 0.5);
    gy00 -= sw00 * (step(vec4f(0.0), gy00) - 0.5);

    var gx01 = ixy01 * (1.0 / 7.0);
    var gy01 = floor(gx01) * (1.0 / 7.0);
    var gz01 = floor(gy01) * (1.0 / 6.0);
    gx01 = fract(gx01) - 0.5;
    gy01 = fract(gy01) - 0.5;
    gz01 = fract(gz01) - 0.5;
    let gw01 = vec4f(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
    let sw01 = step(gw01, vec4f(0.0));
    gx01 -= sw01 * (step(vec4f(0.0), gx01) - 0.5);
    gy01 -= sw01 * (step(vec4f(0.0), gy01) - 0.5);

    var gx10 = ixy10 * (1.0 / 7.0);
    var gy10 = floor(gx10) * (1.0 / 7.0);
    var gz10 = floor(gy10) * (1.0 / 6.0);
    gx10 = fract(gx10) - 0.5;
    gy10 = fract(gy10) - 0.5;
    gz10 = fract(gz10) - 0.5;
    let gw10 = vec4f(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
    let sw10 = step(gw10, vec4f(0.0));
    gx10 -= sw10 * (step(vec4f(0.0), gx10) - 0.5);
    gy10 -= sw10 * (step(vec4f(0.0), gy10) - 0.5);

    var gx11 = ixy11 * (1.0 / 7.0);
    var gy11 = floor(gx11) * (1.0 / 7.0);
    var gz11 = floor(gy11) * (1.0 / 6.0);
    gx11 = fract(gx11) - 0.5;
    gy11 = fract(gy11) - 0.5;
    gz11 = fract(gz11) - 0.5;
    let gw11 = vec4f(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
    let sw11 = step(gw11, vec4f(0.0));
    gx11 -= sw11 * (step(vec4f(0.0), gx11) - 0.5);
    gy11 -= sw11 * (step(vec4f(0.0), gy11) - 0.5);

    var g0000 = vec4f(gx00.x, gy00.x, gz00.x, gw00.x);
    var g1000 = vec4f(gx00.y, gy00.y, gz00.y, gw00.y);
    var g0100 = vec4f(gx00.z, gy00.z, gz00.z, gw00.z);
    var g1100 = vec4f(gx00.w, gy00.w, gz00.w, gw00.w);
    var g0010 = vec4f(gx10.x, gy10.x, gz10.x, gw10.x);
    var g1010 = vec4f(gx10.y, gy10.y, gz10.y, gw10.y);
    var g0110 = vec4f(gx10.z, gy10.z, gz10.z, gw10.z);
    var g1110 = vec4f(gx10.w, gy10.w, gz10.w, gw10.w);
    var g0001 = vec4f(gx01.x, gy01.x, gz01.x, gw01.x);
    var g1001 = vec4f(gx01.y, gy01.y, gz01.y, gw01.y);
    var g0101 = vec4f(gx01.z, gy01.z, gz01.z, gw01.z);
    var g1101 = vec4f(gx01.w, gy01.w, gz01.w, gw01.w);
    var g0011 = vec4f(gx11.x, gy11.x, gz11.x, gw11.x);
    var g1011 = vec4f(gx11.y, gy11.y, gz11.y, gw11.y);
    var g0111 = vec4f(gx11.z, gy11.z, gz11.z, gw11.z);
    var g1111 = vec4f(gx11.w, gy11.w, gz11.w, gw11.w);

    let norm00 = taylorInvSqrtv4f(vec4f(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
    g0000 *= norm00.x;
    g0100 *= norm00.y;
    g1000 *= norm00.z;
    g1100 *= norm00.w;

    let norm01 = taylorInvSqrtv4f(vec4f(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
    g0001 *= norm01.x;
    g0101 *= norm01.y;
    g1001 *= norm01.z;
    g1101 *= norm01.w;

    let norm10 = taylorInvSqrtv4f(vec4f(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
    g0010 *= norm10.x;
    g0110 *= norm10.y;
    g1010 *= norm10.z;
    g1110 *= norm10.w;

    let norm11 = taylorInvSqrtv4f(vec4f(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
    g0011 *= norm11.x;
    g0111 *= norm11.y;
    g1011 *= norm11.z;
    g1111 *= norm11.w;

    let n0000 = dot(g0000, Pf0);
    let n1000 = dot(g1000, vec4f(Pf1.x, Pf0.yzw));
    let n0100 = dot(g0100, vec4f(Pf0.x, Pf1.y, Pf0.zw));
    let n1100 = dot(g1100, vec4f(Pf1.xy, Pf0.zw));
    let n0010 = dot(g0010, vec4f(Pf0.xy, Pf1.z, Pf0.w));
    let n1010 = dot(g1010, vec4f(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
    let n0110 = dot(g0110, vec4f(Pf0.x, Pf1.yz, Pf0.w));
    let n1110 = dot(g1110, vec4f(Pf1.xyz, Pf0.w));
    let n0001 = dot(g0001, vec4f(Pf0.xyz, Pf1.w));
    let n1001 = dot(g1001, vec4f(Pf1.x, Pf0.yz, Pf1.w));
    let n0101 = dot(g0101, vec4f(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
    let n1101 = dot(g1101, vec4f(Pf1.xy, Pf0.z, Pf1.w));
    let n0011 = dot(g0011, vec4f(Pf0.xy, Pf1.zw));
    let n1011 = dot(g1011, vec4f(Pf1.x, Pf0.y, Pf1.zw));
    let n0111 = dot(g0111, vec4f(Pf0.x, Pf1.yzw));
    let n1111 = dot(g1111, Pf1);

    let fade_xyzw = fadev4f(Pf0);
    let n_0w = mix(vec4f(n0000, n1000, n0100, n1100), vec4f(n0001, n1001, n0101, n1101), fade_xyzw.w);
    let n_1w = mix(vec4f(n0010, n1010, n0110, n1110), vec4f(n0011, n1011, n0111, n1111), fade_xyzw.w);
    let n_zw = mix(n_0w, n_1w, fade_xyzw.z);
    let n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
    let n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
    return 2.2 * n_xyzw;
  }

  fn pnoise4D(P: vec4f, rep: vec4f) -> f32 {
    var Pi0 = floor(P) - floor(floor(P) / rep) * rep;
    var Pi1 = (Pi0 + 1.0) - floor((Pi0 + 1.0) / rep) * rep;
    Pi0 = mod289v4f(Pi0);
    Pi1 = mod289v4f(Pi1);
    let Pf0 = fract(P);
    let Pf1 = Pf0 - 1.0;
    let ix = vec4f(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    let iy = vec4f(Pi0.yy, Pi1.yy);
    let iz0 = Pi0.zzzz;
    let iz1 = Pi1.zzzz;
    let iw0 = Pi0.wwww;
    let iw1 = Pi1.wwww;

    let ixy = permute289v4f(permute289v4f(ix) + iy);
    let ixy0 = permute289v4f(ixy + iz0);
    let ixy1 = permute289v4f(ixy + iz1);
    let ixy00 = permute289v4f(ixy0 + iw0);
    let ixy01 = permute289v4f(ixy0 + iw1);
    let ixy10 = permute289v4f(ixy1 + iw0);
    let ixy11 = permute289v4f(ixy1 + iw1);

    var gx00 = ixy00 * (1.0 / 7.0);
    var gy00 = floor(gx00) * (1.0 / 7.0);
    var gz00 = floor(gy00) * (1.0 / 6.0);
    gx00 = fract(gx00) - 0.5;
    gy00 = fract(gy00) - 0.5;
    gz00 = fract(gz00) - 0.5;
    let gw00 = vec4f(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
    let sw00 = step(gw00, vec4f(0.0));
    gx00 -= sw00 * (step(vec4f(0.0), gx00) - 0.5);
    gy00 -= sw00 * (step(vec4f(0.0), gy00) - 0.5);

    var gx01 = ixy01 * (1.0 / 7.0);
    var gy01 = floor(gx01) * (1.0 / 7.0);
    var gz01 = floor(gy01) * (1.0 / 6.0);
    gx01 = fract(gx01) - 0.5;
    gy01 = fract(gy01) - 0.5;
    gz01 = fract(gz01) - 0.5;
    let gw01 = vec4f(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
    let sw01 = step(gw01, vec4f(0.0));
    gx01 -= sw01 * (step(vec4f(0.0), gx01) - 0.5);
    gy01 -= sw01 * (step(vec4f(0.0), gy01) - 0.5);

    var gx10 = ixy10 * (1.0 / 7.0);
    var gy10 = floor(gx10) * (1.0 / 7.0);
    var gz10 = floor(gy10) * (1.0 / 6.0);
    gx10 = fract(gx10) - 0.5;
    gy10 = fract(gy10) - 0.5;
    gz10 = fract(gz10) - 0.5;
    let gw10 = vec4f(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
    let sw10 = step(gw10, vec4f(0.0));
    gx10 -= sw10 * (step(vec4f(0.0), gx10) - 0.5);
    gy10 -= sw10 * (step(vec4f(0.0), gy10) - 0.5);

    var gx11 = ixy11 * (1.0 / 7.0);
    var gy11 = floor(gx11) * (1.0 / 7.0);
    var gz11 = floor(gy11) * (1.0 / 6.0);
    gx11 = fract(gx11) - 0.5;
    gy11 = fract(gy11) - 0.5;
    gz11 = fract(gz11) - 0.5;
    let gw11 = vec4f(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
    let sw11 = step(gw11, vec4f(0.0));
    gx11 -= sw11 * (step(vec4f(0.0), gx11) - 0.5);
    gy11 -= sw11 * (step(vec4f(0.0), gy11) - 0.5);

    var g0000 = vec4f(gx00.x, gy00.x, gz00.x, gw00.x);
    var g1000 = vec4f(gx00.y, gy00.y, gz00.y, gw00.y);
    var g0100 = vec4f(gx00.z, gy00.z, gz00.z, gw00.z);
    var g1100 = vec4f(gx00.w, gy00.w, gz00.w, gw00.w);
    var g0010 = vec4f(gx10.x, gy10.x, gz10.x, gw10.x);
    var g1010 = vec4f(gx10.y, gy10.y, gz10.y, gw10.y);
    var g0110 = vec4f(gx10.z, gy10.z, gz10.z, gw10.z);
    var g1110 = vec4f(gx10.w, gy10.w, gz10.w, gw10.w);
    var g0001 = vec4f(gx01.x, gy01.x, gz01.x, gw01.x);
    var g1001 = vec4f(gx01.y, gy01.y, gz01.y, gw01.y);
    var g0101 = vec4f(gx01.z, gy01.z, gz01.z, gw01.z);
    var g1101 = vec4f(gx01.w, gy01.w, gz01.w, gw01.w);
    var g0011 = vec4f(gx11.x, gy11.x, gz11.x, gw11.x);
    var g1011 = vec4f(gx11.y, gy11.y, gz11.y, gw11.y);
    var g0111 = vec4f(gx11.z, gy11.z, gz11.z, gw11.z);
    var g1111 = vec4f(gx11.w, gy11.w, gz11.w, gw11.w);

    let norm00 = taylorInvSqrtv4f(vec4f(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
    g0000 *= norm00.x;
    g0100 *= norm00.y;
    g1000 *= norm00.z;
    g1100 *= norm00.w;

    let norm01 = taylorInvSqrtv4f(vec4f(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
    g0001 *= norm01.x;
    g0101 *= norm01.y;
    g1001 *= norm01.z;
    g1101 *= norm01.w;

    let norm10 = taylorInvSqrtv4f(vec4f(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
    g0010 *= norm10.x;
    g0110 *= norm10.y;
    g1010 *= norm10.z;
    g1110 *= norm10.w;

    let norm11 = taylorInvSqrtv4f(vec4f(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
    g0011 *= norm11.x;
    g0111 *= norm11.y;
    g1011 *= norm11.z;
    g1111 *= norm11.w;

    let n0000 = dot(g0000, Pf0);
    let n1000 = dot(g1000, vec4f(Pf1.x, Pf0.yzw));
    let n0100 = dot(g0100, vec4f(Pf0.x, Pf1.y, Pf0.zw));
    let n1100 = dot(g1100, vec4f(Pf1.xy, Pf0.zw));
    let n0010 = dot(g0010, vec4f(Pf0.xy, Pf1.z, Pf0.w));
    let n1010 = dot(g1010, vec4f(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
    let n0110 = dot(g0110, vec4f(Pf0.x, Pf1.yz, Pf0.w));
    let n1110 = dot(g1110, vec4f(Pf1.xyz, Pf0.w));
    let n0001 = dot(g0001, vec4f(Pf0.xyz, Pf1.w));
    let n1001 = dot(g1001, vec4f(Pf1.x, Pf0.yz, Pf1.w));
    let n0101 = dot(g0101, vec4f(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
    let n1101 = dot(g1101, vec4f(Pf1.xy, Pf0.z, Pf1.w));
    let n0011 = dot(g0011, vec4f(Pf0.xy, Pf1.zw));
    let n1011 = dot(g1011, vec4f(Pf1.x, Pf0.y, Pf1.zw));
    let n0111 = dot(g0111, vec4f(Pf0.x, Pf1.yzw));
    let n1111 = dot(g1111, Pf1);

    let fade_xyzw = fadev4f(Pf0);
    let n_0w = mix(vec4f(n0000, n1000, n0100, n1100), vec4f(n0001, n1001, n0101, n1101), fade_xyzw.w);
    let n_1w = mix(vec4f(n0010, n1010, n0110, n1110), vec4f(n0011, n1011, n0111, n1111), fade_xyzw.w);
    let n_zw = mix(n_0w, n_1w, fade_xyzw.z);
    let n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
    let n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
    return 2.2 * n_xyzw;
  }
`
export default cnoise4D
