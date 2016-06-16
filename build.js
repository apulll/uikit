var fs = require('fs');
var path = require('path');
var glob = require('glob');
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var package = require('./package.json');
var version = process.env.VERSION || package.version;
var banner = `/*! UIkit ${version} | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */\n`;

glob('src/js/{uikit.js,components/**/*.js}', (er, files) => files.forEach(compile));

function compile(file) {

    var entry = file.substring(0, file.length - 3), dest = entry.substring(4);

    rollup.rollup({
        entry: `${entry}.js`,
        external: ['jquery'],
        plugins: [
            babel({presets: ['es2015-rollup']}),
            resolve({main: true, jsnext: true})
        ]
    })
        .then(function (bundle) {
            return write(`${dest}.js`, bundle.generate({
                format: 'umd',
                banner: banner,
                moduleName: 'UIkit',
                globals: {jquery: 'jQuery'}
            }).code);
        })
        .then(function () {
            return write(
                `${dest}.min.js`,
                `${banner}\n${uglify.minify(`${dest}.js`).code}`
            );
        })
        .catch(console.log);
}

function write(dest, code) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(dest, code, function (err) {
            if (err) return reject(err);
            console.log(`${cyan(dest)} ${getSize(code)}`);
            resolve();
        });
    });
}

function getSize(code) {
    return `${(code.length / 1024).toFixed(2)}kb`;
}

function cyan(str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
}
