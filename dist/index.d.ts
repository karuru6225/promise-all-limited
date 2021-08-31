declare const RUNNING_STATUS: {
    readonly started: "started";
    readonly done: "done";
};
export declare type RunningStatus = typeof RUNNING_STATUS[keyof typeof RUNNING_STATUS];
export declare type PromiseOptions = {
    limit: number;
    callback?: (index: number, status: RunningStatus) => void;
};
export declare const PromiseAllLimited: <T>(promises: (() => Promise<T>)[], options?: PromiseOptions) => Promise<T[]>;
export {};
//# sourceMappingURL=index.d.ts.map