import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import * as meta from './package.json';

export default {
    input: 'main.js',
    output:[
        {
          file: './dist/yd3.js',
          format: 'umd',
          name: 'yd3',
        },
        {
          file: './dist/yd3.min.js',
          format: 'umd',
          name: 'yd3',
          plugins: [terser({output: {preamble: `// Version: ${meta.version} Copyright ${(new Date).getFullYear().toString()} Yalin Chen;`}})]
        }
      ],
    plugins: [resolve()]
  };