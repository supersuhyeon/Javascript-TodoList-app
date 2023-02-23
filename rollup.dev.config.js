import rollupCommonConfig from "./rollup.common.config.js"
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const config = {...rollupCommonConfig}

config.watch = {
    include : 'src/**'
}

config.plugins = [
    ...config.plugins,
    serve({
        host: "localhost",
        port : 8080,
        open: true,
        contentBase : 'dist'
    }),
    livereload('dist')
]

export default config