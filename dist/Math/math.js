export const math = `
  fn mod7v3f(x: vec3f) -> vec3f { return x - floor(x / 7.0) * 7.0; }
  fn mod7v4f(x: vec4f) -> vec4f { return x - floor(x / 7.0) * 7.0; }

  // Special thanks to Stefan Gustavson for releasing mod289 as public domain code!
  // Always credit the original author to show appreciation.
  fn mod289f32(x: f32)   ->   f32 { return x - floor(x / 289.0) * 289.0; }
  fn mod289v2f(x: vec2f) -> vec2f { return x - floor(x / 289.0) * 289.0; }
  fn mod289v3f(x: vec3f) -> vec3f { return x - floor(x / 289.0) * 289.0; }
  fn mod289v4f(x: vec4f) -> vec4f { return x - floor(x / 289.0) * 289.0; }

  fn permute289f32(x:   f32) ->   f32 { return mod289f32(((x*34.0) + 10.0) * x); }
  fn permute289v3f(x: vec3f) -> vec3f { return mod289v3f((34.0 * x + 10.0) * x); }
  fn permute289v4f(x: vec4f) -> vec4f { return mod289v4f((34.0 * x + 10.0) * x); }

  // These fade functions have been separated from Stefan Gustavson's cnoise functions:
  // - fadev2f separated from the cnoise2D file
  // - fadev3f separated from the cnoise3D file
  // - fadev4f separated from the cnoise4D file
  fn fadev2f(t: vec2f) -> vec2f { return t*t*t*(t*(t*6.0 - 15.0) + 10.0); }
  fn fadev3f(t: vec3f) -> vec3f { return t*t*t*(t*(t*6.0 - 15.0) + 10.0); }
  fn fadev4f(t: vec4f) -> vec4f { return t*t*t*(t*(t*6.0 - 15.0) + 10.0); }

  fn taylorInvSqrtf32(r:   f32) ->   f32 { return 1.79284291400159 - 0.85373472095314 * r; }
  fn taylorInvSqrtv4f(r: vec4f) -> vec4f { return 1.79284291400159 - 0.85373472095314 * r; }
`
