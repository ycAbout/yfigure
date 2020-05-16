import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import * as meta from './package.json';

export default [
  {
    input: 'main.js',
    output: [{
      file: './dist/yd3.min.js',
      format: 'umd',
      name: 'yd3',
      plugins: [terser({ output: { preamble: `// Version: ${meta.version} Copyright ${(new Date).getFullYear().toString()} Yalin Chen;` } })]
    }],
    plugins: [resolve()]
  }, {               // this is a iife bundle of yd3 without d3
    input: 'main.js',
    external: ['d3'],
    output: [{
      file: './yd3.iife.js',
      format: 'iife',
      name: 'yd3',
      globals: {
        d3: 'd3'
      }
    }],
  }
];
