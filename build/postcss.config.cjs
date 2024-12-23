module.exports = (ctx) => {
    let plugs = [
        require('autoprefixer')()
    ];
    if(process.argv.indexOf('--minify') >= 0) {
        plugs.push(require('cssnano')({preset: 'default'}));
    }

    return {
        map: ctx.options.map,
        plugins: plugs,
    };
};
