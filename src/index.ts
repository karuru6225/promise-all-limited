const RUNNING_STATUS = {
  started: 'started',
  done: 'done'
} as const;

export type RunningStatus = typeof RUNNING_STATUS[keyof typeof RUNNING_STATUS];

export type PromiseOptions = {
  limit?: number
  callback?: (index: number, status: RunningStatus) => void;
};

const defaultOptions = {
  limit: Infinity,
  callback: null,
};

const PromiseAllLimited = async <T>(promises: (() => Promise<T>)[], options?: PromiseOptions): Promise<T[]> => {
  const results: T[] = [];
  let started = 0;

  const {
    limit,
    callback,
  } = options || defaultOptions;


  const runPromise = async (index: number): Promise<void> => {
    if (index >= promises.length) {
      return Promise.resolve();
    }
    started += 1;
    if (callback) callback(index, RUNNING_STATUS.started);
    return promises[index]().then((result) => {
      results[index] = result;
      if (callback) callback(index, RUNNING_STATUS.done);
      return runPromise(started);
    });
  };

  await Promise.all([...Array(Math.min(promises.length, limit || defaultOptions.limit)).keys()].map((i) => runPromise(i)));

  return results;
};

export default PromiseAllLimited;