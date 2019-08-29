const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify').uglify;
const replace = require('rollup-plugin-replace');
const gzipSize = require('gzip-size');

const INTERNEL_VARS = 'internal_variables.txt';

async function build({ package: packageName, entry = 'src/index.js', name, shouldMinify = false, format = 'umd', mangleProps }) {
  const output = {
    name,
    exports: 'named',
    sourcemap: true
  };

  const uglifyOptions = {
    compress: {
      loops: false,
      keep_fargs: false,
      unsafe: true,
      pure_getters: true
    },
  };

  // Apply internal_variables.txt rules.
  if (shouldMinify) {
    const internalVarFile = join(__dirname, '../packages', packageName, INTERNEL_VARS);
    if (existsSync(internalVarFile)) {
      const internalVariableDeclearation = readFileSync(internalVarFile, 'utf-8');
      const internalVariableList = internalVariableDeclearation
        .split(/\n/)
        .filter(line => line && line[0] !== '#');

      uglifyOptions.mangle = {
        properties: {
          regex: new RegExp('^(' + internalVariableList.join('|') + ')'),
        },
      };
    }
  }

  // For development
  const bundle = await rollup.rollup({
    input: `./packages/${packageName}/${entry}`,
    plugins: [
      resolve(),
      commonjs({
        // style-unit for build while packages linked
        // use /pakacges/ would get error and it seemed to be a rollup-plugin-commonjs bug
        include: /(node_modules|style-unit)/,
      }),
      babel({
        exclude: 'node_modules/**', // only transpile our source code
        presets: [
          ['@babel/preset-env', {
            modules: false,
            loose: true,
            targets: {
              browsers: ['last 2 versions', 'IE >= 9']
            }
          }]
        ],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(shouldMinify ? 'production' : 'development'),
      }),
      shouldMinify ? uglify(uglifyOptions) : null,
    ]
  });

  if (shouldMinify) {
    const file = `./packages/${packageName}/dist/${packageName}.min.js`;
    await bundle.write({
      ...output,
      format,
      file,
    });

    const size = gzipSize.fileSync(file, {
      level: 6
    });

    console.log(file, `${(size / 1024).toPrecision(3)}kb (gzip)`);
  } else {
    const ext = format === 'esm' ? '.mjs' : '.js';
    await bundle.write({
      ...output,
      format,
      file: `./packages/${packageName}/dist/${packageName}${ext}`,
    });
  }
}

build({ package: 'rax', name: 'Rax' });
build({ package: 'rax', name: 'Rax', format: 'esm' });
build({ package: 'rax', name: 'Rax', shouldMinify: true });

build({ package: 'driver-dom', name: 'DriverDOM' });
build({ package: 'driver-dom', name: 'DriverDOM', format: 'esm' });
build({ package: 'driver-dom', name: 'DriverDOM', shouldMinify: true });

build({ package: 'driver-weex', name: 'DriverWeex' });
build({ package: 'driver-weex', name: 'DriverWeex', format: 'esm' });
build({ package: 'driver-weex', name: 'DriverWeex', shouldMinify: true });

build({ package: 'driver-worker', name: 'DriverWorker' });
build({ package: 'driver-worker', name: 'DriverWorker', format: 'esm' });
build({ package: 'driver-worker', name: 'DriverWorker', shouldMinify: true });

build({ package: 'rax-miniapp-renderer', format: 'cjs' });
build({ package: 'rax-miniapp-renderer', format: 'cjs', shouldMinify: true });
