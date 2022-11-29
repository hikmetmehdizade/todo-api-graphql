import nodeResolve from 'rollup-plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import esbild from 'rollup-plugin-esbuild';
import commonJs from 'rollup-plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import dts from 'rollup-plugin-dts';
import nodePolyfills from 'rollup-plugin-node-polyfills';

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [
  {
    input: './dist/types/index.d.ts',
    output: [
      {
        file: './@api-types/index.d.ts',
        format: 'es',
        exports: 'named',

        plugins: [dts()],
      },
    ],
    plugins: [
      dts({ compilerOptions: { declaration: true, incremental: false } }),
      nodePolyfills(),
      nodeResolve({
        extensions: ['.ts', '.d.ts', '.json', '.node'],
        browser: true,
        preferBuiltins: true,
      }),
    ],
  },
];
