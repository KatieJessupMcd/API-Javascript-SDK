module.exports = {
    target: 'node',
    context: __dirname,
    entry: {
        'trackvia-api': './src/trackvia-api'
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
        library: 'TrackviaAPI',
        libraryTarget: 'var',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json']
    }
};
