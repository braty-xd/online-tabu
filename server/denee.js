const path = require("path");

console.log(path.basename(path.dirname(__filename)));

let aaa = path.dirname(require.main.filename);
console.log(__dirname);
console.log(aaa);
