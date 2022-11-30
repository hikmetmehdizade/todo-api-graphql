import nodeResolve from 'rollup-plugin-node-resolve';
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
        file: './api-types/index.d.ts',
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
