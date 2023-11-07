export const snoise4D = `
  // This is a modified wgsl version from https://github.com/ashima/webgl-noise/blob/master/src/noise4D.glsl
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

  fn grad4(j: f32, ip: vec4f) -> vec4f {
    let ones = vec4f(1.0, 1.0, 1.0, -1.0);
    var p: vec4f;
    var s: vec4f;
    p = vec4f(floor( fract (vec3f(j) * ip.xyz) * 7.0) * ip.z - 1.0, p.w);
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4f(p < vec4f(0.0));
    p = vec4f(p.xyz + (s.xyz*2.0 - 1.0) * s.www, p.w);
    return p;
  }

  fn snoise4D(v: vec4f) -> f32 {
    let F4 = 0.309016994374947451;
    let C = vec4f( 0.138196601125011,
                   0.276393202250021,
                   0.414589803375032,
                  -0.447213595499958);

    var i  = floor(v + dot(v, vec4f(F4)) );
    let x0 = v - i + dot(i, C.xxxx);

    var i0: vec4f;
    let isX = step( x0.yzw, x0.xxx );
    let isYZ = step( x0.zww, x0.yyz );

    i0.x = isX.x + isX.y + isX.z;
    i0 = vec4f(i0.x, (1.0 - isX));

    i0.y += isYZ.x + isYZ.y;
    i0.z += 1.0 - isYZ.x;
    i0.w += 1.0 - isYZ.y;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    let i3 = clamp( i0, vec4f(0.0), vec4f(1.0) );
    let i2 = clamp( i0 - 1.0, vec4f(0.0), vec4f(1.0) );
    let i1 = clamp( i0 - 2.0, vec4f(0.0), vec4f(1.0) );

    let x1 = x0 - i1 + C.xxxx;
    let x2 = x0 - i2 + C.yyyy;
    let x3 = x0 - i3 + C.zzzz;
    let x4 = x0 + C.wwww;

    i = mod289v4f(i);
    let j0 = permute289f32( permute289f32( permute289f32( permute289f32(i.w) + i.z) + i.y) + i.x);
    let j1 = permute289v4f( permute289v4f( permute289v4f( permute289v4f (
               i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
             + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
             + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
             + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    let ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);

    var p0 = grad4(j0,   ip);
    var p1 = grad4(j1.x, ip);
    var p2 = grad4(j1.y, ip);
    var p3 = grad4(j1.z, ip);
    var p4 = grad4(j1.w, ip);

    let norm = taylorInvSqrtv4f(vec4f(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrtf32(dot(p4, p4));

    var m0 = max(0.6 - vec3f(dot(x0, x0), dot(x1, x1), dot(x2, x2)), vec3f(0.0));
    var m1 = max(0.6 - vec2f(dot(x3, x3), dot(x4, x4)             ), vec2f(0.0));
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3f( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                 + dot(m1*m1, vec2f( dot( p3, x3 ), dot( p4, x4 ) ) ) );
  }
`
