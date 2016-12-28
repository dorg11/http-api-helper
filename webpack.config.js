module.exports = {
    context: __dirname + "/public",
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ["babel-loader"]
        }, {
            test: /\.css$/,
            loaders: ['style', 'css']
        }]
    },
    entry: "./index.jsx",

    output: {
        filename: "app.js",
        path: __dirname + "/dist",
    }
};
