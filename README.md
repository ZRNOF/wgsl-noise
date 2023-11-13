# wgsl-noise

[![npm version](https://badge.fury.io/js/wgsl-noise.svg)](https://badge.fury.io/js/wgsl-noise)

This repository contains the noise functions that were converted from GLSL to WGSL, sourced from [ashima/webgl-noise](https://github.com/ashima/webgl-noise) and [stegu/webgl-noise](https://github.com/stegu/webgl-noise).

Please note that it currently does not include `psrdnoise` since the original author has already provided a version converted to WGSL (please refer to: [stegu/psrdnoise](https://github.com/stegu/psrdnoise)).

Special thanks to [Stefan Gustavson](https://github.com/stegu) and [Ian McEwan](https://github.com/ijm), [Ashima Arts](https://github.com/ashima) for their contributions to the community! This repository focuses solely on the language porting.

Be sure to visit [ashima/webgl-noise](https://github.com/ashima/webgl-noise), [stegu/webgl-noise](https://github.com/stegu/webgl-noise), and [stegu/psrdnoise](https://github.com/stegu/psrdnoise) for more information!

Finally, a big thank you to [Stefan Gustavson](https://github.com/stegu) for the help!

## Usage

All files with the `.wgsl` extension are located in subdirectories within the `src` directory.

To install `wgsl-noise` using npm, you can run:

```bash
npm i wgsl-noise
```

To avoid potential naming conflicts between math functions when using multiple noise functions in the same app, I separate math functions from noise functions by default.

When using this package, you should first import the `math` and then include the specific noise functions that you need as follows:

```js
import { math, cellular2D, snoise3D, } from "./node_modules/wgsl-noise/dist/main.js"

const shaderCode = `
  ${math}
  ${cellular2D}
  ${snoise3D}

  // your shader code...
`
```

If you are certain that you will only use a single noise function, you can import the functions located in the `src` directory as follows:

```js
import { cellular2D } from "./node_modules/wgsl-noise/src/main.js"

const shaderCode = `
  ${cellular2D}

  // your shader code...
`
```

The default entry point for `wgsl-noise` is specified in `wgsl-noise/package.json`:

```js
{
  // ...
  "main": "dist/main.js",
  // ...
}
```

## LICENSE

Please refer to [the MIT license](https://github.com/ZRNOF/wgsl-noise/blob/main/LICENSE) for detailed licensing information.
