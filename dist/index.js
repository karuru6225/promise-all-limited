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
    exports.PromiseAllLimited = void 0;
    const RUNNING_STATUS = {
        started: 'started',
        done: 'done'
    };
    const defaultOptions = {
        limit: Infinity,
    };
    //@ts-ignore TS6133: for debug
    const PromiseAllLimited = async (promises, options = defaultOptions) => {
        const results = [];
        let started = 0;
        const { limit, callback, } = options;
        //@ts-ignore TS6133: for debug
        const statuses = [...Array(promises.length)].map(() => RUNNING_STATUS.notStarted);
        //@ts-ignore TS6133: for debug
        const logStatus = (index, status) => {
            statuses[index] = status;
            if (false) {
                const stat = [...Array(promises.length).keys()].map((i) => {
                    switch (statuses[i]) {
                        case RUNNING_STATUS.notStarted: return 'x';
                        case RUNNING_STATUS.started: return 'r';
                        case RUNNING_STATUS.done: return '_';
                        default: return 'x';
                    }
                }).join('');
                process.stdout.write(`\r${stat}`);
                if (statuses.every((s) => s === RUNNING_STATUS.done)) {
                    process.stdout.write(`\n`);
                }
            }
            if (false) {
                const doneCount = statuses.filter(s => s === RUNNING_STATUS.done).length;
                process.stdout.write(`\r${doneCount} / ${statuses.length}`);
                if (statuses.every((s) => s === RUNNING_STATUS.done)) {
                    process.stdout.write(`\n`);
                }
            }
        };
        const runPromise = async (index) => {
            if (index < promises.length) {
                started += 1;
                if (callback)
                    callback(index, RUNNING_STATUS.started);
                return promises[index]().then((result) => {
                    results[index] = result;
                    if (callback)
                        callback(index, RUNNING_STATUS.done);
                    // if (debug) logStatus(index, RUNNING_STATUS.done);
                    // if (debug) console.log(`finish: ${index}`);
                    return runPromise(started);
                });
            }
            else {
                return Promise.resolve();
            }
        };
        await Promise.all([...Array(Math.min(promises.length, limit)).keys()].map((i) => runPromise(i)));
        return results;
    };
    exports.PromiseAllLimited = PromiseAllLimited;
});
//# sourceMappingURL=index.js.map