/* CBpipe
 * CallBack pipe.
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.strAllow = factory();
    }
}(this, function() {
    var waitFor = require('async-waitfor');
    
    var CBpipe = function(cb, once) {
        this.stack = [];
        this.cbs = 0;
        this.cb = cb;
        this.once = (typeof once == 'boolean') ? once : false;
        this.called = false;
        this.wait = waitFor();
    };
    
    CBpipe.prototype.add = function() {
        var that = this, 
            i = that.stack.push(function() {
                setTimeout(function() {
                    delete that.stack[i];
                    that.cbs--;
                    
                    if(that.cbs === 0 && (that.once ? (that.called === false) : !that.once)) {
                        that.stack = [];
                        that.called = true;
                        that.cb();
                    }
                }, 1);
            }) - 1;
        
        that.cbs++;
        
        return function() {
            that.wait(that.stack[i]);
        };
    };
    
    CBpipe.prototype.flow = function() {
        this.wait();
    };
    
    return function(cb, once) {
        return (new CBpipe(cb, once));
    };
}));