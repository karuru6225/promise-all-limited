(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const RUNNING_STATUS = {
        started: 'started',
        done: 'done'
    };
    const defaultOptions = {
        limit: Infinity,
        callback: null,
    };
    const PromiseAllLimited = async (promises, options) => {
        const results = [];
        let started = 0;
        const { limit, callback, } = options || defaultOptions;
        const runPromise = async (index) => {
            if (index >= promises.length) {
                return Promise.resolve();
            }
            started += 1;
            if (callback)
                callback(index, RUNNING_STATUS.started);
            return promises[index]().then((result) => {
                results[index] = result;
                if (callback)
                    callback(index, RUNNING_STATUS.done);
                return runPromise(started);
            });
        };
        await Promise.all([...Array(Math.min(promises.length, limit || defaultOptions.limit)).keys()].map((i) => runPromise(i)));
        return results;
    };
    exports.default = PromiseAllLimited;
});
//# sourceMappingURL=index.js.map