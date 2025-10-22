const path = require('path');

module.exports = {
    entry: './content.js',
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname,"dist")
    }
}