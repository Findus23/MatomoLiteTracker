import type {BuildFailure, BuildOptions} from "esbuild";
import {build, serve} from "esbuild";


const options: BuildOptions = {
    entryPoints: ['src/entry.ts'],
    target: "es2017",
    bundle: true,
    format: "iife",
    sourcemap: true,
    minify: true,
    outfile: "dist/bundle.js"
}
console.log(process.argv)
if (process.argv.length > 2 && process.argv[2] == "serve") {
    options.entryPoints = ["example/main.ts"]
    options.outfile = "example/main.min.js"
    build(options).catch((error: BuildFailure) => console.error(error))
    options.minify = false
    options.outfile = "example/main.js"
    build(options).catch((error: BuildFailure) => console.error(error))
    serve({servedir: "example/"}, options)
        .catch((error: BuildFailure) => console.error(error))
        .then(data => console.log(data))
} else {

    build(options).catch((error: BuildFailure) => console.error(error))
    options.minify = true
    options.outfile = "dist/bundle.min.js"
    build(options).catch((error: BuildFailure) => console.error(error))
}
