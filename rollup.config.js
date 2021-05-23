import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import * as meta from './package.json';

export default [
  {
    input: 'main.js',
    output: [{
      file: './dist/yfigure.min.js',
      format: 'umd',
      name: 'yf',
      plugins: [
        terser({ 
          output: { 
            preamble: `// Version: ${meta.version} Copyright ${(new Date).getFullYear().toString()} Yalin Chen;
// This is a dual license (GPL and commercial) software. You are free to use it for non-profit purpose. If you want to use if for profit, please buy a license.
` 
          } 
        })]
    }],
    plugins: [resolve()]
  }, 
  {               // this is a iife bundle of yf without d3
    input: 'main.js',
    external: ['d3'],
    output: [{
      file: './test/yfigure.iife.js',
      format: 'iife',
      name: 'yf',
      globals: {
        d3: 'd3'
      }
    }],
  }
];
