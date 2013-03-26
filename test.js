var CBpipe = require('./cbpipe');

var test = CBpipe(function() {
    console.log('hello world');
    setTimeout(test.add(), 200);
}, true);

setTimeout(test.add(), 10);
setTimeout(test.add(), 200);
setTimeout(test.add(), 2000);
setTimeout(test.add(), 1000);
test.flow();