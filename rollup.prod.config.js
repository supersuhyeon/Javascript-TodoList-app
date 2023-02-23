import rollupCommonConfig from "./rollup.common.config.js"
import { terser } from "rollup-plugin-minification";

const config = {...rollupCommonConfig}

config.plugins = [
    ...config.plugins,
    terser() //terser를 활용하여 번들을 minify합니다.
]

export default config