import { build, BuildOptions, BuildResult } from 'esbuild';
import { FlagMode, getFlagFrom } from './lib/get-flag';

const IS_DEV_MODE = getFlagFrom('--dev', process.argv, FlagMode.boolean);

const ENTRY_POINT = 'client/index.ts';
const TSCONFIG = 'client/tsconfig.json';

const OUT_FILE = 'public/bundle.js';

function createBuildOptions<T extends BuildOptions>(options: T) {
  return options;
} 

const options = createBuildOptions({
  outfile: OUT_FILE,
  minify: !IS_DEV_MODE,
  sourcemap: IS_DEV_MODE,
  metafile: true,
  entryPoints: [
    ENTRY_POINT
  ],
  tsconfig: TSCONFIG,
  bundle: true,
});

type ProgramBuildOptions = typeof options;

function onBuild(result: BuildResult<ProgramBuildOptions>) {
  console.log('build with success!');
  console.log(`bundle size: ${result.metafile.outputs[OUT_FILE]?.bytes}`);
}

build(options).then(onBuild).catch(console.error);